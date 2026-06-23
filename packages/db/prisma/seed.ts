import bcrypt from "bcryptjs";
import {
  BMW_I4_CAPABILITIES,
  DEFAULT_VEHICLE_CAPABILITIES,
  RIVIAN_CAPABILITIES,
} from "@futuristic/shared";
import { PrismaClient, UserRole, VehicleStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCapabilities(
  vehicleId: string,
  caps: readonly { category: string; supportedRange: unknown }[],
  replace = false,
) {
  if (replace) {
    await prisma.vehicleCapability.deleteMany({ where: { vehicleId } });
  }
  for (const cap of caps) {
    const existing = await prisma.vehicleCapability.findFirst({
      where: { vehicleId, category: cap.category },
    });
    if (existing) {
      await prisma.vehicleCapability.update({
        where: { id: existing.id },
        data: { supportedRange: cap.supportedRange as object },
      });
    } else {
      await prisma.vehicleCapability.create({
        data: { vehicleId, category: cap.category, supportedRange: cap.supportedRange as object },
      });
    }
  }
}

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
    },
  });

  await prisma.driverProfile.upsert({
    where: { userId: driver.id },
    update: {
      credentials: {
        licenseClass: "C",
        licenseVerified: true,
        insuranceVerified: true,
        evCertified: true,
      },
      authorization: {
        fleetMemberships: ["seed-fleet-metro"],
        accessTier: "fleet",
        roamingEnabled: true,
      },
      autonomyPosture: {
        maxAutonomyLevel: "L3",
        handoffPolicy: "planned",
        supervisedRequired: false,
        geofenceMode: "standard",
      },
      compliance: {
        safetyScore: 92,
        trainingCurrent: true,
        restrictions: [],
      },
      operationalNeeds: {
        mobilityAid: "none",
        sensoryMode: "standard",
        emergencyContact: "+1-555-0100",
      },
      energyProfile: {
        preferredConnector: "NACS",
        targetSocPercent: 80,
        publicChargingAllowed: true,
      },
    },
    create: {
      userId: driver.id,
      credentials: {
        licenseClass: "C",
        licenseVerified: true,
        insuranceVerified: true,
        evCertified: true,
      },
      authorization: {
        fleetMemberships: ["seed-fleet-metro"],
        accessTier: "fleet",
        roamingEnabled: true,
      },
      autonomyPosture: {
        maxAutonomyLevel: "L3",
        handoffPolicy: "planned",
        supervisedRequired: false,
        geofenceMode: "standard",
      },
      compliance: {
        safetyScore: 92,
        trainingCurrent: true,
        restrictions: [],
      },
      operationalNeeds: {
        mobilityAid: "none",
        sensoryMode: "standard",
        emergencyContact: "+1-555-0100",
      },
      energyProfile: {
        preferredConnector: "NACS",
        targetSocPercent: 80,
        publicChargingAllowed: true,
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
    {
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      vin: "5YJ3E1EA1PF000001",
      fleetId: fleet.id,
      caps: DEFAULT_VEHICLE_CAPABILITIES,
    },
    {
      make: "Rivian",
      model: "R1T",
      year: 2023,
      vin: "7FC1K2E58NG000002",
      fleetId: fleet.id,
      caps: RIVIAN_CAPABILITIES,
    },
    {
      make: "BMW",
      model: "i4",
      year: 2024,
      vin: "WBA1AB2C34DE00003",
      fleetId: undefined,
      caps: BMW_I4_CAPABILITIES,
    },
  ];

  for (const v of vehicles) {
    const vehicle = await prisma.vehicle.upsert({
      where: { vin: v.vin },
      update: { fleetId: v.fleetId ?? null },
      create: {
        make: v.make,
        model: v.model,
        year: v.year,
        vin: v.vin,
        ownerId: owner.id,
        fleetId: v.fleetId,
        status: VehicleStatus.ACTIVE,
      },
    });
    await seedCapabilities(vehicle.id, v.caps, true);
  }

  const profile = await prisma.driverProfile.findUniqueOrThrow({
    where: { userId: driver.id },
  });
  const vehicle = await prisma.vehicle.findFirstOrThrow({ where: { vin: "5YJ3E1EA1PF000001" } });

  const existingSession = await prisma.syncSession.findFirst({
    where: { driverProfileId: profile.id, vehicleId: vehicle.id },
  });

  if (!existingSession) {
    await prisma.syncSession.create({
      data: {
        driverProfileId: profile.id,
        vehicleId: vehicle.id,
        status: "COMPLETED",
        syncPlan: {
          bindStatus: "authorized",
          message: "Futuristic ID bind authorized — portable identity accepted on Metro EV Pool surface",
          summary: { granted: 12, denied: 0, skipped: 0 },
        },
        endedAt: new Date(),
        appliedPreferences: {
          create: [
            {
              category: "credentials",
              key: "licenseClass",
              value: "C",
              applied: true,
            },
            {
              category: "authorization",
              key: "fleetMembership",
              value: "seed-fleet-metro",
              applied: true,
            },
            {
              category: "autonomy",
              key: "maxAutonomyLevel",
              value: "L3",
              applied: true,
            },
          ],
        },
      },
    });
  }

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
