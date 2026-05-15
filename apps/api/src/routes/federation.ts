import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { vehicleApiKey } from "../middleware/vehicle-auth.js";
import {
  federationChallengeSchema,
  federationPresentSchema,
} from "@futuristic/shared";
import * as federationService from "../services/federation.service.js";

export const federationRouter = Router();

/** Vehicle initiates handshake — requires fleet/OEM API key */
federationRouter.post(
  "/challenge",
  vehicleApiKey,
  validate(federationChallengeSchema),
  async (req, res, next) => {
    try {
      const challenge = await federationService.createChallenge(req.body.vehicleId);
      res.status(201).json({ success: true, data: challenge });
    } catch (err) {
      next(err);
    }
  },
);

/** Driver presents DDI to vehicle challenge */
federationRouter.post(
  "/present",
  authenticate,
  authorize("DRIVER"),
  validate(federationPresentSchema),
  async (req, res, next) => {
    try {
      const presentation = await federationService.presentDDI(
        req.user!.id,
        req.body.challenge,
      );
      res.json({ success: true, data: presentation });
    } catch (err) {
      next(err);
    }
  },
);

/** Vehicle polls for verification + cabin sync plan */
federationRouter.get("/session/:challenge", vehicleApiKey, async (req, res, next) => {
  try {
    const result = await federationService.getSessionStatus(req.params.challenge);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/** Driver can also poll recognition status (for web demo) */
federationRouter.get(
  "/session/:challenge/driver",
  authenticate,
  authorize("DRIVER"),
  async (req, res, next) => {
    try {
      const result = await federationService.getSessionStatus(req.params.challenge);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);
