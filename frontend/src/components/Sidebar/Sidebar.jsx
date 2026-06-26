import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import SessionList from './SessionList';
import gwenAvatarUrl from '../../assets/gwen-avatar.svg';

const Sidebar = ({
  isOpen,
  groupedSessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearHistory,
  onDocsClick,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const hasSessions = Object.values(groupedSessions).some(g => g.length > 0);

  const handleClearAll = () => {
    onClearHistory();
    setShowConfirm(false);
  };

  return (
    <aside
      className={twMerge(
        "fixed md:relative top-0 left-0 h-full bg-warm-sidebar border-r border-warm-border flex flex-col transition-transform duration-[280ms] cubic-bezier(0.4, 0, 0.2, 1) z-50",
        "w-[280px]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Sidebar Header with Avatar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '20px 16px 12px'
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <img src={gwenAvatarUrl} width="28" height="28" alt="Gwen" />
        </div>
        <span style={{
          fontFamily: 'Lora, serif',
          fontStyle: 'italic',
          fontSize: 17,
          color: '#C17D4A'
        }}>Gwen</span>
      </div>

      <div className="px-6 pb-3">
        <p className="text-[12px] text-warm-text-secondary font-sans leading-tight">
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
        onDeleteSession={onDeleteSession}
      />

      {/* Sidebar Footer */}
      <footer className="p-5 border-t border-warm-border bg-warm-sidebar/50">

        {/* Confirm Overlay */}
        {showConfirm && (
          <div
            style={{
              background: 'rgba(44,40,37,0.97)',
              border: '1px solid rgba(193,125,74,0.25)',
              borderRadius: 10,
              padding: '14px 12px',
              marginBottom: 12,
              animation: 'fadeSlideUp 160ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <AlertTriangle size={13} color="#f87171" />
              <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>
                Delete all history?
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#a89880', marginBottom: 12, lineHeight: 1.5 }}>
              This removes all conversations from this device. It cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  fontSize: 12,
                  borderRadius: 6,
                  border: '1px solid rgba(168,152,128,0.3)',
                  background: 'transparent',
                  color: '#a89880',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,152,128,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 6,
                  border: '1px solid rgba(248,113,113,0.4)',
                  background: 'rgba(248,113,113,0.12)',
                  color: '#f87171',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.12)'}
              >
                Delete All
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <button 
            onClick={onDocsClick}
            className="text-[12px] text-left text-warm-text-secondary hover:text-warm-accent font-medium transition-colors mb-2.5 border border-warm-border rounded p-2 flex items-center justify-center gap-1.5 bg-warm-surface/40 hover:bg-warm-surface transition-all active:scale-[0.98]"
          >
            Developer API Docs
          </button>
          <p className="text-[11px] text-warm-text-muted">
            Powered by <span className="font-medium">Gemini + Groq</span>
          </p>
          <p className="text-[11px] text-warm-text-muted flex items-center gap-1">
            Made by <span className="text-warm-accent font-medium">Shivam</span>
          </p>

          {/* Clear History Button */}
          {hasSessions && !showConfirm && (
            <button
              onClick={() => setShowConfirm(true)}
              className="mt-3 flex items-center gap-1.5 text-[11px] text-warm-text-muted hover:text-red-400 transition-colors duration-150 group"
            >
              <Trash2
                size={11}
                className="group-hover:text-red-400 transition-colors duration-150"
              />
              Clear all history
            </button>
          )}
        </div>
      </footer>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
