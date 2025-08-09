import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE } from "../utils/constants";

const http = axios.create({ baseURL: API_BASE });

http.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  console.log("Token encontrado:", token); // Debug temporal
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Header Authorization:", config.headers.Authorization); // Debug temporal
  } else {
    console.log("No se encontró token en cookies"); // Debug temporal
  }
  return config;
});

// Interceptor de respuesta para debug
http.interceptors.response.use(
  (response) => {
    console.log("Respuesta exitosa:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("Error de respuesta:", error.response?.status, error.config?.url);
    console.log("Headers enviados:", error.config?.headers);
    return Promise.reject(error);
  }
);

export default http;
