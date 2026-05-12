import { prisma, SyncStatus } from "@futuristic/db";
import type { SyncPlan, SyncPlanItem, CapabilityRange, VehicleCapabilitySet } from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";

function clampValue(value: number, range: CapabilityRange): { applied: number; clamped: boolean } {
  if (range.min !== undefined && range.max !== undefined) {
    const clamped = Math.max(range.min, Math.min(range.max, value));
    return { applied: clamped, clamped: clamped !== value };
  }
  return { applied: value, clamped: false };
}

function matchSetting(
  category: string,
  setting: string,
  requestedValue: unknown,
  capability: VehicleCapabilitySet | undefined,
): SyncPlanItem {
  if (!capability || !(setting in capability)) {
    return {
      category,
      setting,
      requestedValue,
      appliedValue: null,
      status: "unsupported",
      reason: `Vehicle does not support ${category}.${setting}`,
    };
  }

  const range = capability[setting];

  if (range.options !== undefined) {
    const supported = range.options.includes(requestedValue as string | boolean);
    return {
      category,
      setting,
      requestedValue,
      appliedValue: supported ? requestedValue : range.options[0],
      status: supported ? "applied" : "clamped",
      reason: supported ? undefined : `Value not supported, using default`,
    };
  }

  if (typeof requestedValue === "number" && range.min !== undefined) {
    const { applied, clamped } = clampValue(requestedValue, range);
    return {
      category,
      setting,
      requestedValue,
      appliedValue: applied,
      status: clamped ? "clamped" : "applied",
      reason: clamped ? `Clamped to vehicle range [${range.min}-${range.max}]` : undefined,
    };
  }

  return {
    category,
    setting,
    requestedValue,
    appliedValue: requestedValue,
    status: "applied",
  };
}

export async function startSync(driverUserId: string, vehicleId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
  if (!profile) throw new AppError(404, "Driver profile not found");

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: { capabilities: true },
  });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  if (vehicle.status !== "ACTIVE") throw new AppError(400, "Vehicle is not active");

  const capabilityMap: Record<string, VehicleCapabilitySet> = {};
  for (const cap of vehicle.capabilities) {
    capabilityMap[cap.category] = cap.supportedRange as VehicleCapabilitySet;
  }

  const items: SyncPlanItem[] = [];

  const configCategories = [
    { key: "seatConfig", category: "seat" },
    { key: "mirrorConfig", category: "mirror" },
    { key: "climateConfig", category: "climate" },
    { key: "infotainmentConfig", category: "infotainment" },
    { key: "drivingMode", category: "drivingMode" },
    { key: "accessibility", category: "accessibility" },
  ] as const;

  for (const { key, category } of configCategories) {
    const config = profile[key] as Record<string, unknown> | null;
    if (!config || typeof config !== "object") continue;

    const cap = capabilityMap[category];
    for (const [setting, value] of Object.entries(config)) {
      items.push(matchSetting(category, setting, value, cap));
    }
  }

  const summary = {
    applied: items.filter((i) => i.status === "applied").length,
    clamped: items.filter((i) => i.status === "clamped").length,
    unsupported: items.filter((i) => i.status === "unsupported").length,
    total: items.length,
  };

  const syncPlan: SyncPlan = { items, summary };

  const session = await prisma.syncSession.create({
    data: {
      driverId: profile.id,
      vehicleId: vehicle.id,
      status: SyncStatus.ACTIVE,
      syncPlan: syncPlan as any,
    },
    include: {
      vehicle: { select: { make: true, model: true, year: true } },
    },
  });

  return { session, syncPlan };
}

export async function endSync(sessionId: string, driverUserId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
  if (!profile) throw new AppError(404, "Driver profile not found");

  const session = await prisma.syncSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new AppError(404, "Sync session not found");
  if (session.driverId !== profile.id) throw new AppError(403, "Not your session");

  return prisma.syncSession.update({
    where: { id: sessionId },
    data: { status: SyncStatus.COMPLETED, endedAt: new Date() },
  });
}

export async function getSessionHistory(driverUserId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
  if (!profile) throw new AppError(404, "Driver profile not found");

  return prisma.syncSession.findMany({
    where: { driverId: profile.id },
    include: { vehicle: { select: { make: true, model: true, year: true } } },
    orderBy: { startedAt: "desc" },
    take: 20,
  });
}
