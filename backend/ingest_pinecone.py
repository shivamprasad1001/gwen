import os
import re
import json
import time
import logging
from pathlib import Path
from typing import List, Dict, Optional

from google import genai
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

# ---------------------- CONFIG ----------------------

load_dotenv()

GEMINI_API_KEY   = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX   = os.getenv("PINECONE_INDEX_NAME", "personal-ai")

BASE_DIR = Path(__file__).resolve().parent
DATA_FOLDER = BASE_DIR / "data"

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM   = 768

BATCH_SIZE = 50
CHUNK_SIZE = 500
OVERLAP    = 100
MAX_RETRIES = 3

# ---------------------- LOGGING ----------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# ---------------------- CLIENTS ----------------------

client = genai.Client(api_key=GEMINI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)

# ---------------------- INDEX ----------------------

def ensure_index():
    existing = [i.name for i in pc.list_indexes()]

    if PINECONE_INDEX not in existing:
        pc.create_index(
            name=PINECONE_INDEX,
            dimension=EMBEDDING_DIM,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
        logging.info(f"Created index: {PINECONE_INDEX}")

    return pc.Index(PINECONE_INDEX)

# ---------------------- EMBEDDINGS ----------------------

def get_document_embedding(text: str) -> List[float]:
    for attempt in range(MAX_RETRIES):
        try:
            result = client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=text,
                config={
                    "task_type": "RETRIEVAL_DOCUMENT",
                    "output_dimensionality": EMBEDDING_DIM
                }
            )
            return result.embeddings[0].values
        except Exception as e:
            logging.warning(f"[DOC EMBED] Retry {attempt+1}: {e}")
            time.sleep(2)

    raise RuntimeError("Failed document embedding after retries")


def get_query_embedding(text: str) -> list[float]:
    for attempt in range(MAX_RETRIES):
        try:
            result = client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=text,
                config={
                    "task_type": "RETRIEVAL_QUERY",
                    "output_dimensionality": 768   # 🔥 ADD THIS
                }
            )
            return result.embeddings[0].values
        except Exception as e:
            logging.warning(f"[QUERY EMBED] Retry {attempt+1}: {e}")
            time.sleep(2)

    raise RuntimeError("Failed query embedding")
# ---------------------- CHUNKING ----------------------

def chunk_text(text: str, source: str) -> List[Dict]:
    words = text.split()
    chunks = []

    start = 0
    idx = 0

    while start < len(words):
        end = start + CHUNK_SIZE
        chunk_words = words[start:end]

        enriched = f"Document: {source}\n\n" + " ".join(chunk_words)

        chunks.append({
            "id": f"{source}_{idx}",
            "text": enriched,
            "metadata": {
                "source": source,
                "chunk_index": idx,
                "type": "text"
            }
        })

        start += CHUNK_SIZE - OVERLAP
        idx += 1

    return chunks


def flatten_json(data, prefix="") -> str:
    lines = []

    if isinstance(data, dict):
        for k, v in data.items():
            full = f"{prefix}.{k}" if prefix else k
            lines.append(flatten_json(v, full))
    elif isinstance(data, list):
        for i in data:
            lines.append(flatten_json(i, prefix))
    else:
        lines.append(f"{prefix}: {data}")

    return "\n".join(filter(None, lines))


def load_chunks() -> List[Dict]:
    all_chunks = []

    if not DATA_FOLDER.exists():
        logging.error("Data folder not found")
        return []

    for file in DATA_FOLDER.glob("*"):
        logging.info(f"Processing {file.name}")

        if file.suffix == ".md":
            text = file.read_text(encoding="utf-8")
            chunks = chunk_text(text, file.name)

        elif file.suffix == ".json":
            data = json.loads(file.read_text(encoding="utf-8"))
            flat = flatten_json(data)
            chunks = chunk_text(flat, file.name)

        else:
            continue

        all_chunks.extend(chunks)
        logging.info(f"{file.name} → {len(chunks)} chunks")

    return all_chunks

# ---------------------- UPSERT ----------------------

def upsert_chunks(index, chunks: List[Dict], namespace: str = "v1"):
    vectors = []

    for i, chunk in enumerate(chunks):
        try:
            embedding = get_document_embedding(chunk["text"])

            vectors.append({
                "id": chunk["id"],
                "values": embedding,
                "metadata": {
                    **chunk["metadata"],
                    "text": chunk["text"]
                }
            })

            if len(vectors) >= BATCH_SIZE:
                index.upsert(vectors=vectors, namespace=namespace)
                logging.info(f"Upserted batch of {len(vectors)}")
                vectors = []

        except Exception as e:
            logging.error(f"Failed chunk {chunk['id']}: {e}")

    if vectors:
        index.upsert(vectors=vectors, namespace=namespace)
        logging.info(f"Final batch upserted")

# ---------------------- SEARCH ----------------------

def search(index, query: str, top_k: int = 5, namespace: str = "v1"):
    query_embedding = get_query_embedding(query)

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        namespace=namespace
    )

    return results

# ---------------------- MAIN ----------------------

def main():
    logging.info("=== RAG PIPELINE START ===")

    index = ensure_index()

    # ⚠️ Disable delete in production
    # index.delete(delete_all=True)

    chunks = load_chunks()

    if not chunks:
        logging.warning("No chunks found")
        return

    logging.info(f"Total chunks: {len(chunks)}")

    upsert_chunks(index, chunks)

    # -------- TEST QUERY --------
    test_query = "What projects has Shivam built?"

    results = search(index, test_query, top_k=5)

    logging.info("\n=== SEARCH RESULTS ===")
    for match in results["matches"]:
        logging.info(f"Score: {match['score']}")
        logging.info(f"{match['metadata']['text'][:200]}\n")

    logging.info("=== DONE ===")


if __name__ == "__main__":
    main()