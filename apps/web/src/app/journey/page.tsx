"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useDDI, SAMPLE_DDI, type DDI } from "@/lib/ddi-context";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Train,
  Plane,
  Bike,
  Building2,
  Fingerprint,
  Shield,
  Globe,
  Accessibility,
  Bot,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowRight,
  Languages,
  Wallet,
  Network,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CredentialKey =
  | "identity"
  | "license"
  | "insurance"
  | "accessibility"
  | "language"
  | "payment"
  | "smart-city"
  | "ai-assistant"
  | "border";

interface CredentialEvent {
  key: CredentialKey;
  icon: LucideIcon;
  title: string;
  detail: (p: DDI) => string;
}

interface Stop {
  id: string;
  time: string;
  city: string;
  country: string;
  flag: string;
  mode: string;
  modeIcon: LucideIcon;
  operator: string;
  action: string;
  events: CredentialEvent[];
  outcome: (p: DDI) => string;
  durationSec: number;
}

const CREDENTIAL_META: Record<CredentialKey, { color: string; label: string }> = {
  identity: { color: "text-sky-300 bg-sky-500/10 border-sky-500/20", label: "Identity" },
  license: { color: "text-blue-300 bg-blue-500/10 border-blue-500/20", label: "License" },
  insurance: { color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20", label: "Insurance" },
  accessibility: { color: "text-purple-300 bg-purple-500/10 border-purple-500/20", label: "Accessibility" },
  language: { color: "text-amber-300 bg-amber-500/10 border-amber-500/20", label: "Language" },
  payment: { color: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20", label: "Payment" },
  "smart-city": { color: "text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/20", label: "Smart City" },
  "ai-assistant": { color: "text-rose-300 bg-rose-500/10 border-rose-500/20", label: "AI Assistant" },
  border: { color: "text-yellow-300 bg-yellow-500/10 border-yellow-500/20", label: "Border" },
};

const STOPS: Stop[] = [
  {
    id: "robotaxi-sf",
    time: "07:42",
    city: "San Francisco",
    country: "USA",
    flag: "US",
    mode: "Robotaxi",
    modeIcon: Car,
    operator: "Waymo",
    action: "You approach a Waymo at the curb. The vehicle has never seen you before.",
    durationSec: 1.2,
    events: [
      { key: "identity", icon: Fingerprint, title: "Identity verified", detail: (p) => `DDI ${p.id.split("-").slice(0, 2).join("-")}… recognized via biometric handshake` },
      { key: "license", icon: Globe, title: "License attached", detail: () => "California Driver License accepted by Waymo" },
      { key: "insurance", icon: Shield, title: "Insurance auto-bound", detail: (p) => `${p.insurance[0]?.carrier} rideshare policy active` },
      { key: "accessibility", icon: Accessibility, title: "Accessibility profile loaded", detail: (p) => p.accessibility.mobility === "wheelchair" ? "Wheelchair-accessible vehicle dispatched, ramp deployed" : "Cabin layout matched to profile" },
      { key: "ai-assistant", icon: Bot, title: "AI assistant briefed", detail: (p) => `Tone: ${p.aiPersona.tone}. Morning context loaded.` },
    ],
    outcome: () => "Vehicle adapted to you in 1.2s. Zero apps. Zero typing.",
  },
  {
    id: "bart",
    time: "08:15",
    city: "BART · Powell St Station",
    country: "USA",
    flag: "US",
    mode: "Subway",
    modeIcon: Train,
    operator: "BART Bay Area",
    action: "You tap the turnstile with your phone.",
    durationSec: 0.6,
    events: [
      { key: "identity", icon: Fingerprint, title: "Transit credential verified", detail: () => "BART recognized your DDI as a permitted rider" },
      { key: "payment", icon: Wallet, title: "Fare auto-charged", detail: (p) => `Charged to ${p.payment.primary}` },
      { key: "smart-city", icon: Building2, title: "Smart city handoff", detail: () => "Connected city routing optimized your transfer" },
      { key: "accessibility", icon: Accessibility, title: "Accessible path lit", detail: (p) => p.accessibility.mobility ? "Elevator route highlighted, wide gate opened" : "Standard route confirmed" },
    ],
    outcome: () => "Tap → ride. Routing knew where you're going next.",
  },
  {
    id: "border-sfo",
    time: "10:30",
    city: "SFO Terminal 2 → HND",
    country: "USA → Japan",
    flag: "US/JP",
    mode: "Cross-border flight",
    modeIcon: Plane,
    operator: "ANA + TSA + Japan Immigration",
    action: "You walk to the boarding gate. No paper boarding pass. No identity scan line.",
    durationSec: 8,
    events: [
      { key: "border", icon: Globe, title: "Cross-border identity verified", detail: () => "TSA + Japan immigration pre-cleared via DDI federation" },
      { key: "insurance", icon: Shield, title: "Travel insurance auto-extended", detail: (p) => `${p.insurance[1]?.carrier ?? p.insurance[0].carrier} extended to JP for 14 days` },
      { key: "accessibility", icon: Accessibility, title: "Accessibility relay sent", detail: (p) => p.accessibility.mobility ? "ANA cabin crew briefed: wheelchair user, aisle assistance" : "ANA cabin: standard seating preferences shared" },
      { key: "language", icon: Languages, title: "Language switch staged", detail: (p) => p.languages.includes("ja") ? "AI assistant pre-warmed in Japanese" : "Japanese translation layer attached" },
    ],
    outcome: () => "Border crossed in 8 seconds. No forms. No re-verification.",
  },
  {
    id: "robotaxi-tokyo",
    time: "14:50",
    city: "Tokyo · Haneda Airport",
    country: "Japan",
    flag: "JP",
    mode: "Robotaxi",
    modeIcon: Car,
    operator: "ZMP Tokyo",
    action: "You hail a Tokyo robotaxi. You have never used this operator. You don't speak Japanese.",
    durationSec: 1.4,
    events: [
      { key: "identity", icon: Fingerprint, title: "International recognition", detail: (p) => `DDI verified by ZMP via cross-carrier federation. No app installed.` },
      { key: "insurance", icon: Shield, title: "Reciprocal coverage active", detail: (p) => `${p.insurance[0].carrier} valid in Japan via carrier reciprocity` },
      { key: "accessibility", icon: Accessibility, title: "Accessibility honored", detail: (p) => p.accessibility.mobility ? "Ramp deployed before you arrive" : "Cabin pre-configured" },
      { key: "ai-assistant", icon: Bot, title: "AI assistant in Japanese", detail: (p) => p.languages.includes("ja") ? "Native Japanese, your tone preserved" : "Real-time interpretation, your tone preserved" },
    ],
    outcome: () => "Welcome to Tokyo. The car already knew you.",
  },
  {
    id: "scooter",
    time: "18:20",
    city: "Shibuya District",
    country: "Japan",
    flag: "JP",
    mode: "E-scooter",
    modeIcon: Bike,
    operator: "Lime Japan",
    action: "You scan a Lime e-scooter for a 6-block evening ride.",
    durationSec: 0.4,
    events: [
      { key: "license", icon: Globe, title: "International permit verified", detail: () => "AAA International Driving Permit recognized in JP" },
      { key: "insurance", icon: Shield, title: "Micro-insurance attached", detail: () => "Per-minute coverage bound for this trip" },
      { key: "smart-city", icon: Building2, title: "Smart city safety layer", detail: () => "Helmet zone alert, Shibuya speed-limit profile loaded" },
      { key: "payment", icon: Wallet, title: "Yen payment routed", detail: (p) => `${p.payment.primary} charged in JPY automatically` },
    ],
    outcome: () => "Fourth mode of the day. Same identity. No friction.",
  },
  {
    id: "hotel",
    time: "21:45",
    city: "Hotel · Tokyo",
    country: "Japan",
    flag: "JP",
    mode: "Arrived",
    modeIcon: Compass,
    operator: "Day complete",
    action: "You arrive at your hotel. Your DDI logs the journey.",
    durationSec: 0.3,
    events: [
      { key: "identity", icon: Fingerprint, title: "Day summary signed to your DDI", detail: () => "Verifiable record stored. Selectively shareable." },
      { key: "ai-assistant", icon: Bot, title: "AI assistant ready for tomorrow", detail: () => "Local context retained for morning planning" },
    ],
    outcome: () => "5 modes. 2 countries. 1 identity. Zero friction.",
  },
];

type Phase = "intro" | "live" | "complete";

export default function JourneyPage() {
  const { ddi } = useDDI();
  const activeDDI = ddi ?? SAMPLE_DDI;

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentStop, setCurrentStop] = useState(0);
  const [revealedEvents, setRevealedEvents] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = STOPS[currentStop];
  const stopsCompleted = phase === "complete" ? STOPS.length : currentStop;

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useEffect(() => {
    if (phase !== "live") return;
    if (!stop) return;
    if (revealedEvents < stop.events.length) {
      timerRef.current = setTimeout(() => setRevealedEvents((n) => n + 1), 650);
    } else if (autoplay) {
      timerRef.current = setTimeout(() => advanceStop(), 1800);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, revealedEvents, currentStop, autoplay]);

  const begin = (autoplayMode = false) => {
    setAutoplay(autoplayMode);
    setPhase("live");
    setCurrentStop(0);
    setRevealedEvents(0);
  };

  const advanceStop = () => {
    if (currentStop + 1 >= STOPS.length) {
      setPhase("complete");
      return;
    }
    setCurrentStop((s) => s + 1);
    setRevealedEvents(0);
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("intro");
    setCurrentStop(0);
    setRevealedEvents(0);
    setAutoplay(false);
  };

  const totals = useMemo(() => {
    const completedStops = STOPS.slice(0, stopsCompleted);
    const events = completedStops.flatMap((s) => s.events);
    const modes = new Set(completedStops.map((s) => s.mode)).size;
    const countries = new Set(completedStops.map((s) => s.country.split(" → ").pop()!)).size;
    const operators = new Set(completedStops.map((s) => s.operator)).size;
    const insurers = new Set(events.filter((e) => e.key === "insurance").map((e) => e.title)).size;
    const friction = completedStops.reduce((sum, s) => sum + s.durationSec, 0);
    return {
      modes,
      countries,
      operators,
      verifications: events.length,
      insurers,
      friction: Math.round(friction * 10) / 10,
      apps: 0,
      retypes: 0,
    };
  }, [stopsCompleted]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 mb-4">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs text-sky-300 font-semibold tracking-wide uppercase">
              Live Prototype · A Day of Vehicles That Know You
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Every vehicle, every mode &mdash; instant recognition.
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            One DDI. Five modes. Two countries. Six operators. Zero unfamiliar moments.
            {!ddi && <> &nbsp;Using sample DDI for <span className="text-sky-300 font-medium">{SAMPLE_DDI.holderName}</span>.</>}
          </p>
        </div>

        {/* DDI BAR */}
        <Card className="mb-6 border-sky-500/10">
          <div className="flex items-center gap-4">
            <LogoMark size={36} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white truncate">{activeDDI.holderName}</span>
                <Badge variant="info">DDI Active</Badge>
                {!ddi && <Badge variant="warning">Sample</Badge>}
              </div>
              <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">{activeDDI.id}</p>
            </div>
            {!ddi && (
              <Link href="/ddi">
                <Button variant="ghost" size="sm" className="gap-1.5 text-sky-400 hover:text-sky-300">
                  <Fingerprint className="w-3.5 h-3.5" /> Use yours
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* INTRO */}
        {phase === "intro" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">The Day Ahead</h2>
              <div className="space-y-2">
                {STOPS.map((s, i) => {
                  const Icon = s.modeIcon;
                  return (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg border border-white/5 bg-surface-100/60 p-3">
                      <div className="text-[11px] font-mono text-sky-400 w-12">{s.time}</div>
                      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{s.city}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {s.mode} &middot; {s.operator}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500">{s.flag}</span>
                      {i < STOPS.length - 1 && <ArrowRight className="w-3 h-3 text-gray-600" />}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="border-sky-500/20 bg-gradient-to-br from-sky-950/30 to-surface-50">
              <h2 className="text-lg font-semibold text-white mb-3">Run the Prototype</h2>
              <p className="text-sm text-gray-400 mb-6">
                Watch credentials from your DDI fire at every step. No apps installed. No re-typing. No re-verifications.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => begin(false)}
                  size="lg"
                  className="w-full gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
                >
                  <Play className="w-4 h-4" /> Start (manual)
                </Button>
                <Button
                  onClick={() => begin(true)}
                  variant="secondary"
                  size="lg"
                  className="w-full gap-2"
                >
                  <Play className="w-4 h-4" /> Autoplay
                </Button>
              </div>
              <p className="text-[11px] text-gray-500 mt-4 text-center">
                Manual mode lets you advance each stop yourself.
              </p>
            </Card>
          </div>
        )}

        {/* LIVE */}
        {phase === "live" && stop && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* TIMELINE SIDEBAR */}
            <div className="lg:col-span-1 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 px-1">Itinerary</p>
              {STOPS.map((s, i) => {
                const Icon = s.modeIcon;
                const isPast = i < currentStop;
                const isActive = i === currentStop;
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 transition-all",
                      isActive && "border-sky-500/40 bg-sky-500/10 shadow-lg shadow-sky-500/5",
                      isPast && "border-emerald-500/20 bg-emerald-500/5 opacity-70",
                      !isActive && !isPast && "border-white/5 bg-surface-100/40 opacity-50",
                    )}
                  >
                    <div className="text-[10px] font-mono text-sky-400 w-10 flex-shrink-0">{s.time}</div>
                    <Icon className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isActive && "text-sky-300",
                      isPast && "text-emerald-400",
                      !isActive && !isPast && "text-gray-500",
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{s.city}</p>
                      <p className="text-[10px] text-gray-500 truncate">{s.mode}</p>
                    </div>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  </div>
                );
              })}

              <div className="pt-4">
                <Button variant="ghost" size="sm" onClick={reset} className="w-full gap-1.5 text-gray-500">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </Button>
              </div>
            </div>

            {/* MAIN STAGE */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-sky-500/20 bg-gradient-to-br from-sky-950/40 to-surface-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <stop.modeIcon className="w-5 h-5 text-sky-300" />
                      <span className="text-xs font-mono text-sky-400">{stop.time}</span>
                      <Badge variant="info" className="text-[10px]">{stop.flag}</Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{stop.city}</h2>
                    <p className="text-sm text-gray-400">
                      {stop.mode} &middot; {stop.operator}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">Stop</p>
                    <p className="text-sm font-mono text-white">
                      {currentStop + 1}/{STOPS.length}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{stop.action}</p>
              </Card>

              {/* CREDENTIAL EVENTS */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 px-1">
                  DDI credentials firing
                </p>
                {stop.events.map((event, idx) => {
                  const isRevealed = idx < revealedEvents;
                  const meta = CREDENTIAL_META[event.key];
                  const Icon = event.icon;
                  return (
                    <div
                      key={`${stop.id}-${idx}`}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 transition-all duration-300",
                        isRevealed
                          ? "border-white/10 bg-surface-100 opacity-100 translate-y-0"
                          : "border-white/5 bg-surface-100/30 opacity-30 translate-y-1",
                      )}
                    >
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border flex-shrink-0", meta.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">{event.title}</span>
                          <Badge variant="info" className="text-[9px] uppercase tracking-wider">
                            {meta.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{event.detail(activeDDI)}</p>
                      </div>
                      {isRevealed && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />}
                    </div>
                  );
                })}
              </div>

              {/* OUTCOME + ADVANCE */}
              {revealedEvents >= stop.events.length && (
                <Card className="border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{stop.outcome(activeDDI)}</p>
                        <p className="text-xs text-gray-400">Friction: {stop.durationSec}s</p>
                      </div>
                    </div>
                    {!autoplay && (
                      <Button
                        onClick={advanceStop}
                        className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
                      >
                        {currentStop + 1 >= STOPS.length ? "Finish journey" : "Continue journey"}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                    {autoplay && (
                      <span className="text-xs text-gray-500 animate-pulse">Auto-advancing…</span>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* COMPLETE */}
        {phase === "complete" && (
          <div className="space-y-6">
            <Card className="border-sky-500/30 bg-gradient-to-br from-sky-950/50 via-surface-50 to-surface-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
              <div className="relative text-center py-6">
                <LogoMark size={56} className="mx-auto mb-4" />
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Every car along the way knew you.
                </h2>
                <p className="text-lg text-sky-300 font-medium mb-6">
                  Nothing was unfamiliar. Nothing required learning.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
                  <SummaryStat label="Modes" value={totals.modes} />
                  <SummaryStat label="Countries" value={totals.countries} />
                  <SummaryStat label="Operators" value={totals.operators} />
                  <SummaryStat label="Verifications" value={totals.verifications} />
                  <SummaryStat label="Insurance carriers" value={totals.insurers} />
                  <SummaryStat label="Apps installed" value={totals.apps} accent />
                  <SummaryStat label="Re-typed details" value={totals.retypes} accent />
                  <SummaryStat label="Total friction" value={`${totals.friction}s`} accent />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Network className="w-4 h-4 text-sky-400" /> What just happened
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex gap-2"><span className="text-sky-400">→</span> Your DDI carried verified identity, license, insurance, accessibility, languages, and payment across every operator.</li>
                <li className="flex gap-2"><span className="text-sky-400">→</span> Two countries, four insurance carriers, and six operators all federated to the same identity layer.</li>
                <li className="flex gap-2"><span className="text-sky-400">→</span> No app downloads. No account creations. No re-uploaded documents. No retyping.</li>
                <li className="flex gap-2"><span className="text-sky-400">→</span> Vehicles, transit, borders, and cities all <em>recognized you</em> &mdash; instantly.</li>
              </ul>
            </Card>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={reset} variant="secondary" size="lg" className="gap-2">
                <RotateCcw className="w-4 h-4" /> Run again
              </Button>
              <Link href="/ddi">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                  <Fingerprint className="w-4 h-4" /> {ddi ? "View my DDI" : "Create your own DDI"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border p-4", accent ? "border-sky-500/30 bg-sky-500/10" : "border-white/10 bg-surface-100/60")}>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
      <p className={cn("text-2xl font-bold font-mono", accent ? "text-sky-300" : "text-white")}>{value}</p>
    </div>
  );
}
