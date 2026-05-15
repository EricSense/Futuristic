import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100),
  role: z.enum(["DRIVER", "OWNER", "FLEET_OPERATOR"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const seatConfigSchema = z.object({
  position: z.number().min(0).max(10).optional(),
  lumbar: z.number().min(0).max(5).optional(),
  height: z.number().min(0).max(10).optional(),
  tilt: z.number().min(0).max(6).optional(),
  heatingLevel: z.number().min(0).max(3).optional(),
  coolingLevel: z.number().min(0).max(3).optional(),
});

export const mirrorConfigSchema = z.object({
  leftAngleH: z.number().min(-30).max(30).optional(),
  leftAngleV: z.number().min(-15).max(15).optional(),
  rightAngleH: z.number().min(-30).max(30).optional(),
  rightAngleV: z.number().min(-15).max(15).optional(),
  rearviewDim: z.boolean().optional(),
});

export const climateConfigSchema = z.object({
  temperature: z.number().min(55).max(90).optional(),
  fanSpeed: z.number().min(1).max(7).optional(),
  dualZone: z.boolean().optional(),
  driverZoneTemp: z.number().min(55).max(90).optional(),
  passengerZoneTemp: z.number().min(55).max(90).optional(),
});

export const infotainmentConfigSchema = z.object({
  volume: z.number().min(0).max(30).optional(),
  bassLevel: z.number().min(0).max(10).optional(),
  trebleLevel: z.number().min(0).max(10).optional(),
  preferredSource: z.string().optional(),
  favoriteStations: z.array(z.string()).optional(),
});

export const drivingModeSchema = z.object({
  preferred: z.string().optional(),
  steeringFeel: z.string().optional(),
  suspensionMode: z.string().optional(),
  regenerativeBraking: z.string().optional(),
});

export const accessibilitySchema = z.object({
  largeFonts: z.boolean().optional(),
  highContrast: z.boolean().optional(),
  voiceControl: z.boolean().optional(),
  parkingAssist: z.boolean().optional(),
});

export const driverProfileSchema = z.object({
  seatConfig: seatConfigSchema.optional(),
  mirrorConfig: mirrorConfigSchema.optional(),
  climateConfig: climateConfigSchema.optional(),
  infotainmentConfig: infotainmentConfigSchema.optional(),
  drivingMode: drivingModeSchema.optional(),
  accessibility: accessibilitySchema.optional(),
});

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  year: z.number().int().min(2000).max(2030),
  vin: z
    .string()
    .length(17, "VIN must be exactly 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]+$/, "Invalid VIN format"),
});

export const vehicleCapabilitySchema = z.object({
  category: z.string().min(1),
  supportedRange: z.record(z.any()),
});

export const fleetSchema = z.object({
  name: z.string().min(1, "Fleet name is required").max(100),
});

export const syncRequestSchema = z.object({
  vehicleId: z.string().uuid("Invalid vehicle ID"),
});

export const mobilityNeedsSchema = z.object({
  mobility: z.string().optional(),
  vision: z.string().optional(),
  hearing: z.string().optional(),
  communication: z.string().optional(),
});

export const issueDDISchema = z.object({
  holderName: z.string().min(1).max(100),
  homeCity: z.string().min(1).max(120),
  mobilityNeeds: mobilityNeedsSchema.optional(),
  languages: z.array(z.string().min(2).max(5)).min(1).optional(),
  aiPersona: z.enum(["concise", "warm", "playful"]).optional(),
});

export const updateDDISchema = issueDDISchema.partial();

export const federationChallengeSchema = z.object({
  vehicleId: z.string().uuid("Invalid vehicle ID"),
});

export const federationPresentSchema = z.object({
  challenge: z.string().min(16, "Invalid challenge"),
});

export const federationVerifySchema = z.object({
  challenge: z.string().min(16, "Invalid challenge"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DriverProfileInput = z.infer<typeof driverProfileSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type VehicleCapabilityInput = z.infer<typeof vehicleCapabilitySchema>;
export type FleetInput = z.infer<typeof fleetSchema>;
export type SyncRequestInput = z.infer<typeof syncRequestSchema>;
