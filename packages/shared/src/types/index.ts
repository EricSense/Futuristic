export * from "./ddi";

export type UserRole = "DRIVER" | "OWNER" | "FLEET_OPERATOR" | "ADMIN";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SeatConfig {
  position?: number;
  lumbar?: number;
  height?: number;
  tilt?: number;
  heatingLevel?: number;
  coolingLevel?: number;
}

export interface MirrorConfig {
  leftAngleH?: number;
  leftAngleV?: number;
  rightAngleH?: number;
  rightAngleV?: number;
  rearviewDim?: boolean;
}

export interface ClimateConfig {
  temperature?: number;
  fanSpeed?: number;
  dualZone?: boolean;
  driverZoneTemp?: number;
  passengerZoneTemp?: number;
}

export interface InfotainmentConfig {
  volume?: number;
  bassLevel?: number;
  trebleLevel?: number;
  preferredSource?: string;
  favoriteStations?: string[];
}

export interface DrivingModeConfig {
  preferred?: string;
  steeringFeel?: string;
  suspensionMode?: string;
  regenerativeBraking?: string;
}

export interface AccessibilityConfig {
  largeFonts?: boolean;
  highContrast?: boolean;
  voiceControl?: boolean;
  parkingAssist?: boolean;
}

export interface DriverPreferences {
  seatConfig: SeatConfig;
  mirrorConfig: MirrorConfig;
  climateConfig: ClimateConfig;
  infotainmentConfig: InfotainmentConfig;
  drivingMode: DrivingModeConfig;
  accessibility: AccessibilityConfig;
}

export interface CapabilityRange {
  min?: number;
  max?: number;
  options?: (string | boolean)[];
}

export interface VehicleCapabilitySet {
  [setting: string]: CapabilityRange;
}

export type SyncPlanItemStatus = "applied" | "clamped" | "unsupported";

export interface SyncPlanItem {
  category: string;
  setting: string;
  requestedValue: unknown;
  appliedValue: unknown;
  status: SyncPlanItemStatus;
  reason?: string;
}

export interface SyncPlan {
  items: SyncPlanItem[];
  summary: {
    applied: number;
    clamped: number;
    unsupported: number;
    total: number;
  };
}

export const PREFERENCE_CATEGORIES = [
  "seat",
  "mirror",
  "climate",
  "infotainment",
  "drivingMode",
  "accessibility",
] as const;

export type PreferenceCategory = (typeof PREFERENCE_CATEGORIES)[number];
