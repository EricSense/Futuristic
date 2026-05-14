"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { HeroDemo } from "@/components/hero-demo";
import { Button } from "@/components/ui/button";
import {
  Fingerprint,
  ArrowRight,
  Plane,
  Train,
  Bike,
  Car,
  Ship,
  Shield,
  Globe,
  Accessibility,
  Bot,
  Building2,
  Eye,
  Compass,
  Cpu,
  Zap,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/30 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full bg-sky-500/5 blur-[160px]" />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5">
                  <LogoMark size={18} />
                  <span className="text-xs text-sky-300 font-semibold tracking-wide uppercase">
                    Futuristic builds DDI
                  </span>
                </div>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05]">
                From &ldquo;This is MY car&rdquo;
                <br />
                <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                  to &ldquo;This car knows ME.&rdquo;
                </span>
              </h1>

              <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-gray-400 leading-relaxed">
                Futuristic is building <span className="text-white font-medium">Digital Driving Identity</span> &mdash; the
                layer that lets every vehicle instantly understand the person inside.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3">
                <Link href="/recognize">
                  <Button
                    size="lg"
                    className="gap-2 text-base px-7 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
                  >
                    <Eye className="w-5 h-5" /> See full prototype
                  </Button>
                </Link>
                <Link href="/platform">
                  <Button variant="secondary" size="lg" className="gap-2 text-base px-7">
                    Build with us <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <p className="mt-4 text-xs text-gray-500 text-center lg:text-left">
                Try it instantly &mdash; no signup, no install.
              </p>
            </div>

            <div className="lg:col-span-5">
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* MODES STRIP */}
      <section className="border-t border-white/5 py-8 bg-surface-50/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-5">
            One DDI. Every vehicle. Every mode.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Car, label: "Car" },
              { icon: Train, label: "Rail" },
              { icon: Plane, label: "Flight" },
              { icon: Bike, label: "Micro" },
              { icon: Ship, label: "Marine" },
              { icon: Bot, label: "Autonomous" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-gray-500">
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PROTOTYPES */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              Three live prototypes
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Experience DDI</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                href: "/recognize",
                icon: Eye,
                title: "Recognize",
                desc: "From a Waymo's POV: scan, handshake, identify, greet. Watch a car know a stranger in under 2 seconds.",
                cta: "Watch the recognition",
              },
              {
                href: "/journey",
                icon: Compass,
                title: "Journey",
                desc: "San Francisco → Tokyo across 5 modes and 6 operators. One DDI, recognized everywhere.",
                cta: "Take the journey",
              },
              {
                href: "/platform",
                icon: Cpu,
                title: "Platform",
                desc: "For OEMs, mobility operators, insurers, and cities. The network, the SDK, the trust architecture.",
                cta: "Build on DDI",
              },
            ].map(({ href, icon: Icon, title, desc, cta }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl border border-white/10 bg-surface-50 p-7 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{desc}</p>
                <span className="text-sm text-sky-400 font-medium inline-flex items-center gap-1">
                  {cta}{" "}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PARADIGM SHIFT */}
      <section className="py-20 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              The paradigm shift
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Identity defines experience.
              <br />
              <span className="text-gray-500 text-2xl sm:text-3xl font-medium">
                Not ownership. Not the vehicle.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/5 bg-surface-50 p-8">
              <div className="text-xs font-medium uppercase tracking-wider text-red-400 mb-3">
                Yesterday
              </div>
              <p className="text-3xl font-bold text-white mb-4">&ldquo;This is MY car.&rdquo;</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>&middot; Every new vehicle is a stranger</li>
                <li>&middot; Setup, learning, friction with every change</li>
                <li>&middot; The vehicle dictates what you can do</li>
                <li>&middot; Unfamiliar cars feel intimidating</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-[60px]" />
              <div className="relative">
                <div className="text-xs font-medium uppercase tracking-wider text-sky-400 mb-3">
                  With DDI
                </div>
                <p className="text-3xl font-bold text-white mb-4">&ldquo;This car knows ME.&rdquo;</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>&middot; Every vehicle recognizes you instantly</li>
                  <li>&middot; Zero setup, zero learning, zero friction</li>
                  <li>&middot; You define what the vehicle does</li>
                  <li>&middot; Unfamiliar feels familiar from second one</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE INSIGHT */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              The Insight
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              DDI dissolves the
              <br />
              <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                fear of the unfamiliar.
              </span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
              The biggest barrier to electric vehicles and autonomous driving adoption isn&apos;t
              the technology. It&apos;s the unfamiliarity. If every vehicle you enter instantly
              understands you, the barrier disappears.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                tint: "bg-emerald-500/10 text-emerald-400",
                title: "EV adoption",
                desc: "First-time EV drivers shouldn't feel lost. Every EV greets them like an old companion.",
              },
              {
                icon: Bot,
                tint: "bg-purple-500/10 text-purple-300",
                title: "Autonomous trust",
                desc: "People don't fear self-driving cars. They fear the strangeness of one. A robotaxi that knows your name is immediately trustworthy.",
              },
              {
                icon: Users,
                tint: "bg-sky-500/10 text-sky-400",
                title: "Shared mobility",
                desc: "Robotaxis, rentals, fleets, subscriptions — impersonal today. With DDI, a car you've never seen feels exactly as familiar as one you own.",
              },
            ].map(({ icon: Icon, tint, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/5 bg-surface-50 p-7">
                <div
                  className={
                    "flex h-12 w-12 items-center justify-center rounded-xl mb-4 " + tint
                  }
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/30 to-surface-50 p-8 text-center">
            <p className="text-xl text-white font-semibold leading-relaxed">
              The barrier between people and new mobility technologies disappears.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT DDI CARRIES */}
      <section className="py-20 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              What your DDI carries
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              The signals that make a car know you
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Fingerprint, title: "Identity", desc: "Verified once, recognized forever." },
              { icon: Globe, title: "Cross-border licenses", desc: "Recognized in every jurisdiction." },
              { icon: Shield, title: "Portable insurance", desc: "Coverage that follows the person, not the vehicle." },
              { icon: Accessibility, title: "Accessibility honored", desc: "Mobility, vision, hearing needs always respected." },
              { icon: Bot, title: "AI assistant context", desc: "Tone, language, conversational style — ready in every cabin." },
              { icon: Building2, title: "Smart city integration", desc: "Routing, transit credentials, payments — one tap." },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/5 bg-surface-50 p-6 hover:border-sky-500/20 transition-colors"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white text-base mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING MANIFESTO */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <LogoMark size={56} className="mx-auto mb-6" />
          <p className="text-2xl sm:text-3xl text-white font-semibold leading-relaxed">
            The future of transportation is not about owning smarter cars.
          </p>
          <p className="text-2xl sm:text-3xl text-sky-400 font-semibold mt-3 leading-relaxed">
            It is about creating cars that instantly understand people.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/recognize">
              <Button
                size="lg"
                className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
              >
                <Eye className="w-5 h-5" /> See it work
              </Button>
            </Link>
            <Link href="/ddi">
              <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                Create your DDI <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <LogoMark size={24} />
              <span className="font-bold text-white">Futuristic</span>
              <span className="text-[10px] text-sky-400 font-semibold border border-sky-500/20 rounded-full px-1.5 py-0.5 leading-none">
                DDI
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 justify-center">
              <Link href="/recognize" className="hover:text-white transition-colors">
                Recognize
              </Link>
              <Link href="/journey" className="hover:text-white transition-colors">
                Journey
              </Link>
              <Link href="/platform" className="hover:text-white transition-colors">
                Platform
              </Link>
              <Link href="/ddi" className="hover:text-white transition-colors">
                My DDI
              </Link>
            </div>
            <p className="text-sm text-gray-600">Cars that instantly understand people.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
