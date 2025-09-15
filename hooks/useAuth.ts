"use client";

import { useState, useEffect } from "react";

export interface AuthContext {
  token: string | null;
  login: (jwt: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export function useAuth(): AuthContext {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("token");
      if (stored) setToken(stored);
    }
    setLoading(false); // ya terminó de leer
  }, []);

  const login = (jwt: string) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return { token, login, logout, isAuthenticated: !!token, loading };
}
