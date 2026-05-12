import { prisma, VehicleStatus } from "@futuristic/db";
import type { VehicleInput, VehicleCapabilityInput } from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";

export async function listVehicles(ownerId: string) {
  return prisma.vehicle.findMany({
    where: { ownerId },
    include: { capabilities: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVehicle(id: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { capabilities: true, owner: { select: { id: true, name: true, email: true } } },
  });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  return vehicle;
}

export async function createVehicle(ownerId: string, data: VehicleInput) {
  const existing = await prisma.vehicle.findUnique({ where: { vin: data.vin } });
  if (existing) throw new AppError(409, "A vehicle with this VIN already exists");

  return prisma.vehicle.create({
    data: { ...data, ownerId },
    include: { capabilities: true },
  });
}

export async function updateVehicleStatus(
  vehicleId: string,
  ownerId: string,
  status: string,
) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  if (vehicle.ownerId !== ownerId) throw new AppError(403, "Not your vehicle");

  return prisma.vehicle.update({
    where: { id: vehicleId },
    data: { status: status as VehicleStatus },
  });
}

export async function addCapability(
  vehicleId: string,
  ownerId: string,
  data: VehicleCapabilityInput,
) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  if (vehicle.ownerId !== ownerId) throw new AppError(403, "Not your vehicle");

  return prisma.vehicleCapability.create({
    data: { vehicleId, category: data.category, supportedRange: data.supportedRange },
  });
}

export async function deleteVehicle(vehicleId: string, ownerId: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  if (vehicle.ownerId !== ownerId) throw new AppError(403, "Not your vehicle");

  await prisma.vehicle.delete({ where: { id: vehicleId } });
}
