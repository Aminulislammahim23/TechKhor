import { useEffect, useState } from "react";

export function getAuthToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }

  window.dispatchEvent(new Event("authchange"));
}

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    const sync = () => setAuthenticated(isAuthenticated());

    window.addEventListener("storage", sync);
    window.addEventListener("authchange", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("authchange", sync);
    };
  }, []);

  return {
    isAuthenticated: authenticated,
    token: authenticated ? getAuthToken() : null,
  };
}
