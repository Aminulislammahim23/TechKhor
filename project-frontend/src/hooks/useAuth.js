import { useEffect, useState } from "react";
import {
    clearAuthToken,
  getAuthToken,
  isAuthenticated,
  normalizeApiError,
  setAuthToken,
} from "../services";
import { authService } from "../services/api";

export default function useAuth() {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            authService.getCurrentUser()
                .then((response) => {
                    setAuth({
                        isAuthenticated: true,
                        user: response.data,
                        loading: false,
                        error: null,
                    });
                })
                .catch((error) => {
                    clearAuthToken();
                    setAuth({
                        isAuthenticated: false,
                        user: null,
                        loading: false,
                        error: normalizeApiError(error),
                    });
                });
        } else {
            setAuth((prev) => ({ ...prev, loading: false }));
        }
    }, []);

    const login = async (email, password) => {
        setAuth((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const response = await authService.login(email, password);
            setAuthToken(response.data.token);
            const userResponse = await authService.getCurrentUser();
            setAuth({
                isAuthenticated: true,
                user: userResponse.data,
                loading: false,
                error: null,
            });
        } catch (error) {
            clearAuthToken();
            setAuth({
                isAuthenticated: false,
                user: null,
                loading: false,
                error: normalizeApiError(error),
            });
        }
    };

    const logout = () => {
        clearAuthToken();
        setAuth({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
        });
    };

    return {
        ...auth,
        login,
        logout,
    };
}