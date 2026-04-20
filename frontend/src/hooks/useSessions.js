import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'gwen_sessions';

export const useSessions = () => {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  const createSession = () => {
    const newSession = {
      id: uuidv4(),
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const selectSession = (id) => {
    setCurrentSessionId(id);
  };

  const updateSessionMessages = (id, messages) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        // Update title based on the first user message if it's currently default
        let title = s.title;
        if (title === 'New Conversation' && messages.length > 0) {
          const firstUserMsg = messages.find(m => m.role === 'user');
          if (firstUserMsg) {
            title = firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '');
          }
        }
        return { ...s, messages, title };
      }
      return s;
    }));
  };

  const deleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
    }
  };

  const clearCurrentSession = () => {
    setCurrentSessionId(null);
  };

  // Grouping logic for display
  const getGroupedSessions = () => {
    const groups = {
      today: [],
      yesterday: [],
      last7days: [],
      older: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7 = new Date(today);
    last7.setDate(last7.getDate() - 7);

    sessions.forEach(session => {
      const date = new Date(session.createdAt);
      if (date >= today) groups.today.push(session);
      else if (date >= yesterday) groups.yesterday.push(session);
      else if (date >= last7) groups.last7days.push(session);
      else groups.older.push(session);
    });

    return groups;
  };

  return {
    sessions,
    currentSession,
    currentSessionId,
    createSession,
    selectSession,
    updateSessionMessages,
    deleteSession,
    clearCurrentSession,
    getGroupedSessions
  };
};
