import React, { useState, useRef, useEffect } from 'react';
import { Send, Hash } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const InputBar = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-dark/80 backdrop-blur-md border-t border-muted/10 sticky bottom-0 z-10">
      <form 
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto relative flex items-end gap-3 bg-darker border border-muted/20 p-2 pl-4 rounded-2xl shadow-xl focus-within:border-accent/40 transition-colors"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your knowledge bot..."
          className="flex-grow bg-transparent border-none outline-none text-sm py-2 resize-none text-[#C5C6C7] placeholder-muted/60"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className={twMerge(
            "p-3 rounded-xl transition-all duration-200",
            text.trim() && !isLoading
              ? "bg-accent text-dark hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(102,252,241,0.3)]"
              : "bg-muted/10 text-muted cursor-not-allowed"
          )}
        >
          <Send size={18} />
        </button>
      </form>
      <div className="text-[10px] text-center mt-2 text-muted/40 uppercase tracking-[0.2em] font-medium">
        Personal AI • Knowledge Retrieval System
      </div>
    </div>
  );
};

export default InputBar;
