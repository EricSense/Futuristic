import { prisma, Prisma } from "@futuristic/db";
import { autonomyLevelAtMost, DDI_DOMAIN_TO_PROFILE, type BindManifest } from "@futuristic/shared";
import { AppError } from "../middleware/error-handler.js";

type ProfileRecord = Record<string, unknown>;
type PolicyRange = Record<string, unknown>;

function claim(
  category: string,
  key: string,
  requestedValue: unknown,
  granted: boolean,
  reason?: string,
) {
  return { category, key, requestedValue, applied: granted, reason };
}

function asString(value: unknown): string {
  return value === null || value === undefined ? "" : String(value);
}

function asBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
}

function asNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function evaluateCredentials(profile: ProfileRecord, range: PolicyRange | undefined) {
  const creds = profile.credentials as ProfileRecord | undefined;
  if (!creds || Object.keys(creds).length === 0) return [];

  const items = [];
  const accepted = (range?.acceptedLicenseClasses as string[]) ?? [];
  const licenseClass = asString(creds.licenseClass);

  if (licenseClass) {
    items.push(
      claim(
        "credentials",
        "licenseClass",
        licenseClass,
        accepted.includes(licenseClass),
        accepted.includes(licenseClass)
          ? undefined
          : `Surface accepts ${accepted.join(", ") || "none"} — holder has Class ${licenseClass}`,
      ),
    );
  }

  if (range?.requireInsurance && creds.insuranceVerified !== undefined) {
    const verified = asBool(creds.insuranceVerified);
    items.push(
      claim(
        "credentials",
        "insuranceVerified",
        verified,
        verified,
        verified ? undefined : "Insurance verification required for this surface",
      ),
    );
  }

  if (range?.requireEvCertification && creds.evCertified !== undefined) {
    const certified = asBool(creds.evCertified);
    items.push(
      claim(
        "credentials",
        "evCertified",
        certified,
        certified,
        certified ? undefined : "EV operator certification required",
      ),
    );
  }

  if (creds.licenseVerified !== undefined) {
    const verified = asBool(creds.licenseVerified);
    items.push(
      claim(
        "credentials",
        "licenseVerified",
        verified,
        verified,
        verified ? undefined : "License must be verified before bind",
      ),
    );
  }

  return items;
}

function evaluateAuthorization(
  profile: ProfileRecord,
  range: PolicyRange | undefined,
  vehicleFleetId: string | null,
) {
  const auth = profile.authorization as ProfileRecord | undefined;
  if (!auth || Object.keys(auth).length === 0) return [];

  const items = [];
  const fleetIds = (range?.fleetIds as string[]) ?? [];
  const accessTiers = (range?.accessTiers as string[]) ?? [];
  const memberships = asStringList(auth.fleetMemberships);
  const accessTier = asString(auth.accessTier);

  if (vehicleFleetId) {
    const member = memberships.includes(vehicleFleetId);
    items.push(
      claim(
        "authorization",
        "fleetMembership",
        vehicleFleetId,
        member,
        member ? undefined : "Driver not authorized for this fleet surface",
      ),
    );
  } else if (fleetIds.length > 0 && memberships.length > 0) {
    const overlap = memberships.some((id) => fleetIds.includes(id));
    items.push(
      claim(
        "authorization",
        "fleetMembership",
        memberships.join(", "),
        overlap || accessTier === "personal",
        overlap ? undefined : "No fleet overlap — personal access only",
      ),
    );
  }

  if (accessTier) {
    items.push(
      claim(
        "authorization",
        "accessTier",
        accessTier,
        accessTiers.length === 0 || accessTiers.includes(accessTier),
        accessTiers.includes(accessTier) ? undefined : `Surface allows ${accessTiers.join(", ")} access`,
      ),
    );
  }

  if (auth.roamingEnabled !== undefined) {
    const roaming = asBool(auth.roamingEnabled);
    const surfaceRoaming = range?.roamingEnabled !== false;
    items.push(
      claim(
        "authorization",
        "roamingEnabled",
        roaming,
        !roaming || surfaceRoaming,
        surfaceRoaming ? undefined : "Cross-fleet roaming not enabled on this surface",
      ),
    );
  }

  return items;
}

function evaluateAutonomy(profile: ProfileRecord, range: PolicyRange | undefined) {
  const posture = profile.autonomyPosture as ProfileRecord | undefined;
  if (!posture || Object.keys(posture).length === 0) return [];

  const items = [];
  const maxLevel = asString(range?.maxLevel ?? "L0");
  const odd = (range?.odd as string[]) ?? [];
  const handoffPolicies = (range?.handoffPolicies as string[]) ?? [];

  const requestedLevel = asString(posture.maxAutonomyLevel);
  if (requestedLevel) {
    const ok = autonomyLevelAtMost(requestedLevel, maxLevel);
    items.push(
      claim(
        "autonomy",
        "maxAutonomyLevel",
        requestedLevel,
        ok,
        ok ? undefined : `Surface supports up to ${maxLevel} — DDI requests ${requestedLevel}`,
      ),
    );
  }

  const handoff = asString(posture.handoffPolicy);
  if (handoff) {
    items.push(
      claim(
        "autonomy",
        "handoffPolicy",
        handoff,
        handoffPolicies.length === 0 || handoffPolicies.includes(handoff),
        handoffPolicies.includes(handoff) ? undefined : `Surface supports ${handoffPolicies.join(", ")} handoff`,
      ),
    );
  }

  const geofence = asString(posture.geofenceMode);
  if (geofence && odd.length > 0) {
    const geoOk = geofence === "standard" || odd.includes("geo-fenced") || odd.includes(geofence);
    items.push(
      claim(
        "autonomy",
        "geofenceMode",
        geofence,
        geoOk,
        geoOk ? undefined : `Geofence mode not supported in surface ODD`,
      ),
    );
  }

  if (posture.supervisedRequired !== undefined) {
    items.push(
      claim(
        "autonomy",
        "supervisedRequired",
        asBool(posture.supervisedRequired),
        true,
        undefined,
      ),
    );
  }

  return items;
}

function evaluateCompliance(profile: ProfileRecord, range: PolicyRange | undefined) {
  const comp = profile.compliance as ProfileRecord | undefined;
  if (!comp || Object.keys(comp).length === 0) return [];

  const items = [];
  const minScore = asNumber(range?.minSafetyScore ?? 0);
  const requiredTraining = (range?.requiredTraining as string[]) ?? [];
  const allowedRestrictions = (range?.allowedRestrictions as string[]) ?? [];

  const score = asNumber(comp.safetyScore);
  if (!Number.isNaN(score)) {
    items.push(
      claim(
        "compliance",
        "safetyScore",
        score,
        score >= minScore,
        score >= minScore ? undefined : `Minimum safety score ${minScore} required`,
      ),
    );
  }

  if (comp.trainingCurrent !== undefined) {
    const current = asBool(comp.trainingCurrent);
    items.push(
      claim(
        "compliance",
        "trainingCurrent",
        current,
        !requiredTraining.length || current,
        current ? undefined : `Required training: ${requiredTraining.join(", ")}`,
      ),
    );
  }

  const restrictions = asStringList(comp.restrictions);
  if (restrictions.length > 0 && allowedRestrictions.length > 0) {
    const allAllowed = restrictions.every((r) => allowedRestrictions.includes(r));
    items.push(
      claim(
        "compliance",
        "restrictions",
        restrictions.join(", "),
        allAllowed,
        allAllowed ? undefined : "One or more restrictions not supported on this surface",
      ),
    );
  }

  return items;
}

function evaluateOperational(profile: ProfileRecord, range: PolicyRange | undefined) {
  const ops = profile.operationalNeeds as ProfileRecord | undefined;
  if (!ops || Object.keys(ops).length === 0) return [];

  const items = [];
  const mobilityAids = (range?.mobilityAids as string[]) ?? [];
  const sensoryModes = (range?.sensoryModes as string[]) ?? [];

  const aid = asString(ops.mobilityAid);
  if (aid) {
    items.push(
      claim(
        "operational",
        "mobilityAid",
        aid,
        mobilityAids.length === 0 || mobilityAids.includes(aid),
        mobilityAids.includes(aid) ? undefined : `Surface supports ${mobilityAids.join(", ")}`,
      ),
    );
  }

  const sensory = asString(ops.sensoryMode);
  if (sensory) {
    items.push(
      claim(
        "operational",
        "sensoryMode",
        sensory,
        sensoryModes.length === 0 || sensoryModes.includes(sensory),
        sensoryModes.includes(sensory) ? undefined : `Surface supports ${sensoryModes.join(", ")}`,
      ),
    );
  }

  if (ops.emergencyContact) {
    items.push(claim("operational", "emergencyContact", ops.emergencyContact, true));
  }

  return items;
}

function evaluateEnergy(profile: ProfileRecord, range: PolicyRange | undefined) {
  const energy = profile.energyProfile as ProfileRecord | undefined;
  if (!energy || Object.keys(energy).length === 0) return [];

  const items = [];
  const connectors = (range?.connectors as string[]) ?? [];
  const maxDc = asNumber(range?.maxDcKw ?? NaN);

  const connector = asString(energy.preferredConnector);
  if (connector) {
    items.push(
      claim(
        "energy",
        "preferredConnector",
        connector,
        connectors.length === 0 || connectors.includes(connector),
        connectors.includes(connector) ? undefined : `Surface provides ${connectors.join(", ")}`,
      ),
    );
  }

  const soc = asNumber(energy.targetSocPercent);
  if (!Number.isNaN(soc)) {
    items.push(claim("energy", "targetSocPercent", soc, soc >= 20 && soc <= 100));
  }

  if (energy.publicChargingAllowed !== undefined) {
    items.push(
      claim("energy", "publicChargingAllowed", asBool(energy.publicChargingAllowed), true),
    );
  }

  if (!Number.isNaN(maxDc) && !Number.isNaN(soc)) {
    items.push(claim("energy", "maxDcKw", maxDc, true));
  }

  return items;
}

const EVALUATORS: Record<
  string,
  (profile: ProfileRecord, range: PolicyRange | undefined, vehicleFleetId: string | null) => ReturnType<typeof claim>[]
> = {
  credentials: (p, r) => evaluateCredentials(p, r),
  authorization: (p, r, fleetId) => evaluateAuthorization(p, r, fleetId),
  autonomy: (p, r) => evaluateAutonomy(p, r),
  compliance: (p, r) => evaluateCompliance(p, r),
  operational: (p, r) => evaluateOperational(p, r),
  energy: (p, r) => evaluateEnergy(p, r),
};

export function generateBindManifest(
  profile: ProfileRecord,
  capabilities: { category: string; supportedRange: unknown }[],
  vehicleFleetId: string | null,
): BindManifest {
  const capMap = new Map(capabilities.map((c) => [c.category, c.supportedRange as PolicyRange]));
  const items = [];

  for (const category of Object.keys(DDI_DOMAIN_TO_PROFILE)) {
    const field = DDI_DOMAIN_TO_PROFILE[category]!;
    const section = profile[field] as ProfileRecord | undefined;
    if (!section || Object.keys(section).length === 0) continue;

    const range = capMap.get(category);
    if (!range) {
      for (const [key, requestedValue] of Object.entries(section)) {
        items.push(
          claim(category, key, requestedValue, false, "Policy domain not supported by surface"),
        );
      }
      continue;
    }

    const evaluator = EVALUATORS[category];
    if (evaluator) {
      items.push(...evaluator(profile, range, vehicleFleetId));
    }
  }

  const granted = items.filter((i) => i.applied).length;
  const denied = items.filter((i) => !i.applied).length;
  const bindStatus = denied === 0 ? "authorized" : granted === 0 ? "denied" : "partial";

  let message: string;
  if (bindStatus === "authorized") {
    message = `DDI bind authorized — portable identity accepted on this surface (${granted} claims granted)`;
  } else if (bindStatus === "partial") {
    message = `DDI bind partial — ${granted} claims granted, ${denied} denied. Driver may operate with restrictions.`;
  } else {
    message = "DDI bind denied — surface cannot honor this portable identity";
  }

  return {
    items,
    summary: { granted, denied, skipped: 0 },
    message,
    bindStatus,
  };
}

/** @deprecated use generateBindManifest */
export function generateSyncPlan(
  profile: ProfileRecord,
  capabilities: { category: string; supportedRange: unknown }[],
) {
  const manifest = generateBindManifest(profile, capabilities, null);
  return {
    items: manifest.items,
    summary: {
      applied: manifest.summary.granted,
      unsupported: manifest.summary.denied,
      skipped: manifest.summary.skipped,
    },
    message: manifest.message,
  };
}

export async function startSyncSession(driverUserId: string, vehicleId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
  if (!profile) throw new AppError(404, "Digital Driving Identity not found");

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: { capabilities: true, fleet: true },
  });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  if (vehicle.status !== "ACTIVE") throw new AppError(400, "Surface is not available for DDI bind");
  if (vehicle.capabilities.length === 0) {
    throw new AppError(400, "Surface has no policy domains — owner must configure first");
  }

  const manifest = generateBindManifest(
    profile as unknown as ProfileRecord,
    vehicle.capabilities.map((c) => ({ category: c.category, supportedRange: c.supportedRange })),
    vehicle.fleetId,
  );

  const plan = {
    items: manifest.items,
    summary: {
      applied: manifest.summary.granted,
      unsupported: manifest.summary.denied,
      skipped: manifest.summary.skipped,
    },
    message: manifest.message,
    bindStatus: manifest.bindStatus,
  };

  const session = await prisma.syncSession.create({
    data: {
      driverProfileId: profile.id,
      vehicleId,
      status: "SYNCING",
      syncPlan: plan as unknown as Prisma.InputJsonValue,
      appliedPreferences: {
        create: manifest.items.map((item) => ({
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

  return { session, plan, manifest };
}

export async function completeSyncSession(sessionId: string, driverUserId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
  if (!profile) throw new AppError(404, "Digital Driving Identity not found");

  const session = await prisma.syncSession.findFirst({
    where: { id: sessionId, driverProfileId: profile.id },
  });
  if (!session) throw new AppError(404, "Bind session not found");

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
    label: `${p.category}.${p.key}`,
  }));
}
