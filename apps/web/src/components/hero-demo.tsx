"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Eye, Radio, ScanLine, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "scanning" | "handshake" | "recognized";

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Awaiting approach",
  scanning: "Detecting person",
  handshake: "DDI handshake",
  recognized: "Person recognized",
};

const PHASE_ICON = { idle: Car, scanning: Eye, handshake: Radio, recognized: CheckCircle2 };

export function HeroDemo() {
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const reset = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase("idle");
  };

  const run = () => {
    if (!name.trim()) return;
    reset();
    setPhase("scanning");
    timersRef.current.push(setTimeout(() => setPhase("handshake"), 800));
    timersRef.current.push(setTimeout(() => setPhase("recognized"), 1700));
  };

  const Icon = PHASE_ICON[phase];
  const firstName = name.trim().split(/\s+/)[0] || "Friend";

  return (
    <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 via-surface-50 to-surface-50 p-5 sm:p-6 shadow-2xl shadow-sky-950/40 max-w-md mx-auto w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px]" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-sky-300/80 uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            DDI&nbsp;//&nbsp;Live demo
          </div>
          {phase !== "idle" && (
            <button
              onClick={reset}
              className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-300 font-mono"
            >
              Reset
            </button>
          )}
        </div>

        {/* Vehicle viewport */}
        <div className="relative h-44 rounded-xl border border-white/5 bg-surface/60 overflow-hidden mb-4">
          {/* perspective grid */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-x-0 bottom-0 h-1/2"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(56,189,248,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                transform: "perspective(300px) rotateX(60deg)",
                transformOrigin: "bottom",
              }}
            />
          </div>

          {/* scan line */}
          {(phase === "scanning" || phase === "handshake") && (
            <div
              className="absolute inset-x-0 h-px bg-sky-400/70"
              style={{ animation: "scan 1.4s ease-in-out infinite" }}
            />
          )}

          {/* center figure */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
            {phase === "idle" && (
              <>
                <Car className="w-10 h-10 text-gray-600 mb-2" />
                <p className="text-[11px] text-gray-500">Vehicle is idle. Tell it who&apos;s coming.</p>
              </>
            )}
            {(phase === "scanning" || phase === "handshake") && (
              <>
                <div
                  className={cn(
                    "rounded-full bg-sky-400/80 mb-2 transition-all duration-700",
                    phase === "handshake" ? "w-12 h-12" : "w-8 h-8",
                  )}
                  style={{
                    boxShadow:
                      phase === "handshake"
                        ? "0 0 60px rgba(56,189,248,0.7)"
                        : "0 0 30px rgba(56,189,248,0.5)",
                  }}
                />
                <p className="text-[10px] font-mono text-sky-200 uppercase tracking-widest flex items-center gap-1.5">
                  <Icon className="w-3 h-3" /> {PHASE_LABEL[phase]}
                </p>
              </>
            )}
            {phase === "recognized" && (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 mb-2 shadow-lg shadow-sky-500/50">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-base font-bold text-white leading-tight">
                  &ldquo;Welcome, {firstName}.&rdquo;
                </p>
                <p className="text-[10px] text-sky-300 mt-0.5">Cabin ready &middot; AI briefed</p>
              </>
            )}
          </div>

          {/* HUD strip */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-gray-500">
            <span>WAYMO-7K</span>
            <span className={cn(phase === "recognized" && "text-emerald-400")}>
              {phase === "idle" ? "STANDBY" : phase === "recognized" ? "BOUND" : "ACTIVE"}
            </span>
          </div>
        </div>

        {/* Input + action */}
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="Your name"
            className="flex-1 rounded-lg border border-white/10 bg-surface-100 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/20"
            disabled={phase === "scanning" || phase === "handshake"}
          />
          <Button
            onClick={run}
            disabled={!name.trim() || phase === "scanning" || phase === "handshake"}
            className="gap-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Approach
          </Button>
        </div>

        {phase === "recognized" && (
          <Link
            href="/journey"
            className="mt-3 flex items-center justify-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            See this happen across a full day <ArrowRight className="w-3 h-3" />
          </Link>
        )}
        {phase === "idle" && (
          <p className="mt-3 text-[11px] text-gray-500 text-center">
            <ScanLine className="w-3 h-3 inline mr-1" />
            Type any name. Watch the car know you in under 2 seconds.
          </p>
        )}
      </div>
    </div>
  );
}
