"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("driver@futuristic.dev");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) {
    router.replace("/account");
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password, name || email.split("@")[0]);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="text-center mb-8">
          <LogoMark size={48} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">
            {mode === "login" ? "Sign in to Futuristic" : "Create your driver account"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Issue a persisted DDI, sync cabin preferences, and run live federation demos.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Full name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" />
              </div>
            )}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full gap-2" disabled={busy}>
              {busy ? "…" : mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {mode === "login" ? (
              <>
                New?{" "}
                <button type="button" className="text-sky-400" onClick={() => setMode("register")}>
                  Register
                </button>
              </>
            ) : (
              <>
                Have an account?{" "}
                <button type="button" className="text-sky-400" onClick={() => setMode("login")}>
                  Sign in
                </button>
              </>
            )}
          </p>
        </Card>

        <p className="text-center text-xs text-gray-600 mt-6">
          Demo: <code className="text-gray-400">driver@futuristic.dev</code> /{" "}
          <code className="text-gray-400">password123</code>
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-white">
            ← Back home
          </Link>
        </p>
      </div>
    </div>
  );
}
