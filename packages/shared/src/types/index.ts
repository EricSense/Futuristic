/** DDI policy domains evaluated during a vehicle bind */
export const DDI_DOMAINS = [
  "credentials",
  "authorization",
  "autonomy",
  "compliance",
  "operational",
  "energy",
] as const;

export type DdiDomain = (typeof DDI_DOMAINS)[number];

/** @deprecated use DDI_DOMAINS */
export const PREFERENCE_CATEGORIES = DDI_DOMAINS;
export type PreferenceCategory = DdiDomain;

export const USER_ROLES = ["DRIVER", "OWNER", "FLEET_OPERATOR", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface BindClaim {
  category: string;
  key: string;
  requestedValue: unknown;
  applied: boolean;
  reason?: string;
}

/** Bind manifest returned when DDI is presented to a vehicle surface */
export interface BindManifest {
  items: BindClaim[];
  summary: {
    granted: number;
    denied: number;
    skipped: number;
  };
  message: string;
  bindStatus: "authorized" | "partial" | "denied";
}

/** @deprecated use BindManifest */
export interface SyncPlanItem extends BindClaim {}
/** @deprecated use BindManifest */
export interface SyncPlan {
  items: BindClaim[];
  summary: { applied: number; unsupported: number; skipped: number };
  message: string;
}

export interface ProfileCompleteness {
  percent: number;
  filled: string[];
  missing: string[];
}
