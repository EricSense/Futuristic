import { Request, Response, NextFunction } from "express";
import { AppError } from "./error-handler.js";

const VEHICLE_API_KEY = process.env.VEHICLE_API_KEY || "futuristic-vehicle-demo-key";

/** Vehicle OEM / fleet backend uses X-Vehicle-Api-Key for federation endpoints */
export function vehicleApiKey(req: Request, _res: Response, next: NextFunction) {
  const key = req.headers["x-vehicle-api-key"];
  if (key !== VEHICLE_API_KEY) {
    return next(new AppError(401, "Invalid vehicle API key"));
  }
  next();
}
