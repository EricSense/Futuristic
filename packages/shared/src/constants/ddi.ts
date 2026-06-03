import { IDENTITY_LAYERS } from "./capabilities.js";

/** Maps bind/API domain keys to driver profile JSON fields */
export const DDI_DOMAIN_TO_PROFILE: Record<string, string> = {
  credentials: "credentials",
  authorization: "authorization",
  autonomy: "autonomyPosture",
  compliance: "compliance",
  operational: "operationalNeeds",
  energy: "energyProfile",
};

export type DdiProfileField =
  | "credentials"
  | "authorization"
  | "autonomyPosture"
  | "compliance"
  | "operationalNeeds"
  | "energyProfile";

export interface DdiDomainEditor {
  profileField: DdiProfileField;
  domain: string;
  label: string;
  fields: { name: string; label: string; default?: string; type?: "text" | "select" | "boolean" }[];
}

export interface DdiLayerEditor {
  id: string;
  name: string;
  detail: string;
  domains: DdiDomainEditor[];
}

const LAYER_DOMAINS: Record<string, DdiDomainEditor[]> = {
  LAYER_01: [
    {
      profileField: "credentials",
      domain: "credentials",
      label: "Driving credentials",
      fields: [
        { name: "licenseClass", label: "License class", default: "C", type: "select" },
        { name: "licenseVerified", label: "License verified", default: "true", type: "boolean" },
        { name: "insuranceVerified", label: "Insurance verified", default: "true", type: "boolean" },
        { name: "evCertified", label: "EV operator certified", default: "true", type: "boolean" },
      ],
    },
    {
      profileField: "authorization",
      domain: "authorization",
      label: "Access authorization",
      fields: [
        { name: "fleetMemberships", label: "Fleet IDs (comma-separated)", default: "seed-fleet-metro" },
        { name: "accessTier", label: "Access tier", default: "fleet", type: "select" },
        { name: "roamingEnabled", label: "Cross-fleet roaming", default: "true", type: "boolean" },
      ],
    },
  ],
  LAYER_02: [
    {
      profileField: "autonomyPosture",
      domain: "autonomy",
      label: "Autonomy contract",
      fields: [
        { name: "maxAutonomyLevel", label: "Max autonomy level", default: "L3", type: "select" },
        { name: "handoffPolicy", label: "Handoff policy", default: "planned", type: "select" },
        { name: "supervisedRequired", label: "Supervised mode required", default: "false", type: "boolean" },
        { name: "geofenceMode", label: "Geofence mode", default: "standard", type: "select" },
      ],
    },
    {
      profileField: "compliance",
      domain: "compliance",
      label: "Safety & compliance",
      fields: [
        { name: "safetyScore", label: "Safety score", default: "92" },
        { name: "trainingCurrent", label: "Training current", default: "true", type: "boolean" },
        { name: "restrictions", label: "Restrictions (comma-separated)", default: "" },
      ],
    },
  ],
  LAYER_03: [
    {
      profileField: "operationalNeeds",
      domain: "operational",
      label: "Operational needs",
      fields: [
        { name: "mobilityAid", label: "Mobility aid", default: "none", type: "select" },
        { name: "sensoryMode", label: "Sensory mode", default: "standard", type: "select" },
        { name: "emergencyContact", label: "Emergency contact", default: "+1-555-0100" },
      ],
    },
    {
      profileField: "energyProfile",
      domain: "energy",
      label: "EV energy profile",
      fields: [
        { name: "preferredConnector", label: "Preferred connector", default: "NACS", type: "select" },
        { name: "targetSocPercent", label: "Target state of charge %", default: "80" },
        { name: "publicChargingAllowed", label: "Public charging allowed", default: "true", type: "boolean" },
      ],
    },
  ],
};

export const DDI_LAYER_EDITOR: DdiLayerEditor[] = IDENTITY_LAYERS.map((layer) => ({
  id: layer.id,
  name: layer.name,
  detail: layer.detail,
  domains: LAYER_DOMAINS[layer.id] ?? [],
}));

export const DDI_ONBOARDING_STEPS = DDI_LAYER_EDITOR.map((layer) => ({
  id: layer.id,
  name: layer.name,
  detail: layer.detail,
  updates: layer.domains.map((d) => ({
    profileField: d.profileField,
    fields: d.fields.slice(0, 2),
  })),
}));

/** Human-readable labels for bind claim display */
export const BIND_CLAIM_LABELS: Record<string, Record<string, string>> = {
  credentials: {
    licenseClass: "License class",
    licenseVerified: "License verification",
    insuranceVerified: "Insurance verification",
    evCertified: "EV certification",
  },
  authorization: {
    fleetMembership: "Fleet authorization",
    accessTier: "Access tier",
    roamingEnabled: "Cross-fleet roaming",
  },
  autonomy: {
    maxAutonomyLevel: "Autonomy level",
    handoffPolicy: "Handoff policy",
    supervisedRequired: "Supervised mode",
    geofenceMode: "Geofence mode",
  },
  compliance: {
    safetyScore: "Safety score",
    trainingCurrent: "Training status",
    restrictions: "Driving restrictions",
  },
  operational: {
    mobilityAid: "Mobility accommodation",
    sensoryMode: "Sensory mode",
    emergencyContact: "Emergency contact",
  },
  energy: {
    preferredConnector: "Charging connector",
    targetSocPercent: "Target SOC",
    publicChargingAllowed: "Public charging",
  },
};

export function formatBindClaim(category: string, key: string): string {
  return BIND_CLAIM_LABELS[category]?.[key] ?? `${category}.${key}`;
}
