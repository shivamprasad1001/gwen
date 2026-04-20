import React from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const SidebarToggle = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={twMerge(
        "fixed top-5 z-[60] w-9 h-9 rounded-full bg-warm-base border border-warm-border shadow-warm-soft",
        "flex items-center justify-center text-warm-text-secondary transition-all duration-300 ease-in-out hover:bg-warm-accent-soft hover:border-warm-accent hover:text-warm-accent",
        isOpen ? "left-[calc(var(--sidebar-width)+12px)]" : "left-4"
      )}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      <div className={twMerge(
        "transition-transform duration-300",
        isOpen ? "rotate-0" : "rotate-180"
      )}>
        {isOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
      </div>
    </button>
  );
};

export default SidebarToggle;
