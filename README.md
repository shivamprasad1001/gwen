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
- **Fron# System Architecture: Pinecone RAG Workflow

This diagram illustrates the end-to-end flow of a user message through the Personal AI system, from initial request to the final AI response.

```mermaid
graph TD
    %% User & Frontend
    User([User]) -->|Sends Message| UI[React Frontend]
    UI -->|POST /api/chat| API[FastAPI Backend]

    %% Backend Initial State
    Startup[Startup Event] -.->|Loads| BK[Base Knowledge Context]
    BK -.->|From| MD[(Markdown Files)]
    BK -.->|From| MDB[(MongoDB)]
    BK -.->|From| JSN[(JSON Skills)]

    subgraph "RAG Pipeline"
        API -->|1. Generate Embedding| EMB[Embedding Service]
        EMB -->|Google text-embedding-004| VEC(Message Vector)
        VEC -->|2. Search Chunks| PC[(Pinecone DB)]
        PC -->|Matches| RC[Dynamic RAG Context]
    end

    subgraph "Generation Phase"
        API -->|3. Combine| PB[Prompt Builder]
        BK --> PB
        RC --> PB
        PB -->|System Prompt| LLM{LLM Service}
        LLM -->|Primary| GEM[Gemini 1.5 Flash]
        LLM -.->|Fallback| GRQ[Groq/Llama 3.3]
    end

    %% Recovery & Storage
    LLM -->|4. Reply| API
    API -->|Async Log| LOG[(Chat Sessions MongoDB)]
    API -->|5. Formatted JSON| UI
    UI -->|Render Markdown| User

    %% Styling
    style User fill:#61dafb,stroke:#282c34,color:#000
    style UI fill:#1f2833,stroke:#45a29e,color:#fff
    style API fill:#0b0c10,stroke:#66fcf1,color:#fff
    style PC fill:#2a2a2a,stroke:#c5c6c7,color:#fff
    style BK fill:#1f2833,stroke:#66fcf1,stroke-dasharray: 5 5,color:#fff
    style GEM fill:#4285f4,stroke:#fff,color:#fff
    style GRQ fill:#f55036,stroke:#fff,color:#fff
```

### Flow Breakdown:

1.  **Initialize**: At server startup, the bot loads "Base Knowledge" (your bio, standard projects, skills) from local files and MongoDB.
2.  **Embed**: When you ask a question, the system uses Google Gemini to turn your words into a numeric vector.
3.  **Retrieve**: It searches your **Pinecone** index for the technical chunks (resume details, deep project history) that most closely match your question.
4.  **Synthesize**: It builds a massive prompt containing who you are (Base Knowledge) and the specific facts it just found (RAG Context).
5.  **Generate**: The LLM reads this "Cheat Sheet" and answers in your voice, perfectly informed.
6.  **Log**: The conversation is stored in MongoDB so the bot remembers the context of the current session.tend**: React 18, Vite, Tailwind CSS, Lucide Icons.
