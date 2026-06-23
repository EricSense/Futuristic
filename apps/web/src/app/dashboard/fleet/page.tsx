"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useEffect, useState } from "react";
import { DashboardNav, StatCard } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Fleet {
  id: string;
  name: string;
  vehicles: { id: string; make: string; model: string; year: number }[];
  _count: { vehicles: number };
}

interface AssignableVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  owner: { name: string };
}

interface Analytics {
  fleetCount: number;
  vehicleCount: number;
  totalSessions: number;
  recentSessions: {
    id: string;
    status: string;
    startedAt: string;
    vehicle: { make: string; model: string; vin: string };
    driverProfile: { user: { name: string; email: string } };
  }[];
}

export default function FleetDashboard() {
  const { logout, getToken, getUser } = useAuth("FLEET_OPERATOR");
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [assignable, setAssignable] = useState<AssignableVehicle[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loadError, setLoadError] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [assignFleetId, setAssignFleetId] = useState<string | null>(null);

  async function loadData() {
    const token = getToken();
    const [f, a, pool] = await Promise.all([
      apiFetch<Fleet[]>("/fleet", { token }),
      apiFetch<Analytics>("/fleet/analytics", { token }),
      apiFetch<AssignableVehicle[]>("/fleet/assignable-vehicles", { token }),
    ]);
    setFleets(f);
    setAnalytics(a);
    setAssignable(pool);
  }

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
        await loadData();
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : "Failed to load fleet data");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, getUser, logout]);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await apiFetch<Fleet>("/fleet", {
      method: "POST",
      token: getToken(),
      body: JSON.stringify({ name: form.get("name") }),
    });
    await loadData();
    setShowForm(false);
    e.currentTarget.reset();
  }

  async function assignVehicle(fleetId: string, vehicleId: string) {
    await apiFetch(`/fleet/${fleetId}/assign`, {
      method: "POST",
      token: getToken(),
      body: JSON.stringify({ vehicleId }),
    });
    setAssignFleetId(null);
    await loadData();
  }

  return (
    <div className="min-h-screen bg-void">
      <DashboardNav role="FLEET_OPERATOR" onLogout={logout} />
      <div className="mx-auto max-w-6xl px-6 py-10">
        {loadError && (
          <div className="mb-6 rounded-xl border border-border bg-surface p-4 text-sm text-red-300">
            {loadError}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label">Bind operations</p>
            <h1 className="font-display text-3xl font-bold">{user?.name ?? "Operator"}</h1>
            <p className="mt-1 text-muted">
              Portable identity at scale — vehicle binds across every surface in your fleet
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "Create fleet"}
          </button>
        </div>

        {analytics && (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <StatCard label="Fleets" value={analytics.fleetCount} accent />
            <StatCard label="Vehicle surfaces" value={analytics.vehicleCount} />
            <StatCard label="Identity binds" value={analytics.totalSessions} />
          </div>
        )}

        {showForm && (
          <form onSubmit={handleCreate} className="card mt-8 max-w-md">
            <label className="label">Fleet name</label>
            <input name="name" required className="input" placeholder="Metro EV Pool" />
            <button type="submit" className="btn-primary mt-4">
              Create fleet
            </button>
          </form>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {fleets.map((f) => (
            <div key={f.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold">{f.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {f._count?.vehicles ?? f.vehicles.length} vehicles
                  </p>
                </div>
                <button
                  onClick={() => setAssignFleetId(assignFleetId === f.id ? null : f.id)}
                  className="btn-ghost text-xs"
                >
                  {assignFleetId === f.id ? "Close" : "Add vehicle"}
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {f.vehicles.map((v) => (
                  <div key={v.id} className="text-sm text-zinc-400">
                    {v.year} {v.make} {v.model}
                  </div>
                ))}
              </div>
              {assignFleetId === f.id && (
                <div className="mt-4 space-y-2 border-t border-border/40 pt-4">
                  {assignable.length === 0 ? (
                    <p className="text-xs text-muted">No unassigned vehicles available</p>
                  ) : (
                    assignable.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => assignVehicle(f.id, v.id)}
                        className="flex w-full items-center justify-between rounded border border-border bg-surface px-3 py-2 text-left text-sm hover:border-glow/40"
                      >
                        <span>
                          {v.year} {v.make} {v.model}
                        </span>
                        <span className="text-xs text-muted">{v.owner.name}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {analytics && analytics.recentSessions.length > 0 && (
          <div className="card mt-8">
            <h2 className="font-display text-lg font-bold">Bind log</h2>
            <p className="mt-1 text-sm text-muted">Futuristic ID holders bound to fleet surfaces</p>
            <div className="mt-4 divide-y divide-border">
              {analytics.recentSessions.map((s) => (
                <div key={s.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <div>
                    <span className="font-medium">{s.driverProfile.user.name}</span>
                    <span className="text-muted"> → </span>
                    <span>
                      {s.vehicle.make} {s.vehicle.model}
                    </span>
                  </div>
                  <span className="text-muted">
                    {new Date(s.startedAt).toLocaleDateString()} · {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
