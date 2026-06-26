import React, { useState } from 'react';
import { ArrowLeft, Check, Copy, BookOpen, Key, Terminal, Settings, Code } from 'lucide-react';

const DocPage = ({ onBack }) => {
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState('react');

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const reactBoilerplate = `import { useState, useCallback } from 'react';
import axios from 'axios';

// Create API client configuration
const gwenClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://gwen-ccgg.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Gwen-API-Key': import.meta.env.VITE_GWEN_API_KEY || ''
  }
});

export const useGwenChat = (appId = 'portfolio') => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await gwenClient.post('/chat', {
        message: text,
        session_id: sessionId,
        history: messages.map(m => ({ role: m.role, content: m.content })),
        app_id: appId
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.reply
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (response.data.session_id) {
        setSessionId(response.data.session_id);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Trouble connecting to Gwen.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, sessionId, appId]);

  return { messages, sendMessage, isLoading, error };
};`;

  const axiosBoilerplate = `import axios from 'axios';

const sendChatMessage = async () => {
  try {
    const response = await axios.post(
      'https://gwen-ccgg.onrender.com/api/chat',
      {
        message: 'Hello Gwen!',
        app_id: 'portfolio', // custom app context ('portfolio' or 'gwen-site')
        history: [], // optional chat history array
        session_id: null // optional persistent uuid session_id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Gwen-API-Key': 'your-gwen-api-key-here'
        }
      }
    );
    console.log('Gwen Reply:', response.data.reply);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
};`;

  const fetchBoilerplate = `const sendChatMessage = async () => {
  try {
    const response = await fetch('https://gwen-ccgg.onrender.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gwen-API-Key': 'your-gwen-api-key-here'
      },
      body: JSON.stringify({
        message: 'Hello Gwen!',
        app_id: 'portfolio',
        history: [],
        session_id: null
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Network error');
    }
    
    const data = await response.json();
    console.log('Gwen Reply:', data.reply);
  } catch (error) {
    console.error('Error contacting Gwen:', error);
  }
};`;

  const pythonBoilerplate = `import requests

url = "https://gwen-ccgg.onrender.com/api/chat"
headers = {
    "Content-Type": "application/json",
    "X-Gwen-API-Key": "your-gwen-api-key-here"
}
payload = {
    "message": "Hello Gwen!",
    "app_id": "portfolio",
    "history": [],
    "session_id": None
}

try:
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    data = response.json()
    print(f"Gwen Reply: {data['reply']}")
except Exception as e:
    print(f"Failed to query Gwen API: {e}")`;

  const tabs = {
    react: { label: 'React Hook', code: reactBoilerplate, lang: 'javascript' },
    axios: { label: 'Axios JS', code: axiosBoilerplate, lang: 'javascript' },
    fetch: { label: 'Fetch API', code: fetchBoilerplate, lang: 'javascript' },
    python: { label: 'Python', code: pythonBoilerplate, lang: 'python' }
  };

  return (
    <div className="flex h-screen w-full bg-warm-base text-warm-text-primary overflow-hidden font-sans">
      {/* Doc Sidebar Navigation */}
      <aside className="w-64 bg-warm-sidebar border-r border-warm-border hidden md:flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-warm-border flex items-center gap-2">
          <BookOpen className="text-warm-accent" size={20} />
          <h1 className="font-lora italic text-[17px] text-warm-accent font-medium">Gwen Developer</h1>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          <a href="#overview" className="flex items-center gap-2.5 px-3 py-2 text-sm text-warm-text-secondary hover:text-warm-accent rounded-md hover:bg-warm-accent-soft/20 transition-all font-medium">
            <BookOpen size={16} /> Overview
          </a>
          <a href="#auth" className="flex items-center gap-2.5 px-3 py-2 text-sm text-warm-text-secondary hover:text-warm-accent rounded-md hover:bg-warm-accent-soft/20 transition-all font-medium">
            <Key size={16} /> Authentication
          </a>
          <a href="#chat" className="flex items-center gap-2.5 px-3 py-2 text-sm text-warm-text-secondary hover:text-warm-accent rounded-md hover:bg-warm-accent-soft/20 transition-all font-medium">
            <Terminal size={16} /> POST /chat
          </a>
          <a href="#suggestions" className="flex items-center gap-2.5 px-3 py-2 text-sm text-warm-text-secondary hover:text-warm-accent rounded-md hover:bg-warm-accent-soft/20 transition-all font-medium">
            <Settings size={16} /> POST /suggestions
          </a>
          <a href="#tailoring" className="flex items-center gap-2.5 px-3 py-2 text-sm text-warm-text-secondary hover:text-warm-accent rounded-md hover:bg-warm-accent-soft/20 transition-all font-medium">
            <Settings size={16} /> App Context Tailoring
          </a>
          <a href="#boilerplates" className="flex items-center gap-2.5 px-3 py-2 text-sm text-warm-text-secondary hover:text-warm-accent rounded-md hover:bg-warm-accent-soft/20 transition-all font-medium">
            <Code size={16} /> Integration Boilerplates
          </a>
        </nav>
        <div className="p-4 border-t border-warm-border">
          <button 
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-warm-border text-warm-text-secondary text-sm font-medium rounded-md hover:bg-warm-surface active:scale-[0.98] transition-all"
          >
            <ArrowLeft size={16} /> Back to Chat
          </button>
        </div>
      </aside>

      {/* Main Documentation Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-warm-border bg-warm-base md:hidden z-30">
          <button onClick={onBack} className="flex items-center gap-1.5 text-warm-text-secondary text-sm font-medium">
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="font-lora italic text-[17px] text-warm-accent">Gwen API Docs</h2>
          <div className="w-8 h-8" />
        </header>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 max-w-4xl space-y-12 scroll-smooth">
          {/* Header Description */}
          <section id="overview" className="space-y-4">
            <h1 className="font-lora text-3xl font-medium text-warm-text-primary">Gwen API Documentation</h1>
            <p className="text-warm-text-secondary leading-relaxed">
              Integrate Gwen, Shivam's digital twin, into your own portfolio websites, chat applications, or developer consoles. 
              The backend handles authentication, dynamically loaded context models (Pinecone RAG database), custom prompt orchestration, and session history management.
            </p>
          </section>

          {/* Authentication Section */}
          <section id="auth" className="space-y-4 border-t border-warm-border pt-8">
            <h2 className="text-xl font-medium font-lora text-warm-text-primary flex items-center gap-2">
              <Key className="text-warm-accent" size={20} /> Authentication
            </h2>
            <p className="text-warm-text-secondary leading-relaxed">
              The API uses custom API keys passed in the header to authenticate applications. 
              Always keep your key secure and do not expose it on public frontend clients if you want to avoid rate-limiting.
            </p>
            <div className="bg-[#2C2825] text-warm-base rounded-lg p-4 font-mono text-sm space-y-2 border border-white/5 relative">
              <span className="text-emerald-400 font-semibold block">// Required Header</span>
              <div>
                <span className="text-warm-accent-soft">X-Gwen-API-Key: </span>
                <span className="text-[#a89880]">sk_gwen_live_xxxxxxxxxxxxxxxxxxxxxxxx</span>
              </div>
            </div>
          </section>

          {/* Chat Endpoint */}
          <section id="chat" className="space-y-4 border-t border-warm-border pt-8">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/10 text-emerald-600 font-mono text-xs px-2.5 py-1 rounded font-bold border border-emerald-500/20">POST</span>
              <h2 className="text-xl font-medium font-lora text-warm-text-primary">/api/chat</h2>
            </div>
            <p className="text-warm-text-secondary">
              Query the LLM agent using Shivam's RAG identity dataset. This executes context generation and response assembly.
            </p>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-warm-text-muted mt-4">Payload Options</h3>
            <div className="border border-warm-border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-warm-surface border-b border-warm-border text-warm-text-secondary font-medium">
                    <th className="p-3">Field</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Requirement</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-border">
                  <tr className="hover:bg-warm-surface/20">
                    <td className="p-3 font-mono font-semibold text-warm-accent">message</td>
                    <td className="p-3 text-warm-text-secondary">string</td>
                    <td className="p-3 text-red-500 font-medium">Required</td>
                    <td className="p-3 text-warm-text-muted">The user's query text.</td>
                  </tr>
                  <tr className="hover:bg-warm-surface/20">
                    <td className="p-3 font-mono font-semibold text-warm-accent">app_id</td>
                    <td className="p-3 text-warm-text-secondary">string</td>
                    <td className="p-3 text-warm-text-secondary">Optional</td>
                    <td className="p-3 text-warm-text-muted">Custom tailors prompt personality (<code className="bg-warm-surface px-1 py-0.5 rounded text-xs">portfolio</code> or <code className="bg-warm-surface px-1 py-0.5 rounded text-xs">gwen-site</code>).</td>
                  </tr>
                  <tr className="hover:bg-warm-surface/20">
                    <td className="p-3 font-mono font-semibold text-warm-accent">history</td>
                    <td className="p-3 text-warm-text-secondary">array</td>
                    <td className="p-3 text-warm-text-secondary">Optional</td>
                    <td className="p-3 text-warm-text-muted">List of chat rounds: <code className="text-xs">{"[{role: 'user', content: '...'}]"}</code></td>
                  </tr>
                  <tr className="hover:bg-warm-surface/20">
                    <td className="p-3 font-mono font-semibold text-warm-accent">session_id</td>
                    <td className="p-3 text-warm-text-secondary">string</td>
                    <td className="p-3 text-warm-text-secondary">Optional</td>
                    <td className="p-3 text-warm-text-muted">Pass a unique persistent UUID to preserve conversation history.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Request Schema Code Block */}
            <div className="relative bg-[#2C2825] text-warm-base rounded-lg p-4 font-mono text-sm border border-white/5 space-y-2 group">
              <button 
                onClick={() => handleCopy('req', `{\n  "message": "What is Shivam's stack?",\n  "app_id": "portfolio",\n  "history": [],\n  "session_id": "00000000-0000-0000-0000-000000000000"\n}`)}
                className="absolute top-3 right-3 text-warm-text-muted hover:text-white transition-colors duration-150"
              >
                {copiedId === 'req' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
              <span className="text-emerald-400 font-semibold block">// Example payload</span>
              <pre className="text-warm-accent-soft">{`{
  "message": "What is Shivam's stack?",
  "app_id": "portfolio",
  "history": [],
  "session_id": "00000000-0000-0000-0000-000000000000"
}`}</pre>
            </div>
          </section>

          {/* Suggestions Endpoint */}
          <section id="suggestions" className="space-y-4 border-t border-warm-border pt-8">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/10 text-emerald-600 font-mono text-xs px-2.5 py-1 rounded font-bold border border-emerald-500/20">POST</span>
              <h2 className="text-xl font-medium font-lora text-warm-text-primary">/api/suggestions</h2>
            </div>
            <p className="text-warm-text-secondary">
              Generates three dynamic conversational response hints for the user based on the last message pair. This uses no authentication check and can be run openly.
            </p>
            <div className="relative bg-[#2C2825] text-warm-base rounded-lg p-4 font-mono text-sm border border-white/5 space-y-2 group">
              <button 
                onClick={() => handleCopy('sug', `{\n  "last_user_message": "Tell me about your RAG setup.",\n  "last_assistant_reply": "I search memories using Pinecone embeddings."\n}`)}
                className="absolute top-3 right-3 text-warm-text-muted hover:text-white transition-colors duration-150"
              >
                {copiedId === 'sug' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
              <span className="text-emerald-400 font-semibold block">// Example payload</span>
              <pre className="text-warm-accent-soft">{`{
  "last_user_message": "Tell me about your RAG setup.",
  "last_assistant_reply": "I search memories using Pinecone embeddings."
}`}</pre>
            </div>
          </section>

          {/* App Context Tailoring */}
          <section id="tailoring" className="space-y-4 border-t border-warm-border pt-8">
            <h2 className="text-xl font-medium font-lora text-warm-text-primary flex items-center gap-2">
              <Settings className="text-warm-accent" size={20} /> App Context Tailoring
            </h2>
            <p className="text-warm-text-secondary leading-relaxed">
              Gwen is built with multi-tenant awareness. By sending the optional <code className="bg-warm-surface px-1 py-0.5 rounded text-xs font-mono">app_id</code> parameter, 
              Gwen alters its prompt style dynamically:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warm-text-secondary">
              <li>
                <span className="font-semibold text-warm-text-primary">portfolio:</span> Guides Gwen to talk like a professional resume twin, prioritizing Shivam's engineering skills, active projects, work history, and contact details.
              </li>
              <li>
                <span className="font-semibold text-warm-text-primary">gwen-site:</span> Guides Gwen to speak about digital identities, reinforcement learning research, future MARL projects, and the architecture of the twin system itself.
              </li>
            </ul>
          </section>

          {/* Integration Boilerplates */}
          <section id="boilerplates" className="space-y-4 border-t border-warm-border pt-8 pb-16">
            <h2 className="text-xl font-medium font-lora text-warm-text-primary flex items-center gap-2">
              <Code className="text-warm-accent" size={20} /> Integration Boilerplates
            </h2>
            <p className="text-warm-text-secondary">
              Choose your language or integration library below to copy-paste directly into your project's codebase.
            </p>

            {/* Tab Selectors */}
            <div className="flex border-b border-warm-border">
              {Object.entries(tabs).map(([id, item]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-px ${
                    activeTab === id
                      ? 'border-warm-accent text-warm-accent'
                      : 'border-transparent text-warm-text-secondary hover:text-warm-accent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Code Block Container */}
            <div className="relative bg-[#2C2825] text-warm-base rounded-lg p-5 font-mono text-xs border border-white/5 overflow-x-auto shadow-md">
              <button 
                onClick={() => handleCopy(activeTab, tabs[activeTab].code)}
                className="absolute top-4 right-4 text-warm-text-muted hover:text-white transition-colors duration-150 z-10 p-1.5 rounded hover:bg-white/5"
                title="Copy to clipboard"
              >
                {copiedId === activeTab ? (
                  <span className="text-emerald-400 flex items-center gap-1.5 font-sans font-medium text-xs">
                    <Check size={14} /> Copied!
                  </span>
                ) : (
                  <Copy size={15} />
                )}
              </button>
              <pre className="text-warm-accent-soft pt-4 leading-relaxed whitespace-pre font-mono">
                {tabs[activeTab].code}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DocPage;
