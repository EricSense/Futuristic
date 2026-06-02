import { Router } from "express";
import { fleetCreateSchema } from "@futuristic/shared";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { createFleet, getFleetAnalytics, listFleets } from "../services/vehicle.service.js";

export const fleetRouter: Router = Router();

fleetRouter.use(requireAuth, requireRole("FLEET_OPERATOR"));

fleetRouter.get("/", async (req, res, next) => {
  try {
    const fleets = await listFleets(req.user!.userId);
    res.json(fleets);
  } catch (err) {
    next(err);
  }
});

fleetRouter.post("/", async (req, res, next) => {
  try {
    const input = fleetCreateSchema.parse(req.body);
    const fleet = await createFleet(req.user!.userId, input);
    res.status(201).json(fleet);
  } catch (err) {
    next(err);
  }
});

fleetRouter.get("/analytics", async (req, res, next) => {
  try {
    const analytics = await getFleetAnalytics(req.user!.userId);
    res.json(analytics);
  } catch (err) {
    next(err);
  }
});
