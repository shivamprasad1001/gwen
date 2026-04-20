import asyncio
from datetime import datetime
from backend.settings import knowledge_base

async def seed():
    print("Starting MongoDB Seeding...")
    
    # Check current docs
    cursor = knowledge_base.find({})
    docs = await cursor.to_list(length=100)
    print(f"Current document count in knowledge_base: {len(docs)}")
    
    # Sample document to insert (Identity basics)
    sample_doc = {
        "key": "identity",
        "content": "Shivam is the Co-founder of TriviLabs. He is an AI engineer with a deep interest in agentic workflows and decentralized intelligence. He believes that the future of AI lies in collaboration between specialized sub-agents rather than monolithic models.",
        "source": "mongodb",
        "updated_at": datetime.utcnow()
    }
    
    # Insert if not exists
    existing = await knowledge_base.find_one({"key": "identity"})
    if not existing:
        result = await knowledge_base.insert_one(sample_doc)
        print(f"Inserted sample identity doc: {result.inserted_id}")
    else:
        print("Identity document already exists. Skipping insertion.")

    print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed())
