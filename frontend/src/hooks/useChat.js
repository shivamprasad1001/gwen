import { useState, useCallback } from 'react';
import * as api from '../api/client';

export const useChat = (currentSessionId, currentSessionMessages, updateSessionMessages) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync messages when currentSessionId changes
  // We use local state for immediate UI feedback, but sync it back to sessions hook
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    let targetId = currentSessionId;
    let sessionMsgs = [...(currentSessionMessages || [])];

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const newMsgs = [...sessionMsgs, userMessage];
    
    // Optimistic update
    updateSessionMessages(targetId, newMsgs);
    setIsLoading(true);
    setError(null);

    try {
      // Build history (last 10)
      const history = sessionMsgs.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await api.chat({
        session_id: targetId,
        message: text,
        history: history
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString()
      };

      updateSessionMessages(targetId, [...newMsgs, assistantMessage]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Wait, I am having trouble connecting. Try again?');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, currentSessionMessages, updateSessionMessages]);

  return {
    sendMessage,
    isLoading,
    error
  };
};
