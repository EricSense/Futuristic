"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Armchair,
  Thermometer,
  Music,
  Gauge,
  Accessibility,
  Eye,
  Save,
  Zap,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PreferenceCategory = "seat" | "mirror" | "climate" | "infotainment" | "drivingMode" | "accessibility";

const categoryMeta: Record<PreferenceCategory, { label: string; icon: React.ReactNode; description: string }> = {
  seat: { label: "Seat & Ergonomics", icon: <Armchair className="w-5 h-5" />, description: "Position, lumbar, height, and heating" },
  mirror: { label: "Mirrors", icon: <Eye className="w-5 h-5" />, description: "Left, right, and rearview angles" },
  climate: { label: "Climate Control", icon: <Thermometer className="w-5 h-5" />, description: "Temperature, fan speed, and zones" },
  infotainment: { label: "Infotainment", icon: <Music className="w-5 h-5" />, description: "Volume, equalizer, and sources" },
  drivingMode: { label: "Driving Mode", icon: <Gauge className="w-5 h-5" />, description: "Performance, steering, and regen braking" },
  accessibility: { label: "Accessibility", icon: <Accessibility className="w-5 h-5" />, description: "Assists, display, and voice control" },
};

const categories: PreferenceCategory[] = ["seat", "mirror", "climate", "infotainment", "drivingMode", "accessibility"];

export default function DriverDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<PreferenceCategory>("seat");
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [completeness, setCompleteness] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);

  const loadProfile = useCallback(async () => {
    try {
      const res = await api.get<{ profile: any; completeness: number }>("/api/profile");
      if (res.data) {
        setProfile(res.data.profile);
        setCompleteness(res.data.completeness);
      }
    } catch {
      setProfile({
        seatConfig: {}, mirrorConfig: {}, climateConfig: {},
        infotainmentConfig: {}, drivingMode: {}, accessibility: {},
      });
    }
  }, []);

  const loadSessions = useCallback(async () => {
    try {
      const res = await api.get<any[]>("/api/sync/history");
      if (res.data) setSessions(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) { loadProfile(); loadSessions(); }
  }, [user, authLoading, router, loadProfile, loadSessions]);

  const configKeyMap: Record<PreferenceCategory, string> = {
    seat: "seatConfig",
    mirror: "mirrorConfig",
    climate: "climateConfig",
    infotainment: "infotainmentConfig",
    drivingMode: "drivingMode",
    accessibility: "accessibility",
  };

  const updateField = (category: PreferenceCategory, field: string, value: any) => {
    if (!profile) return;
    const key = configKeyMap[category];
    setProfile({
      ...profile,
      [key]: { ...((profile[key] as Record<string, unknown>) || {}), [field]: value },
    });
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await api.put<{ profile: any; completeness: number }>("/api/profile", {
        seatConfig: profile.seatConfig,
        mirrorConfig: profile.mirrorConfig,
        climateConfig: profile.climateConfig,
        infotainmentConfig: profile.infotainmentConfig,
        drivingMode: profile.drivingMode,
        accessibility: profile.accessibility,
      });
      if (res.data) {
        setProfile(res.data.profile);
        setCompleteness(res.data.completeness);
        setSaveMsg("Profile saved!");
        setTimeout(() => setSaveMsg(""), 3000);
      }
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-gray-400 animate-pulse">Loading your identity...</div>
        </div>
      </div>
    );
  }

  const getVal = (cat: PreferenceCategory, field: string, fallback: any = 0) => {
    const key = configKeyMap[cat];
    return (profile[key] as Record<string, any>)?.[field] ?? fallback;
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Digital Driving Identity</h1>
            <p className="text-gray-400 mt-1">Configure preferences that follow you to any vehicle</p>
          </div>
          <div className="flex items-center gap-4">
            {saveMsg && (
              <span className={cn("text-sm", saveMsg.includes("saved") ? "text-green-400" : "text-red-400")}>
                {saveMsg}
              </span>
            )}
            <Button onClick={saveProfile} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>

        {/* Completeness Bar */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-400" />
              <span className="font-medium text-white">Profile Completeness</span>
            </div>
            <Badge variant={completeness === 100 ? "success" : completeness > 50 ? "warning" : "danger"}>
              {completeness}%
            </Badge>
          </div>
          <div className="h-2 rounded-full bg-surface-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Complete all categories for the best sync experience across vehicles.
          </p>
        </Card>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-1">
              {categories.map((cat) => {
                const meta = categoryMeta[cat];
                const key = configKeyMap[cat];
                const hasData = profile[key] && typeof profile[key] === "object" && Object.keys(profile[key] as object).length > 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                      activeCategory === cat
                        ? "bg-brand-600/10 text-brand-400 border border-brand-500/20"
                        : "text-gray-400 hover:text-white hover:bg-surface-100",
                    )}
                  >
                    {meta.icon}
                    <span className="text-sm font-medium flex-1">{meta.label}</span>
                    {hasData && <div className="w-2 h-2 rounded-full bg-green-400" />}
                  </button>
                );
              })}
            </div>

            {/* Recent Syncs */}
            {sessions.length > 0 && (
              <Card className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-white">Recent Syncs</span>
                </div>
                <div className="space-y-2">
                  {sessions.slice(0, 3).map((s: any) => (
                    <div key={s.id} className="text-xs text-gray-400 flex justify-between">
                      <span>{s.vehicle?.make} {s.vehicle?.model}</span>
                      <Badge variant={s.status === "COMPLETED" ? "success" : "info"} className="text-[10px]">
                        {s.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Main Editor */}
          <div className="col-span-12 lg:col-span-9">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {categoryMeta[activeCategory].icon}
                  <div>
                    <CardTitle>{categoryMeta[activeCategory].label}</CardTitle>
                    <CardDescription>{categoryMeta[activeCategory].description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <div className="space-y-6">
                {activeCategory === "seat" && (
                  <>
                    <Slider label="Seat Position" value={getVal("seat", "position")} min={0} max={10} onChange={(v) => updateField("seat", "position", v)} />
                    <Slider label="Lumbar Support" value={getVal("seat", "lumbar")} min={0} max={5} onChange={(v) => updateField("seat", "lumbar", v)} />
                    <Slider label="Seat Height" value={getVal("seat", "height")} min={0} max={10} onChange={(v) => updateField("seat", "height", v)} />
                    <Slider label="Seat Tilt" value={getVal("seat", "tilt")} min={0} max={6} onChange={(v) => updateField("seat", "tilt", v)} />
                    <Slider label="Seat Heating" value={getVal("seat", "heatingLevel")} min={0} max={3} onChange={(v) => updateField("seat", "heatingLevel", v)} />
                  </>
                )}

                {activeCategory === "mirror" && (
                  <>
                    <Slider label="Left Mirror Horizontal" value={getVal("mirror", "leftAngleH")} min={-30} max={30} onChange={(v) => updateField("mirror", "leftAngleH", v)} unit="°" />
                    <Slider label="Left Mirror Vertical" value={getVal("mirror", "leftAngleV")} min={-15} max={15} onChange={(v) => updateField("mirror", "leftAngleV", v)} unit="°" />
                    <Slider label="Right Mirror Horizontal" value={getVal("mirror", "rightAngleH")} min={-30} max={30} onChange={(v) => updateField("mirror", "rightAngleH", v)} unit="°" />
                    <Slider label="Right Mirror Vertical" value={getVal("mirror", "rightAngleV")} min={-15} max={15} onChange={(v) => updateField("mirror", "rightAngleV", v)} unit="°" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Auto-Dim Rearview</span>
                      <button
                        onClick={() => updateField("mirror", "rearviewDim", !getVal("mirror", "rearviewDim", false))}
                        className={cn(
                          "relative h-6 w-11 rounded-full transition-colors",
                          getVal("mirror", "rearviewDim", false) ? "bg-brand-600" : "bg-surface-300",
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                          getVal("mirror", "rearviewDim", false) && "translate-x-5",
                        )} />
                      </button>
                    </div>
                  </>
                )}

                {activeCategory === "climate" && (
                  <>
                    <Slider label="Temperature" value={getVal("climate", "temperature", 72)} min={55} max={90} onChange={(v) => updateField("climate", "temperature", v)} unit="°F" />
                    <Slider label="Fan Speed" value={getVal("climate", "fanSpeed", 3)} min={1} max={7} onChange={(v) => updateField("climate", "fanSpeed", v)} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Dual Zone</span>
                      <button
                        onClick={() => updateField("climate", "dualZone", !getVal("climate", "dualZone", false))}
                        className={cn(
                          "relative h-6 w-11 rounded-full transition-colors",
                          getVal("climate", "dualZone", false) ? "bg-brand-600" : "bg-surface-300",
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                          getVal("climate", "dualZone", false) && "translate-x-5",
                        )} />
                      </button>
                    </div>
                    {getVal("climate", "dualZone", false) && (
                      <>
                        <Slider label="Driver Zone" value={getVal("climate", "driverZoneTemp", 72)} min={55} max={90} onChange={(v) => updateField("climate", "driverZoneTemp", v)} unit="°F" />
                        <Slider label="Passenger Zone" value={getVal("climate", "passengerZoneTemp", 72)} min={55} max={90} onChange={(v) => updateField("climate", "passengerZoneTemp", v)} unit="°F" />
                      </>
                    )}
                  </>
                )}

                {activeCategory === "infotainment" && (
                  <>
                    <Slider label="Volume" value={getVal("infotainment", "volume", 10)} min={0} max={30} onChange={(v) => updateField("infotainment", "volume", v)} />
                    <Slider label="Bass" value={getVal("infotainment", "bassLevel", 5)} min={0} max={10} onChange={(v) => updateField("infotainment", "bassLevel", v)} />
                    <Slider label="Treble" value={getVal("infotainment", "trebleLevel", 5)} min={0} max={10} onChange={(v) => updateField("infotainment", "trebleLevel", v)} />
                    <Select
                      id="source"
                      label="Preferred Audio Source"
                      value={getVal("infotainment", "preferredSource", "bluetooth")}
                      onChange={(e) => updateField("infotainment", "preferredSource", e.target.value)}
                      options={[
                        { value: "bluetooth", label: "Bluetooth" },
                        { value: "radio", label: "Radio" },
                        { value: "usb", label: "USB" },
                        { value: "streaming", label: "Streaming" },
                      ]}
                    />
                  </>
                )}

                {activeCategory === "drivingMode" && (
                  <>
                    <Select
                      id="mode"
                      label="Preferred Driving Mode"
                      value={getVal("drivingMode", "preferred", "comfort")}
                      onChange={(e) => updateField("drivingMode", "preferred", e.target.value)}
                      options={[
                        { value: "comfort", label: "Comfort" },
                        { value: "sport", label: "Sport" },
                        { value: "eco", label: "Eco" },
                        { value: "custom", label: "Custom" },
                      ]}
                    />
                    <Select
                      id="steering"
                      label="Steering Feel"
                      value={getVal("drivingMode", "steeringFeel", "normal")}
                      onChange={(e) => updateField("drivingMode", "steeringFeel", e.target.value)}
                      options={[
                        { value: "light", label: "Light" },
                        { value: "normal", label: "Normal" },
                        { value: "heavy", label: "Heavy" },
                      ]}
                    />
                    <Select
                      id="regen"
                      label="Regenerative Braking"
                      value={getVal("drivingMode", "regenerativeBraking", "moderate")}
                      onChange={(e) => updateField("drivingMode", "regenerativeBraking", e.target.value)}
                      options={[
                        { value: "low", label: "Low" },
                        { value: "moderate", label: "Moderate" },
                        { value: "high", label: "High" },
                      ]}
                    />
                  </>
                )}

                {activeCategory === "accessibility" && (
                  <div className="space-y-4">
                    {[
                      { key: "largeFonts", label: "Large Fonts" },
                      { key: "highContrast", label: "High Contrast Display" },
                      { key: "voiceControl", label: "Voice Control" },
                      { key: "parkingAssist", label: "Parking Assist" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{label}</span>
                        <button
                          onClick={() => updateField("accessibility", key, !getVal("accessibility", key, false))}
                          className={cn(
                            "relative h-6 w-11 rounded-full transition-colors",
                            getVal("accessibility", key, false) ? "bg-brand-600" : "bg-surface-300",
                          )}
                        >
                          <span className={cn(
                            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                            getVal("accessibility", key, false) && "translate-x-5",
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
