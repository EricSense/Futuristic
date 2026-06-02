import { Router } from "express";
import { capabilitySchema, vehicleCreateSchema } from "@futuristic/shared";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  addCapability,
  createVehicle,
  listAvailableVehicles,
  listOwnerVehicles,
  seedDefaultCapabilities,
} from "../services/vehicle.service.js";

export const vehicleRouter: Router = Router();

vehicleRouter.get("/available", requireAuth, async (_req, res, next) => {
  try {
    const vehicles = await listAvailableVehicles();
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
});

vehicleRouter.get("/", requireAuth, requireRole("OWNER"), async (req, res, next) => {
  try {
    const vehicles = await listOwnerVehicles(req.user!.userId);
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
});

vehicleRouter.post("/", requireAuth, requireRole("OWNER"), async (req, res, next) => {
  try {
    const input = vehicleCreateSchema.parse(req.body);
    const vehicle = await createVehicle(req.user!.userId, input);
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
});

vehicleRouter.post("/:id/capabilities", requireAuth, requireRole("OWNER"), async (req, res, next) => {
  try {
    const input = capabilitySchema.parse(req.body);
    const cap = await addCapability(String(req.params.id), req.user!.userId, input);
    res.status(201).json(cap);
  } catch (err) {
    next(err);
  }
});

vehicleRouter.post("/:id/seed-capabilities", requireAuth, requireRole("OWNER"), async (req, res, next) => {
  try {
    const vehicle = await seedDefaultCapabilities(String(req.params.id), req.user!.userId);
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
});
