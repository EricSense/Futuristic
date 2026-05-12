"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Fingerprint,
  Car,
  Building2,
  ArrowRight,
  Shield,
  RefreshCw,
  Play,
  Lock,
  Brain,
  Zap,
  Eye,
  Accessibility,
  Cloud,
  Cpu,
  Users,
  ShieldCheck,
  Layers,
  Network,
  Map,
  Globe,
  Compass,
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
          <div className="flex justify-center mb-6">
            <LogoMark size={88} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2 mb-8">
            <Fingerprint className="w-4 h-4 text-sky-400" />
            <span className="text-sm text-sky-300 font-semibold tracking-wide">DDI &mdash; Digital Driving Identity</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08]">
            This car knows
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
              ME.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed">
            Your <span className="text-white font-medium">DDI</span> is a portable identity layer that
            instantly personalizes any connected vehicle. You enter the car. The car becomes yours.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo">
              <Button size="lg" className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                <Play className="w-5 h-5" /> See DDI in Action
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                Create Your DDI <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHAT IS DDI ===== */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">What is DDI</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Your Digital Driving Identity
            </h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              DDI is a secure, cloud-based identity layer that carries everything about how you
              drive, ride, and experience a vehicle. It&apos;s the bridge between you and any car.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Fingerprint,
                title: "Personal Environment",
                desc: "Seat position, mirrors, climate, audio, lighting -- your physical comfort profile, encoded and portable.",
              },
              {
                icon: ShieldCheck,
                title: "Safety & Driving DNA",
                desc: "Steering feel, braking behavior, assist levels, alert preferences, driving mode -- your driving character.",
              },
              {
                icon: Brain,
                title: "AI Adaptation Layer",
                desc: "Your DDI learns from every drive. It adapts, refines, and anticipates. The more you use it, the smarter it gets.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/5 bg-surface-50 p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW DDI WORKS ===== */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">How DDI Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Three Seconds to Your World</h2>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create Your DDI",
                  desc: "Build your identity across six dimensions: ergonomics, mirrors, climate, audio, driving character, and accessibility.",
                },
                {
                  step: "02",
                  title: "Approach Any Vehicle",
                  desc: "Your DDI syncs to the vehicle's Identity Sync Engine. The car retrieves who you are and what you need.",
                },
                {
                  step: "03",
                  title: "The Car Knows You",
                  desc: "Every setting adapts. What the vehicle can't match, it degrades gracefully. You're home in any car.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-b from-sky-400 to-sky-600 bg-clip-text text-transparent mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 flex justify-center">
            <Link href="/demo">
              <Button size="lg" className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                <Play className="w-5 h-5" /> Watch a DDI Sync Live
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== THE PARADIGM SHIFT ===== */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-10 text-center">The Paradigm Shift</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-white/5 bg-surface-50 p-8">
              <div className="text-xs font-medium uppercase tracking-wider text-red-400 mb-4">Without DDI</div>
              <p className="text-2xl font-bold text-white mb-1">&ldquo;This is MY car.&rdquo;</p>
              <p className="text-sm text-gray-500 mb-6">Ownership defines experience.</p>
              <ul className="space-y-3">
                {[
                  "Settings trapped in one vehicle",
                  "Every new car requires relearning",
                  "Shared mobility feels impersonal",
                  "EV and autonomous adoption stalled by unfamiliarity",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-400/50 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-8 shadow-lg shadow-sky-600/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-[60px]" />
              <div className="relative">
                <div className="text-xs font-medium uppercase tracking-wider text-sky-400 mb-4">With DDI</div>
                <p className="text-2xl font-bold text-white mb-1">&ldquo;This car knows ME.&rdquo;</p>
                <p className="text-sm text-sky-300/70 mb-6">Identity defines experience.</p>
                <ul className="space-y-3">
                  {[
                    "Your DDI travels with you everywhere",
                    "Every vehicle adapts to you instantly",
                    "Shared cars feel like your own",
                    "New technology feels familiar from the first second",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DDI FOR EVERYONE ===== */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">DDI for Everyone</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">One Identity, Every Vehicle</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { icon: Car, label: "Personal Vehicles" },
              { icon: Compass, label: "Robotaxis" },
              { icon: RefreshCw, label: "Rental Cars" },
              { icon: Building2, label: "Fleet Vehicles" },
              { icon: Users, label: "Ride-Sharing" },
              { icon: Layers, label: "Subscription Mobility" },
              { icon: Network, label: "Commercial Transport" },
              { icon: Globe, label: "Cross-Border Travel" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl border border-white/5 bg-surface-50 p-4 text-center group hover:border-sky-500/20 transition-colors">
                <Icon className="w-6 h-6 text-sky-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-300 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY NOW ===== */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">Why Now</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Cars Are Becoming Software-Defined</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Every force in the industry is converging to make DDI not just possible, but inevitable.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Zap, label: "EV Adoption" },
              { icon: Network, label: "Connected Vehicles" },
              { icon: Brain, label: "AI Copilots" },
              { icon: Compass, label: "Autonomous Driving" },
              { icon: Cpu, label: "Software Platforms" },
              { icon: Users, label: "Shared Mobility" },
              { icon: Fingerprint, label: "Digital Identity" },
              { icon: Cloud, label: "Cloud-Native Cars" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl border border-white/5 bg-surface-50 p-4 text-center">
                <Icon className="w-5 h-5 text-sky-400 mx-auto mb-2" />
                <span className="text-xs text-gray-300 font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xl text-white font-semibold">DDI is the operating system for human mobility.</p>
          </div>
        </div>
      </section>

      {/* ===== COMPETITIVE ADVANTAGE ===== */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">Why DDI Wins</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Others Store Preferences.
              <br />
              <span className="text-sky-400">DDI Owns Identity.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-white/5 bg-surface-50 p-8">
              <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-6">Current Systems</h3>
              {["Vehicle-specific profiles", "Limited portability", "Brand-locked ecosystems", "Static, no learning"].map((t) => (
                <div key={t} className="flex items-center gap-3 text-gray-400 mb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 flex-shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  </div>
                  <span className="text-sm">{t}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-8">
              <h3 className="text-sm font-medium uppercase tracking-wider text-sky-400 mb-6">DDI by Futuristic</h3>
              {["Cross-vehicle identity portability", "AI-driven continuous adaptation", "Universal mobility layer", "Human-centered experience architecture"].map((t) => (
                <div key={t} className="flex items-center gap-3 text-white mb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 flex-shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  </div>
                  <span className="text-sm">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== AUTONOMOUS VISION ===== */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">The Autonomous Future</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              When Cars Drive Themselves,
              <br />DDI Becomes Everything
            </h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              In a driverless future, the vehicle matters less. The occupant matters more.
              Your DDI becomes:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Globe, label: "Your mobile environment" },
              { icon: Cpu, label: "Your productivity space" },
              { icon: Play, label: "Your entertainment ecosystem" },
              { icon: Accessibility, label: "Your accessibility interface" },
              { icon: Brain, label: "Your AI mobility companion" },
              { icon: Shield, label: "Your privacy boundary" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl border border-sky-500/10 bg-sky-500/5 p-5 flex items-center gap-3">
                <Icon className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <span className="text-sm text-gray-200 font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-white font-medium text-lg">The future car is temporary.</p>
            <p className="text-sky-300 font-bold text-xl mt-1">Your DDI is permanent.</p>
          </div>
        </div>
      </section>

      {/* ===== PRIVACY & TRUST ===== */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">Privacy & Trust</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Your DDI, Your Data, Your Rules</h2>
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

      {/* ===== THE UNIVERSAL MOBILITY PASSPORT ===== */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">Long-Term Vision</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              DDI Becomes the Universal Mobility Passport
            </h2>
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
            <p className="text-xl text-white font-semibold">One DDI. One identity.</p>
            <p className="text-sky-300 font-medium text-lg mt-1">Infinite mobility experiences.</p>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 to-surface-50 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-[80px]" />
            <div className="relative">
              <LogoMark size={56} className="mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Futuristic
              </h2>
              <p className="text-lg text-sky-300 font-semibold mb-2">
                DDI &mdash; Digital Driving Identity
              </p>
              <p className="text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
                The future of transportation is not about owning smarter cars.
                It is about creating cars that instantly understand people.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/demo">
                  <Button size="lg" className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                    <Play className="w-5 h-5" /> See DDI in Action
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                    Create Your DDI <ArrowRight className="w-5 h-5" />
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
            <div className="flex items-center gap-3">
              <LogoMark size={24} />
              <span className="font-bold text-white">Futuristic</span>
              <span className="text-xs text-sky-400 font-medium border border-sky-500/20 rounded-full px-2 py-0.5">DDI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/demo" className="hover:text-white transition-colors">Demo</Link>
              <Link href="/register" className="hover:text-white transition-colors">Create DDI</Link>
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
