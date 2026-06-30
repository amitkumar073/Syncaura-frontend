import axios from "axios";

const api = axios.create({
  // Use relative URL so Vite proxy forwards /api/* to backend (no CORS issues).
  // In production, set VITE_API_URL to your deployed backend URL.
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Read accessToken first (set by authSlice), fall back to legacy "token" key
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;