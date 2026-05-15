import type {
  ApiResponse,
  AuthTokens,
  AuthUser,
  DigitalDrivingIdentity,
  DriverPreferences,
  FederationChallenge,
  IssueDDIInput,
  RecognitionResult,
  SyncPlan,
  UpdateDDIInput,
  VerifiablePresentation,
} from "@futuristic/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("futuristic_auth");
    return raw ? (JSON.parse(raw) as AuthTokens) : null;
  } catch {
    return null;
  }
}

export function setAuthTokens(tokens: AuthTokens | null) {
  if (typeof window === "undefined") return;
  if (tokens) localStorage.setItem("futuristic_auth", JSON.stringify(tokens));
  else localStorage.removeItem("futuristic_auth");
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { auth?: boolean },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };

  if (init?.auth !== false) {
    const tokens = getTokens();
    if (tokens?.accessToken) headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !body.success) {
    throw new Error(body.error || body.message || `API error ${res.status}`);
  }
  return body.data as T;
}

export const api = {
  health: () => apiFetch<{ status: string }>("/health", { auth: false }),

  register: (data: { email: string; password: string; name: string }) =>
    apiFetch<{ user: AuthUser; tokens: AuthTokens }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ ...data, role: "DRIVER" }),
      auth: false,
    }),

  login: (email: string, password: string) =>
    apiFetch<{ user: AuthUser; tokens: AuthTokens }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      auth: false,
    }),

  getDDI: () => apiFetch<DigitalDrivingIdentity | null>("/api/ddi/me"),

  issueDDI: (input: IssueDDIInput) =>
    apiFetch<DigitalDrivingIdentity>("/api/ddi/issue", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateDDI: (input: UpdateDDIInput) =>
    apiFetch<DigitalDrivingIdentity>("/api/ddi/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  revokeDDI: () =>
    apiFetch<void>("/api/ddi/me", { method: "DELETE" }),

  getProfile: () => apiFetch<DriverPreferences & { completeness: number }>("/api/profile"),

  updateProfile: (prefs: Partial<DriverPreferences>) =>
    apiFetch<DriverPreferences>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(prefs),
    }),

  federationPresent: (challenge: string) =>
    apiFetch<VerifiablePresentation>("/api/federation/present", {
      method: "POST",
      body: JSON.stringify({ challenge }),
    }),

  federationStatus: (challenge: string) =>
    apiFetch<RecognitionResult>(
      `/api/federation/session/${encodeURIComponent(challenge)}/driver`,
    ),

  startSync: (vehicleId: string) =>
    apiFetch<{ session: { id: string }; syncPlan: SyncPlan }>("/api/sync/start", {
      method: "POST",
      body: JSON.stringify({ vehicleId }),
    }),
};

export const vehicleApi = {
  requestChallenge: (vehicleId: string, apiKey: string) =>
    fetch(`${API_URL}/api/federation/challenge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Vehicle-Api-Key": apiKey,
      },
      body: JSON.stringify({ vehicleId }),
    }).then(async (res) => {
      const body = (await res.json()) as ApiResponse<FederationChallenge>;
      if (!res.ok || !body.success) throw new Error(body.error || "Challenge failed");
      return body.data!;
    }),

  getSession: (challenge: string, apiKey: string) =>
    fetch(`${API_URL}/api/federation/session/${encodeURIComponent(challenge)}`, {
      headers: { "X-Vehicle-Api-Key": apiKey },
    }).then(async (res) => {
      const body = (await res.json()) as ApiResponse<RecognitionResult>;
      if (!res.ok || !body.success) throw new Error(body.error || "Session fetch failed");
      return body.data!;
    }),
};
