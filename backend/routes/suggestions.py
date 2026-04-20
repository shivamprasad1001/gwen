from fastapi import APIRouter
from pydantic import BaseModel
import json
import logging
import re
from backend.services.llm import client as gemini_client
from backend.settings import settings
from groq import AsyncGroq

router = APIRouter()
logger = logging.getLogger(__name__)

class SuggestionRequest(BaseModel):
    last_user_message: str
    last_assistant_reply: str

SUGGESTION_PROMPT = """
You are Gwen, a personal AI for Shivam Prasad.

You just gave this response to the user:
"{assistant_reply}"

Look at the KEY TOPICS, NAMES, and CONCEPTS you mentioned in that response.
Generate exactly 3 follow-up questions that dig deeper into those specific things.

Rules:
- Questions must come DIRECTLY from topics YOU mentioned in the reply
- If you mentioned "TriviLabs" → ask about it
- If you mentioned "RL and Multi-Agent Systems" → ask about it  
- If you mentioned "Anthropic, OpenAI, DeepMind" → ask about it
- If you mentioned "BTech-to-PhD" → ask about it
- Each question under 7 words
- Sound like a curious person reading YOUR reply and wanting to know more
- No markdown, no numbering
- Return ONLY a valid JSON array of exactly 3 strings
- BE VARIED AND SURPRISING. Don't always ask the same basic questions.

Example:
Reply mentioned: "TriviLabs", "Reinforcement Learning", "Research Scientist"
Output: ["What is TriviLabs?", "What is Reinforcement Learning?", "Which AI lab is his dream?"]

Reply mentioned: "PPO", "University of Alberta", "gap year"
Output: ["What is PPO exactly?", "Why University of Alberta?", "What's his gap year plan?"]

Now generate 3 questions based on YOUR reply above.
Return ONLY the JSON array.
"""

def extract_json_array(text: str):
    """Robustly extract a JSON array from a string potentially containing other text."""
    try:
        # Match the first [ and last ] to find the array
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return json.loads(text)
    except:
        return None

@router.post("/suggestions")
async def get_suggestions(req: SuggestionRequest):
    try:
        # Pass more context for better topic extraction
        prompt = SUGGESTION_PROMPT.format(
            assistant_reply=req.last_assistant_reply[:2000] 
        )
        
        # 1. Primary: Gemini 1.5 Flash
        try:
            response = gemini_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt,
                config={
                    "temperature": 0.8  # Increase variety
                }
            )
            suggestions = extract_json_array(response.text.strip())
            if isinstance(suggestions, list) and len(suggestions) == 3:
                return {"suggestions": suggestions[:3]}
        except Exception as e:
            logger.warning(f"Suggestions Gemini error: {str(e)}")

        # 2. Fallback: Groq (Llama 3.3)
        try:
            groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
            response = await groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.8
            )
            suggestions = extract_json_array(response.choices[0].message.content.strip())
            if isinstance(suggestions, list) and len(suggestions) == 3:
                return {"suggestions": suggestions[:3]}
        except Exception as e:
            logger.warning(f"Suggestions Groq error: {str(e)}")

        return {"suggestions": []}

    except Exception as e:
        logger.error(f"Suggestions general error: {str(e)}")
        return {"suggestions": []}
