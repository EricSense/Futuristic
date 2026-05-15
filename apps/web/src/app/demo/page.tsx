"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { DDIFlowVisualizer } from "@/components/ddi-flow-visualizer";
import { HeroDemo } from "@/components/hero-demo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDDI } from "@/lib/ddi-context";
import { getDemoProgress } from "@/lib/demo-progress";
import {
  Fingerprint,
  Eye,
  Compass,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function DemoPage() {
  const { ddi } = useDDI();
  const [progress, setProgress] = useState({ recognize: false, journey: false });

  useEffect(() => {
    setProgress(getDemoProgress());
    const onVis = () => setProgress(getDemoProgress());
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const steps = [
    {
      num: 1,
      title: "Understand the handshake",
      body: "Run the protocol simulation above. That is the same sequence a real vehicle uses when it asks Futuristic for a verifiable presentation of your DDI.",
      href: null as string | null,
      done: null as boolean | null,
    },
    {
      num: 2,
      title: "Create your DDI (local prototype)",
      body: "Issue a Digital Driving Identity in your browser. It stores verified-style credentials locally so the demos below can use your name, languages, and accessibility.",
      href: "/ddi",
      done: !!ddi,
    },
    {
      num: 3,
      title: "See one car recognize you",
      body: "Vehicle point of view: scan, verify, greet. Uses your DDI if you created one; otherwise a sample identity.",
      href: "/recognize",
      done: progress.recognize,
    },
    {
      num: 4,
      title: "Run a full day across modes",
      body: "San Francisco to Tokyo: robotaxi, transit, flight, micromobility. Watch credentials fire at every operator.",
      href: "/journey",
      done: progress.journey,
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs text-sky-300 font-semibold tracking-wide uppercase">
              How it works · How to use it
            </span>
          </div>
          <LogoMark size={48} className="mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Digital Driving Identity for the future of mobility
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Futuristic is building <span className="text-white font-medium">Digital Driving Identity (DDI)</span> for a
            new mobility paradigm &mdash;{" "}
            <span className="text-gray-300">not a car you own, but a car that knows you.</span> This walkthrough is a
            working prototype: protocol first, then hands-on demos. No install, no backend required.
          </p>
        </div>

        <section className="mb-10">
          <DDIFlowVisualizer />
        </section>

        <section className="mb-10">
          <p className="text-[10px] uppercase tracking-widest text-sky-400 font-semibold mb-3 text-center">
            Try it in 10 seconds
          </p>
          <HeroDemo />
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 text-center">How to use this prototype</h2>
          <div className="space-y-4">
            {steps.map((s) => (
              <Card key={s.num} className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface-100 text-sm font-bold text-white">
                  {s.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{s.title}</h3>
                    {s.done === true && (
                      <Badge variant="success" className="text-[10px]">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" /> Done
                      </Badge>
                    )}
                    {s.done === false && (
                      <Badge variant="warning" className="text-[10px]">
                        <Circle className="w-3 h-3 mr-0.5" /> Try this
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">{s.body}</p>
                  {s.href && (
                    <Link href={s.href} className="inline-block mt-3">
                      <Button size="sm" className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                        {s.num === 2 && <Fingerprint className="w-3.5 h-3.5" />}
                        {s.num === 3 && <Eye className="w-3.5 h-3.5" />}
                        {s.num === 4 && <Compass className="w-3.5 h-3.5" />}
                        Open step {s.num}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-xs text-gray-600 mt-8">
            Tip: complete steps 3 and 4, then return here &mdash; progress updates when you revisit this tab.
          </p>
        </section>
      </div>
    </div>
  );
}
