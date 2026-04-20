import React from 'react';

const QuickChips = ({ suggestions, onChipClick }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onChipClick(s)}
          className="px-4 py-2 rounded-xl border border-warm-border bg-warm-surface text-[13px] text-warm-text-secondary transition-all duration-200 hover:border-warm-accent hover:text-warm-accent hover:bg-warm-accent-soft shadow-sm"
        >
          {s}
        </button>
      ))}
    </div>
  );
};

export default QuickChips;
