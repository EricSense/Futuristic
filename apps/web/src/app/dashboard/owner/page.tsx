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
import { Select } from "@/components/ui/select";
import { Car, Plus, X, Settings, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleCapability {
  id: string;
  category: string;
  supportedRange: Record<string, any>;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: string;
  capabilities: VehicleCapability[];
}

const defaultCapabilities: Record<string, Record<string, any>> = {
  seat: { position: { min: 0, max: 10 }, lumbar: { min: 0, max: 5 }, height: { min: 0, max: 8 }, tilt: { min: 0, max: 5 }, heatingLevel: { min: 0, max: 3 } },
  mirror: { leftAngleH: { min: -30, max: 30 }, leftAngleV: { min: -15, max: 15 }, rightAngleH: { min: -30, max: 30 }, rightAngleV: { min: -15, max: 15 }, rearviewDim: { options: [true, false] } },
  climate: { temperature: { min: 60, max: 85 }, fanSpeed: { min: 1, max: 7 }, dualZone: { options: [true, false] } },
  infotainment: { volume: { min: 0, max: 20 }, bassLevel: { min: 0, max: 10 }, trebleLevel: { min: 0, max: 10 }, preferredSource: { options: ["bluetooth", "radio", "usb", "streaming"] } },
  drivingMode: { preferred: { options: ["comfort", "sport", "eco", "custom"] }, steeringFeel: { options: ["light", "normal", "heavy"] }, regenerativeBraking: { options: ["low", "moderate", "high"] } },
};

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

const statusVariant: Record<string, "success" | "danger" | "warning"> = {
  ACTIVE: "success", INACTIVE: "danger", MAINTENANCE: "warning",
};

export default function OwnerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);
  const [formData, setFormData] = useState({ make: "", model: "", year: 2025, vin: "" });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadVehicles = useCallback(async () => {
    try {
      const res = await api.get<Vehicle[]>("/api/vehicles");
      if (res.data) setVehicles(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) loadVehicles();
  }, [user, authLoading, router, loadVehicles]);

  const addVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      const res = await api.post<Vehicle>("/api/vehicles", formData);
      if (res.data) {
        for (const [category, supportedRange] of Object.entries(defaultCapabilities)) {
          await api.post(`/api/vehicles/${res.data.id}/capabilities`, { category, supportedRange });
        }
        await loadVehicles();
        setShowAddForm(false);
        setFormData({ make: "", model: "", year: 2025, vin: "" });
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (vehicleId: string, status: string) => {
    try {
      await api.patch(`/api/vehicles/${vehicleId}/status`, { status });
      await loadVehicles();
    } catch {}
  };

  const deleteVehicle = async (vehicleId: string) => {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await api.delete(`/api/vehicles/${vehicleId}`);
      await loadVehicles();
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
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Vehicle Registry</h1>
            <p className="text-gray-400 mt-1">Register and manage your vehicles on the Futuristic platform</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? "Cancel" : "Add Vehicle"}
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Register New Vehicle</CardTitle>
              <CardDescription>Add a vehicle to make it available on the platform</CardDescription>
            </CardHeader>
            {formError && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {formError}
              </div>
            )}
            <form onSubmit={addVehicle} className="grid grid-cols-2 gap-4">
              <Input id="make" label="Make" placeholder="e.g. Tesla" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} required />
              <Input id="model" label="Model" placeholder="e.g. Model 3" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
              <Input id="year" label="Year" type="number" min={2000} max={2030} value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} required />
              <Input id="vin" label="VIN" placeholder="17-character VIN" value={formData.vin} onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })} maxLength={17} required />
              <div className="col-span-2">
                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? "Registering..." : "Register Vehicle"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {vehicles.length === 0 ? (
          <Card className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No vehicles registered</h3>
            <p className="text-gray-400 text-sm">Add your first vehicle to get started.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {vehicles.map((v) => (
              <Card key={v.id} className="overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-200">
                      <Car className="h-6 w-6 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{v.year} {v.make} {v.model}</h3>
                      <p className="text-xs text-gray-500 font-mono">{v.vin}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      id={`status-${v.id}`}
                      value={v.status}
                      onChange={(e) => updateStatus(v.id, e.target.value)}
                      options={statusOptions}
                      className="w-36"
                    />
                    <Badge variant={statusVariant[v.status] || "default"}>{v.status}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedVehicle(expandedVehicle === v.id ? null : v.id)}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      {expandedVehicle === v.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteVehicle(v.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {expandedVehicle === v.id && (
                  <div className="mt-6 border-t border-white/5 pt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Vehicle Capabilities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {v.capabilities.map((cap) => (
                        <div key={cap.id} className="rounded-lg bg-surface-100 border border-white/5 p-3">
                          <div className="text-xs font-medium text-brand-400 uppercase tracking-wider mb-2">
                            {cap.category}
                          </div>
                          <div className="space-y-1">
                            {Object.entries(cap.supportedRange).map(([key, val]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-gray-400">{key}</span>
                                <span className="text-gray-300 font-mono">
                                  {"min" in (val as any)
                                    ? `${(val as any).min}-${(val as any).max}`
                                    : (val as any).options?.join(", ")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
