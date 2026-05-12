import { prisma } from "@futuristic/db";
import type { DriverProfileInput } from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";

export async function getProfile(userId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError(404, "Driver profile not found");
  }
  return profile;
}

export async function updateProfile(userId: string, data: DriverProfileInput) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError(404, "Driver profile not found. Register as a driver first.");
  }

  return prisma.driverProfile.update({
    where: { userId },
    data: {
      ...(data.seatConfig && { seatConfig: data.seatConfig }),
      ...(data.mirrorConfig && { mirrorConfig: data.mirrorConfig }),
      ...(data.climateConfig && { climateConfig: data.climateConfig }),
      ...(data.infotainmentConfig && { infotainmentConfig: data.infotainmentConfig }),
      ...(data.drivingMode && { drivingMode: data.drivingMode }),
      ...(data.accessibility && { accessibility: data.accessibility }),
    },
  });
}

export function computeProfileCompleteness(profile: Record<string, unknown>): number {
  const categories = [
    "seatConfig",
    "mirrorConfig",
    "climateConfig",
    "infotainmentConfig",
    "drivingMode",
    "accessibility",
  ];

  let filled = 0;
  for (const cat of categories) {
    const val = profile[cat];
    if (val && typeof val === "object" && Object.keys(val as object).length > 0) {
      filled++;
    }
  }
  return Math.round((filled / categories.length) * 100);
}
