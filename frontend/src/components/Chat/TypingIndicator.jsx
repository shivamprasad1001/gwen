import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-2.5 items-start self-start max-w-[85%] animate-in fade-in slide-in-from-bottom-2">
      {/* Bot Avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-warm-accent to-[#8B5E3C] flex items-center justify-center text-white font-lora text-[12px] italic flex-shrink-0 mt-0.5">
        G
      </div>

      {/* Bubble */}
      <div className="bg-warm-message-bot border border-warm-border rounded-bl-sm rounded-tr-lg rounded-br-lg rounded-tl-lg px-4 py-3 shadow-warm-soft">
        <div className="flex gap-1.5 items-center h-5 px-1">
          <div className="w-[7px] h-[7px] rounded-full bg-warm-text-muted animate-typing-bounce" />
          <div className="w-[7px] h-[7px] rounded-full bg-warm-text-muted animate-typing-bounce [animation-delay:0.2s]" />
          <div className="w-[7px] h-[7px] rounded-full bg-warm-text-muted animate-typing-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
