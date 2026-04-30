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
