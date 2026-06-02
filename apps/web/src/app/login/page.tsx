"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Nav } from "@/components/ui";
import { apiFetch, getDashboardPath, storeTokens, type AuthResponse } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const result = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      storeTokens(result.accessToken, result.refreshToken);
      localStorage.setItem("futuristic_user", JSON.stringify(result.user));
      router.push(getDashboardPath(result.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="mx-auto flex max-w-md flex-col px-6 pt-32">
        <h1 className="font-display text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-muted">Sign in to your Digital Driving Identity</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
            <input id="password" name="password" type="password" required className="input" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Create one
          </Link>
        </p>

        <div className="mt-8 rounded-xl border border-border/40 bg-surface/50 p-4 text-xs text-muted">
          <p className="font-medium text-zinc-400">Demo accounts</p>
          <p className="mt-2">alex@driver.futuristic · morgan@owner.futuristic · sam@fleet.futuristic</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}
