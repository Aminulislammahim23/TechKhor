import apiClient from "./apiClient";

export const authService = {
  register(payload) {
    return apiClient.post("/auth/register", payload);
  },

  login(payload) {
    return apiClient.post("/auth/login", payload);
  },
};

export const register = authService.register;
export const login = authService.login;
