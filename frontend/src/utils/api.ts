// src/utils/api.ts
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((cfg: AxiosRequestConfig) => {
  try {
    const token = localStorage.getItem("auth_token"); // ✅ fixed key
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
