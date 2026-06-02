"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Nav } from "@/components/ui";
import { API_URL, apiFetch, getRegisterPath, storeTokens, type AuthResponse } from "@/lib/api";

const roles = [
  { value: "DRIVER", label: "Driver", desc: "Build and sync your driving identity" },
  { value: "OWNER", label: "Vehicle Owner", desc: "Register vehicles and capabilities" },
  { value: "FLEET_OPERATOR", label: "Fleet Operator", desc: "Manage fleets and analytics" },
] as const;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as (typeof roles)[number]["value"]) ?? "DRIVER";
  const [role, setRole] = useState<(typeof roles)[number]["value"]>(initialRole);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const result = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
          role,
        }),
      });
      storeTokens(result.accessToken, result.refreshToken);
      localStorage.setItem("futuristic_user", JSON.stringify(result.user));
      router.push(getRegisterPath(result.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 pt-32">
      <h1 className="font-display text-3xl font-bold">Create your identity</h1>
      <p className="mt-2 text-muted">Choose your role in the identity marketplace</p>

      <div className="mt-6 grid gap-2">
        {roles.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setRole(r.value)}
            className={`rounded-xl border p-4 text-left transition ${
              role === r.value
                ? "border-glow/50 bg-glow/10"
                : "border-border bg-surface hover:border-border/80"
            }`}
          >
            <p className="font-medium">{r.label}</p>
            <p className="text-sm text-muted">{r.desc}</p>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input id="password" name="password" type="password" minLength={8} required className="input" />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <p className="text-[11px] text-muted">API: {API_URL}</p>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
