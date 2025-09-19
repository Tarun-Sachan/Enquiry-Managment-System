import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // use env variable
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((cfg: AxiosRequestConfig) => {
  try {
    const token = localStorage.getItem("auth_token");
    if (token) {
      cfg.headers = cfg.headers ?? {};
      (cfg.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Token attach error:", e);
  }
  return cfg;
});

export default api;
