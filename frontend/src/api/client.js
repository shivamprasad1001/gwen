import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://gwen-ccgg.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Gwen-API-Key': import.meta.env.VITE_GWEN_API_KEY || '',
  },
});

export const chat = ({ message, history, session_id, app_id }) =>
  api.post('/chat', { message, history, session_id, app_id: app_id || 'default' })
    .then(r => r.data);

export default api;
