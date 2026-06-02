"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/api";
import { getDashboardPath } from "@/lib/api";

export function useAuth(requiredRole?: AuthUser["role"]) {
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("futuristic_user");
    const token = localStorage.getItem("futuristic_token");
    if (!raw || !token) {
      router.replace("/login");
      return;
    }
    const user = JSON.parse(raw) as AuthUser;
    if (requiredRole && user.role !== requiredRole) {
      router.replace(getDashboardPath(user.role));
    }
  }, [router, requiredRole]);

  function logout() {
    localStorage.removeItem("futuristic_token");
    localStorage.removeItem("futuristic_refresh");
    localStorage.removeItem("futuristic_user");
    router.push("/login");
  }

  function getToken() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("futuristic_token") ?? "";
  }

  function getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("futuristic_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  return { logout, getToken, getUser };
}
