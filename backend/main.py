from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import chat, admin, health, suggestions
from backend.services.knowledge_loader import build_knowledge_context
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Global Knowledge Context
knowledge_context = ""

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Modern lifespan handler for FastAPI to handle startup/shutdown.
    """
    global knowledge_context
    logger.info("Starting up PersonalAI: Initializing Knowledge Knowledge Base...")
    try:
        knowledge_context = await build_knowledge_context()
        logger.info(f"Knowledge loaded: {len(knowledge_context)} characters.")
    except Exception as e:
        logger.error(f"Knowledge load failure: {str(e)}")
    
    yield  # Runs the application
    
    logger.info("Shutting down PersonalAI...")

app = FastAPI(
    title="PersonalAI Public Identity Bot",
    description="RAG-powered personal agent representing Shivam Prasad (Gwen).",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(chat.router, prefix="/api")
# admin router is kept but typically secured in production
app.include_router(admin.router, prefix="/api")
app.include_router(health.router, prefix="/api")
app.include_router(suggestions.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
