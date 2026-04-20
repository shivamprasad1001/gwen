import React from 'react';
import SessionItem from './SessionItem';

const SessionList = ({ groupedSessions, currentSessionId, onSelectSession }) => {
  const hasSessions = Object.values(groupedSessions).some(g => g.length > 0);

  if (!hasSessions) {
    return (
      <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
        <p className="text-[12px] text-warm-text-muted italic">
          No conversations yet. Start one to see your history here.
        </p>
      </div>
    );
  }

  const renderGroup = (label, sessions) => {
    if (sessions.length === 0) return null;
    return (
      <div key={label} className="mb-6">
        <h3 className="text-[11px] font-semibold text-warm-text-muted uppercase tracking-[0.08em] px-3 mb-2">
          {label}
        </h3>
        <div className="flex flex-col gap-1">
          {sessions.map(s => (
            <SessionItem
              key={s.id}
              title={s.title}
              timestamp={s.createdAt}
              isActive={s.id === currentSessionId}
              onClick={() => onSelectSession(s.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-2 py-4">
      {renderGroup('Today', groupedSessions.today)}
      {renderGroup('Yesterday', groupedSessions.yesterday)}
      {renderGroup('Last 7 Days', groupedSessions.last7days)}
      {renderGroup('Older', groupedSessions.older)}
    </div>
  );
};

export default SessionList;
