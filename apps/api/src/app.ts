import cors from "cors";
import express, { type Express } from "express";
import { rateLimit } from "express-rate-limit";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { vehicleRouter } from "./routes/vehicles.js";
import { fleetRouter } from "./routes/fleet.js";
import { syncRouter } from "./routes/sync.js";
import { statusRouter } from "./routes/status.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app: Express = express();

app.set("trust proxy", 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/", (_req, res) => {
  res.json({
    service: "futuristic-api",
    docs: "/health",
    web: "https://futuristic-cyan.vercel.app",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "futuristic-api" });
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/vehicles", vehicleRouter);
app.use("/fleet", fleetRouter);
app.use("/sync", syncRouter);
app.use("/status", statusRouter);

app.use(errorHandler);
