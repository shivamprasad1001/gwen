import secrets
from fastapi import APIRouter, Header, HTTPException
from backend.settings import settings
from backend.services.knowledge_loader import build_knowledge_context
import backend.main as main_module

router = APIRouter()

@router.post("/admin/reload-knowledge")
async def reload_knowledge(x_admin_token: str = Header(None)):
    """Reloads knowledge from all sources without restarting the server."""
    if not x_admin_token or not secrets.compare_digest(x_admin_token, settings.ADMIN_TOKEN):
        raise HTTPException(status_code=401, detail="Unauthorized admin token")
    
    new_context = await build_knowledge_context()
    
    # Update the global variable in main.py
    # We navigate through the module reference to update the state
    main_module.knowledge_context = new_context
    
    return {
        "status": "reloaded",
        "characters": len(new_context),
        "preview": new_context[:100] + "..." if len(new_context) > 100 else new_context
    }
