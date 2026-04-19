# delete_index.py
from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))
index.delete(delete_all=True)
print("✅ All vectors deleted")
print(index.describe_index_stats())