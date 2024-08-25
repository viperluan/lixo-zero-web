import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL:
    import.meta.env.NODE_ENV === 'production'
      ? 'https://backend-tematico.vercel.app'
      : 'http://localhost:5000',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const errorMessage =
        error.response.data?.message || error.response.data?.error || 'Ocorreu um erro no servidor';
      toast.error(errorMessage);

      return Promise.reject(error);
    } else {
      toast.error('Erro de conexão ou timeout');
      return Promise.reject('Erro de conexão ou timeout');
    }
  }
);

export default api;
