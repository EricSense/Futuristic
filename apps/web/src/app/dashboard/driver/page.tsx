"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { DashboardNav, ProgressRing, StatCard } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Profile {
  seatConfig: Record<string, unknown>;
  mirrorConfig: Record<string, unknown>;
  climateConfig: Record<string, unknown>;
  infotainmentConfig: Record<string, unknown>;
  drivingMode: Record<string, unknown>;
  accessibility: Record<string, unknown>;
  completeness: { percent: number; filled: string[]; missing: string[] };
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  owner: { name: string };
}

interface SyncSession {
  id: string;
  status: string;
  startedAt: string;
  syncPlan?: { summary?: { applied: number; unsupported: number } };
  vehicle: { make: string; model: string; year: number };
}

interface SyncResult {
  session: SyncSession;
  plan: {
    items: { category: string; key: string; applied: boolean; reason?: string }[];
    summary: { applied: number; unsupported: number };
    message: string;
  };
}

const CATEGORIES = [
  { key: "seatConfig", label: "Seat", fields: ["position", "lumbar", "height", "tilt"] },
  { key: "mirrorConfig", label: "Mirrors", fields: ["left", "right", "rearview"] },
  { key: "climateConfig", label: "Climate", fields: ["temp", "fan"] },
  { key: "drivingMode", label: "Driving Mode", fields: ["mode"] },
  { key: "infotainmentConfig", label: "Infotainment", fields: ["volume", "source"] },
  { key: "accessibility", label: "Accessibility", fields: ["laneKeep", "adaptiveCruise", "display"] },
] as const;

export default function DriverDashboard() {
  const { logout, getToken, getUser } = useAuth("DRIVER");
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sessions, setSessions] = useState<SyncSession[]>([]);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [activeCategory, setActiveCategory] = useState("seatConfig");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUser(getUser());
    const token = getToken();
    Promise.all([
      apiFetch<Profile>("/profile", { token }),
      apiFetch<Vehicle[]>("/vehicles/available", { token }),
      apiFetch<SyncSession[]>("/sync/sessions", { token }),
    ]).then(([p, v, s]) => {
      setProfile(p);
      setVehicles(v);
      setSessions(s);
    });
  }, [getToken]);

  async function saveCategory() {
    if (!profile) return;
    setSaving(true);
    try {
      const token = getToken();
      const updated = await apiFetch<Profile>("/profile", {
        method: "PATCH",
        token,
        body: JSON.stringify({
          [activeCategory]: profile[activeCategory as keyof Profile],
        }),
      });
      setProfile(updated);
    } finally {
      setSaving(false);
    }
  }

  async function startSync(vehicleId: string) {
    const token = getToken();
    const result = await apiFetch<SyncResult>("/sync/start", {
      method: "POST",
      token,
      body: JSON.stringify({ vehicleId }),
    });
    await apiFetch(`/sync/${result.session.id}/complete`, {
      method: "POST",
      token,
    });
    setSyncResult(result);
    const sessions = await apiFetch<SyncSession[]>("/sync/sessions", { token });
    setSessions(sessions);
  }

  function updateField(key: string, field: string, value: string) {
    if (!profile) return;
    const cat = activeCategory as keyof Profile;
    const current = (profile[cat] as Record<string, unknown>) ?? {};
    const num = Number(value);
    setProfile({
      ...profile,
      [cat]: { ...current, [field]: isNaN(num) ? value : num },
    });
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Loading your identity…
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.key === activeCategory)!;
  const config = (profile[activeCategory as keyof Profile] as Record<string, unknown>) ?? {};

  return (
    <div className="min-h-screen bg-void">
      <DashboardNav role="DRIVER" onLogout={logout} />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="label">Digital Driving Identity</p>
            <h1 className="font-display text-3xl font-bold">{user?.name ?? "Driver"}</h1>
            <p className="mt-1 text-muted">Your portable identity — sync to any vehicle</p>
          </div>
          <ProgressRing percent={profile.completeness.percent} />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="Profile complete" value={`${profile.completeness.percent}%`} accent />
          <StatCard label="Available vehicles" value={vehicles.length} />
          <StatCard label="Sync sessions" value={sessions.length} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="card">
            <h2 className="font-display text-lg font-bold">Preference editor</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    activeCategory === c.key
                      ? "bg-glow/20 text-accent"
                      : "bg-surface text-muted hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {cat.fields.map((field) => (
                <div key={field}>
                  <label className="label">{field}</label>
                  <input
                    className="input"
                    value={String(config[field] ?? "")}
                    onChange={(e) => updateField(activeCategory, field, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button onClick={saveCategory} disabled={saving} className="btn-primary mt-4">
              {saving ? "Saving…" : "Save preferences"}
            </button>
          </div>

          <div className="card">
            <h2 className="font-display text-lg font-bold">Sync to vehicle</h2>
            <p className="mt-1 text-sm text-muted">
              Select a vehicle — the sync engine maps your identity to its capabilities
            </p>
            <div className="mt-4 space-y-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => startSync(v.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left transition hover:border-glow/40"
                >
                  <div>
                    <p className="font-medium">
                      {v.year} {v.make} {v.model}
                    </p>
                    <p className="text-xs text-muted">Owner: {v.owner.name}</p>
                  </div>
                  <span className="text-sm text-accent">Sync →</span>
                </button>
              ))}
            </div>

            {syncResult && (
              <div className="mt-6 rounded-xl border border-glow/30 bg-glow/5 p-4">
                <p className="text-sm font-medium text-accent">{syncResult.plan.message}</p>
                <p className="mt-2 text-xs text-muted">
                  {syncResult.plan.summary.applied} applied · {syncResult.plan.summary.unsupported}{" "}
                  deferred
                </p>
                <div className="mt-3 max-h-48 space-y-1 overflow-y-auto font-mono text-xs">
                  {syncResult.plan.items.map((item, i) => (
                    <div
                      key={i}
                      className={item.applied ? "text-accent" : "text-amber-400/80"}
                    >
                      {item.category}.{item.key} → {item.applied ? "applied" : item.reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="card mt-8">
            <h2 className="font-display text-lg font-bold">Session history</h2>
            <div className="mt-4 divide-y divide-border">
              {sessions.map((s) => (
                <div key={s.id} className="flex justify-between py-3 text-sm">
                  <span>
                    {s.vehicle.year} {s.vehicle.make} {s.vehicle.model}
                  </span>
                  <span className="text-muted">
                    {new Date(s.startedAt).toLocaleDateString()} · {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
