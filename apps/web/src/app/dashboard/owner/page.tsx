"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useEffect, useState } from "react";
import { DashboardNav, StatCard } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Capability {
  id: string;
  category: string;
  supportedRange: Record<string, unknown>;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: string;
  capabilities: Capability[];
  fleet?: { name: string } | null;
}

export default function OwnerDashboard() {
  const { logout, getToken, getUser } = useAuth("OWNER");
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadError, setLoadError] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadError("");
        setUser(getUser());
        const token = getToken();
        if (!token) {
          logout();
          return;
        }
        const list = await apiFetch<Vehicle[]>("/vehicles", { token });
        if (!cancelled) setVehicles(list);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load vehicles");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, getUser, logout]);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const vehicle = await apiFetch<Vehicle>("/vehicles", {
      method: "POST",
      token: getToken(),
      body: JSON.stringify({
        make: form.get("make"),
        model: form.get("model"),
        year: Number(form.get("year")),
        vin: form.get("vin"),
      }),
    });
    setVehicles((v) => [vehicle, ...v]);
    setShowForm(false);
    e.currentTarget.reset();
  }

  async function seedCapabilities(vehicleId: string) {
    const updated = await apiFetch<Vehicle>(`/vehicles/${vehicleId}/seed-capabilities`, {
      method: "POST",
      token: getToken(),
    });
    setVehicles((list) => list.map((v) => (v.id === vehicleId ? updated : v)));
  }

  const activeCount = vehicles.filter((v) => v.status === "ACTIVE").length;

  return (
    <div className="min-h-screen bg-void">
      <DashboardNav role="OWNER" onLogout={logout} />
      <div className="mx-auto max-w-6xl px-6 py-10">
        {loadError && (
          <div className="mb-6 rounded-xl border border-border bg-surface p-4 text-sm text-red-300">
            {loadError}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label">EV surface registry</p>
            <h1 className="font-display text-3xl font-bold">{user?.name ?? "Owner"}</h1>
            <p className="mt-1 text-muted">
              Register vehicles and configure policy domains for portable identity bind validation
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "Register surface"}
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="Surfaces registered" value={vehicles.length} accent />
          <StatCard label="Active surfaces" value={activeCount} />
          <StatCard
            label="Policy domains"
            value={vehicles.reduce((n, v) => n + v.capabilities.length, 0)}
          />
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="card mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Make</label>
              <input name="make" required className="input" placeholder="Tesla" />
            </div>
            <div>
              <label className="label">Model</label>
              <input name="model" required className="input" placeholder="Model 3" />
            </div>
            <div>
              <label className="label">Year</label>
              <input name="year" type="number" required className="input" defaultValue={2024} />
            </div>
            <div>
              <label className="label">VIN</label>
              <input name="vin" required className="input" placeholder="17-character VIN" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">
                Register vehicle surface
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 grid gap-4">
          {vehicles.map((v) => (
            <div key={v.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold">
                    {v.year} {v.make} {v.model}
                  </h3>
                  <p className="text-sm text-muted">VIN: {v.vin}</p>
                  {v.fleet && <p className="text-xs text-accent">Fleet: {v.fleet.name}</p>}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    v.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-zinc-500/10 text-zinc-400"
                  }`}
                >
                  {v.status}
                </span>
              </div>
              {v.capabilities.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {v.capabilities.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-lg bg-surface px-2.5 py-1 text-xs text-muted"
                    >
                      {c.category}
                    </span>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => seedCapabilities(v.id)}
                  className="btn-ghost mt-4 text-xs"
                >
                  Enable policy domains
                </button>
              )}
            </div>
          ))}
          {vehicles.length === 0 && (
            <p className="text-center text-muted py-12">
              No vehicle surfaces yet. Register one to join the Futuristic infrastructure layer.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
