import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
from pinecone import Pinecone

load_dotenv()

class Settings(BaseSettings):
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DB_NAME: str = os.getenv("DB_NAME", "personal_ai_db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    ADMIN_TOKEN: str = os.getenv("ADMIN_TOKEN", "")
    DATA_FOLDER: str = os.getenv("DATA_FOLDER", "data/")
    
    # Pinecone Configuration
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "")
    PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME", "personal-knowledge")
    PINECONE_NAMESPACE: str = os.getenv("PINECONE_NAMESPACE", "v1")
    
    OWNER_NAME: str = os.getenv("OWNER_NAME", "Shivam")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "https://gwen-xi.vercel.app,http://localhost:5173")
    TOP_K: int = 5

settings = Settings()

# MongoDB Client - Fallback to None if URI is missing
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

# Pinecone Client - Fallback to None if API Key is missing
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
