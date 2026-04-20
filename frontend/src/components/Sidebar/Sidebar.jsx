import React from 'react';
import { Plus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import SessionList from './SessionList';

const Sidebar = ({ 
  isOpen, 
  groupedSessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat 
}) => {
  return (
    <aside
      className={twMerge(
        "fixed md:relative top-0 left-0 h-full bg-warm-sidebar border-r border-warm-border flex flex-col transition-transform duration-[280ms] cubic-bezier(0.4, 0, 0.2, 1) z-50",
        "w-[280px]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Sidebar Header */}
      <div className="p-5 px-6 pb-3">
        <h2 className="font-lora text-[20px] italic font-semibold text-warm-accent">
          Gwen
        </h2>
        <p className="text-[12px] text-warm-text-secondary font-sans">
          your conversations
        </p>
      </div>

      {/* New Chat Button */}
      <div className="px-4 mb-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-warm-accent text-warm-accent rounded-md font-sans text-[14px] font-medium transition-all duration-200 hover:bg-warm-accent-soft/30 active:scale-[0.98]"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      <div className="h-[1px] bg-warm-border mx-4 my-2 opacity-50" />

      {/* Session List */}
      <SessionList 
        groupedSessions={groupedSessions} 
        currentSessionId={currentSessionId} 
        onSelectSession={onSelectSession} 
      />

      {/* Sidebar Footer */}
      <footer className="p-5 border-t border-warm-border bg-warm-sidebar/50">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] text-warm-text-muted">
            Powered by <span className="font-medium">Gemini + Groq</span>
          </p>
          <p className="text-[11px] text-warm-text-muted flex items-center gap-1">
            Made by <span className="text-warm-accent font-medium">Shivam</span>
          </p>
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;
