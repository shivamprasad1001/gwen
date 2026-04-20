import React from 'react';
import { twMerge } from 'tailwind-merge';
import MarkdownRenderer from '../UI/MarkdownRenderer';
import gwenAvatarStaticUrl from '../../assets/gwen-avatar-static.svg';

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
        {/* Avatar for Bot using Static SVG for performance */}
        {!isUser && (
          <div style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            marginTop: 2,
            border: '1px solid #E8D5BE'
          }}>
            <img
              src={gwenAvatarStaticUrl}
              width="30"
              height="30"
              alt="Gwen"
              style={{ display: 'block' }}
            />
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
