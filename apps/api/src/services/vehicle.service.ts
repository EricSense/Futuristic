import { prisma, Prisma } from "@futuristic/db";
import { DEFAULT_VEHICLE_CAPABILITIES } from "@futuristic/shared";
import type { VehicleCreateInput, CapabilityInput, FleetCreateInput } from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";

export async function listOwnerVehicles(ownerId: string) {
  return prisma.vehicle.findMany({
    where: { ownerId },
    include: { capabilities: true, fleet: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createVehicle(ownerId: string, input: VehicleCreateInput) {
  const vehicle = await prisma.vehicle.create({
    data: { ...input, ownerId },
  });
  await seedDefaultCapabilities(vehicle.id, ownerId);
  return prisma.vehicle.findUniqueOrThrow({
    where: { id: vehicle.id },
    include: { capabilities: true, fleet: true },
  });
}

export async function seedDefaultCapabilities(vehicleId: string, ownerId: string) {
  const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId, ownerId } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");

  const existing = await prisma.vehicleCapability.count({ where: { vehicleId } });
  if (existing > 0) return listOwnerVehicles(ownerId);

  await prisma.vehicleCapability.createMany({
    data: DEFAULT_VEHICLE_CAPABILITIES.map((cap) => ({
      vehicleId,
      category: cap.category,
      supportedRange: cap.supportedRange as Prisma.InputJsonValue,
    })),
  });

  return prisma.vehicle.findUniqueOrThrow({
    where: { id: vehicleId },
    include: { capabilities: true, fleet: true },
  });
}

export async function addCapability(vehicleId: string, ownerId: string, input: CapabilityInput) {
  const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId, ownerId } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  return prisma.vehicleCapability.create({
    data: {
      vehicleId,
      category: input.category,
      supportedRange: input.supportedRange as Prisma.InputJsonValue,
    },
  });
}

export async function listAvailableVehicles() {
  return prisma.vehicle.findMany({
    where: { status: "ACTIVE" },
    include: { capabilities: true, owner: { select: { name: true } } },
    orderBy: { make: "asc" },
  });
}

export async function listAssignableVehicles() {
  return prisma.vehicle.findMany({
    where: { status: "ACTIVE", fleetId: null },
    include: { owner: { select: { name: true } }, capabilities: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createFleet(operatorUserId: string, input: FleetCreateInput) {
  const operator = await prisma.fleetOperator.findUnique({ where: { userId: operatorUserId } });
  if (!operator) throw new AppError(404, "Fleet operator profile not found");
  return prisma.fleet.create({ data: { operatorId: operator.id, name: input.name } });
}

export async function assignVehicleToFleet(
  fleetId: string,
  vehicleId: string,
  operatorUserId: string,
) {
  const operator = await prisma.fleetOperator.findUnique({ where: { userId: operatorUserId } });
  if (!operator) throw new AppError(404, "Fleet operator profile not found");

  const fleet = await prisma.fleet.findFirst({
    where: { id: fleetId, operatorId: operator.id },
  });
  if (!fleet) throw new AppError(404, "Fleet not found");

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  if (vehicle.fleetId) throw new AppError(409, "Vehicle already assigned to a fleet");

  return prisma.vehicle.update({
    where: { id: vehicleId },
    data: { fleetId },
    include: { capabilities: true, owner: { select: { name: true } } },
  });
}

export async function listFleets(operatorUserId: string) {
  const operator = await prisma.fleetOperator.findUnique({ where: { userId: operatorUserId } });
  if (!operator) throw new AppError(404, "Fleet operator profile not found");
  return prisma.fleet.findMany({
    where: { operatorId: operator.id },
    include: {
      vehicles: { include: { capabilities: true } },
      _count: { select: { vehicles: true } },
    },
  });
}

export async function getFleetAnalytics(operatorUserId: string) {
  const operator = await prisma.fleetOperator.findUnique({ where: { userId: operatorUserId } });
  if (!operator) throw new AppError(404, "Fleet operator profile not found");

  const fleets = await prisma.fleet.findMany({
    where: { operatorId: operator.id },
    include: { vehicles: true },
  });

  const vehicleIds = fleets.flatMap((f) => f.vehicles.map((v) => v.id));
  const sessions = await prisma.syncSession.findMany({
    where: { vehicleId: { in: vehicleIds } },
    include: {
      vehicle: { select: { make: true, model: true, vin: true } },
      driverProfile: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { startedAt: "desc" },
    take: 50,
  });

  return {
    fleetCount: fleets.length,
    vehicleCount: vehicleIds.length,
    totalSessions: sessions.length,
    recentSessions: sessions,
  };
}

export async function getPlatformStatus() {
  const [drivers, vehicles, sessions, completedSessions, appliedPrefs] = await Promise.all([
    prisma.user.count({ where: { role: "DRIVER" } }),
    prisma.vehicle.count({ where: { status: "ACTIVE" } }),
    prisma.syncSession.count(),
    prisma.syncSession.count({ where: { status: "COMPLETED" } }),
    prisma.appliedPreference.count({ where: { applied: true } }),
  ]);

  return {
    drivers,
    vehicles,
    sessions,
    completedSessions,
    appliedPreferences: appliedPrefs,
    vehicleDomain: "PROVEN",
  };
}
