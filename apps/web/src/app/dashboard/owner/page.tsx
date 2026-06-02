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
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setUser(getUser());
    apiFetch<Vehicle[]>("/vehicles", { token: getToken() }).then(setVehicles);
  }, [getToken, getUser]);

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

  const activeCount = vehicles.filter((v) => v.status === "ACTIVE").length;

  return (
    <div className="min-h-screen bg-void">
      <DashboardNav role="OWNER" onLogout={logout} />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label">Vehicle Registry</p>
            <h1 className="font-display text-3xl font-bold">{user?.name ?? "Owner"}</h1>
            <p className="mt-1 text-muted">
              Register vehicles and define what each can honor when identities sync
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "Add vehicle"}
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total vehicles" value={vehicles.length} accent />
          <StatCard label="Active" value={activeCount} />
          <StatCard
            label="Capabilities defined"
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
                Register vehicle
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
              {v.capabilities.length > 0 && (
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
              )}
            </div>
          ))}
          {vehicles.length === 0 && (
            <p className="text-center text-muted py-12">
              No vehicles registered yet. Add your first vehicle to join the identity marketplace.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
