import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Sparkles, Library } from 'lucide-react';

const ChatWindow = ({ messages, isLoading, error }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-grow overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 opacity-40">
            <div className="p-6 rounded-full bg-accent/5 border border-accent/10">
              <Sparkles size={48} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">How can I help you today?</h2>
              <p className="text-sm text-muted mt-1">Upload documents to build your personal knowledge base.</p>
            </div>
            <div className="flex gap-4 mt-8">
              <div className="flex items-center gap-2 text-xs border border-muted/20 px-3 py-1.5 rounded-full text-muted">
                <Library size={14} /> PDF
              </div>
              <div className="flex items-center gap-2 text-xs border border-muted/20 px-3 py-1.5 rounded-full text-muted">
                <Library size={14} /> JSON
              </div>
              <div className="flex items-center gap-2 text-xs border border-muted/20 px-3 py-1.5 rounded-full text-muted">
                <Library size={14} /> TXT/MD
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble 
              key={idx}
              role={msg.role}
              content={msg.content}
              sources={msg.sources}
              llm_used={msg.llm_used}
            />
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 animate-pulse mb-6">
            <div className="w-8 h-8 rounded-full bg-darker border border-muted/10 shadow-inner" />
            <div className="bg-darker border border-muted/10 rounded-2xl rounded-tl-none px-6 py-4 flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm mb-6 max-w-lg mx-auto">
            {error}
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatWindow;
