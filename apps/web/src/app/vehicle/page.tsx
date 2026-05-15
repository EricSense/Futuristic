"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { vehicleApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Car, Radio, ScanLine, CheckCircle2, RotateCcw } from "lucide-react";

type Phase = "idle" | "challenge" | "waiting" | "verified" | "rejected" | "expired";

export default function VehicleConsolePage() {
  const demoVehicleId =
    process.env.NEXT_PUBLIC_DEMO_VEHICLE_ID || "";

  const [vehicleId, setVehicleId] = useState(demoVehicleId);
  const [apiKey, setApiKey] = useState("futuristic-vehicle-demo-key");
  const [phase, setPhase] = useState<Phase>("idle");
  const [challenge, setChallenge] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [vehicleLabel, setVehicleLabel] = useState<string>("");
  const [log, setLog] = useState<string[]>([]);
  const [syncSummary, setSyncSummary] = useState<string>("");

  const canStart = !!vehicleId.trim() && !!apiKey.trim();

  const addLog = (line: string) => setLog((l) => [line, ...l].slice(0, 18));

  const reset = () => {
    setPhase("idle");
    setChallenge("");
    setSessionId("");
    setVehicleLabel("");
    setSyncSummary("");
    setLog([]);
  };

  const [startError, setStartError] = useState("");

  const start = async () => {
    reset();
    setStartError("");
    setPhase("challenge");
    addLog("[vehicle] → [federation] POST /api/federation/challenge");
    try {
      const ch = await vehicleApi.requestChallenge(vehicleId.trim(), apiKey.trim());
      setChallenge(ch.challenge);
      setSessionId(ch.sessionId);
      setVehicleLabel(ch.vehicleLabel);
      addLog(`[federation] session=${ch.sessionId} expires_at=${ch.expiresAt}`);
      setPhase("waiting");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to start challenge";
      setStartError(msg);
      addLog(`[error] ${msg}`);
      setPhase("idle");
    }
  };

  useEffect(() => {
    if (phase !== "waiting" || !challenge) return;
    let stop = false;
    const interval = setInterval(async () => {
      if (stop) return;
      try {
        const s = await vehicleApi.getSession(challenge, apiKey.trim());
        if (s.status === "PRESENTED") addLog("[federation] presentation received");
        if (s.status === "VERIFIED") {
          setPhase("verified");
          addLog("[federation] VERIFIED — sync plan ready");
          if (s.syncPlan?.summary) {
            setSyncSummary(
              `applied ${s.syncPlan.summary.applied} · clamped ${s.syncPlan.summary.clamped} · unsupported ${s.syncPlan.summary.unsupported}`,
            );
          }
        }
        if (s.status === "REJECTED") {
          setPhase("rejected");
          addLog("[federation] REJECTED");
        }
        if (s.status === "EXPIRED") {
          setPhase("expired");
          addLog("[federation] EXPIRED");
        }
      } catch (e) {
        addLog(`[vehicle] poll error: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }, 650);
    return () => {
      stop = true;
      clearInterval(interval);
    };
  }, [phase, challenge, apiKey]);

  const statusPill = useMemo(() => {
    const base = "text-xs font-mono uppercase tracking-widest px-2 py-1 rounded-full border";
    if (phase === "verified") return <span className={cn(base, "text-emerald-400 border-emerald-500/30 bg-emerald-500/10")}>VERIFIED</span>;
    if (phase === "waiting") return <span className={cn(base, "text-sky-300 border-sky-500/30 bg-sky-500/10")}>WAITING</span>;
    if (phase === "rejected") return <span className={cn(base, "text-red-400 border-red-500/30 bg-red-500/10")}>REJECTED</span>;
    if (phase === "expired") return <span className={cn(base, "text-gray-400 border-white/10 bg-white/5")}>EXPIRED</span>;
    return <span className={cn(base, "text-gray-400 border-white/10 bg-white/5")}>IDLE</span>;
  }, [phase]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Vehicle console</h1>
            <p className="text-gray-400 mt-1">
              Simulates an OEM / fleet backend calling the Futuristic federation.
            </p>
          </div>
          <div className="flex items-center gap-2">{statusPill}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 text-sky-300">
              <Car className="w-5 h-5" />
              <h2 className="font-semibold text-white">Handshake</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Vehicle ID</label>
                <Input value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} placeholder="uuid" />
                {!demoVehicleId && (
                  <p className="text-xs text-gray-600 mt-1">
                    Tip: set <code className="text-gray-500">NEXT_PUBLIC_DEMO_VEHICLE_ID</code> from the seed output.
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Vehicle API key</label>
                <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={start} disabled={!canStart || phase === "waiting" || phase === "challenge"} className="gap-2">
                  <Radio className="w-4 h-4" /> Start challenge
                </Button>
                <Button variant="ghost" onClick={reset} className="gap-2 text-gray-400">
                  <RotateCcw className="w-4 h-4" /> Reset
                </Button>
              </div>
              {startError && <p className="text-sm text-red-400">{startError}</p>}

              {challenge && (
                <div className="rounded-xl border border-white/10 bg-surface-50 p-4">
                  <p className="text-xs text-gray-500">Challenge</p>
                  <p className="text-sm text-white font-mono break-all">{challenge}</p>
                  <p className="text-xs text-gray-500 mt-2">Session</p>
                  <p className="text-xs text-gray-400 font-mono break-all">{sessionId}</p>
                  {vehicleLabel && <p className="text-xs text-gray-500 mt-2">{vehicleLabel}</p>}
                </div>
              )}

              {phase === "verified" && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Recognition complete</span>
                  </div>
                  {syncSummary && <p className="text-xs text-emerald-200/90 mt-2">{syncSummary}</p>}
                </div>
              )}

              <div className="rounded-xl border border-white/10 bg-surface-50 p-4">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <ScanLine className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Log</span>
                </div>
                <div className="space-y-1">
                  {log.length === 0 ? (
                    <p className="text-xs text-gray-600">No events yet.</p>
                  ) : (
                    log.map((l, idx) => (
                      <p key={idx} className="text-xs text-gray-500 font-mono break-words">
                        {l}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sky-300 mb-3">
              <h2 className="font-semibold text-white">What to do next</h2>
            </div>
            <ol className="space-y-3 text-sm text-gray-400">
              <li>
                1. Sign in as a driver and issue a DDI:{" "}
                <Link href="/login" className="text-sky-400">/login</Link> →{" "}
                <Link href="/ddi" className="text-sky-400">/ddi</Link>.
              </li>
              <li>
                2. Keep this console open (challenge is now waiting).
              </li>
              <li>
                3. In another tab, open{" "}
                <Link href="/recognize" className="text-sky-400">/recognize</Link> and present the DDI.
              </li>
            </ol>
            <p className="mt-6 text-xs text-gray-600">
              This console is the “vehicle side”; the Recognize page is the “driver side”.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

