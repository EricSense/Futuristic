"use client";

import Link from "next/link";
import Image from "next/image";
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
  Smartphone,
  Globe,
  ChevronRight,
  Play,
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
    gradient: "from-sky-500 to-blue-600",
  },
  {
    icon: Car,
    title: "Vehicle Owners",
    description: "Register your vehicles and define their capabilities. Make them Futuristic-ready.",
    cta: "Register Vehicles",
    href: "/register",
    gradient: "from-cyan-500 to-sky-600",
  },
  {
    icon: Building2,
    title: "Fleet Operators",
    description: "Manage fleets at scale. Track which drivers sync to which vehicles, when, and how.",
    cta: "Manage Fleets",
    href: "/register",
    gradient: "from-blue-500 to-indigo-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/30 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-sky-500/5 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <LogoMark size={80} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 mb-8">
            <span className="text-sm text-sky-300 font-medium">Digital Driving Identity Platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            This car knows
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
              ME.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
            Your identity, preferences, and needs exist independently of any physical vehicle.
            You bring yourself to any car, and it instantly becomes your environment.
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
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-6 text-left shadow-lg shadow-sky-600/5">
                <div className="text-xs font-medium uppercase tracking-wider text-sky-400 mb-3">Futuristic</div>
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

      {/* Interactive Demo CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 to-surface-50 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-[80px]" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/20">
                  <Play className="h-8 w-8 text-sky-400" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                See it in action
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Watch a driver&apos;s digital identity sync to a Tesla Model 3 in real time.
                See which preferences apply, which get clamped to vehicle limits, and which
                aren&apos;t supported -- all happening instantly.
              </p>
              <Link href="/demo">
                <Button size="lg" className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                  Launch Interactive Demo <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
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
                  className="group rounded-xl border border-white/5 bg-surface-50 p-6 transition-all hover:border-sky-500/20 hover:shadow-lg hover:shadow-sky-600/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
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
          <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/50 to-surface-50 p-12">
            <Globe className="mx-auto h-10 w-10 text-sky-400 mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Accelerating the future of mobility
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              The biggest barrier to electric vehicles and autonomous driving isn&apos;t technology --
              it&apos;s the fear of the unfamiliar. When every vehicle instantly understands you,
              that barrier disappears. Futuristic changes everything.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
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
            <Logo size="sm" />
            <p className="text-sm text-gray-500">
              Digital Driving Identity Platform. This car knows ME.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
