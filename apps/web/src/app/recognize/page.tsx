"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useDDI, SAMPLE_DDI, type DDI } from "@/lib/ddi-context";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Fingerprint,
  Shield,
  Globe,
  Accessibility,
  Bot,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowRight,
  Eye,
  Radio,
  ScanLine,
  Sparkles,
  Languages,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "detecting" | "handshake" | "verifying" | "context" | "welcoming";

interface PhaseConfig {
  key: Phase;
  label: string;
  icon: LucideIcon;
  durationMs: number;
  description: string;
}

const PHASES: PhaseConfig[] = [
  { key: "detecting", label: "Detecting", icon: Eye, durationMs: 900, description: "Vehicle perceives a person approaching" },
  { key: "handshake", label: "DDI Handshake", icon: Radio, durationMs: 1100, description: "Encrypted credential exchange initiated" },
  { key: "verifying", label: "Identity Verified", icon: ScanLine, durationMs: 1100, description: "Federated identity confirmed across trust networks" },
  { key: "context", label: "Context Loaded", icon: Sparkles, durationMs: 1100, description: "Person's needs, language, and assistant tone retrieved" },
  { key: "welcoming", label: "Person Recognized", icon: CheckCircle2, durationMs: 0, description: "The car understands who you are" },
];

const PHASE_INDEX: Record<Phase, number> = { idle: -1, detecting: 0, handshake: 1, verifying: 2, context: 3, welcoming: 4 };

interface FactCard {
  icon: LucideIcon;
  label: string;
  value: (p: DDI) => string;
  revealAt: number;
}

const FACTS: FactCard[] = [
  { icon: Fingerprint, label: "Identity", value: (p) => p.holderName, revealAt: 1 },
  { icon: Globe, label: "Origin", value: (p) => p.homeCity, revealAt: 1 },
  { icon: Shield, label: "Insurance", value: (p) => p.insurance[0]?.carrier ?? "Bound on demand", revealAt: 2 },
  {
    icon: Accessibility,
    label: "Needs honored",
    value: (p) => {
      const k = Object.entries(p.accessibility);
      if (k.length === 0) return "No special needs declared";
      return k.map(([k, v]) => `${cap(k)}: ${cap(String(v))}`).join(" · ");
    },
    revealAt: 3,
  },
  { icon: Languages, label: "Language", value: (p) => p.languages.map((l) => l.toUpperCase()).join(" · "), revealAt: 3 },
  { icon: Bot, label: "AI tone", value: (p) => cap(p.aiPersona.tone), revealAt: 3 },
  { icon: Wallet, label: "Payment", value: (p) => p.payment.primary, revealAt: 3 },
];

function cap(s: string) {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function greetingFor(p: DDI): string {
  const ja = p.languages.includes("ja");
  const tone = p.aiPersona.tone;
  const first = p.holderName.split(" ")[0] || p.holderName;
  if (tone === "warm") {
    return ja
      ? `${first}さん、おかえりなさい。`
      : `Welcome back, ${first}. Everything is ready for you.`;
  }
  if (tone === "playful") {
    return ja ? `やあ ${first}！準備完了！` : `Hey ${first}. Buckle up — let's roll.`;
  }
  return ja ? `${first}さん、確認しました。` : `Identified: ${first}. Cabin ready.`;
}

export default function RecognizePage() {
  const { ddi } = useDDI();
  const activeDDI = ddi ?? SAMPLE_DDI;

  const [phase, setPhase] = useState<Phase>("idle");
  const [distance, setDistance] = useState(100); // 100% = far, 0% = inside
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => clearAllTimers(), []);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const start = () => {
    clearAllTimers();
    setPhase("detecting");
    setDistance(100);

    // Animate distance from 100 to 0 over total phase duration
    const totalMs = PHASES.reduce((sum, p) => sum + p.durationMs, 0);
    const stepMs = 60;
    const steps = Math.floor(totalMs / stepMs);
    for (let i = 1; i <= steps; i++) {
      timersRef.current.push(
        setTimeout(() => setDistance(Math.max(0, 100 - (i / steps) * 100)), i * stepMs),
      );
    }

    // Schedule phase transitions
    let cumulative = 0;
    for (let i = 0; i < PHASES.length - 1; i++) {
      cumulative += PHASES[i].durationMs;
      const next = PHASES[i + 1].key;
      timersRef.current.push(setTimeout(() => setPhase(next), cumulative));
    }
  };

  const reset = () => {
    clearAllTimers();
    setPhase("idle");
    setDistance(100);
  };

  const phaseIdx = PHASE_INDEX[phase];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 mb-4">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs text-sky-300 font-semibold tracking-wide uppercase">
              Vehicle Perspective &middot; The car&apos;s POV
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            This car knows ME.
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Watch a vehicle recognize a person it has never met &mdash; using only their DDI.
            {!ddi && (
              <> Using sample DDI for <span className="text-sky-300 font-medium">{SAMPLE_DDI.holderName}</span>.</>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* VEHICLE VIEWPORT */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative aspect-[5/3] rounded-2xl border border-sky-500/20 bg-gradient-to-br from-surface-100 via-surface to-sky-950/40 overflow-hidden">
              {/* Grid floor (perspective effect) */}
              <div className="absolute inset-0 opacity-20">
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(56,189,248,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.4) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    transform: "perspective(400px) rotateX(60deg)",
                    transformOrigin: "bottom",
                  }}
                />
              </div>

              {/* Scan lines */}
              {phase !== "idle" && phase !== "welcoming" && (
                <>
                  <div className="absolute inset-x-0 h-px bg-sky-400/60 animate-scan" style={{ animation: "scan 1.6s ease-in-out infinite" }} />
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-full border border-sky-400/30"
                    style={{
                      width: `${300 - distance * 1.5}px`,
                      height: `${300 - distance * 1.5}px`,
                      transition: "all 60ms linear",
                    }}
                  />
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-full border border-sky-400/40"
                    style={{
                      width: `${200 - distance * 1.2}px`,
                      height: `${200 - distance * 1.2}px`,
                      transition: "all 60ms linear",
                    }}
                  />
                </>
              )}

              {/* HUD top bar */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-sky-300/80">
                <div className="flex items-center gap-2">
                  <Car className="w-3 h-3" />
                  <span>WAYMO-7K · CABIN A</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>DDI//FED</span>
                  <span className={cn("h-1.5 w-1.5 rounded-full", phase === "idle" ? "bg-gray-600" : "bg-sky-400 animate-pulse")} />
                </div>
              </div>

              {/* Center figure (the person silhouette + status text) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                {phase === "idle" ? (
                  <>
                    <Car className="w-14 h-14 text-gray-600 mb-3" />
                    <p className="text-gray-500 text-sm">Vehicle is idle. Awaiting approach.</p>
                  </>
                ) : phase === "welcoming" ? (
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 mb-4 shadow-lg shadow-sky-500/40">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{activeDDI.holderName}</p>
                    <p className="text-sm text-sky-300">Person recognized · Cabin ready</p>
                  </>
                ) : (
                  <>
                    <div
                      className="rounded-full bg-sky-400/80 transition-all duration-700 mb-4"
                      style={{
                        width: `${20 + (100 - distance) * 0.3}px`,
                        height: `${20 + (100 - distance) * 0.3}px`,
                        boxShadow: `0 0 ${30 + (100 - distance) * 0.5}px rgba(56,189,248,0.6)`,
                      }}
                    />
                    <p className="text-xs font-mono text-sky-200 uppercase tracking-widest">
                      {PHASES[phaseIdx]?.label}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 max-w-xs">
                      {PHASES[phaseIdx]?.description}
                    </p>
                    <p className="text-[10px] font-mono text-gray-600 mt-3">
                      Distance: {Math.round(distance)}%
                    </p>
                  </>
                )}
              </div>

              {/* HUD bottom bar - phase pipeline */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center justify-between gap-1">
                  {PHASES.map((p, i) => {
                    const Icon = p.icon;
                    const isActive = i === phaseIdx;
                    const isPast = i < phaseIdx;
                    return (
                      <div
                        key={p.key}
                        className={cn(
                          "flex-1 rounded border px-1.5 py-1 transition-all flex items-center justify-center gap-1",
                          isActive && "border-sky-400 bg-sky-500/20 text-sky-200",
                          isPast && "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
                          !isActive && !isPast && "border-white/10 bg-surface/40 text-gray-600",
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        <span className="text-[9px] font-mono uppercase tracking-wider hidden sm:inline">
                          {p.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {phase === "idle" && (
                <Button
                  onClick={start}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
                >
                  <Play className="w-4 h-4" />
                  Approach the vehicle
                </Button>
              )}
              {phase === "welcoming" && (
                <>
                  <Button onClick={reset} variant="secondary" className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Replay
                  </Button>
                  <Link href="/journey">
                    <Button className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                      Take a full journey <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </>
              )}
              {phase !== "idle" && phase !== "welcoming" && (
                <Button onClick={reset} variant="ghost" size="sm" className="gap-1.5 text-gray-500">
                  <RotateCcw className="w-3.5 h-3.5" /> Cancel
                </Button>
              )}
            </div>

            {/* AI greeting card */}
            {phase === "welcoming" && (
              <Card className="border-sky-500/20 bg-gradient-to-br from-sky-950/30 to-surface-50">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-sky-400 font-semibold mb-1">
                      In-cabin AI
                    </p>
                    <p className="text-lg text-white font-medium leading-snug">
                      &ldquo;{greetingFor(activeDDI)}&rdquo;
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Spoken in <span className="text-gray-300">{activeDDI.languages[0].toUpperCase()}</span> ·
                      Tone: <span className="text-gray-300">{cap(activeDDI.aiPersona.tone)}</span>
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* WHAT THE CAR LEARNS */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 px-1">
              What the car learns &mdash; in real time
            </p>

            {FACTS.map((fact, i) => {
              const Icon = fact.icon;
              const isRevealed = phaseIdx >= fact.revealAt;
              return (
                <div
                  key={fact.label}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 transition-all duration-500",
                    isRevealed
                      ? "border-sky-500/20 bg-sky-500/5 opacity-100 translate-x-0"
                      : "border-white/5 bg-surface-100/30 opacity-30 translate-x-2",
                  )}
                >
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0", isRevealed ? "bg-sky-500/20 text-sky-300" : "bg-surface-200 text-gray-600")}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">{fact.label}</p>
                    <p className={cn("text-sm font-medium mt-0.5", isRevealed ? "text-white" : "text-gray-700")}>
                      {isRevealed ? fact.value(activeDDI) : "—"}
                    </p>
                  </div>
                  {isRevealed && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-1" />
                  )}
                </div>
              );
            })}

            {/* Trust panel */}
            <Card className="mt-4 border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Trust handshake
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">DDI ID</span>
                <span className="text-sky-300 font-mono text-xs truncate ml-2">
                  {activeDDI.id.split("-").slice(0, 3).join("-")}…
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-300">Trust score</span>
                <span className="text-white font-mono">{activeDDI.trustScore}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-300">Federation</span>
                <Badge variant="info" className="text-[10px]">{activeDDI.trustedNetworks.length} networks</Badge>
              </div>
            </Card>

            <p className="text-xs text-gray-600 px-1">
              The car never stored your data. It received a verifiable, time-limited proof of who
              you are and what you need &mdash; and adapted accordingly.
            </p>
          </div>
        </div>

        {/* CTA tail */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            This is what &ldquo;cars that instantly understand people&rdquo; looks like in practice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/journey">
              <Button variant="secondary" className="gap-2">
                See it across a full day
              </Button>
            </Link>
            {!ddi && (
              <Link href="/ddi">
                <Button className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                  <Fingerprint className="w-4 h-4" /> Create your DDI
                </Button>
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
