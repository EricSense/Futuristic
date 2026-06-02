import { z } from "zod";

export const vehicleCreateSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1990).max(2030),
  vin: z.string().min(11).max(17),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).optional(),
});

export const capabilitySchema = z.object({
  category: z.string().min(1),
  supportedRange: z.record(z.unknown()),
});

export const fleetCreateSchema = z.object({
  name: z.string().min(2),
});

export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>;
export type CapabilityInput = z.infer<typeof capabilitySchema>;
export const fleetAssignSchema = z.object({
  vehicleId: z.string().uuid(),
});

export const seedCapabilitiesSchema = z.object({
  template: z.enum(["default"]).optional(),
});

export type FleetCreateInput = z.infer<typeof fleetCreateSchema>;
export type FleetAssignInput = z.infer<typeof fleetAssignSchema>;
