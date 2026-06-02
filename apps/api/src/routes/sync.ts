import { Router } from "express";
import { syncStartSchema } from "@futuristic/shared";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  completeSyncSession,
  listDriverSessions,
  startSyncSession,
} from "../services/sync.service.js";

export const syncRouter: Router = Router();

syncRouter.use(requireAuth, requireRole("DRIVER"));

syncRouter.get("/sessions", async (req, res, next) => {
  try {
    const sessions = await listDriverSessions(req.user!.userId);
    res.json(sessions);
  } catch (err) {
    next(err);
  }
});

syncRouter.post("/start", async (req, res, next) => {
  try {
    const { vehicleId } = syncStartSchema.parse(req.body);
    const result = await startSyncSession(req.user!.userId, vehicleId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

syncRouter.post("/:id/complete", async (req, res, next) => {
  try {
    const session = await completeSyncSession(req.params.id!, req.user!.userId);
    res.json(session);
  } catch (err) {
    next(err);
  }
});
