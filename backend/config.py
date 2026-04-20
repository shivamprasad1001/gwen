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
    TOP_K: int = 5

settings = Settings()

# MongoDB Client
client = AsyncIOMotorClient(settings.MONGODB_URI)
db = client[settings.DB_NAME]

# Collections
knowledge_base = db["knowledge_base"]
chat_sessions = db["chat_sessions"]

# Pinecone Client
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
pinecone_index = pc.Index(settings.PINECONE_INDEX_NAME)
