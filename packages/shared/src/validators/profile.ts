import { z } from "zod";

export const profileUpdateSchema = z.object({
  credentials: z.record(z.unknown()).optional(),
  authorization: z.record(z.unknown()).optional(),
  autonomyPosture: z.record(z.unknown()).optional(),
  compliance: z.record(z.unknown()).optional(),
  operationalNeeds: z.record(z.unknown()).optional(),
  energyProfile: z.record(z.unknown()).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
