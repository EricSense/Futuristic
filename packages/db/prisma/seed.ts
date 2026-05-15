import { PrismaClient, UserRole, VehicleStatus } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const demoDriver = await prisma.user.upsert({
    where: { email: "driver@futuristic.dev" },
    update: {},
    create: {
      email: "driver@futuristic.dev",
      name: "Alex Rivera",
      passwordHash: hashSync("password123", 10),
      role: UserRole.DRIVER,
      driverProfile: {
        create: {
          seatConfig: {
            position: 7,
            lumbar: 4,
            height: 5,
            tilt: 3,
            heatingLevel: 2,
          },
          mirrorConfig: {
            leftAngleH: -15,
            leftAngleV: -5,
            rightAngleH: 15,
            rightAngleV: -3,
            rearviewDim: false,
          },
          climateConfig: {
            temperature: 72,
            fanSpeed: 3,
            dualZone: true,
            driverZoneTemp: 72,
            passengerZoneTemp: 70,
          },
          infotainmentConfig: {
            volume: 14,
            bassLevel: 6,
            trebleLevel: 5,
            preferredSource: "bluetooth",
            favoriteStations: ["KEXP", "NPR"],
          },
          drivingMode: {
            preferred: "comfort",
            steeringFeel: "normal",
            suspensionMode: "comfort",
            regenerativeBraking: "moderate",
          },
          accessibility: {
            largeFonts: false,
            highContrast: false,
            voiceControl: true,
            parkingAssist: true,
          },
        },
      },
    },
  });

  const demoOwner = await prisma.user.upsert({
    where: { email: "owner@futuristic.dev" },
    update: {},
    create: {
      email: "owner@futuristic.dev",
      name: "Jordan Chen",
      passwordHash: hashSync("password123", 10),
      role: UserRole.OWNER,
    },
  });

  await prisma.digitalDrivingIdentity.upsert({
    where: { userId: demoDriver.id },
    update: {},
    create: {
      ddiCode: "DDI-7K9F-4M2X-LP3R-WQ8N",
      userId: demoDriver.id,
      holderName: "Alex Rivera",
      homeCity: "San Francisco, USA",
      mobilityNeeds: { voiceControl: true, parkingAssist: true },
      languages: ["en", "es"],
      aiPersona: { tone: "warm" },
      licenses: [
        { type: "Driver License", issuer: "California DMV", verified: true },
        { type: "International Driving Permit", issuer: "AAA", verified: true },
      ],
      insurance: [
        { carrier: "Lemonade Universal", coverage: "global", verified: true },
      ],
      trustedNetworks: ["Waymo", "BART Bay Area", "Lime", "TSA PreCheck"],
      trustScore: 982,
      payment: { primary: "Mobility Wallet **** 4242" },
    },
  });

  const vehicle1 = await prisma.vehicle.upsert({
    where: { vin: "5YJ3E1EA1PF000001" },
    update: { externalId: "WAYMO-7K" },
    create: {
      ownerId: demoOwner.id,
      make: "Tesla",
      model: "Model 3",
      year: 2025,
      vin: "5YJ3E1EA1PF000001",
      externalId: "WAYMO-7K",
      status: VehicleStatus.ACTIVE,
      capabilities: {
        create: [
          {
            category: "seat",
            supportedRange: {
              position: { min: 0, max: 10 },
              lumbar: { min: 0, max: 5 },
              height: { min: 0, max: 8 },
              tilt: { min: 0, max: 5 },
              heatingLevel: { min: 0, max: 3 },
            },
          },
          {
            category: "mirror",
            supportedRange: {
              leftAngleH: { min: -30, max: 30 },
              leftAngleV: { min: -15, max: 15 },
              rightAngleH: { min: -30, max: 30 },
              rightAngleV: { min: -15, max: 15 },
              rearviewDim: { options: [true, false] },
            },
          },
          {
            category: "climate",
            supportedRange: {
              temperature: { min: 60, max: 85 },
              fanSpeed: { min: 1, max: 7 },
              dualZone: { options: [true, false] },
            },
          },
          {
            category: "infotainment",
            supportedRange: {
              volume: { min: 0, max: 20 },
              bassLevel: { min: 0, max: 10 },
              trebleLevel: { min: 0, max: 10 },
              preferredSource: {
                options: ["bluetooth", "radio", "usb", "streaming"],
              },
            },
          },
          {
            category: "drivingMode",
            supportedRange: {
              preferred: { options: ["comfort", "sport", "eco", "custom"] },
              steeringFeel: { options: ["light", "normal", "heavy"] },
              regenerativeBraking: { options: ["low", "moderate", "high"] },
            },
          },
        ],
      },
    },
  });

  const vehicle2 = await prisma.vehicle.upsert({
    where: { vin: "WBA53BJ06RWC00002" },
    update: {},
    create: {
      ownerId: demoOwner.id,
      make: "BMW",
      model: "i4",
      year: 2025,
      vin: "WBA53BJ06RWC00002",
      status: VehicleStatus.ACTIVE,
      capabilities: {
        create: [
          {
            category: "seat",
            supportedRange: {
              position: { min: 0, max: 10 },
              lumbar: { min: 0, max: 5 },
              height: { min: 0, max: 10 },
              tilt: { min: 0, max: 6 },
              heatingLevel: { min: 0, max: 3 },
              coolingLevel: { min: 0, max: 3 },
            },
          },
          {
            category: "mirror",
            supportedRange: {
              leftAngleH: { min: -25, max: 25 },
              leftAngleV: { min: -12, max: 12 },
              rightAngleH: { min: -25, max: 25 },
              rightAngleV: { min: -12, max: 12 },
              rearviewDim: { options: [true, false] },
            },
          },
          {
            category: "climate",
            supportedRange: {
              temperature: { min: 62, max: 82 },
              fanSpeed: { min: 1, max: 5 },
              dualZone: { options: [true, false] },
            },
          },
        ],
      },
    },
  });

  const demoFleetOp = await prisma.user.upsert({
    where: { email: "fleet@futuristic.dev" },
    update: {},
    create: {
      email: "fleet@futuristic.dev",
      name: "Sam Torres",
      passwordHash: hashSync("password123", 10),
      role: UserRole.FLEET_OPERATOR,
      fleetOperator: {
        create: {
          fleets: {
            create: {
              name: "Downtown EV Fleet",
              vehicles: {
                create: [
                  { vehicleId: vehicle1.id },
                  { vehicleId: vehicle2.id },
                ],
              },
            },
          },
        },
      },
    },
  });

  console.log("Seeded users:", {
    driver: demoDriver.email,
    owner: demoOwner.email,
    fleetOperator: demoFleetOp.email,
  });

  console.log("Seeded vehicles:", {
    vehicle1: { id: vehicle1.id, label: `${vehicle1.make} ${vehicle1.model}`, externalId: "WAYMO-7K" },
    vehicle2: { id: vehicle2.id, label: `${vehicle2.make} ${vehicle2.model}` },
  });

  console.log("Demo DDI:", { code: "DDI-7K9F-4M2X-LP3R-WQ8N", driver: demoDriver.email });
  console.log("Set NEXT_PUBLIC_DEMO_VEHICLE_ID=" + vehicle1.id);
  console.log("Database seeded successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
