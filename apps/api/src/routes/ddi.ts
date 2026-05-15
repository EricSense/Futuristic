import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { issueDDISchema, updateDDISchema } from "@futuristic/shared";
import * as ddiService from "../services/ddi.service.js";

export const ddiRouter = Router();

ddiRouter.use(authenticate);
ddiRouter.use(authorize("DRIVER"));

ddiRouter.get("/me", async (req, res, next) => {
  try {
    const ddi = await ddiService.getDDIByUserId(req.user!.id);
    res.json({ success: true, data: ddi });
  } catch (err) {
    next(err);
  }
});

ddiRouter.post("/issue", validate(issueDDISchema), async (req, res, next) => {
  try {
    const ddi = await ddiService.issueDDI(req.user!.id, req.body);
    res.status(201).json({ success: true, data: ddi });
  } catch (err) {
    next(err);
  }
});

ddiRouter.patch("/me", validate(updateDDISchema), async (req, res, next) => {
  try {
    const ddi = await ddiService.updateDDI(req.user!.id, req.body);
    res.json({ success: true, data: ddi });
  } catch (err) {
    next(err);
  }
});

ddiRouter.delete("/me", async (req, res, next) => {
  try {
    await ddiService.revokeDDI(req.user!.id);
    res.json({ success: true, message: "DDI revoked" });
  } catch (err) {
    next(err);
  }
});
