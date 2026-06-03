import { IDENTITY_LAYERS } from "./capabilities.js";

/** Maps sync/API domain keys to driver profile JSON fields */
export const DDI_DOMAIN_TO_PROFILE: Record<string, string> = {
  seat: "seatConfig",
  mirrors: "mirrorConfig",
  climate: "climateConfig",
  infotainment: "infotainmentConfig",
  drivingMode: "drivingMode",
  accessibility: "accessibility",
};

export type DdiProfileField =
  | "seatConfig"
  | "mirrorConfig"
  | "climateConfig"
  | "infotainmentConfig"
  | "drivingMode"
  | "accessibility";

export interface DdiDomainEditor {
  profileField: DdiProfileField;
  domain: string;
  label: string;
  fields: { name: string; label: string; default?: string }[];
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
      profileField: "seatConfig",
      domain: "seat",
      label: "Body signature",
      fields: [
        { name: "position", label: "Position", default: "72" },
        { name: "lumbar", label: "Lumbar", default: "6" },
        { name: "height", label: "Height", default: "58" },
        { name: "tilt", label: "Tilt", default: "12" },
      ],
    },
    {
      profileField: "mirrorConfig",
      domain: "mirrors",
      label: "Spatial alignment",
      fields: [
        { name: "left", label: "Left", default: "-8" },
        { name: "right", label: "Right", default: "14" },
        { name: "rearview", label: "Rearview", default: "0" },
      ],
    },
  ],
  LAYER_02: [
    {
      profileField: "climateConfig",
      domain: "climate",
      label: "Climate rhythm",
      fields: [
        { name: "temp", label: "Temperature (°F)", default: "71" },
        { name: "fan", label: "Airflow", default: "3" },
      ],
    },
    {
      profileField: "infotainmentConfig",
      domain: "infotainment",
      label: "Ambient audio",
      fields: [
        { name: "volume", label: "Volume", default: "35" },
        { name: "source", label: "Source", default: "bluetooth" },
      ],
    },
    {
      profileField: "drivingMode",
      domain: "drivingMode",
      label: "Movement intent",
      fields: [{ name: "mode", label: "Default mode", default: "comfort" }],
    },
  ],
  LAYER_03: [
    {
      profileField: "accessibility",
      domain: "accessibility",
      label: "Contextual assists",
      fields: [
        { name: "laneKeep", label: "Lane keep", default: "true" },
        { name: "adaptiveCruise", label: "Adaptive cruise", default: "true" },
        { name: "display", label: "Display mode", default: "standard" },
      ],
    },
  ],
};

/** Single source of truth for DDI layer UI (dashboard + onboarding) */
export const DDI_LAYER_EDITOR: DdiLayerEditor[] = IDENTITY_LAYERS.map((layer) => ({
  id: layer.id,
  name: layer.name,
  detail: layer.detail,
  domains: LAYER_DOMAINS[layer.id] ?? [],
}));

/** Onboarding: one step per identity layer (core signals only) */
export const DDI_ONBOARDING_STEPS = DDI_LAYER_EDITOR.map((layer) => ({
  id: layer.id,
  name: layer.name,
  detail: layer.detail,
  updates: layer.domains.map((d) => ({
    profileField: d.profileField,
    fields: d.fields.slice(0, 2),
  })),
}));
