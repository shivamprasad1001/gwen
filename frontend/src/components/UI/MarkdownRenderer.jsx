import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="font-lora text-warm-text-primary text-xl font-semibold mt-6 mb-3" {...props} />,
        h2: ({ node, ...props }) => <h2 className="font-lora text-warm-text-primary text-lg font-semibold mt-5 mb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="font-lora text-warm-text-primary text-md font-semibold mt-4 mb-2" {...props} />,
        p: ({ node, ...props }) => <p className="font-sans text-[15px] leading-relaxed text-warm-text-primary mb-3" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold text-warm-text-primary" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        code: ({ node, inline, ...props }) => 
          inline ? (
            <code className="font-mono text-[13px] bg-warm-surface border border-warm-border rounded px-1.5 py-0.5 text-warm-accent" {...props} />
          ) : (
            <pre className="block bg-[#2C2825] border border-white/5 rounded-md p-4 my-4 overflow-x-auto">
              <code className="text-[#F0EBE1] font-mono text-[13px] bg-none p-0 border-none" {...props} />
            </pre>
          ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-left-3 border-warm-accent bg-warm-accent-soft/30 pl-4 py-2 my-4 rounded-r-md italic text-warm-text-secondary" {...props} />
        ),
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-3 space-y-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-3 space-y-2" {...props} />,
        li: ({ node, ...props }) => <li className="font-sans text-[15px] leading-relaxed" {...props} />,
        hr: ({ node, ...props }) => <hr className="border-t border-warm-border my-6" {...props} />,
        a: ({ node, ...props }) => <a className="text-warm-accent underline underline-offset-2 hover:text-warm-accent/80 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
