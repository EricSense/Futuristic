"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePassport } from "@/lib/passport-context";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogoMark } from "@/components/logo";
import { Fingerprint, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const accessibilityOptions = [
  { id: "none", label: "None" },
  { id: "wheelchair", label: "Wheelchair user" },
  { id: "mobility-aid", label: "Mobility aid" },
  { id: "low-vision", label: "Low vision" },
  { id: "hearing", label: "Hearing assistance" },
];

const languageOptions = ["en", "ja", "es", "fr", "de", "zh", "ko", "ar"];

const personaOptions = [
  { id: "concise", label: "Concise" },
  { id: "warm", label: "Warm" },
  { id: "playful", label: "Playful" },
] as const;

export default function ClaimPage() {
  const { claim } = usePassport();
  const router = useRouter();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [accessibility, setAccessibility] = useState("none");
  const [languages, setLanguages] = useState<string[]>(["en"]);
  const [persona, setPersona] = useState<"concise" | "warm" | "playful">("concise");
  const [issuing, setIssuing] = useState(false);

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;

    setIssuing(true);
    const accMap: Record<string, Record<string, string>> = {
      none: {},
      wheelchair: { mobility: "wheelchair" },
      "mobility-aid": { mobility: "mobility-aid" },
      "low-vision": { vision: "low-vision" },
      hearing: { hearing: "assisted" },
    };

    setTimeout(() => {
      claim({
        holderName: name,
        homeCity: city,
        accessibility: accMap[accessibility] ?? {},
        languages: languages.length ? languages : ["en"],
        aiPersona: persona,
      });
      router.push("/passport");
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4">
              <LogoMark size={56} />
            </div>
            <h1 className="text-2xl font-bold text-white">Claim your DDI</h1>
            <p className="mt-1 text-sm text-gray-400">
              Issue your Universal Mobility Passport &mdash; portable across vehicles, modes, and borders.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="name"
              label="Full name"
              placeholder="Maya Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              id="city"
              label="Home city"
              placeholder="San Francisco, USA"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            <div>
              <label className="text-sm text-gray-300 font-medium block mb-2">
                Accessibility profile
              </label>
              <div className="grid grid-cols-2 gap-2">
                {accessibilityOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAccessibility(opt.id)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm text-left transition-colors",
                      accessibility === opt.id
                        ? "border-sky-500 bg-sky-500/10 text-white"
                        : "border-white/10 bg-surface-100 text-gray-400 hover:border-white/20",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 font-medium block mb-2">
                Languages (recognized at every border)
              </label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs uppercase tracking-wider font-medium transition-colors",
                      languages.includes(lang)
                        ? "border-sky-500 bg-sky-500/10 text-sky-200"
                        : "border-white/10 bg-surface-100 text-gray-500 hover:border-white/20",
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 font-medium block mb-2">
                AI assistant tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                {personaOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPersona(opt.id)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-colors",
                      persona === opt.id
                        ? "border-sky-500 bg-sky-500/10 text-white"
                        : "border-white/10 bg-surface-100 text-gray-400 hover:border-white/20",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={issuing || !name.trim() || !city.trim()}
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0"
            >
              {issuing ? (
                <>
                  <Fingerprint className="w-5 h-5 animate-pulse" />
                  Issuing your passport...
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  Issue Universal Mobility Passport
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-sky-400" />
              Stored locally in your browser. No account, no email required.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Just want to see it work?{" "}
            <Link
              href="/journey"
              className="text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1"
            >
              Run the prototype with a demo passport <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
