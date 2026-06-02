import { Router } from "express";
import { profileUpdateSchema } from "@futuristic/shared";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { getDriverProfile, updateDriverProfile } from "../services/profile.service.js";

export const profileRouter: Router = Router();

profileRouter.use(requireAuth, requireRole("DRIVER"));

profileRouter.get("/", async (req, res, next) => {
  try {
    const profile = await getDriverProfile(req.user!.userId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

profileRouter.patch("/", async (req, res, next) => {
  try {
    const input = profileUpdateSchema.parse(req.body);
    const profile = await updateDriverProfile(req.user!.userId, input);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});
