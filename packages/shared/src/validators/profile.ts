import { z } from "zod";

export const profileUpdateSchema = z.object({
  seatConfig: z.record(z.unknown()).optional(),
  mirrorConfig: z.record(z.unknown()).optional(),
  climateConfig: z.record(z.unknown()).optional(),
  infotainmentConfig: z.record(z.unknown()).optional(),
  drivingMode: z.record(z.unknown()).optional(),
  accessibility: z.record(z.unknown()).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
