import React from 'react';
import { User } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // Premium dark theme for code

const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';

  // Configure marked for safety and syntax highlighting
  marked.setOptions({
    gfm: true,
    breaks: true,
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (err) {}
      }
      return hljs.highlightAuto(code).value;
    }
  });

  const htmlContent = marked.parse(content);

  return (
    <div className={twMerge(
      "flex w-full mb-6 gap-3 animate-in fade-in slide-in-from-bottom-2",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={twMerge(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px]",
        isUser ? "bg-accent/20 text-accent border border-accent/20" : "bg-darker text-muted border border-muted/20"
      )}>
        {isUser ? <User size={16} /> : "SP"}
      </div>

      <div className={twMerge(
        "max-w-[85%] sm:max-w-[70%] space-y-1",
        isUser ? "items-end text-right" : "items-start text-left"
      )}>
        <div className={twMerge(
          "px-4 py-3 rounded-2xl inline-block text-sm leading-relaxed",
          isUser 
            ? "bg-accent/10 border border-accent/20 text-accent rounded-tr-none" 
            : "bg-[#1F2833] border border-[#2E3C4E] text-[#C5C6C7] rounded-tl-none shadow-lg"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div 
              className="prose prose-invert prose-sm max-w-none 
                         prose-headings:text-accent prose-a:text-accent 
                         prose-code:text-accent prose-strong:text-accent-hover
                         prose-code:bg-darker prose-code:px-1 prose-code:rounded
                         prose-pre:bg-[#0B0C10] prose-pre:border prose-pre:border-[#2E3C4E]
                         markdown-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
