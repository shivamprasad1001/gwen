import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import FollowUpSuggestions from './FollowUpSuggestions';

const InputBar = ({ onSend, isLoading, suggestions, suggestionsVisible, setSuggestionsVisible }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleAdjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    handleAdjustHeight();
  }, [text]);

  const handleSend = (overrideText) => {
    const finalMsg = typeof overrideText === 'string' ? overrideText : text;
    if (finalMsg.trim() && !isLoading) {
      onSend(finalMsg.trim());
      setText('');
      if (suggestionsVisible) setSuggestionsVisible(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    // Dismiss suggestions upon typing
    if (val.trim() && suggestionsVisible) {
      setSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (suggestionText) => {
    handleSend(suggestionText);
  };

  return (
    <div className="w-full bg-warm-base px-3 md:px-5 pb-8 md:pb-6 pt-2">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-2">
        
        {/* Follow-up Suggestions Area */}
        <FollowUpSuggestions 
          suggestions={suggestions}
          visible={suggestionsVisible}
          onSelect={handleSuggestionClick}
        />

        {/* Input Wrapper */}
        <div className={twMerge(
          "w-full flex items-end gap-2 bg-warm-surface border border-warm-border rounded-xl p-2.5 px-4 transition-all duration-300 shadow-sm",
          "focus-within:border-warm-accent focus-within:shadow-[0_0_0_3px_rgba(193,125,74,0.12)]"
        )}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gwen anything..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none py-1.5 font-sans text-[15px] text-black leading-relaxed placeholder:text-warm-text-muted"
          />
          
          <button
            onClick={() => handleSend()}
            disabled={!text.trim() || isLoading}
            className={twMerge(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0",
              text.trim() && !isLoading 
                ? "bg-warm-accent text-white hover:bg-[#A86B3A] hover:scale-105 active:scale-95 shadow-md" 
                : "bg-warm-border text-warm-text-muted cursor-not-allowed opacity-40"
            )}
          >
            <ArrowUp size={18} />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] md:text-[11px] text-warm-text-muted text-center tracking-tight opacity-70">
          Gwen may make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
};

export default InputBar;
