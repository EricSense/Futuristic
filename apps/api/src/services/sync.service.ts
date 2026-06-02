import { prisma, Prisma } from "@futuristic/db";
import type { SyncPlan, SyncPlanItem } from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";

const CATEGORY_TO_PROFILE_FIELD: Record<string, string> = {
  seat: "seatConfig",
  mirrors: "mirrorConfig",
  climate: "climateConfig",
  infotainment: "infotainmentConfig",
  drivingMode: "drivingMode",
  accessibility: "accessibility",
};

function flattenPreferences(category: string, config: Record<string, unknown>): SyncPlanItem[] {
  return Object.entries(config).map(([key, requestedValue]) => ({
    category,
    key,
    requestedValue,
    applied: false,
  }));
}

function valueInRange(value: unknown, range: unknown): boolean {
  if (range === undefined || range === null) return false;
  if (typeof value === "number" && typeof range === "object" && range !== null) {
    const r = range as { min?: number; max?: number };
    if (typeof r.min === "number" && typeof r.max === "number") {
      return value >= r.min && value <= r.max;
    }
  }
  if (typeof value === "string" && Array.isArray(range)) {
    return range.includes(value);
  }
  if (typeof value === "boolean") return true;
  if (typeof value === "object" && value !== null) return true;
  return false;
}

export function generateSyncPlan(
  profile: Record<string, unknown>,
  capabilities: { category: string; supportedRange: unknown }[],
): SyncPlan {
  const capMap = new Map(capabilities.map((c) => [c.category, c.supportedRange]));
  const items: SyncPlanItem[] = [];

  for (const [category, field] of Object.entries(CATEGORY_TO_PROFILE_FIELD)) {
    const config = profile[field] as Record<string, unknown> | undefined;
    if (!config || Object.keys(config).length === 0) continue;

    const range = capMap.get(category);
    if (!range) {
      for (const [key, requestedValue] of Object.entries(config)) {
        items.push({ category, key, requestedValue, applied: false, reason: "Category not supported by vehicle" });
      }
      continue;
    }

    const rangeObj = range as Record<string, unknown>;
    for (const [key, requestedValue] of Object.entries(config)) {
      const keyRange = rangeObj[key] ?? rangeObj;
      if (valueInRange(requestedValue, keyRange)) {
        items.push({ category, key, requestedValue, applied: true });
      } else {
        items.push({
          category,
          key,
          requestedValue,
          applied: false,
          reason: "Value outside vehicle capability range",
        });
      }
    }
  }

  const applied = items.filter((i) => i.applied).length;
  const unsupported = items.filter((i) => !i.applied).length;

  return {
    items,
    summary: { applied, unsupported, skipped: 0 },
    message:
      applied > 0
        ? `Identity synced — ${applied} preferences applied, ${unsupported} gracefully deferred`
        : "No preferences could be applied to this vehicle",
  };
}

export async function startSyncSession(driverUserId: string, vehicleId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
  if (!profile) throw new AppError(404, "Driver profile not found");

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: { capabilities: true },
  });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  if (vehicle.status !== "ACTIVE") throw new AppError(400, "Vehicle is not available for sync");

  const plan = generateSyncPlan(
    profile as unknown as Record<string, unknown>,
    vehicle.capabilities.map((c) => ({ category: c.category, supportedRange: c.supportedRange })),
  );

  const session = await prisma.syncSession.create({
    data: {
      driverProfileId: profile.id,
      vehicleId,
      status: "ACTIVE",
      syncPlan: plan as unknown as Prisma.InputJsonValue,
      appliedPreferences: {
        create: plan.items.map((item) => ({
          category: item.category,
          key: item.key,
          value: item.requestedValue as object,
          applied: item.applied,
          reason: item.reason,
        })),
      },
    },
    include: {
      vehicle: { select: { make: true, model: true, year: true, vin: true } },
      appliedPreferences: true,
    },
  });

  return { session, plan };
}

export async function completeSyncSession(sessionId: string, driverUserId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
  if (!profile) throw new AppError(404, "Driver profile not found");

  const session = await prisma.syncSession.findFirst({
    where: { id: sessionId, driverProfileId: profile.id },
  });
  if (!session) throw new AppError(404, "Sync session not found");

  return prisma.syncSession.update({
    where: { id: sessionId },
    data: { status: "COMPLETED", endedAt: new Date() },
    include: { vehicle: true, appliedPreferences: true },
  });
}

export async function listDriverSessions(driverUserId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
  if (!profile) return [];

  return prisma.syncSession.findMany({
    where: { driverProfileId: profile.id },
    include: { vehicle: { select: { make: true, model: true, year: true } } },
    orderBy: { startedAt: "desc" },
    take: 20,
  });
}
