"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Fingerprint,
  ArrowRight,
  Play,
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
  Network,
  Lock,
  Eye,
  CheckCircle2,
  Compass,
  Cpu,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/30 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-sky-500/5 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-28 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <LogoMark size={88} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2 mb-8">
            <Fingerprint className="w-4 h-4 text-sky-400" />
            <span className="text-sm text-sky-300 font-semibold tracking-wide">
              DDI &middot; The Universal Mobility Passport
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05]">
            From &ldquo;This is MY car&rdquo;
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
              to &ldquo;This car knows ME.&rdquo;
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed">
            Futuristic builds DDI &mdash; the Digital Driving Identity that lets every vehicle
            instantly understand the person it is serving.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/recognize">
              <Button
                size="lg"
                className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
              >
                <Eye className="w-5 h-5" /> Watch a car recognize you
              </Button>
            </Link>
            <Link href="/journey">
              <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                <Compass className="w-5 h-5" /> Run a full journey
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            No app downloads. No accounts. Try the prototype in 30 seconds.
          </p>
        </div>
      </section>

      {/* MODES STRIP */}
      <section className="border-t border-white/5 py-10 bg-surface-50/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-6">
            One DDI works across every mode of transport
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
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE WAYS TO EXPERIENCE */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              Experience Futuristic
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Three live prototypes
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              Each one shows a different facet of cars that instantly understand people.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              href="/recognize"
              className="group rounded-2xl border border-white/10 bg-surface-50 p-7 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Recognize
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Stand in front of a Waymo. Watch from the car&apos;s POV as it identifies you and
                the cabin AI greets you by name &mdash; in your tone and language.
              </p>
              <span className="text-sm text-sky-400 font-medium inline-flex items-center gap-1">
                Watch the recognition <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/journey"
              className="group rounded-2xl border border-white/10 bg-surface-50 p-7 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Journey
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Travel from San Francisco to Tokyo across 5 modes, 6 operators, and 2 countries.
                One DDI carries identity, insurance, accessibility, and language end to end.
              </p>
              <span className="text-sm text-sky-400 font-medium inline-flex items-center gap-1">
                Take the journey <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/platform"
              className="group rounded-2xl border border-white/10 bg-surface-50 p-7 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Platform
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                For OEMs, mobility operators, insurers, and cities. The federation, the SDK, the
                trust architecture &mdash; everything to recognize people in your own product.
              </p>
              <span className="text-sm text-sky-400 font-medium inline-flex items-center gap-1">
                Build on DDI <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* THE BIG IDEA */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              The Paradigm Shift
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
              <p className="text-3xl font-bold text-white mb-4">&ldquo;This is my car.&rdquo;</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>&middot; Every system requires a new app, account, profile</li>
                <li>&middot; Insurance, license, accessibility re-verified each time</li>
                <li>&middot; Cross-border travel means starting from zero</li>
                <li>&middot; The vehicle defines what you can do</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-[60px]" />
              <div className="relative">
                <div className="text-xs font-medium uppercase tracking-wider text-sky-400 mb-3">
                  With DDI
                </div>
                <p className="text-3xl font-bold text-white mb-4">&ldquo;This car knows me.&rdquo;</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>&middot; One verified identity recognized everywhere</li>
                  <li>&middot; Insurance, licenses, accessibility travel with you</li>
                  <li>&middot; Borders, languages, modes &mdash; seamless</li>
                  <li>&middot; You define what the vehicle does</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT THE PASSPORT CARRIES */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              The Universal Mobility Passport
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">What your DDI carries</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Verified credentials that follow you to every vehicle, every operator, every country.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Globe,
                title: "Cross-Border Identity",
                desc: "Verified once, recognized in every country. No re-issuing, no re-uploading documents.",
              },
              {
                icon: Shield,
                title: "Insurance Portability",
                desc: "Coverage that follows you across carriers, vehicles, and jurisdictions in real time.",
              },
              {
                icon: Accessibility,
                title: "Adaptive Accessibility",
                desc: "Your accessibility profile travels with you. Every vehicle adapts. Every operator is briefed.",
              },
              {
                icon: Bot,
                title: "AI Travel Assistant",
                desc: "Your AI companion has full context. Tone, language, preferences &mdash; ready everywhere.",
              },
              {
                icon: Building2,
                title: "Smart City Integration",
                desc: "Routing, payments, transit credentials &mdash; one tap interfaces with city infrastructure.",
              },
              {
                icon: Network,
                title: "Multimodal Continuity",
                desc: "Car, rail, flight, scooter, ship. One credential bridges every transition.",
              },
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

      {/* THE PROTOTYPE PROMO */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 via-surface-50 to-surface-50 p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[100px]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
                  Live Prototype
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                  A day in
                  <br />
                  Universal Mobility.
                </h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Watch a single DDI carry someone across 5 modes, 2 countries, 4 insurance
                  carriers, and 6 operators &mdash; with zero apps, zero re-typing, zero friction.
                </p>
                <Link href="/journey">
                  <Button
                    size="lg"
                    className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
                  >
                    <Play className="w-5 h-5" /> Run the Journey Now
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { time: "07:42", city: "San Francisco", mode: "Robotaxi" },
                  { time: "08:15", city: "BART Powell", mode: "Subway" },
                  { time: "10:30", city: "SFO → HND", mode: "Flight" },
                  { time: "14:50", city: "Tokyo", mode: "Robotaxi" },
                  { time: "18:20", city: "Shibuya", mode: "E-scooter" },
                  { time: "21:45", city: "Hotel", mode: "Arrived" },
                ].map((stop) => (
                  <div
                    key={stop.time}
                    className="rounded-lg border border-white/10 bg-surface/60 backdrop-blur p-3"
                  >
                    <div className="text-[10px] font-mono text-sky-400 mb-0.5">{stop.time}</div>
                    <div className="text-xs font-semibold text-white truncate">{stop.city}</div>
                    <div className="text-[11px] text-gray-500">{stop.mode}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="py-24 border-t border-white/5 bg-surface-50/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400 mb-3">
              Trust Architecture
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Your passport. Your rules.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Lock, label: "User-owned credentials" },
              { icon: Eye, label: "Permission-based sharing" },
              { icon: CheckCircle2, label: "Verifiable, revocable" },
              { icon: Shield, label: "End-to-end encrypted" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-xl border border-white/5 bg-surface-50 p-5 text-center"
              >
                <Icon className="w-6 h-6 text-sky-400 mx-auto mb-3" />
                <span className="text-sm text-gray-300 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING VISION */}
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
            <Link href="/journey">
              <Button
                size="lg"
                className="gap-2 text-base px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
              >
                <Play className="w-5 h-5" /> Try the Prototype
              </Button>
            </Link>
            <Link href="/claim">
              <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                Claim Your Passport <ArrowRight className="w-5 h-5" />
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
              <Link href="/claim" className="hover:text-white transition-colors">
                Claim
              </Link>
            </div>
            <p className="text-sm text-gray-600">The Universal Mobility Passport.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
