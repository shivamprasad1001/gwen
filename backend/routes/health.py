from fastapi import APIRouter
from backend.models import HealthResponse
from backend.settings import db, pinecone_index
import backend.main as main_module

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    mongodb_status = "unhealthy"
    pinecone_status = "unhealthy"
    
    try:
        # Check MongoDB connection
        await db.command("ping")
        mongodb_status = "healthy"
    except Exception:
        pass

    try:
        # Check Pinecone connection
        # A simple describe_index_stats call serves as a ping
        stats = pinecone_index.describe_index_stats()
        if stats:
            pinecone_status = "healthy"
    except Exception:
        pass
        
    return {
        "status": "ok",
        "mongodb": mongodb_status,
        "pinecone": pinecone_status, # We should update the HealthResponse model
        "knowledge_loaded": len(main_module.knowledge_context) > 0
    }
