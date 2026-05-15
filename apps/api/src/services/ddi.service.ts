import { prisma, DDIStatus } from "@futuristic/db";
import type {
  DigitalDrivingIdentity,
  DriverCabinPreferences,
  IssueDDIInput,
  UpdateDDIInput,
  DDIMobilityNeeds,
  DDIAIPersona,
  VerifiedCredential,
  DDIInsurance,
} from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";
import { generateDDICode } from "../lib/ddi-code.js";

const DEFAULT_NETWORKS = [
  "Waymo",
  "BART Bay Area",
  "ANA Airlines",
  "Tokyo Smart City",
  "Lime",
  "TSA PreCheck",
];

const DEFAULT_LICENSES: VerifiedCredential[] = [
  { type: "Driver License", issuer: "California DMV", verified: true },
  { type: "International Driving Permit", issuer: "AAA", verified: true },
];

const DEFAULT_INSURANCE: DDIInsurance[] = [
  { carrier: "Lemonade Universal", coverage: "global", verified: true },
  { carrier: "Allianz Travel", coverage: "global", verified: true },
];

function mapRecord(
  record: Awaited<ReturnType<typeof prisma.digitalDrivingIdentity.findUnique>> & object,
  preferences?: DriverCabinPreferences,
): DigitalDrivingIdentity {
  return {
    id: record.id,
    ddiCode: record.ddiCode,
    userId: record.userId,
    holderName: record.holderName,
    homeCity: record.homeCity,
    status: record.status as DigitalDrivingIdentity["status"],
    issuedAt: record.issuedAt.toISOString(),
    identity: record.identity as DigitalDrivingIdentity["identity"],
    licenses: record.licenses as VerifiedCredential[],
    insurance: record.insurance as DDIInsurance[],
    mobilityNeeds: record.mobilityNeeds as DDIMobilityNeeds,
    languages: record.languages as string[],
    payment: record.payment as DigitalDrivingIdentity["payment"],
    aiPersona: record.aiPersona as DDIAIPersona,
    trustedNetworks: record.trustedNetworks as string[],
    trustScore: record.trustScore,
    preferences,
  };
}

async function getPreferences(userId: string): Promise<DriverCabinPreferences | undefined> {
  const profile = await prisma.driverProfile.findUnique({ where: { userId } });
  if (!profile) return undefined;
  return {
    seatConfig: profile.seatConfig as Record<string, unknown>,
    mirrorConfig: profile.mirrorConfig as Record<string, unknown>,
    climateConfig: profile.climateConfig as Record<string, unknown>,
    infotainmentConfig: profile.infotainmentConfig as Record<string, unknown>,
    drivingMode: profile.drivingMode as Record<string, unknown>,
    accessibility: profile.accessibility as Record<string, unknown>,
  };
}

export async function getDDIByUserId(userId: string): Promise<DigitalDrivingIdentity | null> {
  const record = await prisma.digitalDrivingIdentity.findUnique({ where: { userId } });
  if (!record || record.status === DDIStatus.REVOKED) return null;
  const preferences = await getPreferences(userId);
  return mapRecord(record, preferences);
}

export async function issueDDI(userId: string, input: IssueDDIInput): Promise<DigitalDrivingIdentity> {
  const existing = await prisma.digitalDrivingIdentity.findUnique({ where: { userId } });
  if (existing && existing.status !== DDIStatus.REVOKED) {
    throw new AppError(409, "DDI already issued for this account");
  }

  const profile = await prisma.driverProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(400, "Driver profile required to issue DDI");

  const record = await prisma.digitalDrivingIdentity.upsert({
    where: { userId },
    create: {
      ddiCode: generateDDICode(),
      userId,
      holderName: input.holderName.trim(),
      homeCity: input.homeCity.trim(),
      mobilityNeeds: input.mobilityNeeds ?? {},
      languages: input.languages ?? ["en"],
      aiPersona: { tone: input.aiPersona ?? "concise" },
      licenses: DEFAULT_LICENSES,
      insurance: DEFAULT_INSURANCE,
      trustedNetworks: DEFAULT_NETWORKS,
      trustScore: 900 + Math.floor(Math.random() * 99),
      payment: { primary: "Mobility Wallet **** 4242" },
    },
    update: {
      holderName: input.holderName.trim(),
      homeCity: input.homeCity.trim(),
      status: DDIStatus.ACTIVE,
      revokedAt: null,
      mobilityNeeds: input.mobilityNeeds ?? {},
      languages: input.languages ?? ["en"],
      aiPersona: { tone: input.aiPersona ?? "concise" },
    },
  });

  const preferences = await getPreferences(userId);
  return mapRecord(record, preferences);
}

export async function updateDDI(userId: string, input: UpdateDDIInput): Promise<DigitalDrivingIdentity> {
  const record = await prisma.digitalDrivingIdentity.findUnique({ where: { userId } });
  if (!record || record.status !== DDIStatus.ACTIVE) {
    throw new AppError(404, "Active DDI not found");
  }

  const updated = await prisma.digitalDrivingIdentity.update({
    where: { userId },
    data: {
      ...(input.holderName !== undefined ? { holderName: input.holderName.trim() } : {}),
      ...(input.homeCity !== undefined ? { homeCity: input.homeCity.trim() } : {}),
      ...(input.mobilityNeeds !== undefined ? { mobilityNeeds: input.mobilityNeeds } : {}),
      ...(input.languages !== undefined ? { languages: input.languages } : {}),
      ...(input.aiPersona !== undefined ? { aiPersona: { tone: input.aiPersona } } : {}),
    },
  });

  const preferences = await getPreferences(userId);
  return mapRecord(updated, preferences);
}

export async function revokeDDI(userId: string): Promise<void> {
  const record = await prisma.digitalDrivingIdentity.findUnique({ where: { userId } });
  if (!record) throw new AppError(404, "DDI not found");

  await prisma.digitalDrivingIdentity.update({
    where: { userId },
    data: { status: DDIStatus.REVOKED, revokedAt: new Date() },
  });
}

export function greetingFor(ddi: DigitalDrivingIdentity): string {
  const first = ddi.holderName.split(" ")[0] || ddi.holderName;
  const ja = ddi.languages.includes("ja");
  const tone = ddi.aiPersona.tone;
  if (tone === "warm") {
    return ja
      ? `${first}さん、おかえりなさい。`
      : `Welcome back, ${first}. Everything is ready for you.`;
  }
  if (tone === "playful") {
    return ja ? `やあ ${first}！準備完了！` : `Hey ${first}. Buckle up — let's roll.`;
  }
  return ja ? `${first}さん、確認しました。` : `Identified: ${first}. Cabin ready.`;
}
