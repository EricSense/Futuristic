import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { fleetSchema } from "@futuristic/shared";
import * as fleetService from "../services/fleet.service.js";

export const fleetRouter = Router();

fleetRouter.get("/", authenticate, authorize("FLEET_OPERATOR", "ADMIN"), async (req, res, next) => {
  try {
    const fleets = await fleetService.listFleets(req.user!.id);
    res.json({ success: true, data: fleets });
  } catch (err) {
    next(err);
  }
});

fleetRouter.post("/", authenticate, authorize("FLEET_OPERATOR", "ADMIN"), validate(fleetSchema), async (req, res, next) => {
  try {
    const fleet = await fleetService.createFleet(req.user!.id, req.body);
    res.status(201).json({ success: true, data: fleet });
  } catch (err) {
    next(err);
  }
});

fleetRouter.post("/:id/vehicles", authenticate, authorize("FLEET_OPERATOR", "ADMIN"), async (req, res, next) => {
  try {
    const result = await fleetService.addVehicleToFleet(req.user!.id, req.params.id as string, req.body.vehicleId);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

fleetRouter.delete("/:id/vehicles/:vehicleId", authenticate, authorize("FLEET_OPERATOR", "ADMIN"), async (req, res, next) => {
  try {
    await fleetService.removeVehicleFromFleet(req.user!.id, req.params.id as string, req.params.vehicleId as string);
    res.json({ success: true, message: "Vehicle removed from fleet" });
  } catch (err) {
    next(err);
  }
});

fleetRouter.get("/:id/analytics", authenticate, authorize("FLEET_OPERATOR", "ADMIN"), async (req, res, next) => {
  try {
    const analytics = await fleetService.getFleetAnalytics(req.user!.id, req.params.id as string);
    res.json({ success: true, data: analytics });
  } catch (err) {
    next(err);
  }
});

fleetRouter.delete("/:id", authenticate, authorize("FLEET_OPERATOR", "ADMIN"), async (req, res, next) => {
  try {
    await fleetService.deleteFleet(req.user!.id, req.params.id as string);
    res.json({ success: true, message: "Fleet deleted" });
  } catch (err) {
    next(err);
  }
});
