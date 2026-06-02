import Link from "next/link";
import { Nav } from "@/components/ui";

const personas = [
  {
    role: "Driver",
    href: "/register?role=DRIVER",
    tag: "Your identity travels with you",
    desc: "Build a portable driving profile — seat, climate, mirrors, mode — once. Every vehicle adapts to you.",
  },
  {
    role: "Vehicle Owner",
    href: "/register?role=OWNER",
    tag: "Your car becomes context-aware",
    desc: "Register capabilities. When a driver syncs, your vehicle knows exactly what it can honor.",
  },
  {
    role: "Fleet Operator",
    href: "/register?role=FLEET_OPERATOR",
    tag: "Identity at scale",
    desc: "Manage pools of vehicles where every driver feels at home — without manual reconfiguration.",
  },
];

const layers = [
  { name: "Seat & Ergonomics", detail: "Position, lumbar, tilt — your body, remembered" },
  { name: "Climate & Comfort", detail: "Temperature zones, fan speed, your ambient preference" },
  { name: "Mirrors & Visibility", detail: "Angles calibrated to your sightline" },
  { name: "Driving Mode", detail: "Eco, sport, comfort — your default intent" },
  { name: "Infotainment", detail: "Volume, sources, presets that follow you" },
  { name: "Accessibility", detail: "Assists and display modes that match how you drive" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Nav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-24">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div
            className="pointer-events-none absolute inset-0 bg-grid-fade opacity-40"
            style={{ backgroundSize: "64px 64px" }}
          />
          <div className="relative mx-auto max-w-6xl px-6">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-glow/30 bg-glow/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Digital Driving Identity
            </p>
            <h1 className="font-display max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
              The car that knows you is the prototype for{" "}
              <span className="bg-gradient-to-r from-accent via-glow to-indigo-400 bg-clip-text text-transparent">
                the world that knows you
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Your Digital Driving Identity isn&apos;t a car feature — it&apos;s an early proof of
              concept for something much larger. One portable identity. Any vehicle. Graceful sync
              when capabilities differ. This is where identity becomes ambient.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary">
                Build your identity
              </Link>
              <Link href="/login" className="btn-ghost">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="border-y border-border/40 bg-surface/30 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="font-display text-3xl font-bold md:text-4xl">
                  Prescient by design
                </h2>
                <p className="mt-4 text-zinc-400 leading-relaxed">
                  Today, your preferences live trapped in one car&apos;s memory. Tomorrow, your
                  identity travels — from vehicle to vehicle, from car to home to office. Futuristic
                  starts with driving because it&apos;s the highest-stakes, most personal environment
                  where context matters.
                </p>
                <p className="mt-4 text-zinc-400 leading-relaxed">
                  The sync engine maps what you want to what a vehicle can do — applying matches,
                  gracefully deferring the rest. No failed expectations. Just intelligence.
                </p>
              </div>
              <div className="card relative overflow-hidden">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-glow/20 blur-3xl" />
                <p className="label">Sync preview</p>
                <div className="mt-4 space-y-3 font-mono text-sm">
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
                    <span>6 → deferred (unsupported)</span>
                  </div>
                </div>
                <p className="mt-6 text-xs text-muted">
                  14 preferences applied · 1 gracefully deferred · session logged
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Identity layers */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-display text-center text-3xl font-bold">Six layers of you</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted">
              Your digital identity is structured, portable, and machine-readable.
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {layers.map((l) => (
                <div key={l.name} className="card transition hover:border-glow/30">
                  <p className="font-medium">{l.name}</p>
                  <p className="mt-1 text-sm text-muted">{l.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personas */}
        <section className="border-t border-border/40 bg-surface/20 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-display text-center text-3xl font-bold">The marketplace</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted">
              Drivers, owners, and fleet operators — connected by identity sync.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {personas.map((p) => (
                <Link key={p.role} href={p.href} className="card group transition hover:border-glow/40">
                  <p className="text-xs font-medium uppercase tracking-wider text-accent">
                    {p.tag}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold">{p.role}</h3>
                  <p className="mt-2 text-sm text-muted">{p.desc}</p>
                  <span className="mt-4 inline-block text-sm text-glow group-hover:text-accent">
                    Get started →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-bold">
              Start with the car. Expand to everything.
            </h2>
            <p className="mt-4 text-muted">
              Futuristic is the proof of concept for ambient identity — where the world adapts to
              you, not the other way around.
            </p>
            <Link href="/register" className="btn-primary mt-8 inline-flex">
              Create your Digital Driving Identity
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted">
        Futuristic — The prototype for a world that knows you.
      </footer>
    </div>
  );
}
