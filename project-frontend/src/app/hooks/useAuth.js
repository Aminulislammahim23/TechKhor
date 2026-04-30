import { useEffect, useState } from "react";
import {
  clearAuthToken,
  getAuthToken,
  isAuthenticated,
  normalizeApiError,
  setAuthToken,
} from "../services";
import { authService } from "../services/authService";
import { getCurrentRoleFromToken } from "../utils/jwt";

export { clearAuthToken, getAuthToken, isAuthenticated, setAuthToken };

function getTokenFromResponse(data) {
  return data?.token || data?.accessToken || data?.access_token || null;
}

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sync = () => setAuthenticated(isAuthenticated());

    window.addEventListener("storage", sync);
    window.addEventListener("authchange", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("authchange", sync);
    };
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError("");
      const response = await authService.login(credentials);
      const token = getTokenFromResponse(response.data);

      if (!token) {
        throw new Error("Login succeeded but no token was returned by the server.");
      }

      setAuthToken(token);

      return {
        token,
        role: getCurrentRoleFromToken(token),
      };
    } catch (err) {
      const message = normalizeApiError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    try {
      setLoading(true);
      setError("");
      await authService.register(payload);
    } catch (err) {
      const message = normalizeApiError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthToken();
  };

  return {
    isAuthenticated: authenticated,
    token: authenticated ? getAuthToken() : null,
    loading,
    error,
    setError,
    login,
    register,
    logout,
  };
}
