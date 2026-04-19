# Personal Knowledge AI Chatbot

A production-ready RAG-based AI assistant that uses your personal documents (PDF, JSON, TXT, MD) as knowledge source.

## 🚀 Features
- **Retrieval Augmented Generation (RAG)**: Extracts answers ONLY from your documents.
- **Smart Primary/Fallback LLM**: Uses Google Gemini (Primary) and Groq/Llama 3.3 (Fallback).
- **High-Performance Vector Search**: Powered by MongoDB Atlas Vector Search.
- **Modern UI**: Dark mode, glassmorphism design with responsive sidebar.
- **Admin Tools**: Knowledge management and document clearing.

---

## 🛠️ Setup Instructions

### 1. MongoDB Atlas Configuration
1. **Create a Cluster**: Sign up for a free MongoDB Atlas account and create a shared cluster.
2. **Network Access**: Allow access from your IP address.
3. **Database & Collection**: The system will automatically create `personal_ai_db` and `knowledge_chunks`.
4. **Vector Search Index**: 
   - Go to "Search" tab on your `knowledge_chunks` collection.
   - Click "Create Search Index" -> "Atlas Vector Search" (JSON Editor).
   - Use the following configuration:
   ```json
   {
     "fields": [
       {
         "numDimensions": 768,
         "path": "embedding",
         "similarity": "cosine",
         "type": "vector"
       }
     ]
   }
   ```
   - Name the index exactly `vector_index`.

### 2. Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create a `.env` file based on `.env.example`:
   ```bash
   MONGODB_URI=your_atlas_connection_string
   GEMINI_API_KEY=your_key
   GROQ_API_KEY=your_key
   OWNER_NAME=YourName
   ```
4. Start the server: `uvicorn main:app --reload`

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing the System
1. **Ingest Knowledge**: 
   - Open the sidebar "Knowledge Desk".
   - Upload a PDF (e.g., your resume or a technical manual).
   - Click "START INGESTION".
2. **Chat**: 
   - Ask a question specifically about the uploaded document.
   - The AI will provide sources and indicate which LLM was used.
3. **Direct API Test (curl)**:
   ```bash
   curl -X POST http://localhost:8000/api/chat \
   -H "Content-Type: application/json" \
   -d '{"message": "What is in my documents?", "history": []}'
   ```

## ⚙️ Tech Stack
- **Backend**: FastAPI, Motor (Async MongoDB), PyMuPDF, LangChain (Splitters).
- **AI**: Gemini 1.5 Flash (Primary), Groq/Llama 3.3 (Fallback), Google text-embedding-004.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
