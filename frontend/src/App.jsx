import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import { useChat } from './hooks/useChat';
import { BrainCircuit, Github, Command } from 'lucide-react';

const SUGGESTIONS = [
  "Who is Shivam?", 
  "What is TriviLabs?",
  "His research goals", 
  "Current projects", 
  "Tech stack"
];

function App() {
  const { messages, sendMessage, isLoading, error, showSuggestions } = useChat();

  return (
    <div className="flex h-screen bg-[#0B0C10] text-[#C5C6C7] overflow-hidden">
      {/* Main Content */}
      <main className="flex-grow flex flex-col h-full bg-gradient-to-br from-[#0B0C10] via-[#0B0C10] to-[#121212] relative">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-muted/5 bg-dark/40 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-accent blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <span className="text-accent font-bold text-sm">SP</span>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest uppercase text-white">Shivam</h1>
              <div className="flex items-center gap-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                <span className="text-[9px] text-muted font-bold tracking-tighter uppercase opacity-60">Personal AI • Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition-colors">
              <Github size={18} />
            </a>
            <div className="h-4 w-[1px] bg-muted/20"></div>
            <div className="flex items-center gap-2 text-[10px] text-muted font-mono bg-darker px-2 py-1 rounded border border-muted/10">
              <Command size={10} />
              IDENTITY_MODE
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-grow overflow-hidden flex flex-col relative">
          <ChatWindow messages={messages} isLoading={isLoading} error={error} />
          
          {/* Suggestion Chips */}
          {showSuggestions && (
            <div className="absolute bottom-4 left-0 right-0 px-6 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(s)}
                  className="px-4 py-2 bg-darker/60 hover:bg-accent/10 border border-muted/10 hover:border-accent/40 rounded-full text-xs text-muted hover:text-accent transition-all duration-300 backdrop-blur-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="w-full max-w-4xl mx-auto">
          <InputBar onSend={sendMessage} isLoading={isLoading} />
        </div>
        
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-muted/5 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
      </main>
    </div>
  );
}

export default App;
