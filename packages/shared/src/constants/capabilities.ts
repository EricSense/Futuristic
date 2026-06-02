export const DEFAULT_VEHICLE_CAPABILITIES = [
  {
    category: "seat",
    supportedRange: {
      position: { min: 0, max: 100 },
      lumbar: { min: 0, max: 10 },
      height: { min: 0, max: 100 },
      tilt: { min: -30, max: 30 },
    },
  },
  {
    category: "mirrors",
    supportedRange: {
      left: { min: -45, max: 45 },
      right: { min: -45, max: 45 },
      rearview: { min: -20, max: 20 },
    },
  },
  {
    category: "climate",
    supportedRange: {
      temp: { min: 60, max: 85 },
      fan: { min: 0, max: 7 },
      zones: ["driver", "passenger"],
    },
  },
  {
    category: "infotainment",
    supportedRange: {
      volume: { min: 0, max: 100 },
      sources: ["bluetooth", "carplay", "radio"],
    },
  },
  {
    category: "drivingMode",
    supportedRange: { modes: ["eco", "comfort", "sport", "custom"] },
  },
  {
    category: "accessibility",
    supportedRange: {
      assists: ["lane-keep", "adaptive-cruise", "blind-spot"],
      display: ["standard", "high-contrast"],
    },
  },
] as const;

export const IDENTITY_LAYERS = [
  {
    id: "LAYER_01",
    name: "ERGONOMIC CORE",
    mapsTo: ["seat", "mirrors"],
    detail:
      "Physiological baseline — seat position, lumbar, mirrors. The irreducible body signature every vehicle must honor first.",
  },
  {
    id: "LAYER_02",
    name: "BEHAVIORAL MESH",
    mapsTo: ["climate", "infotainment", "drivingMode"],
    detail:
      "Patterns of preference across climate, audio, and driving intent — your behavioral model compressed into portable config.",
  },
  {
    id: "LAYER_03",
    name: "CONTEXTUAL FIELD",
    mapsTo: ["accessibility"],
    detail:
      "Assists, alerts, and display modes — how the environment adapts to your presence before you ask.",
  },
] as const;
