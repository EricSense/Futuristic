import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

config({ path: resolve(fileURLToPath(new URL(".", import.meta.url)), "../../../.env") });

import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { vehicleRouter } from "./routes/vehicles.js";
import { fleetRouter } from "./routes/fleet.js";
import { syncRouter } from "./routes/sync.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();
const port = Number(process.env.API_PORT ?? 4000);

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

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "futuristic-api" });
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/vehicles", vehicleRouter);
app.use("/fleet", fleetRouter);
app.use("/sync", syncRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Futuristic API listening on http://localhost:${port}`);
});
