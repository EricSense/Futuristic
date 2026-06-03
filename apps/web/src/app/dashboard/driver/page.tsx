"use client";

export const dynamic = "force-dynamic";

import { DDI_LAYER_EDITOR, type DdiProfileField } from "@futuristic/shared";
import { useEffect, useState } from "react";
import { DdiStack } from "@/components/prototype/ddi-stack";
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

interface RecognitionSurface {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  owner: { name: string };
}

interface RecognitionEvent {
  id: string;
  status: string;
  startedAt: string;
  syncPlan?: { summary?: { applied: number; unsupported: number } };
  vehicle: { make: string; model: string; year: number };
}

interface RecognitionResult {
  session: RecognitionEvent;
  plan: {
    items: { category: string; key: string; applied: boolean; reason?: string }[];
    summary: { applied: number; unsupported: number };
    message: string;
  };
}

export default function DriverDashboard() {
  const { logout, getToken, getUser } = useAuth("DRIVER");
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [ddi, setDdi] = useState<Profile | null>(null);
  const [loadError, setLoadError] = useState("");
  const [surfaces, setSurfaces] = useState<RecognitionSurface[]>([]);
  const [events, setEvents] = useState<RecognitionEvent[]>([]);
  const [recognition, setRecognition] = useState<RecognitionResult | null>(null);
  const [activeLayerId, setActiveLayerId] = useState(DDI_LAYER_EDITOR[0]!.id);
  const [activeDomain, setActiveDomain] = useState(DDI_LAYER_EDITOR[0]!.domains[0]!.profileField);
  const [saving, setSaving] = useState(false);

  const activeLayer = DDI_LAYER_EDITOR.find((l) => l.id === activeLayerId)!;
  const domainEditor = activeLayer.domains.find((d) => d.profileField === activeDomain)!;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadError("");
        setUser(getUser());
        const token = getToken();
        if (!token) {
          logout();
          return;
        }
        const [profile, available, sessions] = await Promise.all([
          apiFetch<Profile>("/profile", { token }),
          apiFetch<RecognitionSurface[]>("/vehicles/available", { token }),
          apiFetch<RecognitionEvent[]>("/sync/sessions", { token }),
        ]);
        if (cancelled) return;
        setDdi(profile);
        setSurfaces(available);
        setEvents(sessions);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : "Failed to load DDI");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, getUser, logout]);

  async function saveLayerSignals() {
    if (!ddi) return;
    setSaving(true);
    try {
      const token = getToken();
      const updated = await apiFetch<Profile>("/profile", {
        method: "PATCH",
        token,
        body: JSON.stringify({
          [activeDomain]: ddi[activeDomain as keyof Profile],
        }),
      });
      setDdi(updated);
    } finally {
      setSaving(false);
    }
  }

  async function expressIdentity(surfaceId: string) {
    const token = getToken();
    const result = await apiFetch<RecognitionResult>("/sync/start", {
      method: "POST",
      token,
      body: JSON.stringify({ vehicleId: surfaceId }),
    });
    await apiFetch(`/sync/${result.session.id}/complete`, {
      method: "POST",
      token,
    });
    setRecognition(result);
    const sessions = await apiFetch<RecognitionEvent[]>("/sync/sessions", { token });
    setEvents(sessions);
  }

  function updateSignal(field: string, value: string) {
    if (!ddi) return;
    const current = (ddi[activeDomain as keyof Profile] as Record<string, unknown>) ?? {};
    const num = Number(value);
    setDdi({
      ...ddi,
      [activeDomain]: { ...current, [field]: isNaN(num) ? value : num },
    });
  }

  function selectLayer(layerId: string) {
    setActiveLayerId(layerId);
    const layer = DDI_LAYER_EDITOR.find((l) => l.id === layerId)!;
    setActiveDomain(layer.domains[0]!.profileField);
  }

  if (!ddi) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        {loadError ? (
          <div className="max-w-md space-y-3 rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-medium text-red-300">Couldn&apos;t load your DDI</p>
            <p className="text-sm text-muted">{loadError}</p>
            <button className="btn-primary w-full" onClick={() => window.location.reload()}>
              Retry
            </button>
            <button className="btn-secondary w-full" onClick={logout}>
              Sign out
            </button>
          </div>
        ) : (
          "Initializing Digital Driving Identity…"
        )}
      </div>
    );
  }

  const signals = (ddi[activeDomain as DdiProfileField] as Record<string, unknown>) ?? {};

  return (
    <div className="min-h-screen bg-void">
      <DashboardNav role="DRIVER" onLogout={logout} />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="label">Digital Driving Identity</p>
            <h1 className="font-display text-3xl font-bold">{user?.name ?? "Driver"}</h1>
            <p className="mt-1 max-w-xl text-muted">
              One portable identity. Any recognition surface. Your living signature — not settings
              inside a car.
            </p>
          </div>
          <ProgressRing percent={ddi.completeness.percent} />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="DDI complete" value={`${ddi.completeness.percent}%`} accent />
          <StatCard label="Recognition surfaces" value={surfaces.length} />
          <StatCard label="Recognition events" value={events.length} />
        </div>

        <div className="mt-8">
          <DdiStack ddi={ddi} completeness={ddi.completeness.percent} />
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {DDI_LAYER_EDITOR.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => selectLayer(layer.id)}
              className={`card text-left transition ${
                activeLayerId === layer.id ? "border-glow/40 bg-glow/5" : "hover:border-border/80"
              }`}
            >
              <p className="font-mono text-[10px] tracking-wider text-muted">{layer.id}</p>
              <p className="mt-2 font-display text-sm font-bold">{layer.name}</p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{layer.detail}</p>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="card">
            <h2 className="font-display text-lg font-bold">Identity stack editor</h2>
            <p className="mt-1 text-sm text-muted">
              Compose signals for {activeLayer.name.toLowerCase()}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeLayer.domains.map((d) => (
                <button
                  key={d.profileField}
                  type="button"
                  onClick={() => setActiveDomain(d.profileField)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    activeDomain === d.profileField
                      ? "bg-glow/20 text-accent"
                      : "bg-surface text-muted hover:text-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {domainEditor.fields.map((field) => (
                <div key={field.name}>
                  <label className="label">{field.label}</label>
                  <input
                    className="input"
                    value={String(signals[field.name] ?? "")}
                    onChange={(e) => updateSignal(field.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button onClick={saveLayerSignals} disabled={saving} className="btn-primary mt-4">
              {saving ? "Saving…" : "Save identity signals"}
            </button>
          </div>

          <div className="card">
            <h2 className="font-display text-lg font-bold">Identity recognition</h2>
            <p className="mt-1 text-sm text-muted">
              Express your DDI on a recognition surface — the runtime maps signals to what the
              environment can honor
            </p>
            <div className="mt-4 space-y-2">
              {surfaces.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => expressIdentity(s.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left transition hover:border-glow/40"
                >
                  <div>
                    <p className="font-medium">
                      {s.year} {s.make} {s.model}
                    </p>
                    <p className="text-xs text-muted">Surface operator: {s.owner.name}</p>
                  </div>
                  <span className="text-sm text-accent">Recognize →</span>
                </button>
              ))}
              {surfaces.length === 0 && (
                <p className="py-6 text-center text-sm text-muted">
                  No recognition surfaces available yet.
                </p>
              )}
            </div>

            {recognition && (
              <div className="mt-6 rounded-xl border border-glow/30 bg-glow/5 p-4">
                <p className="text-sm font-medium text-accent">{recognition.plan.message}</p>
                <p className="mt-2 text-xs text-muted">
                  {recognition.plan.summary.applied} signals expressed ·{" "}
                  {recognition.plan.summary.unsupported} deferred
                </p>
                <div className="mt-3 max-h-48 space-y-1 overflow-y-auto font-mono text-xs">
                  {recognition.plan.items.map((item, i) => (
                    <div
                      key={i}
                      className={item.applied ? "text-accent" : "text-amber-400/80"}
                    >
                      {item.category}.{item.key} → {item.applied ? "expressed" : item.reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {events.length > 0 && (
          <div className="card mt-8">
            <h2 className="font-display text-lg font-bold">Recognition log</h2>
            <p className="mt-1 text-sm text-muted">Where your DDI was recognized</p>
            <div className="mt-4 divide-y divide-border">
              {events.map((e) => (
                <div key={e.id} className="flex justify-between py-3 text-sm">
                  <span>
                    {e.vehicle.year} {e.vehicle.make} {e.vehicle.model}
                  </span>
                  <span className="text-muted">
                    {new Date(e.startedAt).toLocaleDateString()} · {e.status}
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
