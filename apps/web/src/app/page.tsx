import Link from "next/link";
import { IDENTITY_LAYERS } from "@futuristic/shared";
import { InteractivePrototype } from "@/components/prototype/interactive-demo";
import { LiveProof, LiveStats } from "@/components/landing/live-status";
import { Marquee } from "@/components/landing/marquee";
import { SystemNav } from "@/components/landing/system-nav";

const layerMeta = [
  { status: "LIVE", statusColor: "text-emerald-400", metric: "License · Fleet · Insurance" },
  { status: "LIVE", statusColor: "text-emerald-400", metric: "Autonomy · Safety · Training" },
  { status: "LIVE", statusColor: "text-emerald-400", metric: "Mobility · Charging · SOC" },
];

const identityLayers = IDENTITY_LAYERS.map((layer, i) => ({
  ...layer,
  ...layerMeta[i]!,
}));

const domains = [
  {
    icon: "🚗",
    name: "VEHICLE",
    status: "PROVEN",
    statusClass: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    desc: "Identity binding proven across EV surfaces — credentials, fleet auth, and autonomy contracts validated at scale.",
  },
  {
    icon: "🏠",
    name: "HOME",
    status: "IN PROGRESS",
    statusClass: "text-accent border-accent/30 bg-accent/10",
    desc: "Connected spaces that can verify access, safety, and intent before systems unlock or adapt.",
  },
  {
    icon: "🏙",
    name: "CITY",
    status: "QUEUED",
    statusClass: "text-muted border-border bg-surface",
    desc: "Mobility, transit, charging, and civic systems that understand portable authorization.",
  },
  {
    icon: "🌐",
    name: "WORLD",
    status: "QUEUED",
    statusClass: "text-muted border-border bg-surface",
    desc: "The long arc: trusted identity that travels across vehicles, autonomous systems, and connected infrastructure.",
  },
];

const principles = [
  "Portable identity — one trust layer across vehicles and fleets",
  "Bind-time validation of credentials and autonomy contract",
  "Graceful degradation when surface policies differ",
  "Privacy-first, user-controlled identity layer",
  "Open protocol for OEMs, fleets, and mobility operators",
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SystemNav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div
            className="pointer-events-none absolute inset-0 bg-grid-fade opacity-30"
            style={{ backgroundSize: "48px 48px" }}
          />
          <div className="relative mx-auto max-w-7xl px-6">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted">
              PORTABLE IDENTITY INFRASTRUCTURE — V.2.0
            </p>
            <h1 className="font-display mt-6 max-w-5xl text-5xl font-bold leading-[0.95] tracking-tight md:text-8xl">
              IDENTITY
              <br />
              <span className="bg-gradient-to-r from-accent via-white to-glow bg-clip-text text-transparent">
                THAT MOVES
              </span>
              <br />
              WITH YOU
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
              Futuristic builds portable digital identity infrastructure for vehicles, autonomous
              systems, and the connected world. The live prototype proves the vehicle layer:
              credentials, authorization, autonomy contract, and EV profile validated at every bind.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary tracking-wide">
                EXPLORE THE SYSTEM
              </Link>
              <a href="#prototype" className="btn-ghost tracking-wide">
                RUN PROTOTYPE
              </a>
            </div>
            <p className="mt-12 font-mono text-[10px] tracking-[0.2em] text-accent/80">
              01 — PROTOTYPE ACTIVE
            </p>
          </div>
        </section>

        <Marquee />

        <InteractivePrototype />

        {/* Architecture */}
        <section id="architecture" className="scroll-mt-24 border-b border-border/40 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted">// ARCHITECTURE</p>
                <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">
                  Infrastructure Stack
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE
              </span>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {identityLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="card group border-border/60 transition hover:border-glow/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-[10px] tracking-wider text-muted">{layer.id}</p>
                    <span
                      className={`font-mono text-[10px] tracking-wider ${layer.statusColor}`}
                    >
                      {layer.status}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-wide">
                    {layer.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{layer.detail}</p>
                  <p className="mt-4 font-mono text-[10px] tracking-wider text-muted">
                    {layer.mapsTo.join(" · ")}
                  </p>
                  <p className="mt-2 font-mono text-xs text-accent">{layer.metric}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <LiveStats />
            </div>
          </div>
        </section>

        {/* Thesis */}
        <section id="thesis" className="scroll-mt-24 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted">// THESIS</p>
            <div className="mt-8 grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="font-display text-5xl font-bold text-accent/90 md:text-7xl">∞</p>
                <h2 className="font-display mt-4 text-3xl font-bold leading-tight md:text-5xl">
                  PORTABLE IDENTITY
                  <br />
                  FOR AUTONOMOUS
                  <br />
                  SYSTEMS.
                </h2>
                <p className="mt-6 text-zinc-400 leading-relaxed">
                  Vehicles are the first high-stakes surface where portable identity becomes urgent.
                  As fleets become electric, shared, and autonomous, every bind needs to answer:
                  who is this person, what are they authorized to operate, and what system contract
                  should the machine honor?
                </p>
                <p className="mt-4 text-zinc-400 leading-relaxed">
                  Futuristic starts with vehicles because the requirements are concrete. The same
                  infrastructure extends into autonomous systems and the connected world.
                </p>
                <div className="mt-8 flex flex-wrap gap-2 font-mono text-[10px] tracking-wider">
                  {["VEHICLE ✓", "HOME", "CITY", "WORLD"].map((d, i) => (
                    <span
                      key={d}
                      className={`rounded border px-3 py-1.5 ${
                        i === 0
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                          : "border-border text-muted"
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card">
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted">
                  PRODUCT LOGIC
                </p>
                <h3 className="font-display mt-3 text-2xl font-bold">
                  VEHICLES
                  <br />
                  ARE THE START
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  Futuristic is infrastructure for portable identity, authorization, and machine
                  policy. The vehicle prototype validates license,
                  fleet membership, autonomy posture, compliance, and charging needs in real time.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  That same pattern becomes infrastructure for autonomous systems: a portable,
                  privacy-aware identity layer that connected environments can verify before they act.
                </p>
                <ul className="mt-6 space-y-2 border-t border-border/40 pt-6">
                  {principles.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-zinc-300">
                      <span className="text-accent">→</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Proof / Terminal */}
        <section id="proof" className="scroll-mt-24 border-y border-border/40 bg-surface/30 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted">SYSTEM STATUS</p>
                <h2 className="font-display mt-2 text-3xl font-bold">IDENTITY RUNTIME</h2>
                <p className="mt-4 text-sm text-zinc-400">
                  The bind runtime validates portable identity claims against each EV surface&apos;s policy
                  domains — granting authorization where aligned, denying with reason where not.
                </p>
                <div className="mt-8">
                  <LiveProof />
                </div>
                <Link href="/register?role=DRIVER" className="btn-primary mt-8 inline-flex">
                  Create Futuristic ID
                </Link>
              </div>

              <div className="terminal rounded-xl border border-border/60 bg-void p-6 font-mono text-sm leading-relaxed">
                <p className="text-muted">
                  <span className="text-accent">FUTURISTIC_ID</span> — bind.runtime
                </p>
                <p className="mt-4 text-zinc-300">$ futuristic bind --surface=vehicle</p>
                <p className="text-emerald-400">✓ Credentials layer loaded</p>
                <p className="text-emerald-400">✓ Autonomy contract active</p>
                <p className="text-emerald-400">✓ EV energy profile bound</p>
                <p className="text-accent">→ Presenting portable identity to autonomous surface...</p>
                <p className="mt-4 text-zinc-500">
                  DOMAIN [ VEHICLE ] ........ <span className="text-emerald-400">PROVEN</span>
                </p>
                <p className="text-zinc-500">
                  DOMAIN [ HOME ] ........ <span className="text-accent">IN PROGRESS</span>
                </p>
                <p className="text-zinc-500">
                  DOMAIN [ CITY ] ........ <span className="text-muted">QUEUED</span>
                </p>
                <p className="text-zinc-500">
                  DOMAIN [ WORLD ] ........ <span className="text-muted">QUEUED</span>
                </p>
                <p className="mt-4 text-zinc-600">$ <span className="terminal-cursor">_</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Domain Roadmap */}
        <section id="expansion" className="scroll-mt-24 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted">// EXPANSION</p>
            <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">Domain Roadmap</h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {domains.map((d) => (
                <div key={d.name} className="card flex flex-col">
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{d.icon}</span>
                    <span
                      className={`rounded border px-2 py-0.5 font-mono text-[9px] tracking-wider ${d.statusClass}`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-wide">{d.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/40 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted">
              // PROTOTYPE → PARADIGM
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold md:text-4xl">
              Enter the identity layer
            </h2>
            <p className="mt-4 text-muted">
              Driver, owner, or fleet operator — join the infrastructure layer for connected
              mobility.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register" className="btn-primary">
                Create identity
              </Link>
              <Link href="/login" className="btn-ghost">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-sm font-bold tracking-[0.35em]">FUTURISTIC</p>
              <p className="mt-1 font-mono text-[10px] tracking-wider text-muted">
                DIGITAL IDENTITY INFRASTRUCTURE — EST. NOW
              </p>
            </div>
            <p className="font-mono text-[10px] tracking-wider text-muted">
              © 2026 FUTURISTIC. All systems operational.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
