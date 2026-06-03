"use client";

export const dynamic = "force-dynamic";

import { DDI_LAYER_EDITOR, formatBindClaim, type DdiProfileField } from "@futuristic/shared";
import { useEffect, useState } from "react";
import { DdiStack } from "@/components/prototype/ddi-stack";
import { DashboardNav, ProgressRing, StatCard } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Profile {
  credentials: Record<string, unknown>;
  authorization: Record<string, unknown>;
  autonomyPosture: Record<string, unknown>;
  compliance: Record<string, unknown>;
  operationalNeeds: Record<string, unknown>;
  energyProfile: Record<string, unknown>;
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

interface BindEvent {
  id: string;
  status: string;
  startedAt: string;
  syncPlan?: { bindStatus?: string; summary?: { applied: number; unsupported: number } };
  vehicle: { make: string; model: string; year: number };
}

interface BindResult {
  session: BindEvent;
  plan: {
    bindStatus?: string;
    items: { category: string; key: string; applied: boolean; reason?: string }[];
    summary: { applied: number; unsupported: number };
    message: string;
  };
}

function parseFieldValue(raw: string, type?: string): unknown {
  if (type === "boolean") return raw === "true";
  if (type === "select" || type === "text") return raw;
  const num = Number(raw);
  return isNaN(num) ? raw : num;
}

function serializeFieldValue(value: unknown, fieldName: string): string {
  if (Array.isArray(value)) return value.join(", ");
  if (fieldName === "fleetMemberships" && typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value ?? "");
}

export default function DriverDashboard() {
  const { logout, getToken, getUser } = useAuth("DRIVER");
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [ddi, setDdi] = useState<Profile | null>(null);
  const [loadError, setLoadError] = useState("");
  const [surfaces, setSurfaces] = useState<RecognitionSurface[]>([]);
  const [events, setEvents] = useState<BindEvent[]>([]);
  const [bindResult, setBindResult] = useState<BindResult | null>(null);
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
          apiFetch<BindEvent[]>("/sync/sessions", { token }),
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

  async function saveLayer() {
    if (!ddi) return;
    setSaving(true);
    try {
      const token = getToken();
      const section = { ...(ddi[activeDomain as keyof Profile] as Record<string, unknown>) };
      if (section.fleetMemberships !== undefined) {
        section.fleetMemberships = String(section.fleetMemberships)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (section.restrictions !== undefined) {
        const r = String(section.restrictions).trim();
        section.restrictions = r ? r.split(",").map((s) => s.trim()) : [];
      }
      const updated = await apiFetch<Profile>("/profile", {
        method: "PATCH",
        token,
        body: JSON.stringify({ [activeDomain]: section }),
      });
      setDdi(updated);
    } finally {
      setSaving(false);
    }
  }

  async function bindToSurface(surfaceId: string) {
    const token = getToken();
    const result = await apiFetch<BindResult>("/sync/start", {
      method: "POST",
      token,
      body: JSON.stringify({ vehicleId: surfaceId }),
    });
    await apiFetch(`/sync/${result.session.id}/complete`, {
      method: "POST",
      token,
    });
    setBindResult(result);
    const sessions = await apiFetch<BindEvent[]>("/sync/sessions", { token });
    setEvents(sessions);
  }

  function updateField(field: string, value: string) {
    if (!ddi) return;
    const current = (ddi[activeDomain as keyof Profile] as Record<string, unknown>) ?? {};
    const fieldDef = domainEditor.fields.find((f) => f.name === field);
    setDdi({
      ...ddi,
      [activeDomain]: { ...current, [field]: parseFieldValue(value, fieldDef?.type) },
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
          "Loading portable Digital Driving Identity…"
        )}
      </div>
    );
  }

  const fields = (ddi[activeDomain as DdiProfileField] as Record<string, unknown>) ?? {};

  return (
    <div className="min-h-screen bg-void">
      <DashboardNav role="DRIVER" onLogout={logout} />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="label">Digital Driving Identity</p>
            <h1 className="font-display text-3xl font-bold">{user?.name ?? "Driver"}</h1>
            <p className="mt-1 max-w-xl text-muted">
              Portable identity infrastructure — credentials, authorization, autonomy contract, and
              EV profile that travels with you across any vehicle or fleet.
            </p>
          </div>
          <ProgressRing percent={ddi.completeness.percent} />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="DDI complete" value={`${ddi.completeness.percent}%`} accent />
          <StatCard label="EV surfaces" value={surfaces.length} />
          <StatCard label="DDI binds" value={events.length} />
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
            <h2 className="font-display text-lg font-bold">DDI editor</h2>
            <p className="mt-1 text-sm text-muted">Configure {activeLayer.name.toLowerCase()}</p>
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
                  {field.type === "boolean" ? (
                    <select
                      className="input"
                      value={serializeFieldValue(fields[field.name], field.name)}
                      onChange={(e) => updateField(field.name, e.target.value)}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : field.type === "select" && field.name === "licenseClass" ? (
                    <select
                      className="input"
                      value={serializeFieldValue(fields[field.name], field.name)}
                      onChange={(e) => updateField(field.name, e.target.value)}
                    >
                      {["C", "B", "A"].map((v) => (
                        <option key={v} value={v}>
                          Class {v}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "select" && field.name === "maxAutonomyLevel" ? (
                    <select
                      className="input"
                      value={serializeFieldValue(fields[field.name], field.name)}
                      onChange={(e) => updateField(field.name, e.target.value)}
                    >
                      {["L0", "L1", "L2", "L3", "L4"].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "select" && field.name === "preferredConnector" ? (
                    <select
                      className="input"
                      value={serializeFieldValue(fields[field.name], field.name)}
                      onChange={(e) => updateField(field.name, e.target.value)}
                    >
                      {["NACS", "CCS", "CHAdeMO"].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="input"
                      value={serializeFieldValue(fields[field.name], field.name)}
                      onChange={(e) => updateField(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            <button onClick={saveLayer} disabled={saving} className="btn-primary mt-4">
              {saving ? "Saving…" : "Save DDI"}
            </button>
          </div>

          <div className="card">
            <h2 className="font-display text-lg font-bold">Bind to EV surface</h2>
            <p className="mt-1 text-sm text-muted">
              Present your portable DDI to a vehicle — the bind runtime validates credentials,
              authorization, autonomy, compliance, and energy claims
            </p>
            <div className="mt-4 space-y-2">
              {surfaces.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => bindToSurface(s.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left transition hover:border-glow/40"
                >
                  <div>
                    <p className="font-medium">
                      {s.year} {s.make} {s.model}
                    </p>
                    <p className="text-xs text-muted">Operator: {s.owner.name}</p>
                  </div>
                  <span className="text-sm text-accent">Bind DDI →</span>
                </button>
              ))}
              {surfaces.length === 0 && (
                <p className="py-6 text-center text-sm text-muted">No EV surfaces available.</p>
              )}
            </div>

            {bindResult && (
              <div className="mt-6 rounded-xl border border-glow/30 bg-glow/5 p-4">
                <p className="text-sm font-medium text-accent">{bindResult.plan.message}</p>
                <p className="mt-2 text-xs text-muted">
                  {bindResult.plan.summary.applied} granted · {bindResult.plan.summary.unsupported}{" "}
                  denied
                  {bindResult.plan.bindStatus && ` · ${bindResult.plan.bindStatus}`}
                </p>
                <div className="mt-3 max-h-48 space-y-1 overflow-y-auto font-mono text-xs">
                  {bindResult.plan.items.map((item, i) => (
                    <div
                      key={i}
                      className={item.applied ? "text-emerald-400" : "text-amber-400/80"}
                    >
                      {formatBindClaim(item.category, item.key)} →{" "}
                      {item.applied ? "granted" : item.reason ?? "denied"}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {events.length > 0 && (
          <div className="card mt-8">
            <h2 className="font-display text-lg font-bold">Bind history</h2>
            <p className="mt-1 text-sm text-muted">Where your portable DDI was presented</p>
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
