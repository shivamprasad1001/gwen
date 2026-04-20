import React from 'react';
import { twMerge } from 'tailwind-merge';

const FollowUpSuggestions = ({ suggestions, onSelect, visible }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={twMerge(
      "w-full px-6 pb-2.5 transition-all duration-300 ease-in-out",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
    )}>
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        <p className="text-[11px] text-warm-text-muted font-medium uppercase tracking-[0.04em] mb-1 pl-1">
          Continue exploring <span className="text-warm-accent">›</span>
        </p>
        <div className="flex flex-wrap gap-2 justify-start">
          {suggestions.map((text, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(text)}
              className={twMerge(
                "group flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-warm-border bg-warm-base shadow-sm",
                "text-[13px] text-warm-text-secondary font-sans transition-all duration-200",
                "hover:bg-warm-accent-soft hover:border-warm-accent hover:text-warm-accent hover:-translate-y-0.5",
                "active:translate-y-0 hover:shadow-[0_3px_10px_rgba(193,125,74,0.15)]"
              )}
            >
              <span className="text-warm-accent opacity-70 group-hover:opacity-100 transition-opacity font-bold">›</span>
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowUpSuggestions;
