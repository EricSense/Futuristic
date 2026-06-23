"use client";

import { DDI_LAYER_EDITOR, formatBindClaim, type DdiProfileField } from "@futuristic/shared";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  API_URL,
  apiFetch,
  getDashboardPath,
  storeTokens,
  type AuthResponse,
} from "@/lib/api";

interface Profile {
  credentials: Record<string, unknown>;
  authorization: Record<string, unknown>;
  autonomyPosture: Record<string, unknown>;
  compliance: Record<string, unknown>;
  operationalNeeds: Record<string, unknown>;
  energyProfile: Record<string, unknown>;
  completeness: { percent: number };
}

interface Surface {
  id: string;
  make: string;
  model: string;
  year: number;
  owner: { name: string };
}

interface BindResult {
  session: { id: string };
  plan: {
    bindStatus?: string;
    items: { category: string; key: string; applied: boolean; reason?: string; requestedValue?: unknown }[];
    summary: { applied: number; unsupported: number };
    message: string;
  };
}

type Step = "idle" | "auth" | "identity" | "bind" | "done" | "error";

const DEMO = { email: "alex@driver.futuristic", password: "password123" };

function layerPreview(profile: Profile, layerId: string): string {
  const layer = DDI_LAYER_EDITOR.find((l) => l.id === layerId);
  if (!layer) return "—";
  const parts: string[] = [];
  for (const domain of layer.domains) {
    const data = profile[domain.profileField] as Record<string, unknown> | undefined;
    if (!data) continue;
    const first = Object.entries(data).find(([k]) => k !== "restrictions" && k !== "fleetMemberships");
    if (first) parts.push(`${first[0]}:${String(first[1])}`);
  }
  return parts.slice(0, 2).join(" · ") || "—";
}

export function InteractivePrototype() {
  const [step, setStep] = useState<Step>("idle");
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<Surface | null>(null);
  const [result, setResult] = useState<BindResult["plan"] | null>(null);
  const [token, setToken] = useState("");

  const push = useCallback((line: string) => {
    setLog((prev) => [...prev, line]);
  }, []);

  async function runFullDemo() {
    setError("");
    setLog([]);
    setProfile(null);
    setSelectedSurface(null);
    setResult(null);
    setToken("");

    try {
      setStep("auth");
      push(`→ POST ${API_URL}/auth/login`);
      const auth = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(DEMO),
      });
      storeTokens(auth.accessToken, auth.refreshToken);
      localStorage.setItem("futuristic_user", JSON.stringify(auth.user));
      setToken(auth.accessToken);
      push(`✓ Futuristic ID holder authenticated: ${auth.user.name}`);

      setStep("identity");
      push(`→ GET ${API_URL}/profile`);
      const p = await apiFetch<Profile>("/profile", { token: auth.accessToken });
      setProfile(p);
      push(`✓ Portable identity loaded (${p.completeness.percent}% complete)`);
      push(`  credentials: Class ${String((p.credentials as Record<string, unknown>).licenseClass ?? "?")} · verified`);
      push(`  autonomy: ${String((p.autonomyPosture as Record<string, unknown>).maxAutonomyLevel ?? "?")} · ${String((p.autonomyPosture as Record<string, unknown>).handoffPolicy ?? "?")} handoff`);

      push(`→ GET ${API_URL}/vehicles/available`);
      const list = await apiFetch<Surface[]>("/vehicles/available", {
        token: auth.accessToken,
      });
      if (list.length === 0) throw new Error("No vehicle surfaces available");
      const surface = list[0]!;
      setSelectedSurface(surface);
      push(`✓ ${list.length} EV surface(s) — binding to ${surface.year} ${surface.make} ${surface.model}`);

      setStep("bind");
      push(`→ POST ${API_URL}/sync/start  (vehicle bind)`);
      const bind = await apiFetch<BindResult>("/sync/start", {
        method: "POST",
        token: auth.accessToken,
        body: JSON.stringify({ vehicleId: surface.id }),
      });
      push(`→ POST ${API_URL}/sync/${bind.session.id}/complete`);
      await apiFetch(`/sync/${bind.session.id}/complete`, {
        method: "POST",
        token: auth.accessToken,
      });
      setResult(bind.plan);
      push(`✓ ${bind.plan.message}`);
      push(`✓ ${bind.plan.summary.applied} claims granted · ${bind.plan.summary.unsupported} denied`);
      setStep("done");
    } catch (err) {
      setStep("error");
      const msg = err instanceof Error ? err.message : "Prototype failed";
      setError(msg);
      push(`✗ ${msg}`);
    }
  }

  const running = step !== "idle" && step !== "done" && step !== "error";

  return (
    <section id="prototype" className="scroll-mt-24 border-b border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted">// LIVE PROTOTYPE</p>
            <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">
              Bind a Futuristic ID to an EV surface
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              One click presents Alex&apos;s portable identity to a real vehicle — validating
              credentials, fleet authorization, autonomy contract, compliance, and charging profile.
              This is identity infrastructure for the autonomous era, not cabin settings.
            </p>
          </div>
          <button
            type="button"
            onClick={runFullDemo}
            disabled={running}
            className="btn-primary text-xs tracking-wide disabled:opacity-50"
          >
            {running ? "Binding…" : "RUN VEHICLE BIND"}
          </button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {DDI_LAYER_EDITOR.map((layer, i) => {
                const active = step === "identity" || step === "bind" || step === "done";
                return (
                  <div
                    key={layer.id}
                    className={`card transition ${
                      active ? "border-glow/40 bg-glow/5" : "opacity-60"
                    }`}
                  >
                    <p className="font-mono text-[9px] tracking-wider text-muted">
                      {String(i + 1).padStart(2, "0")} · {layer.id}
                    </p>
                    <p className="mt-2 font-display text-xs font-bold">{layer.name}</p>
                    <p className="mt-2 font-mono text-[10px] text-accent">
                      {active && profile ? layerPreview(profile, layer.id) : "awaiting…"}
                    </p>
                  </div>
                );
              })}
            </div>

            {selectedSurface && (step === "bind" || step === "done") && (
              <div className="card border-glow/30">
                <p className="label">Recognition surface</p>
                <p className="font-display text-lg font-bold">
                  {selectedSurface.year} {selectedSurface.make} {selectedSurface.model}
                </p>
                <p className="text-xs text-muted">Operator: {selectedSurface.owner.name}</p>
              </div>
            )}

            {result && (
              <div className="card">
                <p className="label">Bind manifest</p>
                <p className="text-sm font-medium text-accent">{result.message}</p>
                <div className="mt-3 max-h-48 space-y-1 overflow-y-auto font-mono text-[11px]">
                  {result.items.map((item, i) => (
                    <div key={i} className={item.applied ? "text-emerald-400" : "text-amber-400/80"}>
                      {formatBindClaim(item.category, item.key)} →{" "}
                      {item.applied ? "granted" : item.reason ?? "denied"}
                    </div>
                  ))}
                </div>
                {token && (
                  <Link
                    href={getDashboardPath("DRIVER")}
                    className="btn-ghost mt-4 inline-flex text-xs"
                  >
                    Open full identity dashboard →
                  </Link>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
                <p className="mt-2 text-xs text-muted">API: {API_URL}</p>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/60 bg-void font-mono text-sm">
            <div className="border-b border-border/40 bg-surface/80 px-4 py-2 text-[10px] tracking-wider text-muted">
              futuristic.bind.runtime — live output
            </div>
            <div className="min-h-[320px] space-y-1.5 p-4">
              {log.length === 0 && (
                <p className="text-muted">Press RUN VEHICLE BIND to execute against {API_URL}</p>
              )}
              {log.map((line, i) => (
                <p
                  key={i}
                  className={
                    line.startsWith("✓")
                      ? "text-emerald-400"
                      : line.startsWith("✗")
                        ? "text-red-400"
                        : line.startsWith("  ")
                          ? "text-zinc-400"
                          : "text-accent"
                  }
                >
                  {line}
                </p>
              ))}
              {running && <p className="animate-pulse text-muted">…</p>}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-muted">
          Demo identity: {DEMO.email} · Try Rivian (L2 cap) vs BMW i4 (L4) for different bind outcomes ·{" "}
          <Link href="/login" className="text-accent hover:underline">
            sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
