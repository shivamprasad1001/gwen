from typing import List, Dict, Any
from backend.settings import pinecone_index, settings
import logging

logger = logging.getLogger(__name__)

async def pinecone_search(query_embedding: List[float], top_k: int = 5) -> str:
    """
    Queries Pinecone for relevant knowledge chunks and returns a formatted context string.
    """
    try:
        # Pinecone query (synchronous SDK call wrapped as async)
        query_response = pinecone_index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            namespace=settings.PINECONE_NAMESPACE
        )
        
        matches = query_response.get("matches", [])
        if not matches:
            return "No relevant information found in the knowledge base."
            
        context_chunks = []
        for match in matches:
            # Assuming chunks are stored in the 'text' key of metadata
            metadata = match.get("metadata", {})
            text = metadata.get("text", "")
            source = metadata.get("source", "Unknown Source")
            score = match.get("score", 0.0)
            
            if text:
                context_chunks.append(text)
        
        return "\n\n".join(context_chunks)
        
    except Exception as e:
        logger.error(f"Pinecone search error: {str(e)}")
        return "Error retrieving knowledge from Pinecone."
