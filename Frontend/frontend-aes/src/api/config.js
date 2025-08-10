import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL para la API
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y tokens expirados
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.log('Token expirado, redirigiendo al login...');
      
      // Limpiar tokens del storage
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      
      // Recargar página para mostrar login
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
