"use client";

import { useEffect, useState } from "react";
import { formatBindClaim } from "@futuristic/shared";
import { API_URL } from "@/lib/api";

interface PlatformStatus {
  drivers: number;
  vehicles: number;
  sessions: number;
  completedSessions: number;
  appliedPreferences: number;
  latestProof: { category: string; key: string; value: unknown }[] | null;
}

export function LiveProof() {
  const [status, setStatus] = useState<PlatformStatus | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/status/public`)
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  const proof = status?.latestProof ?? [
    { category: "credentials", key: "licenseClass", value: "C" },
    { category: "authorization", key: "fleetMembership", value: "Metro EV Pool" },
    { category: "autonomy", key: "maxAutonomyLevel", value: "L3" },
  ];

  return (
    <div>
      <div className="space-y-3 font-mono text-sm">
        {proof.map((item) => (
          <div key={`${item.category}.${item.key}`} className="flex justify-between gap-4 text-accent">
            <span>{formatBindClaim(item.category, item.key)}</span>
            <span className="text-emerald-400">{String(item.value)} → granted</span>
          </div>
        ))}
      </div>
      {status && (
        <p className="mt-6 text-xs text-muted">
          {status.appliedPreferences} bind claims across {status.completedSessions} identity binds ·{" "}
          {status.vehicles} EV surfaces
        </p>
      )}
    </div>
  );
}

export function LiveStats() {
  const [status, setStatus] = useState<PlatformStatus | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/status/public`)
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  const stats = status
    ? [
        { value: String(status.completedSessions), label: "IDENTITY BINDS" },
        { value: String(status.appliedPreferences), label: "CLAIMS GRANTED" },
        { value: String(status.vehicles), label: "EV SURFACES" },
        { value: `${status.drivers}`, label: "PORTABLE IDENTITIES" },
        { value: "L4", label: "MAX AUTONOMY TESTED" },
      ]
    : [
        { value: "—", label: "IDENTITY BINDS" },
        { value: "—", label: "CLAIMS GRANTED" },
        { value: "—", label: "EV SURFACES" },
        { value: "—", label: "PORTABLE IDENTITIES" },
        { value: "L4", label: "MAX AUTONOMY TESTED" },
      ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/40 md:grid-cols-5">
      {stats.map((s) => (
        <div key={s.label} className="bg-panel px-4 py-6 text-center md:px-6">
          <p className="font-display text-2xl font-bold text-white md:text-3xl">{s.value}</p>
          <p className="mt-2 font-mono text-[9px] leading-snug tracking-wider text-muted">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
