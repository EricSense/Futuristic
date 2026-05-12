"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Logo, LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Fingerprint,
  Car,
  Building2,
  ArrowRight,
  Shield,
  RefreshCw,
  Gauge,
  Globe,
  ChevronRight,
  Play,
  Lock,
  Brain,
  Zap,
  Eye,
  Accessibility,
  Cloud,
  Cpu,
  TrendingUp,
  Users,
  ShieldCheck,
  Layers,
  Compass,
  Network,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/30 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-sky-500/5 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-28 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <LogoMark size={88} />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08]">
            This car knows
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
              ME.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed">
            The Digital Driving Identity Platform. A portable identity layer
            for the future of mobility.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo">
              <Button size="lg" className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                <Play className="w-5 h-5" /> Try the Demo
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== THE CORE INSIGHT ===== */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">The Core Insight</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Cars are becoming smarter.
              <br />
              <span className="text-gray-400">But the driving experience is still tied to the vehicle.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              "Every new car requires relearning",
              "Preferences stay trapped inside one vehicle",
              "Shared mobility feels impersonal",
              "EV and autonomous adoption are slowed by unfamiliarity",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-white/5 bg-surface-50 p-4">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 flex-shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                </div>
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl text-white font-semibold">The future is identity-centered mobility.</p>
            <p className="text-gray-400 mt-2">Your environment should recognize you, not the other way around.</p>
          </div>
        </div>
      </section>

      {/* ===== PARADIGM SHIFT ===== */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3 text-center">The Paradigm Shift</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="rounded-2xl border border-white/5 bg-surface-50 p-8">
              <div className="text-xs font-medium uppercase tracking-wider text-red-400 mb-4">Old Paradigm</div>
              <p className="text-2xl font-bold text-white mb-1">&ldquo;This is MY car.&rdquo;</p>
              <p className="text-sm text-gray-500 mb-6">Ownership defines experience.</p>
              <ul className="space-y-3">
                {[
                  "Settings stored in one vehicle",
                  "Switching vehicles resets familiarity",
                  "Every car feels different",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-400/50" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-8 shadow-lg shadow-sky-600/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-[60px]" />
              <div className="relative">
                <div className="text-xs font-medium uppercase tracking-wider text-sky-400 mb-4">New Paradigm</div>
                <p className="text-2xl font-bold text-white mb-1">&ldquo;This car knows ME.&rdquo;</p>
                <p className="text-sm text-sky-300/70 mb-6">Identity defines experience.</p>
                <ul className="space-y-3">
                  {[
                    "Your identity travels with you",
                    "Every vehicle adapts instantly",
                    "Mobility becomes continuous and familiar",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE PROBLEM ===== */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">The Hidden Barrier to Future Mobility</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Zap, text: "Fear of unfamiliar EV systems" },
              { icon: Brain, text: "Anxiety around autonomous vehicles" },
              { icon: Layers, text: "Inconsistent interfaces between brands" },
              { icon: Car, text: "Shared/rental vehicles feel temporary" },
              { icon: Accessibility, text: "Accessibility settings need constant reconfiguration" },
              { icon: Users, text: "Human mobility is person-centric, but cars aren't" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 rounded-xl border border-white/5 bg-surface-50 p-5">
                <Icon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-sky-500/10 bg-sky-500/5 p-6 text-center">
            <p className="text-white font-medium">Current mobility is vehicle-centric.</p>
            <p className="text-sky-300 font-semibold mt-1">Human mobility should be person-centric.</p>
          </div>
        </div>
      </section>

      {/* ===== THE SOLUTION ===== */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">The Solution</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Digital Driving Identity</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              A secure cloud-based identity layer that instantly personalizes any connected vehicle.
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="rounded-2xl border border-white/10 bg-surface-50 p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white mx-auto mb-4">
                  <Fingerprint className="h-7 w-7" />
                </div>
                <p className="font-semibold text-white text-lg mb-1">You enter the car.</p>
              </div>

              <div className="hidden md:flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" style={{ animationDuration: "4s" }} />
                  <span className="text-xs text-sky-400 font-medium">Identity Sync</span>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6 text-center shadow-lg shadow-sky-600/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white mx-auto mb-4">
                  <Car className="h-7 w-7" />
                </div>
                <p className="font-semibold text-white text-lg mb-1">The car becomes yours.</p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Fingerprint, title: "Personal Environment Profile", desc: "Seat, mirrors, climate, audio, driving mode, accessibility -- every preference synced instantly." },
              { icon: ShieldCheck, title: "Safety & Driving Preferences", desc: "Steering feel, braking behavior, assist levels, and alert configurations follow you." },
              { icon: Brain, title: "AI Adaptation Layer", desc: "Mobility history powers continuous learning. The system gets better every time you drive." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-white/5 bg-surface-50 p-6">
                <Icon className="w-6 h-6 text-sky-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/demo">
              <Button size="lg" className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                <Play className="w-5 h-5" /> See It In Action
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY NOW ===== */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">Why Now</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Industry Timing Is Perfect</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { icon: Zap, label: "EV Adoption" },
              { icon: Network, label: "Connected Vehicles" },
              { icon: Brain, label: "AI Copilots" },
              { icon: Compass, label: "Autonomous Driving" },
              { icon: Cpu, label: "Vehicle Software Platforms" },
              { icon: Users, label: "Shared Mobility" },
              { icon: Fingerprint, label: "Digital Identity Infra" },
              { icon: Cloud, label: "Cloud-Native Cars" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl border border-white/5 bg-surface-50 p-4 text-center group hover:border-sky-500/20 transition-colors">
                <Icon className="w-6 h-6 text-sky-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-300 font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xl text-white font-semibold">Cars are becoming software-defined.</p>
            <p className="text-sky-300 mt-1 font-medium">Identity becomes the operating system for mobility.</p>
          </div>
        </div>
      </section>

      {/* ===== MARKET OPPORTUNITY ===== */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">Market Opportunity</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Massive Cross-Industry Platform</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">Applicable To</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Personal Vehicles", "Robotaxis", "Rentals", "Fleet Vehicles", "Ride-Sharing", "Subscription Mobility", "Commercial Transport"].map((t) => (
                  <div key={t} className="flex items-center gap-2 rounded-lg bg-surface-50 border border-white/5 px-3 py-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <span className="text-sm text-gray-300">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">Potential Partners</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Automakers", "Mobility Providers", "Insurance Companies", "Smart City Ecosystems", "Enterprise Fleets"].map((t) => (
                  <div key={t} className="flex items-center gap-2 rounded-lg bg-surface-50 border border-white/5 px-3 py-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span className="text-sm text-gray-300">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPETITIVE ADVANTAGE ===== */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">Competitive Advantage</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Existing Systems Store Preferences.
              <br />
              <span className="text-sky-400">Futuristic Owns Identity.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-white/5 bg-surface-50 p-8">
              <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-6">Current Systems</h3>
              <ul className="space-y-4">
                {[
                  "Vehicle-specific profiles",
                  "Limited portability",
                  "Brand-locked ecosystems",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-gray-400">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 flex-shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-8">
              <h3 className="text-sm font-medium uppercase tracking-wider text-sky-400 mb-6">Futuristic</h3>
              <ul className="space-y-4">
                {[
                  "Cross-vehicle identity portability",
                  "AI-driven adaptation",
                  "Universal mobility layer",
                  "Human-centered experience architecture",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-white">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 flex-shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-400">We are not building another car platform.</p>
            <p className="text-white font-semibold text-lg mt-1">We are building the identity layer for transportation.</p>
          </div>
        </div>
      </section>

      {/* ===== VISION FOR AUTONOMOUS MOBILITY ===== */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">Vision for Autonomous Mobility</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Autonomous Cars Need Human Context</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              In a driverless future, the vehicle matters less. The occupant matters more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Globe, label: "Your mobile environment" },
              { icon: Cpu, label: "Your productivity space" },
              { icon: Play, label: "Your entertainment ecosystem" },
              { icon: Accessibility, label: "Your accessibility interface" },
              { icon: Brain, label: "Your personal AI mobility companion" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl border border-sky-500/10 bg-sky-500/5 p-5 flex items-center gap-3">
                <Icon className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <span className="text-sm text-gray-200">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-white font-medium">The future car is temporary.</p>
            <p className="text-sky-300 font-semibold text-lg mt-1">Your identity is permanent.</p>
          </div>
        </div>
      </section>

      {/* ===== PRIVACY & TRUST ===== */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">Privacy & Trust</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Identity Without Compromising Security</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Lock, label: "User-owned data" },
              { icon: Eye, label: "Permission-based sharing" },
              { icon: ShieldCheck, label: "End-to-end encryption" },
              { icon: Fingerprint, label: "Portable identity controls" },
              { icon: Shield, label: "Transparency and consent" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl border border-white/5 bg-surface-50 p-5 flex items-center gap-3">
                <Icon className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-white font-semibold">Personalization must never sacrifice privacy.</p>
          </div>
        </div>
      </section>

      {/* ===== LONG-TERM VISION ===== */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">Long-Term Vision</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">The Universal Mobility Passport</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Globe, label: "Cross-border transportation identity" },
              { icon: Shield, label: "Insurance portability" },
              { icon: Accessibility, label: "Adaptive accessibility profiles" },
              { icon: Brain, label: "AI travel assistants" },
              { icon: Building2, label: "Smart city integration" },
              { icon: Map, label: "Seamless multimodal transportation" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="group rounded-xl border border-white/5 bg-surface-50 p-5 flex items-center gap-3 hover:border-sky-500/20 transition-colors">
                <Icon className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl text-white font-semibold">One identity.</p>
            <p className="text-sky-300 font-medium text-lg mt-1">Infinite mobility experiences.</p>
          </div>
        </div>
      </section>

      {/* ===== DEMO CTA ===== */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 to-surface-50 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-[80px]" />
            <div className="relative">
              <LogoMark size={56} className="mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Futuristic
              </h2>
              <p className="text-lg text-sky-300 font-medium mb-6">
                The operating system for human mobility.
              </p>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                The future of transportation is not about owning smarter cars.
                It is about creating cars that instantly understand people.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/demo">
                  <Button size="lg" className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                    <Play className="w-5 h-5" /> Try the Demo
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                    Create Your Identity <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/demo" className="hover:text-white transition-colors">Demo</Link>
              <Link href="/register" className="hover:text-white transition-colors">Get Started</Link>
              <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            </div>
            <p className="text-sm text-gray-600">
              The operating system for human mobility.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
