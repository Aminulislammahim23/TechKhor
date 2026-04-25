import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5010";
export const ACCESS_TOKEN_KEY = "access_token";
const LEGACY_TOKEN_KEY = "token";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getAuthToken() {
  if (!canUseStorage()) return null;

  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (!canUseStorage()) return;

  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(LEGACY_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  }

  window.dispatchEvent(new Event("authchange"));
}

export function clearAuthToken() {
  setAuthToken(null);
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function normalizeApiError(error) {
  const responseMessage = error?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(", ");
  }

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  return error?.message || "Something went wrong. Please try again.";
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = normalizeApiError(error);

    if (error?.response?.status === 401) {
      clearAuthToken();
    }

    return Promise.reject(error);
  }
);

export const register = (payload) => api.post("/auth/register", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const getProducts = (params) => api.get("/products", { params });
export const createProduct = (payload) => api.post("/products", payload);
export const createOrderFromCart = () => api.post("/orders/from-cart");
export const createOrder = (payload) => api.post("/orders", payload);
export const getMyOrders = () => api.get("/orders/my");
export const getAdminOrders = () => api.get("/orders/admin");
export const createPayment = (payload) => api.post("/payments", payload);
export const getPayments = () => api.get("/payments");
export const getAdminPayments = () => api.get("/payments/admin");
export const getMaintenanceStatus = () => api.get("/admin/settings/maintenance");
export const updateMaintenanceStatus = (maintenanceMode) =>
  api.patch("/admin/settings/maintenance", { maintenanceMode });
export const getPublicMaintenanceStatus = () => api.get("/maintenance/status");
export const getMaintenanceAccess = () => api.get("/maintenance/access");

export default api;
