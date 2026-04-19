import { useState, useCallback, useEffect } from 'react';
import * as api from '../api/client';

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm Shivam's personal AI. Ask me anything about him.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [sessionId, setSessionId] = useState(localStorage.getItem('chat_session_id') || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    if (showSuggestions) setShowSuggestions(false);

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Exclude the initial greeting from history if it wasn't a real turn
      // and keep last 10 messages for context
      const history = messages
        .filter(m => m.timestamp) // simple filter
        .slice(-10)
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const response = await api.chat({
        session_id: sessionId,
        message: text,
        history: history
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      if (!sessionId) {
        setSessionId(response.session_id);
        localStorage.setItem('chat_session_id', response.session_id);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, sessionId, showSuggestions]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    sessionId,
    showSuggestions
  };
};
