from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.settings import settings
from backend.routes import chat, admin, health, suggestions
from backend.services.knowledge_loader import build_knowledge_context
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import httpx
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Global Knowledge Context
knowledge_context = ""
scheduler = AsyncIOScheduler()

SELF_URL = "https://gwen-ccgg.onrender.com/api/health"  # update this with your backend url(render/railway). In my case render.

async def self_ping():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(SELF_URL)
            logger.info(f"Self ping - Status: {response.status_code}")
    except Exception as e:
        logger.error(f"Self ping failed: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global knowledge_context
    logger.info("Starting up PersonalAI: Initializing Knowledge Base...")
    try:
        knowledge_context = await build_knowledge_context()
        logger.info(f"Knowledge loaded: {len(knowledge_context)} characters.")
    except Exception as e:
        logger.error(f"Knowledge load failure: {str(e)}")

    # Start self-ping scheduler
    scheduler.add_job(self_ping, "interval", minutes=10)
    scheduler.start()
    logger.info("Self-ping scheduler started.")

    yield

    scheduler.shutdown()
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
app.include_router(admin.router, prefix="/api")
app.include_router(health.router, prefix="/api")
app.include_router(suggestions.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
