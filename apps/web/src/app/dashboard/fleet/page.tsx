"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Plus,
  X,
  Car,
  Users,
  Activity,
  BarChart3,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FleetVehicle {
  id: string;
  vehicleId: string;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    status: string;
  };
}

interface Fleet {
  id: string;
  name: string;
  vehicles: FleetVehicle[];
}

interface Analytics {
  fleetName: string;
  totalVehicles: number;
  totalSessions: number;
  uniqueDrivers: number;
  recentSessions: Array<{
    id: string;
    status: string;
    startedAt: string;
    endedAt: string | null;
    driver: { user: { name: string; email: string } };
    vehicle: { make: string; model: string; year: number };
  }>;
}

export default function FleetDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [fleetName, setFleetName] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedFleet, setExpandedFleet] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Record<string, Analytics>>({});
  const [vehicleIdInput, setVehicleIdInput] = useState("");

  const loadFleets = useCallback(async () => {
    try {
      const res = await api.get<Fleet[]>("/api/fleets");
      if (res.data) setFleets(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) loadFleets();
  }, [user, authLoading, router, loadFleets]);

  const createFleet = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      await api.post("/api/fleets", { name: fleetName });
      await loadFleets();
      setShowAddForm(false);
      setFleetName("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create fleet");
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async (fleetId: string) => {
    try {
      const res = await api.get<Analytics>(`/api/fleets/${fleetId}/analytics`);
      if (res.data) setAnalytics((prev) => ({ ...prev, [fleetId]: res.data! }));
    } catch {}
  };

  const toggleExpand = (fleetId: string) => {
    if (expandedFleet === fleetId) {
      setExpandedFleet(null);
    } else {
      setExpandedFleet(fleetId);
      if (!analytics[fleetId]) loadAnalytics(fleetId);
    }
  };

  const addVehicleToFleet = async (fleetId: string) => {
    if (!vehicleIdInput.trim()) return;
    try {
      await api.post(`/api/fleets/${fleetId}/vehicles`, { vehicleId: vehicleIdInput.trim() });
      await loadFleets();
      setVehicleIdInput("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add vehicle");
    }
  };

  const removeVehicle = async (fleetId: string, vehicleId: string) => {
    try {
      await api.delete(`/api/fleets/${fleetId}/vehicles/${vehicleId}`);
      await loadFleets();
    } catch {}
  };

  const deleteFleet = async (fleetId: string) => {
    if (!confirm("Delete this fleet and all its associations?")) return;
    try {
      await api.delete(`/api/fleets/${fleetId}`);
      await loadFleets();
    } catch {}
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-gray-400 animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Fleet Management</h1>
            <p className="text-gray-400 mt-1">Enable DDI across your fleet &mdash; every driver, every vehicle, instantly personalized</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? "Cancel" : "Create Fleet"}
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Fleet</CardTitle>
              <CardDescription>Group vehicles together for centralized management</CardDescription>
            </CardHeader>
            {formError && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {formError}
              </div>
            )}
            <form onSubmit={createFleet} className="flex gap-3">
              <Input
                id="fleet-name"
                placeholder="Fleet name (e.g. Downtown EV Fleet)"
                value={fleetName}
                onChange={(e) => setFleetName(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </form>
          </Card>
        )}

        {fleets.length === 0 ? (
          <Card className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No fleets yet</h3>
            <p className="text-gray-400 text-sm">Create your first fleet to start managing vehicles.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {fleets.map((fleet) => {
              const a = analytics[fleet.id];
              return (
                <Card key={fleet.id} className="overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/10 border border-brand-500/20">
                        <Building2 className="h-6 w-6 text-brand-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{fleet.name}</h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Car className="w-3 h-3" /> {fleet.vehicles.length} vehicles
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleExpand(fleet.id)} className="gap-1">
                        <BarChart3 className="w-4 h-4" />
                        {expandedFleet === fleet.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteFleet(fleet.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {expandedFleet === fleet.id && (
                    <div className="mt-6 space-y-6 border-t border-white/5 pt-4">
                      {/* Stats */}
                      {a && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="rounded-lg bg-surface-100 border border-white/5 p-4 text-center">
                            <Car className="w-5 h-5 text-brand-400 mx-auto mb-1" />
                            <div className="text-2xl font-bold text-white">{a.totalVehicles}</div>
                            <div className="text-xs text-gray-500">Vehicles</div>
                          </div>
                          <div className="rounded-lg bg-surface-100 border border-white/5 p-4 text-center">
                            <Activity className="w-5 h-5 text-green-400 mx-auto mb-1" />
                            <div className="text-2xl font-bold text-white">{a.totalSessions}</div>
                            <div className="text-xs text-gray-500">Total Syncs</div>
                          </div>
                          <div className="rounded-lg bg-surface-100 border border-white/5 p-4 text-center">
                            <Users className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                            <div className="text-2xl font-bold text-white">{a.uniqueDrivers}</div>
                            <div className="text-xs text-gray-500">Unique Drivers</div>
                          </div>
                        </div>
                      )}

                      {/* Vehicles in Fleet */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Fleet Vehicles</h4>
                        {fleet.vehicles.length > 0 ? (
                          <div className="space-y-2">
                            {fleet.vehicles.map((fv) => (
                              <div key={fv.id} className="flex items-center justify-between rounded-lg bg-surface-100 border border-white/5 px-4 py-2.5">
                                <div className="flex items-center gap-3">
                                  <Car className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-white">
                                    {fv.vehicle.year} {fv.vehicle.make} {fv.vehicle.model}
                                  </span>
                                  <Badge variant={fv.vehicle.status === "ACTIVE" ? "success" : "warning"} className="text-[10px]">
                                    {fv.vehicle.status}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => removeVehicle(fleet.id, fv.vehicleId)} className="text-red-400 hover:text-red-300">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No vehicles in this fleet yet.</p>
                        )}

                        <div className="mt-3 flex gap-2">
                          <Input
                            id={`add-vehicle-${fleet.id}`}
                            placeholder="Vehicle ID to add"
                            value={vehicleIdInput}
                            onChange={(e) => setVehicleIdInput(e.target.value)}
                            className="flex-1"
                          />
                          <Button variant="secondary" size="sm" onClick={() => addVehicleToFleet(fleet.id)} className="gap-1">
                            <Plus className="w-3 h-3" /> Add
                          </Button>
                        </div>
                      </div>

                      {/* Recent Sessions */}
                      {a && a.recentSessions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Sync Sessions</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-white/5">
                                  <th className="text-left py-2 text-xs text-gray-500 font-medium">Driver</th>
                                  <th className="text-left py-2 text-xs text-gray-500 font-medium">Vehicle</th>
                                  <th className="text-left py-2 text-xs text-gray-500 font-medium">Status</th>
                                  <th className="text-left py-2 text-xs text-gray-500 font-medium">Started</th>
                                </tr>
                              </thead>
                              <tbody>
                                {a.recentSessions.slice(0, 10).map((s) => (
                                  <tr key={s.id} className="border-b border-white/5">
                                    <td className="py-2 text-white">{s.driver.user.name}</td>
                                    <td className="py-2 text-gray-400">{s.vehicle.year} {s.vehicle.make} {s.vehicle.model}</td>
                                    <td className="py-2">
                                      <Badge variant={s.status === "COMPLETED" ? "success" : s.status === "ACTIVE" ? "info" : "warning"}>
                                        {s.status}
                                      </Badge>
                                    </td>
                                    <td className="py-2 text-gray-400">{new Date(s.startedAt).toLocaleDateString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
