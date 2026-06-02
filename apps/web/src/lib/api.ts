const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "DRIVER" | "OWNER" | "FLEET_OPERATOR" | "ADMIN";
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

function getStoredRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("futuristic_refresh");
}

function storeTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("futuristic_token", accessToken);
  localStorage.setItem("futuristic_refresh", refreshToken);
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { accessToken: string; refreshToken: string };
    storeTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string; retry?: boolean } = {},
): Promise<T> {
  const { token, retry = true, ...init } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers ?? {}),
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401 && retry && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiFetch<T>(path, { ...options, token: newToken, retry: false });
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Request failed");
  return data as T;
}

export function getDashboardPath(role: AuthUser["role"]) {
  switch (role) {
    case "DRIVER":
      return "/dashboard/driver";
    case "OWNER":
      return "/dashboard/owner";
    case "FLEET_OPERATOR":
      return "/dashboard/fleet";
    default:
      return "/dashboard/driver";
  }
}

export function getRegisterPath(role: AuthUser["role"]) {
  if (role === "DRIVER") return "/dashboard/driver/onboarding";
  return getDashboardPath(role);
}

export { API_URL, storeTokens };
