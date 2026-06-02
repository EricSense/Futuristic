import bcrypt from "bcryptjs";
import { DEFAULT_VEHICLE_CAPABILITIES } from "@futuristic/shared";
import { PrismaClient, UserRole, VehicleStatus } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCapabilities = DEFAULT_VEHICLE_CAPABILITIES.map((cap) => ({
  category: cap.category,
  supportedRange: cap.supportedRange,
}));

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const driver = await prisma.user.upsert({
    where: { email: "alex@driver.futuristic" },
    update: {},
    create: {
      email: "alex@driver.futuristic",
      passwordHash,
      name: "Alex Rivera",
      role: UserRole.DRIVER,
      driverProfile: {
        create: {
          seatConfig: { position: 72, lumbar: 6, height: 58, tilt: 12 },
          mirrorConfig: { left: -8, right: 14, rearview: 2 },
          climateConfig: { temp: 71, fan: 3, zones: { driver: 71, passenger: 68 } },
          infotainmentConfig: { volume: 35, source: "bluetooth", presets: ["Morning Drive", "Focus"] },
          drivingMode: { mode: "comfort", regen: "medium" },
          accessibility: { laneKeep: true, adaptiveCruise: true, blindSpot: true, display: "standard" },
        },
      },
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "morgan@owner.futuristic" },
    update: {},
    create: {
      email: "morgan@owner.futuristic",
      passwordHash,
      name: "Morgan Chen",
      role: UserRole.OWNER,
    },
  });

  const fleetOp = await prisma.user.upsert({
    where: { email: "sam@fleet.futuristic" },
    update: {},
    create: {
      email: "sam@fleet.futuristic",
      passwordHash,
      name: "Sam Okonkwo",
      role: UserRole.FLEET_OPERATOR,
      fleetOperator: { create: { company: "Metro Mobility" } },
    },
  });

  const fleetOperator = await prisma.fleetOperator.findUniqueOrThrow({
    where: { userId: fleetOp.id },
  });

  const fleet = await prisma.fleet.upsert({
    where: { id: "seed-fleet-metro" },
    update: {},
    create: {
      id: "seed-fleet-metro",
      operatorId: fleetOperator.id,
      name: "Metro EV Pool",
    },
  });

  const vehicles = [
    { make: "Tesla", model: "Model 3", year: 2024, vin: "5YJ3E1EA1PF000001" },
    { make: "Rivian", model: "R1T", year: 2023, vin: "7FC1K2E58NG000002" },
    { make: "BMW", model: "i4", year: 2024, vin: "WBA1AB2C34DE00003" },
  ];

  for (const [index, v] of vehicles.entries()) {
    const vehicle = await prisma.vehicle.upsert({
      where: { vin: v.vin },
      update: {},
      create: {
        ...v,
        ownerId: owner.id,
        fleetId: index < 2 ? fleet.id : undefined,
        status: VehicleStatus.ACTIVE,
      },
    });

    for (const cap of defaultCapabilities) {
      const existing = await prisma.vehicleCapability.findFirst({
        where: { vehicleId: vehicle.id, category: cap.category },
      });
      if (!existing) {
        await prisma.vehicleCapability.create({
          data: { vehicleId: vehicle.id, ...cap },
        });
      }
    }
  }

  const profile = await prisma.driverProfile.findUniqueOrThrow({
    where: { userId: driver.id },
  });
  const vehicle = await prisma.vehicle.findFirstOrThrow({ where: { vin: "5YJ3E1EA1PF000001" } });

  await prisma.syncSession.create({
    data: {
      driverProfileId: profile.id,
      vehicleId: vehicle.id,
      status: "COMPLETED",
      syncPlan: {
        applied: 14,
        unsupported: 1,
        skipped: 0,
        message: "Identity synced — vehicle adapted to driver preferences",
      },
      endedAt: new Date(),
      appliedPreferences: {
        create: [
          { category: "seat", key: "position", value: 72, applied: true },
          { category: "climate", key: "temp", value: 71, applied: true },
          { category: "drivingMode", key: "mode", value: "comfort", applied: true },
        ],
      },
    },
  });

  console.log("Seed complete:");
  console.log("  Driver:  alex@driver.futuristic / password123");
  console.log("  Owner:   morgan@owner.futuristic / password123");
  console.log("  Fleet:   sam@fleet.futuristic / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
