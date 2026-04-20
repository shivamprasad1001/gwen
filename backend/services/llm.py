import logging
from typing import List
from google import genai
from groq import AsyncGroq
from backend.settings import settings

logger = logging.getLogger(__name__)

# Initialize the Google GenAI Client lazily
client = None
if settings.GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize Gemini client: {e}")
else:
    logger.warning("GEMINI_API_KEY not set. Gemini functionality will be unavailable.")

async def ask_gemini(system_prompt: str, history: List[dict], message: str) -> str:
    """Primary LLM handler: Google Gemini 1.5 Flash using new google-genai SDK."""
    if client is None:
        logger.error("Gemini client is not initialized. Check GEMINI_API_KEY.")
        raise Exception("Gemini client not initialized")
    try:
        # Format history for the new SDK
        # The new SDK uses 'user' and 'model'
        contents = []
        for msg in history:
            role = "user" if msg["role"] == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg["content"]}]
            })
        
        # Add current message
        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })
            
        # Call generate_content with system_instruction in config
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=contents,
            config={
                "system_instruction": system_prompt
            }
        )
        
        return response.text
    except Exception as e:
        logger.warning(f"Gemini error with new SDK: {str(e)}")
        raise e

async def ask_groq(system_prompt: str, history: List[dict], message: str) -> str:
    """Fallback LLM handler: Groq (Llama 3.3 70B)."""
    try:
        groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        
        # Format messages for Groq
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Add current message
        messages.append({"role": "user", "content": message})
            
        response = await groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Groq error: {str(e)}")
        raise e
