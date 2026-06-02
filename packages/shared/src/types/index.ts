export const PREFERENCE_CATEGORIES = [
  "seat",
  "mirrors",
  "climate",
  "infotainment",
  "drivingMode",
  "accessibility",
] as const;

export type PreferenceCategory = (typeof PREFERENCE_CATEGORIES)[number];

export const USER_ROLES = ["DRIVER", "OWNER", "FLEET_OPERATOR", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface SyncPlanItem {
  category: string;
  key: string;
  requestedValue: unknown;
  applied: boolean;
  reason?: string;
}

export interface SyncPlan {
  items: SyncPlanItem[];
  summary: {
    applied: number;
    unsupported: number;
    skipped: number;
  };
  message: string;
}

export interface ProfileCompleteness {
  percent: number;
  filled: string[];
  missing: string[];
}
