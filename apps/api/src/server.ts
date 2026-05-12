import "dotenv/config";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./middleware/error-handler.js";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { vehicleRouter } from "./routes/vehicle.js";
import { fleetRouter } from "./routes/fleet.js";
import { syncRouter } from "./routes/sync.js";

const app = express();
const port = process.env.API_PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests, please try again later" },
});
app.use(limiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "futuristic-api", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/fleets", fleetRouter);
app.use("/api/sync", syncRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Futuristic API running on http://localhost:${port}`);
});
