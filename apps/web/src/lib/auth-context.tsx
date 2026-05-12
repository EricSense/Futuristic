"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { AuthUser } from "@futuristic/shared";
import { api } from "./api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    const stored = typeof window !== "undefined" ? localStorage.getItem("futuristic_user") : null;
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        api.setToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string } }>(
      "/api/auth/login",
      { email, password },
    );
    if (res.data) {
      api.setToken(res.data.tokens.accessToken);
      localStorage.setItem("futuristic_refresh", res.data.tokens.refreshToken);
      localStorage.setItem("futuristic_user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, role: string) => {
    const res = await api.post<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string } }>(
      "/api/auth/register",
      { email, password, name, role },
    );
    if (res.data) {
      api.setToken(res.data.tokens.accessToken);
      localStorage.setItem("futuristic_refresh", res.data.tokens.refreshToken);
      localStorage.setItem("futuristic_user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
  }, []);

  const logout = useCallback(() => {
    api.setToken(null);
    localStorage.removeItem("futuristic_user");
    localStorage.removeItem("futuristic_refresh");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
