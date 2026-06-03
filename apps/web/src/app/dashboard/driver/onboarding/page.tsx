"use client";

export const dynamic = "force-dynamic";

import { DDI_ONBOARDING_STEPS } from "@futuristic/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ProgressRing } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function DriverOnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth("DRIVER");
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [saving, setSaving] = useState(false);

  const current = DDI_ONBOARDING_STEPS[step]!;
  const allFields = current.updates.flatMap((u) =>
    u.fields.map((f) => ({ ...f, profileField: u.profileField })),
  );

  function setField(profileField: string, field: string, value: string) {
    setValues((v) => ({
      ...v,
      [profileField]: { ...(v[profileField] ?? {}), [field]: value },
    }));
  }

  async function handleNext(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const update of current.updates) {
        const parsed: Record<string, unknown> = {};
        for (const f of update.fields) {
          const raw = values[update.profileField]?.[f.name] ?? f.default ?? "";
          const num = Number(raw);
          parsed[f.name] = isNaN(num) ? raw : num;
        }
        payload[update.profileField] = parsed;
      }

      await apiFetch("/profile", {
        method: "PATCH",
        token: getToken(),
        body: JSON.stringify(payload),
      });

      if (step < DDI_ONBOARDING_STEPS.length - 1) {
        setStep(step + 1);
      } else {
        router.push("/dashboard/driver");
      }
    } finally {
      setSaving(false);
    }
  }

  const progress = Math.round(((step + 1) / DDI_ONBOARDING_STEPS.length) * 100);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-6 py-16">
      <div className="w-full max-w-lg">
        <Link href="/" className="font-display text-sm font-bold tracking-[0.35em] text-white">
          FUTURISTIC
        </Link>
        <p className="mt-8 font-mono text-[10px] tracking-[0.3em] text-muted">
          DDI INITIALIZATION — LAYER {step + 1}/{DDI_ONBOARDING_STEPS.length}
        </p>
        <h1 className="font-display mt-3 text-3xl font-bold">{current.name}</h1>
        <p className="mt-2 text-sm text-zinc-400">{current.detail}</p>

        <div className="mt-8 flex items-center gap-6">
          <ProgressRing percent={progress} />
          <p className="text-sm text-muted">Composing your Digital Driving Identity</p>
        </div>

        <form onSubmit={handleNext} className="card mt-8 space-y-4">
          {allFields.map((f) => (
            <div key={`${f.profileField}.${f.name}`}>
              <label className="label">{f.label}</label>
              <input
                className="input"
                defaultValue={values[f.profileField]?.[f.name] ?? f.default}
                onChange={(e) => setField(f.profileField, f.name, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving
              ? "Saving…"
              : step < DDI_ONBOARDING_STEPS.length - 1
                ? "Next layer →"
                : "Activate DDI"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/dashboard/driver")}
          className="mt-4 w-full text-center text-xs text-muted hover:text-white"
        >
          Skip initialization
        </button>
      </div>
    </div>
  );
}
