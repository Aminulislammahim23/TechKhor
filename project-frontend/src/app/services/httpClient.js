import axios from "axios";
import { clearAuthToken, getAuthToken } from "./authStorage";

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5010";

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

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = normalizeApiError(error);

    if (error?.response?.status === 401) {
      clearAuthToken();
    }

    return Promise.reject(error);
  }
);

export default httpClient;
