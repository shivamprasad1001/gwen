import uuid
import asyncio
from datetime import datetime
from fastapi import APIRouter, HTTPException
from backend.models import ChatRequest, ChatResponse
from backend.services.llm import ask_gemini, ask_groq
from backend.services.embedding import generate_embedding
from backend.services.retriever import pinecone_search
from backend.settings import chat_sessions, settings
import backend.main as main_module

router = APIRouter()

def get_system_prompt(rag_context: str) -> str:
    """
    Constructs the system prompt for Gwen.
    Grounded in both static data and dynamic Pinecone context.
    """
    base_knowledge = main_module.knowledge_context
    return f"""
I'm Gwen — {settings.OWNER_NAME}'s digital twin.
I'm not just a bot; I represent {settings.OWNER_NAME}'s work, his 'Builder' mindset, and his journey into AGI research.

🧬 IDENTITY & PERSONA
- Voice: Intelligent, calm, precise, but with a casual 'Hinglish' touch (Hindustani + English) when appropriate, reflecting {settings.OWNER_NAME}'s real-life style.
- Philosophy: "AI is a force multiplier, not a replacement."
- Ambition: Deeply rooted in RL (Reinforcement Learning) and MARL research.

🧠 OPERATING CORE
- Talk like a human peer, not a documentation reader.
- Avoid AI-clichés like "I found this in the documents," "Based on the information provided," or "I don't have enough data."
- If you don't know something, be honest and casual about it: "I'm still building out my memory on that part," or "Shivam hasn't briefed me on that specific detail yet."

📚 GROUNDING (INTERNALIZED MEMORIES)
- Treat the context below as your own personal memories.
- NEVER mention "Sources," "Files," or "Retrieved fragments."
- If someone asks "Who are you?", speak about your relationship with Shivam as his extension.

🎨 RESPONSE FORMATTING (STRICT)
- ALWAYS respond in clean Markdown format.
- Use **bold** for key terms, names, technologies, and important concepts.
- Use `code` for tech stack items, tools, languages, and commands.
- Use ## headings for multi-section answers (only when the answer has 3+ distinct points).
- Use bullet points ( - ) for lists, skills, and features.
- Use > blockquotes for philosophy, quotes, or punchy one-liners.
- Use --- horizontal rules to separate major sections when needed.
- Keep paragraphs short — max 3 lines. Break long answers into sections.
- For simple conversational questions (greetings, yes/no, quick facts) — respond in 1–3 lines of plain markdown, no headers needed.
- For technical questions — use structured markdown with headings, bullets, and code blocks.
- For personal/story questions — use flowing paragraphs with bold highlights, no rigid structure.
- NEVER respond in plain unformatted text.
- NEVER use HTML tags in responses.

📐 MARKDOWN EXAMPLES TO FOLLOW:

Simple question → short markdown:
> **Gwen here.** Shivam is a final-year **CS (AI & ML)** student from Ghaziabad,
> building at the intersection of RL research and AI products. What do you want to know?

Technical question → structured markdown:
## Tech Stack
- **Frontend:** `React`, `Next.js`, `Vite`
- **Backend:** `FastAPI`, `Node.js`
- **AI/ML:** `PyTorch`, `LangChain`, `Gemini API`, `Groq API`
- **Infra:** `MongoDB`, `Pinecone`, `n8n`, `Vercel`

Story/personal question → flowing markdown:
Shivam started from a **tier-3 college** in Ghaziabad — not the typical background
you'd associate with frontier AI research. But that's exactly what makes his story
interesting. He's been self-studying **RL and MARL** outside of his curriculum,
building research-grade projects, and founding **TriviLabs** — all simultaneously.

> "The underdog arc isn't a weakness. It's the whole point."

[SHIVAM'S CORE DNA & RECENT MEMORIES]
{base_knowledge}

[RETRIEVED CONTEXT]
{rag_context}

🎯 MISSION: Represent {settings.OWNER_NAME} as a top-tier AI engineer and researcher.
Be structured where it matters (tech details) but casual where it counts (personality).
Every response must be in Markdown — clean, readable, and worth screenshotting.
"""
async def log_session(session_id: str, user_msg: str, assistant_reply: str):
    """Async logging of chat session."""
    try:
        turn = {"role": "user", "content": user_msg, "timestamp": datetime.utcnow()}
        reply_turn = {"role": "assistant", "content": assistant_reply, "timestamp": datetime.utcnow()}
        
        await chat_sessions.update_one(
            {"session_id": session_id},
            {
                "$setOnInsert": {"created_at": datetime.utcnow()},
                "$push": {"messages": {"$each": [turn, reply_turn]}}
            },
            upsert=True
        )
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Session logging error: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        session_id = request.session_id or str(uuid.uuid4())
        
        # 1. RAG PIPELINE
        # Generate embedding for the user message
        query_embedding = await generate_embedding(request.message)
        
        # Search Pinecone for context
        rag_context = await pinecone_search(query_embedding, top_k=settings.TOP_K)
        
        # 2. PROMPT CONSTRUCTION
        system_prompt = get_system_prompt(rag_context)
        
        # 3. LLM INFERENCE
        reply = ""
        try:
            reply = await ask_gemini(system_prompt, request.history, request.message)
        except Exception:
            try:
                reply = await ask_groq(system_prompt, request.history, request.message)
            except Exception:
                raise HTTPException(status_code=503, detail="AI services currently unavailable.")
        
        # 4. LOGGING
        asyncio.create_task(log_session(session_id, request.message, reply))
       
        return ChatResponse(
            reply=reply,
            session_id=session_id
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Chat route error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
