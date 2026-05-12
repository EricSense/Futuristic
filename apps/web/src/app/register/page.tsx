"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Fingerprint, Car, Building2 } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";

const roles = [
  {
    value: "DRIVER",
    label: "Create My DDI",
    description: "Build your Digital Driving Identity and carry it to any vehicle",
    icon: Fingerprint,
    redirect: "/dashboard/driver",
  },
  {
    value: "OWNER",
    label: "Vehicle Owner",
    description: "Register vehicles and enable DDI sync for your cars",
    icon: Car,
    redirect: "/dashboard/owner",
  },
  {
    value: "FLEET_OPERATOR",
    label: "Fleet Operator",
    description: "Enable DDI across your fleet for every driver",
    icon: Building2,
    redirect: "/dashboard/fleet",
  },
] as const;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!role) {
        setError("Please select a role");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register(email, password, name, role);
      const selected = roles.find((r) => r.value === role);
      router.push(selected?.redirect || "/dashboard/driver");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4">
              <LogoMark size={56} />
            </div>
            <h1 className="text-2xl font-bold text-white">Join Futuristic</h1>
            <p className="mt-1 text-sm text-gray-400">
              {step === 1 ? "Choose how you'll use DDI" : "Set up your account"}
            </p>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <div className={cn("h-1 flex-1 rounded-full", step >= 1 ? "bg-brand-600" : "bg-surface-200")} />
            <div className={cn("h-1 flex-1 rounded-full", step >= 2 ? "bg-brand-600" : "bg-surface-200")} />
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <div className="space-y-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={cn(
                        "w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                        role === r.value
                          ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/5"
                          : "border-white/10 bg-surface-100 hover:border-white/20",
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        role === r.value ? "bg-sky-600 text-white" : "bg-surface-200 text-gray-400",
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{r.label}</div>
                        <div className="text-sm text-gray-400">{r.description}</div>
                      </div>
                    </button>
                  );
                })}
                <Button type="submit" className="w-full" size="lg">
                  Continue
                </Button>
              </div>
            ) : (
              <>
                <Input
                  id="name"
                  label="Full name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1" size="lg">
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1" size="lg">
                    {loading ? "Creating..." : "Create DDI"}
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-sky-400 hover:text-sky-300 font-medium">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
