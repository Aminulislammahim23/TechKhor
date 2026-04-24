import axios from "axios";

const PRIMARY_BASE_URL = "http://localhost:5010";
const FALLBACK_BASE_URL = "http://localhost:5005";

const api = axios.create({
  baseURL: PRIMARY_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error?.code !== "ERR_NETWORK" ||
      !originalRequest ||
      originalRequest.__retriedWithFallback ||
      originalRequest.baseURL === FALLBACK_BASE_URL
    ) {
      return Promise.reject(error);
    }

    originalRequest.__retriedWithFallback = true;
    originalRequest.baseURL = FALLBACK_BASE_URL;

    return api.request(originalRequest);
  }
);

export const register = (payload) => api.post("/auth/register", payload);
export const login = (payload) => api.post("/auth/login", payload);

export default api;
