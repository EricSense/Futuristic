import { Router } from "express";
import { loginSchema, registerSchema } from "@futuristic/shared";
import { getUserById, loginUser, refreshAccessToken, registerUser } from "../services/auth.service.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter: Router = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const result = await registerUser(input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token required" });
      return;
    }
    const result = await refreshAccessToken(refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await getUserById(req.user!.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});
