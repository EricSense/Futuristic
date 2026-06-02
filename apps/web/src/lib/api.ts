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

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...init } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers ?? {}),
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
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

export { API_URL };
