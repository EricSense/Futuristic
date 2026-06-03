"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SCENES = [
  "→ Sign in — load Digital Driving Identity",
  "✓ Layer 01 Ergonomic Core initialized",
  "→ Layer 02 Behavioral Mesh · Layer 03 Contextual Field",
  "→ Express DDI on recognition surface",
  "✓ 14 identity signals recognized",
  "✓ DDI portable — recognition event logged",
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

  return (
    <section id="demo" className="scroll-mt-24 border-b border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted">// DEMO</p>
            <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">
              Digital Driving Identity — live demo
            </h2>
            <p className="mt-3 max-w-xl text-sm text-zinc-400">
              Compose your three-layer DDI, express it on a recognition surface, and watch identity
              signals propagate. Not car settings — portable identity infrastructure.
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
              futuristic — ddi.recognition.demo
            </span>
          </div>

          <div className="grid lg:grid-cols-2">
            <div className="border-b border-border/40 p-6 lg:border-b-0 lg:border-r">
              <p className="font-mono text-[10px] tracking-wider text-accent">DDI RUNTIME</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-border/50 bg-surface/50 p-4">
                  <p className="text-xs text-muted">DDI complete</p>
                  <p className="font-display text-2xl font-bold text-accent">
                    {visible >= 2 ? "85%" : "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-surface/50 p-4">
                  <p className="text-xs text-muted">Recognition surfaces</p>
                  <p className="font-display text-2xl font-bold">{visible >= 3 ? "3" : "—"}</p>
                </div>
                {visible >= 3 && (
                  <div className="rounded-lg border border-glow/30 bg-glow/5 p-4">
                    <p className="text-sm font-medium">Recognition surface · Model 3</p>
                    <p className="text-xs text-accent">DDI expressed</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 font-mono text-sm">
              <p className="text-muted">$ futuristic ddi init --layers=3</p>
              <div className="mt-4 min-h-[140px] space-y-1.5">
                {SCENES.slice(0, visible + 1).map((line) => (
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
