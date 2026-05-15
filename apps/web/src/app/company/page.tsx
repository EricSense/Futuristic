"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Fingerprint,
  Target,
  Layers,
  Network,
  Shield,
  Cpu,
  Users,
  Globe,
  TrendingUp,
  Rocket,
  Mail,
  ArrowRight,
  CheckCircle2,
  CirclePlay,
  Building2,
} from "lucide-react";

const PILLARS = [
  {
    icon: Fingerprint,
    title: "Digital Driving Identity (DDI)",
    body: "A portable, verifiable identity for mobility: who you are, what you need, and what you are permitted to do — independent of any single vehicle or brand.",
  },
  {
    icon: Network,
    title: "Federation & trust",
    body: "Futuristic operates the trust layer between people, vehicles, operators, insurers, and cities. Recognition is standardized; data stays permissioned and revocable.",
  },
  {
    icon: Cpu,
    title: "SDK & integrations",
    body: "Drop-in recognition for infotainment, robotaxi stacks, transit gates, and fleet backends. One handshake pattern across OEMs and mobility partners.",
  },
];

const BEACHHEAD = [
  "Autonomous & shared fleets (highest pain: churn, onboarding, trust)",
  "OEM software-defined vehicle programs (differentiation + retention)",
  "Insurance portability pilots (coverage follows the person)",
  "Smart-city mobility wallets (transit + MaaS + curb)",
];

const ROADMAP = [
  { phase: "Now", title: "Prototypes & design partners", detail: "Interactive demos, handshake spec, SDK alpha, pilot LOIs." },
  { phase: "Next", title: "Pilot networks", detail: "Closed federation with 2–3 operators + 1 OEM infotainment path; VP issuance in staging." },
  { phase: "Scale", title: "Production federation", detail: "SLA-backed APIs, compliance pack, billing, multi-region." },
  { phase: "Platform", title: "Mobility OS", detail: "Third-party credential issuers, marketplace for mobility services on top of DDI." },
];

const MOAT = [
  "Cross-brand network effects: value rises as more vehicles and operators speak DDI",
  "Person-centric trust: user-owned posture vs. siloed OEM accounts",
  "Compliance-forward design: consent, minimization, audit trails from day one",
  "Speed to “recognized in 2 seconds”: product wedge operators can measure",
];

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <LogoMark size={56} className="mx-auto mb-5" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400 mb-3">Company</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Building Futuristic as the company for{" "}
            <span className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
              Digital Driving Identity
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A new mobility paradigm:{" "}
            <span className="text-white font-medium">not a car you own, but a car that knows you.</span>{" "}
            Futuristic exists to make that real at scale — product, federation, and go-to-market — so every
            vehicle can instantly understand the person inside.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/demo">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                <CirclePlay className="w-5 h-5" /> See the product demo
              </Button>
            </Link>
            <a href="mailto:hello@futuristic.example">
              <Button variant="secondary" size="lg" className="gap-2">
                <Mail className="w-5 h-5" /> Talk to us
              </Button>
            </a>
          </div>
        </div>

        <section className="mb-14">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-400" /> Mission
          </h2>
          <Card className="border-sky-500/20 bg-gradient-to-br from-sky-950/30 to-surface-50">
            <p className="text-gray-300 leading-relaxed">
              We are building the identity layer for the future of mobility. When identity travels with the person,
              EVs, robotaxis, rentals, and transit stop feeling unfamiliar — and adoption accelerates. Futuristic is
              the company that ships the protocols, SDKs, and trust fabric to make{" "}
              <span className="text-white font-medium">&ldquo;this car knows ME&rdquo;</span> the default.
            </p>
          </Card>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" /> What we ship
          </h2>
          <div className="space-y-4">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <Card key={title}>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{title}</h3>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">{body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Technical stack today: monorepo (Next.js + Express + Prisma + shared types). Web demos run client-side;
            API and DB packages are ready for pilot integrations.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" /> How we scale as a company
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" /> B2B2C motion
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                We sell to enterprises that move people (OEMs, fleets, insurers, cities). End users hold the DDI;
                partners integrate once and recognize everyone who opts in.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" /> Network revenue
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Usage-based federation fees, premium trust tiers, and eventually marketplace services on top of DDI
                (insurance, accessibility, concierge) as the graph grows.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-400" /> Compliance as product
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Audit logs, regional data residency, and issuer policies become selling points for regulated buyers —
                not an afterthought.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-sky-400" /> Velocity
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Ship thin vertical slices: recognition → portability → billing. Each slice unlocks pilot revenue and
                tighter design-partner feedback loops.
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" /> Go-to-market beachhead
          </h2>
          <Card>
            <ul className="space-y-2">
              {BEACHHEAD.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-bold text-white mb-4">Roadmap (indicative)</h2>
          <div className="space-y-3">
            {ROADMAP.map((r) => (
              <div key={r.phase} className="flex gap-4 rounded-xl border border-white/10 bg-surface-50 p-4">
                <div className="text-xs font-mono text-sky-400 w-16 flex-shrink-0 pt-0.5">{r.phase}</div>
                <div>
                  <p className="font-semibold text-white">{r.title}</p>
                  <p className="text-sm text-gray-400 mt-1">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-bold text-white mb-4">Why Futuristic can win</h2>
          <Card>
            <ul className="space-y-2">
              {MOAT.map((m) => (
                <li key={m} className="flex gap-2 text-sm text-gray-300">
                  <span className="text-sky-400">→</span>
                  {m}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-950/40 to-surface-50 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Partners, pilots, investors</h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto mb-6">
            If you are an OEM, fleet, insurer, or city team exploring DDI pilots — or an investor backing the
            identity layer for mobility — we would like to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="mailto:partners@futuristic.example">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                <Mail className="w-5 h-5" /> partners@futuristic.example
              </Button>
            </a>
            <Link href="/platform">
              <Button variant="secondary" size="lg" className="gap-2">
                Integration overview <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
