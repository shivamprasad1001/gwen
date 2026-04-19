from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    history: List[dict] # Turn objects: {"role": "user"|"assistant", "content": "..."}

class ChatResponse(BaseModel):
    reply: str
    session_id: str

class HealthResponse(BaseModel):
    status: str
    mongodb: str
    pinecone: str
    knowledge_loaded: bool
