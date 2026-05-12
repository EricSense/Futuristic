"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  User,
  Zap,
  Check,
  AlertTriangle,
  X,
  ArrowRight,
  RotateCcw,
  Armchair,
  Thermometer,
  Music,
  Eye,
  Gauge,
  Accessibility,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---- Simulated data (no backend needed) ----

const demoDriver = {
  name: "Alex Rivera",
  avatar: "AR",
  preferences: {
    seat: { position: 7, lumbar: 4, height: 5, tilt: 3, heatingLevel: 2 },
    mirror: { leftAngleH: -15, leftAngleV: -5, rightAngleH: 15, rightAngleV: -3, rearviewDim: false },
    climate: { temperature: 72, fanSpeed: 3, dualZone: true, driverZoneTemp: 72, passengerZoneTemp: 70 },
    infotainment: { volume: 14, bassLevel: 6, trebleLevel: 5, preferredSource: "bluetooth" },
    drivingMode: { preferred: "comfort", steeringFeel: "normal", regenerativeBraking: "moderate" },
    accessibility: { voiceControl: true, parkingAssist: true, largeFonts: false, highContrast: false },
  },
};

const demoVehicles = [
  {
    id: "tesla",
    make: "Tesla",
    model: "Model 3",
    year: 2025,
    image: "T",
    capabilities: {
      seat: { position: { min: 0, max: 10 }, lumbar: { min: 0, max: 5 }, height: { min: 0, max: 8 }, tilt: { min: 0, max: 5 }, heatingLevel: { min: 0, max: 3 } },
      mirror: { leftAngleH: { min: -30, max: 30 }, leftAngleV: { min: -15, max: 15 }, rightAngleH: { min: -30, max: 30 }, rightAngleV: { min: -15, max: 15 }, rearviewDim: { options: [true, false] } },
      climate: { temperature: { min: 60, max: 85 }, fanSpeed: { min: 1, max: 7 }, dualZone: { options: [true, false] } },
      infotainment: { volume: { min: 0, max: 20 }, bassLevel: { min: 0, max: 10 }, trebleLevel: { min: 0, max: 10 }, preferredSource: { options: ["bluetooth", "radio", "usb", "streaming"] } },
      drivingMode: { preferred: { options: ["comfort", "sport", "eco", "custom"] }, steeringFeel: { options: ["light", "normal", "heavy"] }, regenerativeBraking: { options: ["low", "moderate", "high"] } },
      accessibility: { voiceControl: { options: [true, false] }, parkingAssist: { options: [true, false] } },
    },
  },
  {
    id: "bmw",
    make: "BMW",
    model: "i4",
    year: 2025,
    image: "B",
    capabilities: {
      seat: { position: { min: 0, max: 10 }, lumbar: { min: 0, max: 5 }, height: { min: 0, max: 10 }, tilt: { min: 0, max: 6 }, heatingLevel: { min: 0, max: 3 }, coolingLevel: { min: 0, max: 3 } },
      mirror: { leftAngleH: { min: -25, max: 25 }, leftAngleV: { min: -12, max: 12 }, rightAngleH: { min: -25, max: 25 }, rightAngleV: { min: -12, max: 12 }, rearviewDim: { options: [true, false] } },
      climate: { temperature: { min: 62, max: 82 }, fanSpeed: { min: 1, max: 5 } },
      infotainment: { volume: { min: 0, max: 25 }, bassLevel: { min: 0, max: 10 }, trebleLevel: { min: 0, max: 10 } },
      drivingMode: { preferred: { options: ["comfort", "sport", "eco"] }, steeringFeel: { options: ["light", "normal", "sport"] } },
      accessibility: { voiceControl: { options: [true, false] } },
    },
  },
  {
    id: "rivian",
    make: "Rivian",
    model: "R1S",
    year: 2025,
    image: "R",
    capabilities: {
      seat: { position: { min: 0, max: 12 }, lumbar: { min: 0, max: 6 }, height: { min: 0, max: 10 }, tilt: { min: 0, max: 7 }, heatingLevel: { min: 0, max: 3 }, coolingLevel: { min: 0, max: 3 } },
      mirror: { leftAngleH: { min: -30, max: 30 }, leftAngleV: { min: -15, max: 15 }, rightAngleH: { min: -30, max: 30 }, rightAngleV: { min: -15, max: 15 }, rearviewDim: { options: [true, false] } },
      climate: { temperature: { min: 60, max: 85 }, fanSpeed: { min: 1, max: 10 }, dualZone: { options: [true, false] }, driverZoneTemp: { min: 60, max: 85 }, passengerZoneTemp: { min: 60, max: 85 } },
      infotainment: { volume: { min: 0, max: 30 }, bassLevel: { min: 0, max: 10 }, trebleLevel: { min: 0, max: 10 }, preferredSource: { options: ["bluetooth", "radio", "usb", "streaming", "aux"] } },
      drivingMode: { preferred: { options: ["comfort", "sport", "eco", "offroad", "tow"] }, steeringFeel: { options: ["light", "normal", "heavy"] }, regenerativeBraking: { options: ["low", "moderate", "high"] }, suspensionMode: { options: ["comfort", "sport", "offroad"] } },
      accessibility: { voiceControl: { options: [true, false] }, parkingAssist: { options: [true, false] }, largeFonts: { options: [true, false] }, highContrast: { options: [true, false] } },
    },
  },
];

type SyncStatus = "applied" | "clamped" | "unsupported";

interface SyncItem {
  category: string;
  setting: string;
  requested: unknown;
  applied: unknown;
  status: SyncStatus;
  reason?: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  seat: <Armchair className="w-4 h-4" />,
  mirror: <Eye className="w-4 h-4" />,
  climate: <Thermometer className="w-4 h-4" />,
  infotainment: <Music className="w-4 h-4" />,
  drivingMode: <Gauge className="w-4 h-4" />,
  accessibility: <Accessibility className="w-4 h-4" />,
};

const categoryLabels: Record<string, string> = {
  seat: "Seat & Ergonomics",
  mirror: "Mirrors",
  climate: "Climate Control",
  infotainment: "Infotainment",
  drivingMode: "Driving Mode",
  accessibility: "Accessibility",
};

function runSync(vehicle: typeof demoVehicles[0]): SyncItem[] {
  const items: SyncItem[] = [];
  const prefs = demoDriver.preferences;
  const caps = vehicle.capabilities;

  for (const [category, settings] of Object.entries(prefs)) {
    const vehicleCaps = (caps as any)[category] as Record<string, any> | undefined;

    for (const [setting, value] of Object.entries(settings as Record<string, unknown>)) {
      if (!vehicleCaps || !(setting in vehicleCaps)) {
        items.push({ category, setting, requested: value, applied: null, status: "unsupported", reason: `${vehicle.make} ${vehicle.model} does not support this setting` });
        continue;
      }

      const range = vehicleCaps[setting];
      if (range.options !== undefined) {
        const supported = range.options.includes(value);
        items.push({
          category, setting, requested: value,
          applied: supported ? value : range.options[0],
          status: supported ? "applied" : "clamped",
          reason: supported ? undefined : `Value not available, using ${range.options[0]}`,
        });
      } else if (typeof value === "number" && range.min !== undefined) {
        const clamped = Math.max(range.min, Math.min(range.max, value));
        items.push({
          category, setting, requested: value,
          applied: clamped,
          status: clamped !== value ? "clamped" : "applied",
          reason: clamped !== value ? `Clamped to vehicle range [${range.min}–${range.max}]` : undefined,
        });
      } else {
        items.push({ category, setting, requested: value, applied: value, status: "applied" });
      }
    }
  }
  return items;
}

function formatValue(v: unknown): string {
  if (typeof v === "boolean") return v ? "On" : "Off";
  if (v === null) return "—";
  return String(v);
}

function formatSetting(s: string): string {
  return s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

type DemoPhase = "select" | "syncing" | "results";

export default function DemoPage() {
  const [phase, setPhase] = useState<DemoPhase>("select");
  const [selectedVehicle, setSelectedVehicle] = useState<typeof demoVehicles[0] | null>(null);
  const [syncItems, setSyncItems] = useState<SyncItem[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const startSync = useCallback((vehicle: typeof demoVehicles[0]) => {
    setSelectedVehicle(vehicle);
    setPhase("syncing");
    const items = runSync(vehicle);
    setSyncItems(items);
    setRevealedCount(0);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= items.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("results"), 600);
      }
    }, 80);
  }, []);

  const reset = () => {
    setPhase("select");
    setSelectedVehicle(null);
    setSyncItems([]);
    setRevealedCount(0);
    setActiveCategory("all");
  };

  const applied = syncItems.filter((i) => i.status === "applied").length;
  const clamped = syncItems.filter((i) => i.status === "clamped").length;
  const unsupported = syncItems.filter((i) => i.status === "unsupported").length;

  const categories = Array.from(new Set(syncItems.map((i) => i.category)));
  const filtered = activeCategory === "all" ? syncItems : syncItems.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <LogoMark size={48} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Interactive Demo
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Experience how a driver&apos;s digital identity syncs to any vehicle.
            No account required -- this runs entirely in your browser.
          </p>
        </div>

        {/* Driver Identity Card (always visible) */}
        <Card className="mb-8 border-sky-500/10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold text-lg">
              {demoDriver.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-white">{demoDriver.name}</span>
                <Badge variant="info">Driver</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                6 preference categories configured &middot; Profile 100% complete
              </p>
            </div>
            <div className="hidden sm:grid grid-cols-6 gap-2">
              {Object.keys(categoryIcons).map((cat) => (
                <div key={cat} className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-200 text-sky-400" title={categoryLabels[cat]}>
                  {categoryIcons[cat]}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Phase: Vehicle Selection */}
        {phase === "select" && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Step 1: Choose a vehicle to sync with
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoVehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => startSync(v)}
                  className="group rounded-xl border border-white/10 bg-surface-50 p-6 text-left transition-all hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-600/5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-200 text-sky-400 font-bold text-xl group-hover:bg-sky-500/10">
                      {v.image}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{v.year} {v.make} {v.model}</div>
                      <div className="text-xs text-gray-500">{Object.keys(v.capabilities).length} capability categories</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {Object.keys(v.capabilities).map((cat) => (
                      <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-200 text-gray-400">
                        {categoryLabels[cat] || cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-sky-400 group-hover:text-sky-300">
                    Sync identity <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phase: Syncing Animation */}
        {phase === "syncing" && selectedVehicle && (
          <div>
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold text-xl">
                {demoDriver.avatar}
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-sky-400 animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-sky-400 font-medium">Syncing...</span>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-200 text-sky-400 font-bold text-xl border-2 border-sky-500/30">
                {selectedVehicle.image}
              </div>
            </div>

            <Card>
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {syncItems.slice(0, revealedCount).map((item, idx) => (
                  <div
                    key={`${item.category}-${item.setting}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm animate-in fade-in slide-in-from-left-2",
                      item.status === "applied" && "bg-green-500/5",
                      item.status === "clamped" && "bg-yellow-500/5",
                      item.status === "unsupported" && "bg-red-500/5",
                    )}
                    style={{ animationDuration: "300ms" }}
                  >
                    <div className="text-gray-500">{categoryIcons[item.category]}</div>
                    <span className="text-gray-400 w-32 truncate">{formatSetting(item.setting)}</span>
                    <span className="text-white font-mono text-xs">{formatValue(item.requested)}</span>
                    <ArrowRight className="w-3 h-3 text-gray-600" />
                    <span className={cn("font-mono text-xs font-medium",
                      item.status === "applied" && "text-green-400",
                      item.status === "clamped" && "text-yellow-400",
                      item.status === "unsupported" && "text-red-400",
                    )}>
                      {formatValue(item.applied)}
                    </span>
                    <div className="ml-auto">
                      {item.status === "applied" && <Check className="w-4 h-4 text-green-400" />}
                      {item.status === "clamped" && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                      {item.status === "unsupported" && <X className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Phase: Results */}
        {phase === "results" && selectedVehicle && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-sky-400" />
                <h2 className="text-xl font-semibold text-white">
                  Sync Complete: {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </h2>
              </div>
              <Button variant="secondary" onClick={reset} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Try Another Vehicle
              </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl bg-green-500/5 border border-green-500/10 p-4 text-center">
                <Check className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">{applied}</div>
                <div className="text-xs text-green-400 font-medium">Applied</div>
              </div>
              <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/10 p-4 text-center">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">{clamped}</div>
                <div className="text-xs text-yellow-400 font-medium">Adapted</div>
              </div>
              <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-4 text-center">
                <X className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">{unsupported}</div>
                <div className="text-xs text-red-400 font-medium">Unsupported</div>
              </div>
            </div>

            {/* Compatibility Score */}
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-white">Vehicle Compatibility</span>
                <span className="text-2xl font-bold text-sky-400">
                  {Math.round(((applied + clamped) / syncItems.length) * 100)}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-surface-200 overflow-hidden flex">
                <div className="bg-green-500 transition-all duration-700" style={{ width: `${(applied / syncItems.length) * 100}%` }} />
                <div className="bg-yellow-500 transition-all duration-700" style={{ width: `${(clamped / syncItems.length) * 100}%` }} />
                <div className="bg-red-500/30 transition-all duration-700" style={{ width: `${(unsupported / syncItems.length) * 100}%` }} />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Applied perfectly</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Adapted to vehicle range</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500/50" /> Not supported</span>
              </div>
            </Card>

            {/* Category Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  activeCategory === "all" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "text-gray-400 hover:text-white bg-surface-100",
                )}
              >
                All ({syncItems.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                    activeCategory === cat ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "text-gray-400 hover:text-white bg-surface-100",
                  )}
                >
                  {categoryIcons[cat]} {categoryLabels[cat]}
                </button>
              ))}
            </div>

            {/* Detailed Results */}
            <Card>
              <div className="space-y-1">
                {filtered.map((item) => (
                  <div
                    key={`${item.category}-${item.setting}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                      item.status === "applied" && "bg-green-500/5",
                      item.status === "clamped" && "bg-yellow-500/5",
                      item.status === "unsupported" && "bg-red-500/5",
                    )}
                  >
                    <div className="text-gray-500">{categoryIcons[item.category]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm">{formatSetting(item.setting)}</div>
                      {item.reason && <div className="text-[11px] text-gray-500 truncate">{item.reason}</div>}
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="text-xs text-gray-500">Requested</div>
                        <div className="text-sm text-white font-mono">{formatValue(item.requested)}</div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Applied</div>
                        <div className={cn("text-sm font-mono font-medium",
                          item.status === "applied" && "text-green-400",
                          item.status === "clamped" && "text-yellow-400",
                          item.status === "unsupported" && "text-red-400",
                        )}>
                          {formatValue(item.applied)}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2">
                      {item.status === "applied" && <Badge variant="success">Applied</Badge>}
                      {item.status === "clamped" && <Badge variant="warning">Adapted</Badge>}
                      {item.status === "unsupported" && <Badge variant="danger">N/A</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">
                This is what Futuristic does. Your identity, any vehicle, instant adaptation.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                    Create Your Identity <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" onClick={reset} className="gap-2">
                  <RotateCcw className="w-4 h-4" /> Try Another
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
