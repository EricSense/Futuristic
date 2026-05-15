import type {
  ApiResponse,
  FederationChallenge,
  RecognitionResult,
  SyncPlan,
} from "@futuristic/shared";

export interface FuturisticVehicleClientOptions {
  baseUrl: string;
  vehicleApiKey: string;
}

/**
 * SDK for OEMs, robotaxi stacks, and fleet backends to integrate Futuristic DDI recognition.
 */
export class FuturisticVehicleClient {
  private baseUrl: string;
  private vehicleApiKey: string;

  constructor(options: FuturisticVehicleClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.vehicleApiKey = options.vehicleApiKey;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-Vehicle-Api-Key": this.vehicleApiKey,
        ...init?.headers,
      },
    });
    const body = (await res.json()) as ApiResponse<T>;
    if (!res.ok || !body.success) {
      throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return body.data as T;
  }

  /** Step 1: Vehicle requests a federation challenge when a person approaches */
  async requestChallenge(vehicleId: string): Promise<FederationChallenge> {
    return this.request<FederationChallenge>("/api/federation/challenge", {
      method: "POST",
      body: JSON.stringify({ vehicleId }),
    });
  }

  /** Step 2: Poll until driver presents DDI and cabin sync is ready */
  async pollRecognition(
    challenge: string,
    options?: { intervalMs?: number; timeoutMs?: number },
  ): Promise<RecognitionResult> {
    const intervalMs = options?.intervalMs ?? 500;
    const timeoutMs = options?.timeoutMs ?? 120_000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const result = await this.getSession(challenge);
      if (result.status === "VERIFIED" || result.status === "REJECTED" || result.status === "EXPIRED") {
        return result;
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    throw new Error("Recognition timed out waiting for driver presentation");
  }

  /** Get current federation session status */
  async getSession(challenge: string): Promise<RecognitionResult> {
    return this.request<RecognitionResult>(
      `/api/federation/session/${encodeURIComponent(challenge)}`,
    );
  }

  /** Extract cabin sync plan after successful recognition */
  getSyncPlan(result: RecognitionResult): SyncPlan | undefined {
    return result.syncPlan as SyncPlan | undefined;
  }
}

export { FuturisticVehicleClient as default };
