import { useEffect, useState } from "react";
import { getAuthToken, isAuthenticated, setAuthToken } from "../api";

export { getAuthToken, isAuthenticated, setAuthToken };

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
