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

const KEY_TO_CAPABILITY: Record<string, string> = {
  mode: "modes",
  source: "sources",
};

const BOOL_TO_ASSIST: Record<string, string> = {
  laneKeep: "lane-keep",
  adaptiveCruise: "adaptive-cruise",
  blindSpot: "blind-spot",
};

function resolveCapabilityRange(key: string, rangeObj: Record<string, unknown>): unknown {
  if (rangeObj[key] !== undefined) return rangeObj[key];
  const mapped = KEY_TO_CAPABILITY[key];
  if (mapped && rangeObj[mapped] !== undefined) return rangeObj[mapped];
  if (BOOL_TO_ASSIST[key] && rangeObj.assists !== undefined) return rangeObj.assists;
  return rangeObj;
}

function valueInRange(value: unknown, range: unknown, key: string): boolean {
  if (range === undefined || range === null) return false;

  if (typeof value === "boolean") {
    if (Array.isArray(range) && BOOL_TO_ASSIST[key]) {
      return !value || range.includes(BOOL_TO_ASSIST[key]);
    }
    return true;
  }

  if (typeof value === "number" && typeof range === "object" && range !== null && !Array.isArray(range)) {
    const r = range as { min?: number; max?: number };
    if (typeof r.min === "number" && typeof r.max === "number") {
      return value >= r.min && value <= r.max;
    }
  }

  if (typeof value === "string" && Array.isArray(range)) {
    return range.includes(value);
  }

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
        if (key === "presets" || key === "regen" || key === "zones") continue;
        items.push({ category, key, requestedValue, applied: false, reason: "Category not supported by vehicle" });
      }
      continue;
    }

    const rangeObj = range as Record<string, unknown>;
    for (const [key, requestedValue] of Object.entries(config)) {
      if (key === "presets" || key === "regen" || key === "zones") continue;
      const keyRange = resolveCapabilityRange(key, rangeObj);
      if (valueInRange(requestedValue, keyRange, key)) {
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
        ? `DDI recognized — ${applied} identity signals expressed, ${unsupported} deferred`
        : "Recognition surface could not honor your DDI signals",
  };
}

export async function startSyncSession(driverUserId: string, vehicleId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
  if (!profile) throw new AppError(404, "Digital Driving Identity not found");

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: { capabilities: true },
  });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  if (vehicle.status !== "ACTIVE") throw new AppError(400, "Vehicle is not available for sync");
  if (vehicle.capabilities.length === 0) {
    throw new AppError(400, "Vehicle has no capabilities defined — owner must configure first");
  }

  const plan = generateSyncPlan(
    profile as unknown as Record<string, unknown>,
    vehicle.capabilities.map((c) => ({ category: c.category, supportedRange: c.supportedRange })),
  );

  const session = await prisma.syncSession.create({
    data: {
      driverProfileId: profile.id,
      vehicleId,
      status: "SYNCING",
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
  if (!profile) throw new AppError(404, "Digital Driving Identity not found");

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

export async function getLatestSyncProof() {
  const session = await prisma.syncSession.findFirst({
    where: { status: "COMPLETED" },
    orderBy: { startedAt: "desc" },
    include: {
      appliedPreferences: { where: { applied: true }, take: 3 },
    },
  });
  if (!session) return null;
  return session.appliedPreferences.map((p) => ({
    category: p.category,
    key: p.key,
    value: p.value,
  }));
}
