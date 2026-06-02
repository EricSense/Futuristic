"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SCENES = [
  { t: 0, line: "→ Sign in as alex@driver.futuristic" },
  { t: 1200, line: "✓ Digital Driving Identity loaded" },
  { t: 2400, line: "→ Profile: seat · climate · mode · audio · assists" },
  { t: 3600, line: "→ Select 2024 Tesla Model 3 — Sync" },
  { t: 4800, line: "✓ 14 preferences applied to vehicle" },
  { t: 6000, line: "✓ Session complete — identity portable" },
];

export function DemoVideo() {
  const [visible, setVisible] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const interval = window.setInterval(() => {
      frame = (frame + 1) % (SCENES.length + 2);
      setVisible(Math.min(frame, SCENES.length - 1));
      setProgress((Math.min(frame, SCENES.length) / SCENES.length) * 100);
    }, 1400);
    return () => window.clearInterval(interval);
  }, []);

  const lines = SCENES.slice(0, visible + 1).map((s) => s.line);

  return (
    <section id="demo" className="scroll-mt-24 border-b border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted">// DEMO</p>
            <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">
              See identity sync in action
            </h2>
            <p className="mt-3 max-w-xl text-sm text-zinc-400">
              Login → build preferences → sync to any vehicle. The driver dashboard is live on
              production — try the demo account below.
            </p>
          </div>
          <Link href="/login" className="btn-primary text-xs tracking-wide">
            TRY LIVE DEMO
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-void shadow-2xl shadow-glow/5">
          <div className="flex items-center gap-2 border-b border-border/40 bg-surface/80 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 font-mono text-[10px] tracking-wider text-muted">
              futuristic — driver.sync.demo
            </span>
          </div>

          <div className="grid lg:grid-cols-2">
            <div className="border-b border-border/40 p-6 lg:border-b-0 lg:border-r">
              <p className="font-mono text-[10px] tracking-wider text-accent">DRIVER DASHBOARD</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-border/50 bg-surface/50 p-4">
                  <p className="text-xs text-muted">Profile complete</p>
                  <p className="font-display text-2xl font-bold text-accent">
                    {visible >= 2 ? "85%" : "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-surface/50 p-4">
                  <p className="text-xs text-muted">Available vehicles</p>
                  <p className="font-display text-2xl font-bold">{visible >= 3 ? "3" : "—"}</p>
                </div>
                {visible >= 3 && (
                  <div className="rounded-lg border border-glow/30 bg-glow/5 p-4">
                    <p className="text-sm font-medium">2024 Tesla Model 3</p>
                    <p className="text-xs text-accent">Sync → applied</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 font-mono text-sm">
              <p className="text-muted">$ futuristic demo --role=driver</p>
              <div className="mt-4 min-h-[140px] space-y-1.5">
                {lines.map((line) => (
                  <p
                    key={line}
                    className={
                      line.startsWith("✓")
                        ? "text-emerald-400"
                        : line.startsWith("→")
                          ? "text-accent"
                          : "text-zinc-300"
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-border/40">
                <div
                  className="h-full bg-gradient-to-r from-accent to-glow transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-muted">
          Demo: alex@driver.futuristic · password123 ·{" "}
          <Link href="/login" className="text-accent hover:underline">
            sign in now
          </Link>
        </p>
      </div>
    </section>
  );
}
