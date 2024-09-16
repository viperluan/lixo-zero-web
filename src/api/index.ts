import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

type ErrorResponseType = {
  message?: string;
  error?: string;
};

const isDevelopment = import.meta.env.MODE === 'development';
const baseURL = isDevelopment ? `http://localhost:5000` : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500,
});

const responseSuccessInterceptor = (response: AxiosResponse) => Promise.resolve(response);

const responseErrorInterceptor = (error: AxiosError<ErrorResponseType>) => {
  if (error.response) {
    const serverErrorMessage = error.response.data?.message || error.response.data?.error;
    toast.error(serverErrorMessage || 'Ocorreu um erro no servidor');

    return Promise.reject(error);
  }

  toast.error('Erro de conexão ou timeout');
  return Promise.reject('Erro de conexão ou timeout');
};

api.interceptors.response.use(responseSuccessInterceptor, responseErrorInterceptor);

export default api;
