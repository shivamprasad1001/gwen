import React from 'react';
import { twMerge } from 'tailwind-merge';
import MarkdownRenderer from '../UI/MarkdownRenderer';

const MessageBubble = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  return (
    <div className={twMerge(
      "flex w-full animate-message-in flex-col",
      isUser ? "items-end" : "items-start"
    )}>
      <div className={twMerge(
        "flex gap-2.5 max-w-[85%] md:max-w-[72%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar for Bot */}
        {!isUser && (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-warm-accent to-[#8B5E3C] flex items-center justify-center text-white font-lora text-[12px] italic flex-shrink-0 mt-0.5 shadow-sm">
            Gwen
          </div>
        )}

        {/* Bubble */}
        <div className={twMerge(
          "px-[18px] py-[14px] text-[15px] shadow-warm-soft transition-all duration-300",
          isUser
            ? "bg-warm-message-usr text-warm-text-primary rounded-l-lg rounded-tr-lg rounded-br-sm"
            : "bg-warm-message-bot border border-warm-border rounded-r-lg rounded-tl-lg rounded-bl-sm"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap font-sans leading-relaxed text-warm-text-primary">
              {content}
            </p>
          ) : (
            <MarkdownRenderer content={content} />
          )}
        </div>
      </div>

      {/* Timestamp */}
      {timestamp && (
        <span className={twMerge(
          "text-[11px] text-warm-text-muted mt-1.5",
          !isUser ? "ml-[38px]" : "mr-1"
        )}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
};

export default MessageBubble;
