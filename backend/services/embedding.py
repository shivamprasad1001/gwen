from google import genai
from backend.config import settings
import logging
import asyncio

logger = logging.getLogger(__name__)

# Initialize the new Google GenAI Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def generate_embedding(text: str) -> list[float]:
    """
    Generates a 768-dimensional embedding using Google's modern embedding model.
    Switched to gemini-embedding-001 as text-embedding-004 is deprecated.
    """
    try:
        # The new SDK is sync by default; we call it directly here.
        # gemini-embedding-001 supports adjustable dimensionality.
        response = client.models.embed_content(
            model='gemini-embedding-001',
            contents=text,
            config={
                'task_type': 'RETRIEVAL_QUERY',
                'output_dimensionality': 768  # Crucial to match your Pinecone index
            }
        )
        return response.embeddings[0].values
    except Exception as e:
        logger.error(f"Error generating embedding with gemini-embedding-001: {str(e)}")
        raise e
