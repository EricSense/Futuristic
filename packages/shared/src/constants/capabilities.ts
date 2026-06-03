/** Default surface policies for EV / autonomous recognition surfaces */
export const DEFAULT_VEHICLE_CAPABILITIES = [
  {
    category: "credentials",
    supportedRange: {
      acceptedLicenseClasses: ["C", "B", "A"],
      requireInsurance: true,
      requireEvCertification: false,
    },
  },
  {
    category: "authorization",
    supportedRange: {
      fleetIds: ["seed-fleet-metro"],
      accessTiers: ["personal", "fleet", "ridehail"],
      roamingEnabled: true,
    },
  },
  {
    category: "autonomy",
    supportedRange: {
      maxLevel: "L3",
      odd: ["highway", "urban", "parking"],
      handoffPolicies: ["immediate", "planned"],
    },
  },
  {
    category: "compliance",
    supportedRange: {
      minSafetyScore: 75,
      requiredTraining: ["ev-basics"],
      allowedRestrictions: ["night-driving", "highway-only"],
    },
  },
  {
    category: "operational",
    supportedRange: {
      mobilityAids: ["none", "wheelchair", "hand-controls"],
      sensoryModes: ["standard", "high-contrast", "audio-first"],
    },
  },
  {
    category: "energy",
    supportedRange: {
      connectors: ["NACS", "CCS"],
      maxDcKw: 250,
      v2gCapable: false,
    },
  },
] as const;

/** Rivian — L2 highway assist, fleet pool */
export const RIVIAN_CAPABILITIES = DEFAULT_VEHICLE_CAPABILITIES.map((cap) =>
  cap.category === "autonomy"
    ? {
        ...cap,
        supportedRange: {
          maxLevel: "L2",
          odd: ["highway"],
          handoffPolicies: ["immediate"],
        },
      }
    : cap,
);

/** BMW i4 — L4-capable personal EV, not in fleet pool */
export const BMW_I4_CAPABILITIES = DEFAULT_VEHICLE_CAPABILITIES.map((cap) => {
  if (cap.category === "autonomy") {
    return {
      ...cap,
      supportedRange: {
        maxLevel: "L4",
        odd: ["highway", "urban", "parking", "geo-fenced"],
        handoffPolicies: ["immediate", "planned", "never"],
      },
    };
  }
  if (cap.category === "authorization") {
    return {
      ...cap,
      supportedRange: {
        fleetIds: [],
        accessTiers: ["personal", "ridehail"],
        roamingEnabled: true,
      },
    };
  }
  return cap;
});

export const IDENTITY_LAYERS = [
  {
    id: "LAYER_01",
    name: "TRUST ROOT",
    mapsTo: ["credentials", "authorization"],
    detail:
      "Verifiable credentials and access scopes — license, insurance, fleet membership. The portable trust anchor every surface must validate before operation.",
  },
  {
    id: "LAYER_02",
    name: "OPERATING POSTURE",
    mapsTo: ["autonomy", "compliance"],
    detail:
      "Autonomy contract and compliance posture — how you authorize handoff, supervised driving, and safety thresholds as vehicles become self-driving.",
  },
  {
    id: "LAYER_03",
    name: "INFRASTRUCTURE FIELD",
    mapsTo: ["operational", "energy"],
    detail:
      "Operational needs and EV energy profile — mobility accommodations, charging protocol, and session limits that follow you across any vehicle.",
  },
] as const;

const AUTONOMY_RANK: Record<string, number> = {
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
  L4: 4,
};

export function autonomyLevelAtMost(requested: string, maxSupported: string): boolean {
  const r = AUTONOMY_RANK[requested] ?? -1;
  const m = AUTONOMY_RANK[maxSupported] ?? 99;
  return r >= 0 && r <= m;
}
