import { Router } from "express";
import { fleetAssignSchema, fleetCreateSchema } from "@futuristic/shared";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  assignVehicleToFleet,
  createFleet,
  getFleetAnalytics,
  listAssignableVehicles,
  listFleets,
} from "../services/vehicle.service.js";

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

fleetRouter.get("/assignable-vehicles", async (_req, res, next) => {
  try {
    const vehicles = await listAssignableVehicles();
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
});

fleetRouter.post("/:id/assign", async (req, res, next) => {
  try {
    const { vehicleId } = fleetAssignSchema.parse(req.body);
    const vehicle = await assignVehicleToFleet(String(req.params.id), vehicleId, req.user!.userId);
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
});
