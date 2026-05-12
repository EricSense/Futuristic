"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Fingerprint,
  Car,
  Building2,
  ArrowRight,
  Shield,
  RefreshCw,
  Gauge,
  Smartphone,
  Globe,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Fingerprint,
    title: "Digital Driving Identity",
    description:
      "Your seat position, mirror angles, climate preferences, and driving modes -- all stored in a portable digital profile that travels with you.",
  },
  {
    icon: RefreshCw,
    title: "Instant Vehicle Sync",
    description:
      "Step into any connected vehicle and your preferences apply automatically. The car adapts to you, not the other way around.",
  },
  {
    icon: Shield,
    title: "Graceful Degradation",
    description:
      "Our sync engine intelligently maps your preferences to each vehicle's capabilities. When a feature isn't supported, it adapts gracefully.",
  },
  {
    icon: Building2,
    title: "Fleet Intelligence",
    description:
      "Fleet operators get real-time analytics on driver-vehicle interactions, utilization patterns, and sync session insights.",
  },
  {
    icon: Gauge,
    title: "Performance Profiles",
    description:
      "Sport, comfort, or eco -- your driving mode follows you. Steering feel, regenerative braking, and suspension all sync to your taste.",
  },
  {
    icon: Smartphone,
    title: "Accessibility First",
    description:
      "Voice control, large fonts, high contrast, parking assists -- accessibility preferences are first-class citizens in your identity.",
  },
];

const roles = [
  {
    icon: Fingerprint,
    title: "Drivers",
    description: "Create your digital identity and bring it to any vehicle. Never adjust a seat again.",
    cta: "Create Identity",
    href: "/register",
    gradient: "from-brand-600 to-indigo-600",
  },
  {
    icon: Car,
    title: "Vehicle Owners",
    description: "Register your vehicles and define their capabilities. Make them Futuristic-ready.",
    cta: "Register Vehicles",
    href: "/register",
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    icon: Building2,
    title: "Fleet Operators",
    description: "Manage fleets at scale. Track which drivers sync to which vehicles, when, and how.",
    cta: "Manage Fleets",
    href: "/register",
    gradient: "from-amber-600 to-orange-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-brand-600/5 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 mb-8">
            <Zap className="w-4 h-4 text-brand-400" />
            <span className="text-sm text-brand-300">The future of personal mobility</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            The car doesn&apos;t define you.
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              You define the car.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
            Futuristic separates your driving identity from any physical vehicle.
            Your preferences, your comfort, your accessibility needs -- they follow you
            into every car you enter.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base px-8">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Paradigm Shift Visual */}
          <div className="mt-20 mx-auto max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-white/5 bg-surface-50 p-6 text-left">
                <div className="text-xs font-medium uppercase tracking-wider text-red-400 mb-3">Old Paradigm</div>
                <p className="text-lg font-semibold text-white mb-2">&ldquo;This is MY car&rdquo;</p>
                <p className="text-sm text-gray-400">
                  Your comfort settings are locked to a single vehicle. Rent a car? Start over. 
                  Share a vehicle? Compromise. Buy a new car? Re-learn everything.
                </p>
              </div>
              <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-6 text-left shadow-lg shadow-brand-600/5">
                <div className="text-xs font-medium uppercase tracking-wider text-brand-400 mb-3">New Paradigm</div>
                <p className="text-lg font-semibold text-white mb-2">&ldquo;This car knows ME&rdquo;</p>
                <p className="text-sm text-gray-300">
                  Your identity exists independently. Step into any Futuristic-connected vehicle 
                  and it instantly becomes your environment. Every time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">How Futuristic works</h2>
            <p className="mt-3 text-gray-400 max-w-xl mx-auto">Three steps to a driving experience that follows you everywhere.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Build Your Identity", desc: "Configure your preferences across six categories: seating, mirrors, climate, infotainment, driving mode, and accessibility." },
              { step: "02", title: "Connect to a Vehicle", desc: "Select any Futuristic-enabled vehicle. Our sync engine maps your preferences to its specific capabilities." },
              { step: "03", title: "Drive in Your World", desc: "The vehicle adapts to you instantly. Unsupported features degrade gracefully with clear feedback." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-surface-200 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 border-t border-white/5 bg-surface-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Built for the future</h2>
            <p className="mt-3 text-gray-400 max-w-xl mx-auto">
              Every feature designed around one idea: your identity should be portable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-xl border border-white/5 bg-surface-50 p-6 transition-all hover:border-brand-500/20 hover:shadow-lg hover:shadow-brand-600/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10 text-brand-400 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Join the platform</h2>
            <p className="mt-3 text-gray-400 max-w-xl mx-auto">
              Whether you&apos;re a driver, vehicle owner, or fleet operator -- Futuristic has a place for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.title}
                  className="group rounded-xl border border-white/10 bg-surface-50 p-8 transition-all hover:border-white/20 hover:shadow-xl"
                >
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white mb-5", role.gradient)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{role.title}</h3>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">{role.description}</p>
                  <Link href={role.href}>
                    <Button variant="secondary" className="w-full gap-2 group-hover:bg-surface-300">
                      {role.cta} <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EV Adoption Banner */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-950/50 to-surface-50 p-12">
            <Globe className="mx-auto h-10 w-10 text-brand-400 mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Accelerating the future of mobility
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              The biggest barrier to electric vehicles and autonomous driving isn&apos;t technology -- 
              it&apos;s the fear of the unfamiliar. When every vehicle instantly understands you, 
              that barrier disappears. Futuristic changes everything.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base px-8">
                Start Building Your Identity <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white">Futuristic</span>
            </div>
            <p className="text-sm text-gray-500">
              Digital Driving Identity Platform. The car doesn&apos;t define you.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
