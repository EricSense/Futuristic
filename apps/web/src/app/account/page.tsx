"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useDDI } from "@/lib/ddi-context";
import { api } from "@/lib/api";
import type { DriverPreferences } from "@futuristic/shared";
import { Fingerprint, Car, Settings2, ArrowRight, LogOut } from "lucide-react";

export default function AccountPage() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { ddi, apiConnected, refresh } = useDDI();
  const router = useRouter();
  const [climateTemp, setClimateTemp] = useState(72);
  const [seatPosition, setSeatPosition] = useState(7);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .getProfile()
      .then((p) => {
        const t = p.climateConfig?.temperature;
        if (typeof t === "number") setClimateTemp(t);
        const pos = p.seatConfig?.position;
        if (typeof pos === "number") setSeatPosition(pos);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh] text-gray-400">Loading…</div>
      </div>
    );
  }

  async function savePreferences() {
    setSaving(true);
    setMessage("");
    try {
      const prefs: Partial<DriverPreferences> = {
        seatConfig: { position: seatPosition },
        climateConfig: { temperature: climateTemp },
      };
      await api.updateProfile(prefs);
      await refresh();
      setMessage("Preferences saved. Vehicles apply these after DDI recognition.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Driver account</h1>
            <p className="text-gray-400 mt-1">{user?.email}</p>
            {apiConnected && (
              <span className="inline-block mt-2 text-xs text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5">
                API connected
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-gray-400" onClick={() => { logout(); router.push("/"); }}>
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>

        <div className="grid gap-5">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sky-400 mb-3">
              <Fingerprint className="w-5 h-5" />
              <h2 className="font-semibold text-white">Digital Driving Identity</h2>
            </div>
            {ddi ? (
              <>
                <p className="text-white font-medium">{ddi.holderName}</p>
                <p className="text-sm text-gray-400 font-mono mt-1">{ddi.ddiCode}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs rounded-full bg-sky-500/10 text-sky-300 px-2 py-1">Identity</span>
                  <span className="text-xs rounded-full bg-sky-500/10 text-sky-300 px-2 py-1">Preferences</span>
                  <span className="text-xs rounded-full bg-sky-500/10 text-sky-300 px-2 py-1">Needs</span>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm mb-4">No DDI on this account yet.</p>
            )}
            <Link href="/ddi" className="inline-block mt-4">
              <Button variant="secondary" size="sm" className="gap-1">
                {ddi ? "Manage DDI" : "Issue DDI"} <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-5 h-5 text-sky-400" />
              <h2 className="font-semibold text-white">Cabin preferences</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Stored on your driver profile. Applied when a vehicle recognizes your DDI and runs sync.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Seat position (0–10)</label>
                <Input type="number" min={0} max={10} value={seatPosition} onChange={(e) => setSeatPosition(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Climate °F</label>
                <Input type="number" min={60} max={85} value={climateTemp} onChange={(e) => setClimateTemp(Number(e.target.value))} />
              </div>
            </div>
            {message && <p className="text-sm text-sky-300 mt-3">{message}</p>}
            <Button className="mt-4" onClick={savePreferences} disabled={saving}>
              {saving ? "Saving…" : "Save preferences"}
            </Button>
          </Card>

          <Card className="p-6 border-sky-500/20 bg-sky-950/20">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-5 h-5 text-sky-400" />
              <h2 className="font-semibold text-white">Live recognition demo</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Open the vehicle console in another tab, start a challenge, then present your DDI from Recognize.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/vehicle">
                <Button variant="secondary" size="sm">Vehicle console</Button>
              </Link>
              <Link href="/recognize">
                <Button size="sm" className="gap-1 bg-gradient-to-r from-sky-500 to-blue-600 border-0">
                  Present DDI <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
