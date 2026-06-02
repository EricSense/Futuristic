import Link from "next/link";
import { Marquee } from "@/components/landing/marquee";
import { SystemNav } from "@/components/landing/system-nav";

const identityLayers = [
  {
    id: "LAYER_01",
    name: "BIOMETRIC CORE",
    status: "SYNCING",
    statusColor: "text-accent",
    detail:
      "Physiological fingerprint. The irreducible you — voice, gait, pulse cadence mapped to a living signature that cannot be replicated.",
    metric: "94% fidelity",
  },
  {
    id: "LAYER_02",
    name: "BEHAVIORAL MESH",
    status: "LIVE",
    statusColor: "text-emerald-400",
    detail:
      "Patterns of preference, rhythm of routine — captured across 128 behavioral dimensions and compressed into your living model.",
    metric: "71% calibrated",
  },
  {
    id: "LAYER_03",
    name: "CONTEXTUAL FIELD",
    status: "PENDING",
    statusColor: "text-amber-400",
    detail:
      "The environment adapts before you ask. Ambient intelligence calibrated to your presence in real time across every surface.",
    metric: "38% deployed",
  },
];

const stats = [
  { value: "4.2B", label: "IDENTITY EVENTS / DAY" },
  { value: "0.3ms", label: "RECOGNITION LATENCY" },
  { value: "128", label: "BEHAVIORAL DIMENSIONS" },
  { value: "99.97%", label: "ACCURACY INDEX" },
  { value: "∞", label: "SCALE POTENTIAL" },
];

const domains = [
  {
    icon: "🚗",
    name: "VEHICLE",
    status: "PROVEN",
    statusClass: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    desc: "DDI proven in automotive. Seat, climate, audio — all pre-configured to your living signature. No setup. Just recognition.",
  },
  {
    icon: "🏠",
    name: "HOME",
    status: "IN PROGRESS",
    statusClass: "text-accent border-accent/30 bg-accent/10",
    desc: "Smart environments that recognize you at the threshold. No apps, no commands. Presence is the interface.",
  },
  {
    icon: "🏙",
    name: "CITY",
    status: "QUEUED",
    statusClass: "text-muted border-border bg-surface",
    desc: "Urban infrastructure shaped by citizen identity. Transit, commerce, civic access — frictionless by default.",
  },
  {
    icon: "🌐",
    name: "WORLD",
    status: "QUEUED",
    statusClass: "text-muted border-border bg-surface",
    desc: "The full vision. A single identity layer beneath every digital and physical system on Earth.",
  },
];

const principles = [
  "Seamless identity continuity across contexts",
  "Environment adapts; user never configures",
  "Preference is infrastructure, not a setting",
  "Privacy-first architecture by design",
  "Open protocol, not a closed ecosystem",
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
              DIGITAL IDENTITY SYSTEM — V.2.0
            </p>
            <h1 className="font-display mt-6 max-w-5xl text-5xl font-bold leading-[0.95] tracking-tight md:text-8xl">
              THE WORLD
              <br />
              <span className="bg-gradient-to-r from-accent via-white to-glow bg-clip-text text-transparent">
                THAT KNOWS
              </span>
              <br />
              YOU
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
              Your Digital Driving Identity isn&apos;t a car feature — it&apos;s an early proof of
              concept for something much larger. The car that knows you is the prototype for the
              world that knows you.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary tracking-wide">
                EXPLORE THE SYSTEM
              </Link>
              <a href="#proof" className="btn-ghost tracking-wide">
                VIEW PROOF
              </a>
            </div>
            <p className="mt-12 font-mono text-[10px] tracking-[0.2em] text-accent/80">
              01 — PROTOTYPE ACTIVE
            </p>
          </div>
        </section>

        <Marquee />

        {/* Architecture */}
        <section id="architecture" className="scroll-mt-24 border-b border-border/40 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted">// ARCHITECTURE</p>
                <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">Identity Stack</h2>
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
                  <p className="mt-6 font-mono text-xs text-accent">{layer.metric}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/40 md:grid-cols-5">
              {stats.map((s) => (
                <div key={s.label} className="bg-panel px-4 py-6 text-center md:px-6">
                  <p className="font-display text-2xl font-bold text-white md:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-2 font-mono text-[9px] leading-snug tracking-wider text-muted">
                    {s.label}
                  </p>
                </div>
              ))}
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
                  GENUINELY PRESCIENT.
                  <br />
                  THE CAR IS JUST
                  <br />
                  THE BEGINNING.
                </h2>
                <p className="mt-6 text-zinc-400 leading-relaxed">
                  Every surface becomes intelligent. Every threshold becomes a recognition event.
                  The Digital Driving Identity is not a vertical product — it is the first validated
                  instance of a horizontal identity layer that extends across every domain: home,
                  city, commerce, healthcare, governance.
                </p>
                <p className="mt-4 text-zinc-400 leading-relaxed">
                  The prototype always precedes the paradigm. We are building the prototype.
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
                  PROTOTYPE LOGIC
                </p>
                <h3 className="font-display mt-3 text-2xl font-bold">
                  FROM VEHICLE
                  <br />
                  TO WORLD
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  What the car already does — adapt seat position, adjust climate, cue your playlist
                  — is a microcosm of what every physical and digital environment can do.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  FUTURISTIC isn&apos;t building a car feature. It&apos;s validating the
                  infrastructure of personal recognition at planetary scale.
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
                  The sync engine maps driver preferences to vehicle capabilities — applying
                  matches, gracefully deferring the rest. Live proof of ambient identity in
                  automotive.
                </p>
                <div className="mt-8 space-y-3 font-mono text-sm">
                  <div className="flex justify-between text-accent">
                    <span>seat.position</span>
                    <span>72 → applied</span>
                  </div>
                  <div className="flex justify-between text-accent">
                    <span>climate.temp</span>
                    <span>71°F → applied</span>
                  </div>
                  <div className="flex justify-between text-accent">
                    <span>drivingMode.mode</span>
                    <span>comfort → applied</span>
                  </div>
                  <div className="flex justify-between text-amber-400/80">
                    <span>seat.lumbar</span>
                    <span>6 → deferred</span>
                  </div>
                </div>
                <Link href="/register?role=DRIVER" className="btn-primary mt-8 inline-flex">
                  Build your identity
                </Link>
              </div>

              <div className="terminal rounded-xl border border-border/60 bg-void p-6 font-mono text-sm leading-relaxed">
                <p className="text-muted">
                  <span className="text-accent">FUTURISTIC_DDI</span> — identity.runtime
                </p>
                <p className="mt-4 text-zinc-300">$ ddi init --scope=world</p>
                <p className="text-emerald-400">✓ Biometric layer loaded</p>
                <p className="text-emerald-400">✓ Behavioral mesh calibrated</p>
                <p className="text-emerald-400">✓ Context field active</p>
                <p className="text-accent">→ Extending identity to new domains...</p>
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
              Driver, owner, or fleet operator — join the marketplace where identity meets
              environment.
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
