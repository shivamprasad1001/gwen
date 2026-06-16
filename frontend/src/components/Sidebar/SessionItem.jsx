import React, { useState } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const SessionItem = ({ title, timestamp, isActive, onClick, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffHrs < 48) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={twMerge(
        "group flex items-center gap-3 p-2.5 px-3 rounded-md cursor-pointer transition-all duration-200",
        isActive
          ? "bg-warm-accent-soft/40 border-l-2 border-warm-accent"
          : "hover:bg-warm-accent-soft/20 text-warm-text-secondary"
      )}
    >
      <MessageSquare
        size={14}
        className={twMerge(
          "flex-shrink-0 transition-colors",
          isActive ? "text-warm-accent" : "text-warm-text-muted group-hover:text-warm-accent"
        )}
      />

      <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
        <span className={twMerge(
          "text-[14px] leading-tight truncate",
          isActive ? "text-warm-text-primary font-medium" : "text-warm-text-secondary"
        )}>
          {title}
        </span>
        <span className="text-[11px] text-warm-text-muted whitespace-nowrap">
          {formatTime(timestamp)}
        </span>
      </div>

      {/* Delete button — slides in on hover */}
      <button
        onClick={handleDelete}
        title="Delete conversation"
        style={{
          opacity: hovered || isActive ? 1 : 0,
          transform: hovered || isActive ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 150ms ease, transform 150ms ease',
          pointerEvents: hovered || isActive ? 'auto' : 'none',
        }}
        className="flex-shrink-0 p-1 rounded hover:bg-red-500/15 text-warm-text-muted hover:text-red-400 transition-colors duration-150"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
};

export default SessionItem;
