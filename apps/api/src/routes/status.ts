import { Router } from "express";
import { getLatestSyncProof } from "../services/sync.service.js";
import { getPlatformStatus } from "../services/vehicle.service.js";

export const statusRouter: Router = Router();

statusRouter.get("/public", async (_req, res, next) => {
  try {
    const [status, proof] = await Promise.all([getPlatformStatus(), getLatestSyncProof()]);
    res.json({ ...status, latestProof: proof });
  } catch (err) {
    next(err);
  }
});
