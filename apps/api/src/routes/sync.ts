import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { syncRequestSchema } from "@futuristic/shared";
import * as syncService from "../services/sync.service.js";

export const syncRouter = Router();

syncRouter.post("/start", authenticate, authorize("DRIVER"), validate(syncRequestSchema), async (req, res, next) => {
  try {
    const result = await syncService.startSync(req.user!.id, req.body.vehicleId);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

syncRouter.post("/:sessionId/end", authenticate, authorize("DRIVER"), async (req, res, next) => {
  try {
    const session = await syncService.endSync(req.params.sessionId as string, req.user!.id);
    res.json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
});

syncRouter.get("/history", authenticate, authorize("DRIVER"), async (req, res, next) => {
  try {
    const sessions = await syncService.getSessionHistory(req.user!.id);
    res.json({ success: true, data: sessions });
  } catch (err) {
    next(err);
  }
});
