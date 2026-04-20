import os
import json
import logging
from typing import List, Dict, Any
from backend.settings import settings, knowledge_base

logger = logging.getLogger(__name__)

async def load_from_mongodb() -> str:
    """Fetches and formats all documents from the knowledge_base collection."""
    try:
        if knowledge_base is None:
            logger.warning("knowledge_base collection not initialized. Skipping MongoDB load.")
            return ""
        cursor = knowledge_base.find({}).sort("key", 1)
        docs = await cursor.to_list(length=100)
        
        results = []
        for doc in docs:
            key = doc.get("key", "unknown").upper()
            content = doc.get("content", "")
            results.append(f"=== {key} ===\n{content}\n")
        
        return "\n\n".join(results)
    except Exception as e:
        logger.error(f"Error loading from MongoDB: {str(e)}")
        return ""

def load_from_markdown(folder: str) -> str:
    """Scans and reads all .md files in the data folder."""
    results = []
    if not os.path.exists(folder):
        return ""
        
    for filename in os.listdir(folder):
        if filename.endswith(".md"):
            path = os.path.join(folder, filename)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                    title = filename.replace(".md", "").upper()
                    results.append(f"=== {title} ===\n{content}\n")
            except Exception as e:
                logger.error(f"Error reading {filename}: {str(e)}")
                
    return "\n\n".join(results)

def flatten_json(obj: Any, prefix: str = "") -> List[str]:
    """Recursively flattens nested dicts/lists into strings."""
    items = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            items.extend(flatten_json(v, f"{prefix}{k}: "))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            items.extend(flatten_json(v, f"{prefix}[{i}]: "))
    else:
        items.append(f"{prefix}{obj}")
    return items

def load_from_json(folder: str) -> str:
    """Scans and flattens all .json files in the data folder."""
    results = []
    if not os.path.exists(folder):
        return ""
        
    for filename in os.listdir(folder):
        if filename.endswith(".json"):
            path = os.path.join(folder, filename)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    flattened = "\n".join(flatten_json(data))
                    title = filename.replace(".json", "").upper()
                    results.append(f"=== {title} ===\n{flattened}\n")
            except Exception as e:
                logger.error(f"Error reading {filename}: {str(e)}")
                
    return "\n\n".join(results)

async def build_knowledge_context() -> str:
    """Aggregates all knowledge sources into one string."""
    logger.info("Building knowledge context from all sources...")
    
    mongo_data = await load_from_mongodb()
    md_data = load_from_markdown(settings.DATA_FOLDER)
    json_data = load_from_json(settings.DATA_FOLDER)
    
    combined = "\n\n".join(filter(None, [mongo_data, md_data, json_data])).strip()
    return combined
