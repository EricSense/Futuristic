import { prisma } from "@futuristic/db";
import type { FleetInput } from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";

async function getOperatorId(userId: string) {
  const op = await prisma.fleetOperator.findUnique({ where: { userId } });
  if (!op) throw new AppError(403, "Not a fleet operator");
  return op.id;
}

export async function listFleets(userId: string) {
  const operatorId = await getOperatorId(userId);
  return prisma.fleet.findMany({
    where: { operatorId },
    include: {
      vehicles: {
        include: { vehicle: { include: { capabilities: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createFleet(userId: string, data: FleetInput) {
  const operatorId = await getOperatorId(userId);
  return prisma.fleet.create({
    data: { name: data.name, operatorId },
  });
}

export async function addVehicleToFleet(
  userId: string,
  fleetId: string,
  vehicleId: string,
) {
  const operatorId = await getOperatorId(userId);
  const fleet = await prisma.fleet.findUnique({ where: { id: fleetId } });
  if (!fleet || fleet.operatorId !== operatorId) {
    throw new AppError(404, "Fleet not found");
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");

  const existing = await prisma.fleetVehicle.findUnique({
    where: { fleetId_vehicleId: { fleetId, vehicleId } },
  });
  if (existing) throw new AppError(409, "Vehicle already in this fleet");

  return prisma.fleetVehicle.create({
    data: { fleetId, vehicleId },
    include: { vehicle: true },
  });
}

export async function removeVehicleFromFleet(
  userId: string,
  fleetId: string,
  vehicleId: string,
) {
  const operatorId = await getOperatorId(userId);
  const fleet = await prisma.fleet.findUnique({ where: { id: fleetId } });
  if (!fleet || fleet.operatorId !== operatorId) {
    throw new AppError(404, "Fleet not found");
  }

  const fv = await prisma.fleetVehicle.findUnique({
    where: { fleetId_vehicleId: { fleetId, vehicleId } },
  });
  if (!fv) throw new AppError(404, "Vehicle not in this fleet");

  await prisma.fleetVehicle.delete({ where: { id: fv.id } });
}

export async function getFleetAnalytics(userId: string, fleetId: string) {
  const operatorId = await getOperatorId(userId);
  const fleet = await prisma.fleet.findUnique({
    where: { id: fleetId },
    include: { vehicles: true },
  });
  if (!fleet || fleet.operatorId !== operatorId) {
    throw new AppError(404, "Fleet not found");
  }

  const vehicleIds = fleet.vehicles.map((fv) => fv.vehicleId);

  const sessions = await prisma.syncSession.findMany({
    where: { vehicleId: { in: vehicleIds } },
    orderBy: { startedAt: "desc" },
    take: 50,
    include: {
      driver: { include: { user: { select: { name: true, email: true } } } },
      vehicle: { select: { make: true, model: true, year: true } },
    },
  });

  const totalSessions = await prisma.syncSession.count({
    where: { vehicleId: { in: vehicleIds } },
  });

  const uniqueDrivers = await prisma.syncSession.groupBy({
    by: ["driverId"],
    where: { vehicleId: { in: vehicleIds } },
  });

  return {
    fleetName: fleet.name,
    totalVehicles: vehicleIds.length,
    totalSessions,
    uniqueDrivers: uniqueDrivers.length,
    recentSessions: sessions,
  };
}

export async function deleteFleet(userId: string, fleetId: string) {
  const operatorId = await getOperatorId(userId);
  const fleet = await prisma.fleet.findUnique({ where: { id: fleetId } });
  if (!fleet || fleet.operatorId !== operatorId) {
    throw new AppError(404, "Fleet not found");
  }
  await prisma.fleet.delete({ where: { id: fleetId } });
}
