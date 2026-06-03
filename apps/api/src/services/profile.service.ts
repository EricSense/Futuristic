import { prisma, Prisma } from "@futuristic/db";
import type { ProfileUpdateInput, ProfileCompleteness } from "@futuristic/shared";
import { DDI_DOMAINS, DDI_DOMAIN_TO_PROFILE } from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";

function isFilled(value: unknown): boolean {
  return value !== null && value !== undefined && typeof value === "object" && Object.keys(value as object).length > 0;
}

export function computeCompleteness(profile: Record<string, unknown>): ProfileCompleteness {
  const filled: string[] = [];
  const missing: string[] = [];

  for (const domain of DDI_DOMAINS) {
    const field = DDI_DOMAIN_TO_PROFILE[domain]!;
    if (isFilled(profile[field])) filled.push(domain);
    else missing.push(domain);
  }

  return {
    percent: Math.round((filled.length / DDI_DOMAINS.length) * 100),
    filled,
    missing,
  };
}

export async function getDriverProfile(userId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, "Driver profile not found");
  const completeness = computeCompleteness(profile as unknown as Record<string, unknown>);
  return { ...profile, completeness };
}

export async function updateDriverProfile(userId: string, input: ProfileUpdateInput) {
  const profile = await prisma.driverProfile.update({
    where: { userId },
    data: input as Prisma.DriverProfileUpdateInput,
  });
  const completeness = computeCompleteness(profile as unknown as Record<string, unknown>);
  return { ...profile, completeness };
}

export async function ensureDriverProfile(userId: string) {
  return prisma.driverProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}
