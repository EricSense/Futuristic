"use client";

import { DDI_LAYER_EDITOR, type DdiProfileField } from "@futuristic/shared";

type DdiData = Partial<Record<DdiProfileField, Record<string, unknown>>>;

const SKIP_KEYS = new Set(["restrictions", "fleetMemberships", "emergencyContact"]);

export function DdiStack({ ddi, completeness }: { ddi: DdiData; completeness: number }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="label">Futuristic ID</p>
          <p className="font-display text-lg font-bold">Travels with you across any vehicle</p>
        </div>
        <span className="font-display text-2xl font-bold text-accent">{completeness}%</span>
      </div>
      <div className="mt-6 space-y-4">
        {DDI_LAYER_EDITOR.map((layer) => (
          <div key={layer.id} className="rounded-xl border border-border/50 bg-surface/40 p-4">
            <p className="font-mono text-[10px] tracking-wider text-muted">{layer.id}</p>
            <p className="mt-1 font-display text-sm font-bold">{layer.name}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {layer.domains.map((domain) => {
                const signals = ddi[domain.profileField] ?? {};
                const entries = Object.entries(signals).filter(([k]) => !SKIP_KEYS.has(k));
                return (
                  <div key={domain.profileField} className="rounded-lg bg-void/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted">{domain.label}</p>
                    {entries.length === 0 ? (
                      <p className="mt-1 text-xs text-zinc-500">Not configured</p>
                    ) : (
                      <ul className="mt-1 space-y-0.5 font-mono text-[11px] text-accent">
                        {entries.map(([k, v]) => (
                          <li key={k}>
                            {k}={String(v)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
