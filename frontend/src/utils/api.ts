// import axios, { type AxiosRequestConfig, type AxiosRequestHeaders } from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ?? "",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config: AxiosRequestConfig) => {
//   try {
//     const token = localStorage.getItem("auth_token");
//     if (token) {
//       // Ensure headers exist
//       if (!config.headers) {
//         config.headers = {} as AxiosRequestHeaders;
//       }

//       // Assign Authorization safely
//       (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
//     }
//   } catch (error) {
//     console.error("Token attach error:", error);
//   }
//   return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    // config.headers is AxiosHeaders type
    config.headers = config.headers ?? {};
    // Use type assertion to bypass TS strictness
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
