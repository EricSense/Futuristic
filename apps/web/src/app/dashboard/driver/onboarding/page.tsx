"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ProgressRing } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const STEPS = [
  {
    key: "seatConfig",
    label: "Ergonomic Core",
    desc: "Seat position and ergonomics — your physiological baseline.",
    fields: [
      { name: "position", label: "Seat position", default: "72" },
      { name: "lumbar", label: "Lumbar support", default: "6" },
    ],
  },
  {
    key: "climateConfig",
    label: "Behavioral Mesh",
    desc: "Climate preferences — temperature and fan rhythm.",
    fields: [
      { name: "temp", label: "Temperature (°F)", default: "71" },
      { name: "fan", label: "Fan speed", default: "3" },
    ],
  },
  {
    key: "drivingMode",
    label: "Driving Intent",
    desc: "Default mode — how you intend to move through space.",
    fields: [{ name: "mode", label: "Mode", default: "comfort" }],
  },
] as const;

export default function DriverOnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth("DRIVER");
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [saving, setSaving] = useState(false);

  const current = STEPS[step]!;

  function setField(field: string, value: string) {
    setValues((v) => ({
      ...v,
      [current.key]: { ...(v[current.key] ?? {}), [field]: value },
    }));
  }

  async function handleNext(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const stepValues = values[current.key] ?? {};
      const payload: Record<string, unknown> = {};
      const parsed: Record<string, unknown> = {};
      for (const f of current.fields) {
        const raw = stepValues[f.name] ?? f.default;
        const num = Number(raw);
        parsed[f.name] = isNaN(num) ? raw : num;
      }
      payload[current.key] = parsed;

      await apiFetch("/profile", {
        method: "PATCH",
        token: getToken(),
        body: JSON.stringify(payload),
      });

      if (step < STEPS.length - 1) {
        setStep(step + 1);
      } else {
        router.push("/dashboard/driver");
      }
    } finally {
      setSaving(false);
    }
  }

  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-6 py-16">
      <div className="w-full max-w-lg">
        <Link href="/" className="font-display text-sm font-bold tracking-[0.35em] text-white">
          FUTURISTIC
        </Link>
        <p className="mt-8 font-mono text-[10px] tracking-[0.3em] text-muted">
          IDENTITY INITIALIZATION — STEP {step + 1}/{STEPS.length}
        </p>
        <h1 className="font-display mt-3 text-3xl font-bold">{current.label}</h1>
        <p className="mt-2 text-sm text-zinc-400">{current.desc}</p>

        <div className="mt-8 flex items-center gap-6">
          <ProgressRing percent={progress} />
          <p className="text-sm text-muted">Building your Digital Driving Identity</p>
        </div>

        <form onSubmit={handleNext} className="card mt-8 space-y-4">
          {current.fields.map((f) => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <input
                className="input"
                defaultValue={values[current.key]?.[f.name] ?? f.default}
                onChange={(e) => setField(f.name, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving…" : step < STEPS.length - 1 ? "Continue →" : "Activate identity"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/dashboard/driver")}
          className="mt-4 w-full text-center text-xs text-muted hover:text-white"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
