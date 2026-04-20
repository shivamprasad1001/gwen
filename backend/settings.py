import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pinecone import Pinecone

load_dotenv()

class Settings(BaseSettings):
    """
    Centralized configuration system using Pydantic BaseSettings.
    Environment variables are automatically loaded and validated.
    """
    # Database
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DB_NAME: str = os.getenv("DB_NAME", "personal_ai_db")
    
    # AI Providers
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # RAG Configuration (Pinecone)
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "")
    PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME", "personal-knowledge")
    PINECONE_NAMESPACE: str = os.getenv("PINECONE_NAMESPACE", "v1")
    
    # App & Security
    ADMIN_TOKEN: str = os.getenv("ADMIN_TOKEN", "")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "https://gwen-xi.vercel.app,http://localhost:5173")
    DATA_FOLDER: str = os.getenv("DATA_FOLDER", "data/")
    OWNER_NAME: str = os.getenv("OWNER_NAME", "Shivam")
    TOP_K: int = 5

    class Config:
        env_file = ".env"

# Initialize Global Settings
settings = Settings()

# --- Connection initializations with resilience logic ---

# MongoDB Client
client = None
db = None
knowledge_base = None
chat_sessions = None

if settings.MONGODB_URI:
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        db = client[settings.DB_NAME]
        knowledge_base = db["knowledge_base"]
        chat_sessions = db["chat_sessions"]
    except Exception as e:
        print(f"Error initializing MongoDB: {e}")
else:
    print("WARNING: MONGODB_URI not set. Database functionality will be limited.")

# Pinecone Client
pc = None
pinecone_index = None

if settings.PINECONE_API_KEY:
    try:
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        if settings.PINECONE_INDEX_NAME:
            pinecone_index = pc.Index(settings.PINECONE_INDEX_NAME)
    except Exception as e:
        print(f"Error initializing Pinecone: {e}")
else:
    print("WARNING: PINECONE_API_KEY not set. Search functionality will be limited.")
