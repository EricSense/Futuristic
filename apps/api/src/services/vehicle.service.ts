import { prisma, Prisma } from "@futuristic/db";
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
  return prisma.vehicle.create({
    data: { ...input, ownerId },
    include: { capabilities: true },
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

export async function createFleet(operatorUserId: string, input: FleetCreateInput) {
  const operator = await prisma.fleetOperator.findUnique({ where: { userId: operatorUserId } });
  if (!operator) throw new AppError(404, "Fleet operator profile not found");
  return prisma.fleet.create({ data: { operatorId: operator.id, name: input.name } });
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
