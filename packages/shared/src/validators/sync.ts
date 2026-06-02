import { z } from "zod";

export const syncStartSchema = z.object({
  vehicleId: z.string().uuid(),
});

export type SyncStartInput = z.infer<typeof syncStartSchema>;
