import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { driverProfileSchema } from "@futuristic/shared";
import * as profileService from "../services/profile.service.js";

export const profileRouter = Router();

profileRouter.get("/", authenticate, authorize("DRIVER"), async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user!.id);
    const completeness = profileService.computeProfileCompleteness(profile as any);
    res.json({ success: true, data: { profile, completeness } });
  } catch (err) {
    next(err);
  }
});

profileRouter.put("/", authenticate, authorize("DRIVER"), validate(driverProfileSchema), async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user!.id, req.body);
    const completeness = profileService.computeProfileCompleteness(profile as any);
    res.json({ success: true, data: { profile, completeness } });
  } catch (err) {
    next(err);
  }
});
