"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  Smartphone,
  Cloud,
  Car,
  Bot,
  ArrowRight,
  Play,
  RotateCcw,
  Radio,
  ShieldCheck,
  FileKey,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "approach" | "challenge" | "verify" | "vp" | "adapt" | "done";

const RUN_PHASES: { key: Phase; durationMs: number }[] = [
  { key: "approach", durationMs: 900 },
  { key: "challenge", durationMs: 1000 },
  { key: "verify", durationMs: 1200 },
  { key: "vp", durationMs: 1000 },
  { key: "adapt", durationMs: 900 },
];

const PHASE_LABELS: Record<Phase, string> = {
  idle: "Idle",
  approach: "Person approaches vehicle",
  challenge: "Vehicle requests DDI proof",
  verify: "Futuristic verifies holder + policies",
  vp: "Verifiable presentation returned",
  adapt: "Cabin + AI adapt to this person",
  done: "Ready to drive",
};

const LOG_LINES: Record<Phase, string[]> = {
  idle: [],
  approach: ["[vehicle] proximity sensor: person at curb", "[vehicle] BLE + UWB: DDI-capable device detected"],
  challenge: [
    "[vehicle] → [federation] POST /v1/presentations/request",
    "[federation] challenge_id=ch_8f2a… expires_in=30s",
  ],
  verify: [
    "[federation] holder session OK · biometric match",
    "[federation] license + insurance bindings valid for this trip",
  ],
  vp: [
    "[federation] → [vehicle] VP signed (W3C VC profile)",
    "claims: identity, insurance, accessibility, language, ai_tone",
  ],
  adapt: ["[vehicle] cabin profile applied", "[vehicle] in-cabin AI loaded with holder context"],
  done: ["[vehicle] status=READY · This car knows ME."],
};

const ORDER: Phase[] = ["idle", "approach", "challenge", "verify", "vp", "adapt", "done"];

function phaseRank(p: Phase): number {
  return ORDER.indexOf(p);
}

interface NodeProps {
  active: boolean;
  done: boolean;
  icon: React.ReactNode;
  label: string;
  sub: string;
}

function FlowNode({ active, done, icon, label, sub }: NodeProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center rounded-xl border px-2 py-3 transition-all duration-300 min-w-0 flex-1 max-w-[100px] sm:max-w-none",
        done && "border-emerald-500/40 bg-emerald-500/10",
        active && !done && "border-sky-400/60 bg-sky-500/15 shadow-lg shadow-sky-500/10",
        !active && !done && "border-white/5 bg-surface-100/40 opacity-50",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg mb-1.5",
          done && "bg-emerald-500/20 text-emerald-300",
          active && !done && "bg-sky-500/25 text-sky-200",
          !active && !done && "bg-surface-200 text-gray-500",
        )}
      >
        {icon}
      </div>
      <span className="text-[9px] sm:text-[10px] font-semibold text-white leading-tight">{label}</span>
      <span className="text-[8px] text-gray-500 leading-tight mt-0.5 hidden sm:block">{sub}</span>
    </div>
  );
}

export function DDIFlowVisualizer() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const r = phaseRank(phase);

  const you = { active: phase === "approach", done: r > phaseRank("approach") };
  const phone = { active: phase === "challenge", done: r > phaseRank("challenge") };
  const fed = { active: phase === "verify" || phase === "vp", done: r > phaseRank("vp") };
  const vehicle = { active: phase === "adapt", done: phase === "done" };
  const cabin = { active: phase === "adapt", done: phase === "done" };

  const run = () => {
    clearTimers();
    setRunning(true);
    setPhase("idle");
    setLog([]);

    let delay = 100;
    RUN_PHASES.forEach((step, i) => {
      timers.current.push(
        setTimeout(() => {
          setPhase(step.key);
          setLog((prev) => [...prev, ...LOG_LINES[step.key]]);
        }, delay),
      );
      delay += step.durationMs;
    });

    timers.current.push(
      setTimeout(() => {
        setPhase("done");
        setLog((prev) => [...prev, ...LOG_LINES.done]);
        setRunning(false);
      }, delay + 400),
    );
  };

  const reset = () => {
    clearTimers();
    setRunning(false);
    setPhase("idle");
    setLog([]);
  };

  return (
    <Card className="border-sky-500/15 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-sky-400 font-semibold mb-1">
            How DDI works
          </p>
          <h3 className="text-lg font-bold text-white">The recognition handshake</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md">
            Your DDI never lives inside the car. The vehicle asks the Futuristic federation for a
            time-limited proof. The cabin adapts from that proof &mdash; identity, insurance,
            accessibility, language, AI tone.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={run}
            disabled={running}
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
          >
            <Play className="w-3.5 h-3.5" />
            {running ? "Running…" : "Run simulation"}
          </Button>
          <Button variant="secondary" size="sm" onClick={reset} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex items-stretch justify-between gap-1 sm:gap-2 mb-4">
        <FlowNode done={you.done} active={you.active} icon={<User className="w-4 h-4" />} label="You" sub="Holder" />
        <ArrowSlot active={you.active} />
        <FlowNode done={phone.done} active={phone.active} icon={<Smartphone className="w-4 h-4" />} label="Phone" sub="DDI wallet" />
        <ArrowSlot active={phone.active || fed.active} />
        <FlowNode done={fed.done} active={fed.active} icon={<Cloud className="w-4 h-4" />} label="Futuristic" sub="Federation" />
        <ArrowSlot active={phase === "vp"} />
        <FlowNode done={vehicle.done} active={vehicle.active} icon={<Car className="w-4 h-4" />} label="Vehicle" sub="Recognition" />
        <ArrowSlot active={vehicle.active || cabin.done} />
        <FlowNode done={cabin.done} active={cabin.active && phase !== "done"} icon={<Bot className="w-4 h-4" />} label="Cabin AI" sub="Adapts" />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {RUN_PHASES.map((p, i) => {
          const pr = phaseRank(phase);
          const tr = phaseRank(p.key);
          const done = pr > tr || phase === "done";
          const active = phase === p.key;
          return (
            <span
              key={p.key}
              className={cn(
                "text-[9px] sm:text-[10px] rounded-full px-2 py-0.5 font-medium border",
                done && "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                active && "border-sky-400/50 bg-sky-500/15 text-sky-200",
                !done && !active && "border-white/5 text-gray-600",
              )}
            >
              {i + 1}. {PHASE_LABELS[p.key]}
            </span>
          );
        })}
      </div>

      <div className="hidden sm:flex items-center justify-center gap-6 text-[10px] text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Radio className="w-3 h-3 text-sky-400" /> Challenge / response
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified at federation
        </span>
        <span className="flex items-center gap-1">
          <FileKey className="w-3 h-3 text-amber-400" /> VP to vehicle
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-400" /> Cabin adapts
        </span>
      </div>

      <div className="rounded-lg border border-white/5 bg-black/40 font-mono text-[10px] sm:text-[11px] p-3 h-36 overflow-y-auto text-gray-300">
        {log.length === 0 ? (
          <span className="text-gray-600">
            Press &ldquo;Run simulation&rdquo; to see messages flow between you, your DDI, Futuristic, and the vehicle.
          </span>
        ) : (
          log.map((line, idx) => (
            <div key={`${idx}-${line.slice(0, 24)}`} className="leading-relaxed border-b border-white/5 py-0.5 last:border-0">
              {line}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

function ArrowSlot({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center px-0.5 sm:px-1 flex-shrink-0">
      <ArrowRight className={cn("w-3 h-3 sm:w-4 sm:h-4 transition-colors", active ? "text-sky-400 animate-pulse" : "text-gray-700")} />
    </div>
  );
}
