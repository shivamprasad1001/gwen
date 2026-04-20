import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ messages, isLoading, onSendMessage }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-2 scroll-smooth">
      <div className="max-w-3xl mx-auto flex flex-col gap-4 min-h-full">
        {messages.length === 0 ? (
          <WelcomeScreen onSendMessage={onSendMessage} />
        ) : (
          <>
            {messages.map((msg, idx) => (
              <MessageBubble 
                key={idx} 
                role={msg.role} 
                content={msg.content} 
                timestamp={msg.timestamp} 
              />
            ))}
            
            {isLoading && <TypingIndicator />}
            
            {/* Scroll Anchor */}
            <div ref={scrollRef} className="h-4 w-full flex-shrink-0" />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
