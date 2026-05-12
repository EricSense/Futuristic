import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { vehicleSchema, vehicleCapabilitySchema } from "@futuristic/shared";
import * as vehicleService from "../services/vehicle.service.js";

export const vehicleRouter = Router();

vehicleRouter.get("/", authenticate, authorize("OWNER", "ADMIN"), async (req, res, next) => {
  try {
    const vehicles = await vehicleService.listVehicles(req.user!.id);
    res.json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
});

vehicleRouter.get("/:id", authenticate, async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicle(req.params.id as string);
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
});

vehicleRouter.post("/", authenticate, authorize("OWNER", "ADMIN"), validate(vehicleSchema), async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.user!.id, req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
});

vehicleRouter.patch("/:id/status", authenticate, authorize("OWNER", "ADMIN"), async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicleStatus(req.params.id as string, req.user!.id, req.body.status);
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
});

vehicleRouter.post("/:id/capabilities", authenticate, authorize("OWNER", "ADMIN"), validate(vehicleCapabilitySchema), async (req, res, next) => {
  try {
    const capability = await vehicleService.addCapability(req.params.id as string, req.user!.id, req.body);
    res.status(201).json({ success: true, data: capability });
  } catch (err) {
    next(err);
  }
});

vehicleRouter.delete("/:id", authenticate, authorize("OWNER", "ADMIN"), async (req, res, next) => {
  try {
    await vehicleService.deleteVehicle(req.params.id as string, req.user!.id);
    res.json({ success: true, message: "Vehicle deleted" });
  } catch (err) {
    next(err);
  }
});
