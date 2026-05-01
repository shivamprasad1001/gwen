import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://recognize-lou-translated-bond.trycloudflare.com/api' || 'https://gwen-ccgg.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chat = ({ message, history, session_id }) =>
  api.post('/chat', { message, history, session_id })
    .then(r => r.data);

export default api;
