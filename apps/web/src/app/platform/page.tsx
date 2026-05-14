"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Car,
  Building2,
  Shield,
  Network,
  Code2,
  Cpu,
  Globe,
  Plug,
  CheckCircle2,
  ArrowRight,
  Fingerprint,
  Compass,
  Lock,
  Eye,
  Users,
  type LucideIcon,
} from "lucide-react";

interface Persona {
  icon: LucideIcon;
  title: string;
  tagline: string;
  bullets: string[];
}

const PERSONAS: Persona[] = [
  {
    icon: Car,
    title: "OEMs & Vehicle Makers",
    tagline: "Make every vehicle DDI-aware out of the box.",
    bullets: [
      "Drop-in SDK for any infotainment OS",
      "Cabin adapts to the person, not the trim",
      "New buyers feel at home from second one",
      "Future-proof for autonomy and shared use",
    ],
  },
  {
    icon: Building2,
    title: "Mobility Operators",
    tagline: "Zero-onboarding friction for every rider.",
    bullets: [
      "No app downloads, no account creation",
      "Robotaxi, rental, rideshare, transit — same identity",
      "Recover lost time spent on signups",
      "Cross-operator loyalty without lock-in",
    ],
  },
  {
    icon: Shield,
    title: "Insurance Carriers",
    tagline: "Insurance that follows the person.",
    bullets: [
      "Bind coverage in milliseconds across vehicles",
      "Carrier reciprocity across borders",
      "Per-trip and per-mode micro-policies",
      "Real-time risk scoring with verified context",
    ],
  },
  {
    icon: Globe,
    title: "Cities & Governments",
    tagline: "Smart city integration without the silos.",
    bullets: [
      "Standardized credentials for transit, parking, charging",
      "Accessibility profiles propagate across infrastructure",
      "Cross-border identity reciprocity",
      "Privacy-preserving usage analytics",
    ],
  },
];

interface Step {
  num: string;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  { num: "01", title: "Join the federation", desc: "Become a Trusted Network. Issue, accept, or relay DDI credentials." },
  { num: "02", title: "Plug in the SDK", desc: "Drop the DDI handshake into your vehicle, app, gate, or kiosk." },
  { num: "03", title: "Recognize people", desc: "Every interaction starts with a verified person, not a stranger." },
  { num: "04", title: "Adapt instantly", desc: "Cabin, coverage, language, accessibility — configured in milliseconds." },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-sky-500/5 blur-[140px]" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 mb-6">
            <Network className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs text-sky-300 font-semibold tracking-wide uppercase">
              The Mobility Identity Network
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Build your business
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
              on the DDI network.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed">
            Futuristic operates the federation that lets every vehicle, operator, insurer, and
            city instantly understand the people they serve.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/recognize">
              <Button
                size="lg"
                className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
              >
                See it work <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="mailto:partners@futuristic.example">
              <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                Talk to partnerships
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* NETWORK STATS BAR */}
      <section className="border-b border-white/5 py-10 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "5", label: "Modes federated" },
              { value: "2", label: "Continents" },
              { value: "6", label: "Launch operators" },
              { value: "<1s", label: "Recognition latency" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-bold text-white font-mono">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="py-20 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              For every actor in mobility
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              One network. Every stakeholder.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PERSONAS.map(({ icon: Icon, title, tagline, bullets }) => (
              <Card key={title} className="hover:border-sky-500/20 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{title}</h3>
                    <p className="text-sm text-sky-300/80">{tagline}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO INTEGRATE */}
      <section className="py-20 border-b border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              Integration in four steps
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              From handshake to adaptation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <div key={s.num} className="rounded-xl border border-white/5 bg-surface-50 p-5">
                <div className="text-3xl font-bold bg-gradient-to-b from-sky-400 to-sky-600 bg-clip-text text-transparent mb-3">
                  {s.num}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDK SAMPLE */}
      <section className="py-20 border-b border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              Developer-first
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              The handshake, in 6 lines.
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm">
              Recognize a person in your vehicle, gate, kiosk, or app.
              Everything else &mdash; insurance, accessibility, language &mdash; comes with them.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-surface-200/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[11px] font-mono text-gray-500 ml-2">vehicle-handshake.ts</span>
              <span className="ml-auto flex items-center gap-1 text-[10px] text-sky-400">
                <Code2 className="w-3 h-3" /> @futuristic/ddi-sdk
              </span>
            </div>
            <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
              <code>
                <span className="text-purple-300">import</span>{" "}
                <span className="text-white">{"{ DDI }"}</span>{" "}
                <span className="text-purple-300">from</span>{" "}
                <span className="text-emerald-300">&apos;@futuristic/ddi-sdk&apos;</span>;
                {"\n\n"}
                <span className="text-gray-500">// Vehicle subscribes to nearby DDIs</span>
                {"\n"}
                <span className="text-purple-300">const</span>{" "}
                <span className="text-white">person</span>{" "}
                <span className="text-purple-300">=</span>{" "}
                <span className="text-purple-300">await</span>{" "}
                <span className="text-sky-300">DDI</span>.
                <span className="text-yellow-300">recognize</span>(
                <span className="text-white">{"{ proximity: 'curb' }"}</span>);
                {"\n\n"}
                <span className="text-gray-500">// Adapt to who they are</span>
                {"\n"}
                <span className="text-sky-300">cabin</span>.
                <span className="text-yellow-300">welcome</span>(
                <span className="text-white">person.name</span>,{" "}
                <span className="text-white">person.aiPersona</span>);
                {"\n"}
                <span className="text-sky-300">cabin</span>.
                <span className="text-yellow-300">honor</span>(
                <span className="text-white">person.accessibility</span>);
                {"\n"}
                <span className="text-sky-300">trip</span>.
                <span className="text-yellow-300">bindInsurance</span>(
                <span className="text-white">person.insurance</span>);
              </code>
            </pre>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Cpu, label: "Edge-native SDK" },
              { icon: Plug, label: "REST + WebRTC handshake" },
              { icon: Lock, label: "Verifiable Credentials (W3C VC)" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-white/5 bg-surface-50 p-3">
                <Icon className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span className="text-xs text-gray-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-20 border-b border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              Trust architecture
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Built for an industry that can&apos;t guess
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Lock, label: "End-to-end encrypted" },
              { icon: Eye, label: "Permissioned reads" },
              { icon: Fingerprint, label: "User-revocable" },
              { icon: Users, label: "Decentralized federation" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl border border-white/5 bg-surface-50 p-4 text-center">
                <Icon className="w-5 h-5 text-sky-400 mx-auto mb-2" />
                <span className="text-xs text-gray-300 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 to-surface-50 p-12 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px]" />
            <div className="relative">
              <LogoMark size={48} className="mx-auto mb-5" />
              <h2 className="text-3xl font-bold text-white mb-3">
                Be the first in your category.
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Operators that adopt DDI early become the default for the next billion mobility
                interactions. The network compounds with every actor.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/recognize">
                  <Button
                    size="lg"
                    className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
                  >
                    <Compass className="w-4 h-4" /> See the prototype
                  </Button>
                </Link>
                <a href="mailto:partners@futuristic.example">
                  <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                    Become a partner
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <LogoMark size={20} />
            <span className="font-bold text-white">Futuristic</span>
            <span className="text-[10px] text-sky-400 font-semibold border border-sky-500/20 rounded-full px-1.5 py-0.5 leading-none">
              DDI
            </span>
          </div>
          <p className="text-xs text-gray-600">
            The operating system for human mobility.
          </p>
        </div>
      </footer>
    </div>
  );
}
