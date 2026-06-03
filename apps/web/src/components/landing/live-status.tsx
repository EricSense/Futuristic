"use client";

import { useEffect, useState } from "react";
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
    { category: "seat", key: "position", value: 72 },
    { category: "climate", key: "temp", value: 71 },
    { category: "drivingMode", key: "mode", value: "comfort" },
  ];

  return (
    <div>
      <div className="space-y-3 font-mono text-sm">
        {proof.map((item) => (
          <div key={`${item.category}.${item.key}`} className="flex justify-between text-accent">
            <span>
              {item.category}.{item.key}
            </span>
            <span>{String(item.value)} → expressed</span>
          </div>
        ))}
      </div>
      {status && (
        <p className="mt-6 text-xs text-muted">
          {status.appliedPreferences} identity signals across {status.completedSessions} recognition
          events · {status.vehicles} active surfaces
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
        { value: String(status.sessions), label: "RECOGNITION EVENTS" },
        { value: String(status.appliedPreferences), label: "SIGNALS EXPRESSED" },
        { value: "128", label: "BEHAVIORAL DIMENSIONS" },
        { value: `${status.drivers}`, label: "ACTIVE IDENTITIES" },
        { value: "∞", label: "SCALE POTENTIAL" },
      ]
    : [
        { value: "—", label: "RECOGNITION EVENTS" },
        { value: "—", label: "SIGNALS EXPRESSED" },
        { value: "128", label: "BEHAVIORAL DIMENSIONS" },
        { value: "—", label: "ACTIVE IDENTITIES" },
        { value: "∞", label: "SCALE POTENTIAL" },
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
