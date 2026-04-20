import { useState, useCallback } from 'react';
import * as api from '../api/client';
import { getKeywordSuggestions } from '../utils/getKeywordSuggestions';

export const useChat = (currentSessionId, currentSessionMessages, updateSessionMessages) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const fetchSuggestions = async (userMsg, assistantReply) => {
    try {
      const response = await api.post('/suggestions', {
        last_user_message: userMsg,
        last_assistant_reply: assistantReply
      });
      
      const data = response.data || response; // handle both axios response structures
      
      if (data.suggestions && data.suggestions.length === 3) {
        setSuggestions(data.suggestions);
        setSuggestionsVisible(true);
      } else {
        throw new Error('Invalid suggestions format');
      }
    } catch (err) {
      console.warn('Backend suggestions failed, falling back to keywords:', err);
      const fallback = getKeywordSuggestions(assistantReply);
      setSuggestions(fallback);
      setSuggestionsVisible(true);
    }
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Reset suggestions immediately
    setSuggestionsVisible(false);

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
      
      // Delay fetch suggestions slightly for better UX (let Gwen's message appear first)
      setTimeout(() => {
        fetchSuggestions(text, response.reply);
      }, 400);

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
    error,
    suggestions,
    suggestionsVisible,
    setSuggestionsVisible
  };
};
