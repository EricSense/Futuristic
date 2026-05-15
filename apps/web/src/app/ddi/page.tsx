"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDDI, type DDI } from "@/lib/ddi-context";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Fingerprint,
  Shield,
  Globe,
  Accessibility,
  Bot,
  CheckCircle2,
  Languages,
  Wallet,
  Network,
  Compass,
  Trash2,
  ArrowRight,
  Eye,
} from "lucide-react";
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

export default function DDIPage() {
  const { ddi, loading, create, revoke } = useDDI();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh] text-gray-400 animate-pulse">
          Loading…
        </div>
      </div>
    );
  }

  if (!ddi) {
    return <CreateView onCreated={() => router.push("/ddi")} create={create} />;
  }

  return <DDIView ddi={ddi} onRevoke={() => { revoke(); router.push("/"); }} />;
}

// ============== CREATE VIEW ==============

function CreateView({
  onCreated,
  create,
}: {
  onCreated: () => void;
  create: ReturnType<typeof useDDI>["create"];
}) {
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

    setTimeout(async () => {
      try {
        await create({
          holderName: name,
          homeCity: city,
          mobilityNeeds: accMap[accessibility] ?? {},
          languages: languages.length ? languages : ["en"],
          aiPersona: persona,
        });
        onCreated();
      } finally {
        setIssuing(false);
      }
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
            <h1 className="text-2xl font-bold text-white">Create your DDI</h1>
            <p className="mt-1 text-sm text-gray-400">
              Your Digital Driving Identity &mdash; the way every vehicle, in every city, recognizes you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input id="name" label="Full name" placeholder="Maya Chen" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="city" label="Home city" placeholder="San Francisco, USA" value={city} onChange={(e) => setCity(e.target.value)} required />

            <div>
              <label className="text-sm text-gray-300 font-medium block mb-2">Accessibility</label>
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
              <label className="text-sm text-gray-300 font-medium block mb-2">Languages the car will recognize</label>
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
              <label className="text-sm text-gray-300 font-medium block mb-2">In-cabin AI tone</label>
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
                  Issuing your DDI…
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  Issue DDI
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-sky-400" />
              Stored locally in your browser. No account, no email required.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            New to DDI?{" "}
            <Link href="/demo" className="text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1">
              Start with the walkthrough <ArrowRight className="w-3 h-3" />
            </Link>
            {" · "}
            <Link href="/recognize" className="text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1">
              Jump to vehicle demo <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

// ============== VIEW ==============

function DDIView({ ddi, onRevoke }: { ddi: DDI; onRevoke: () => void }) {
  const issued = new Date(ddi.issuedAt);
  const needs = ddi.mobilityNeeds ?? ddi.accessibility ?? {};
  const credentialCount =
    1 +
    ddi.licenses.length +
    ddi.insurance.length +
    (Object.keys(needs).length > 0 ? 1 : 0) +
    1 +
    1;

  const handleRevoke = () => {
    if (confirm("Revoke your DDI? You can issue a new one anytime.")) onRevoke();
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">My DDI</h1>
            <p className="text-gray-400 mt-1 text-sm">
              The verified identity that every vehicle in the network instantly recognizes.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/recognize">
              <Button variant="secondary" className="gap-2">
                <Eye className="w-4 h-4" /> See it work
              </Button>
            </Link>
            <Link href="/journey">
              <Button className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
                <Compass className="w-4 h-4" /> Run journey
              </Button>
            </Link>
          </div>
        </div>

        {/* DDI CARD */}
        <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-950/50 via-surface-50 to-surface p-8 sm:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px]" />

          <div className="relative">
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <LogoMark size={48} />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-sky-300/80 font-semibold">
                    Digital Driving Identity
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Issued by the Futuristic federation</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Trust score</p>
                <p className="text-2xl font-bold text-sky-300 font-mono">{ddi.trustScore}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Holder</p>
                <p className="text-2xl font-bold text-white">{ddi.holderName}</p>
                <p className="text-sm text-gray-400 mt-1">{ddi.homeCity}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">DDI ID</p>
                <p className="text-sm font-mono text-sky-200 break-all">{ddi.id}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Issued {issued.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10">
              <Stat label="Verified credentials" value={credentialCount} />
              <Stat label="Trusted networks" value={ddi.trustedNetworks.length} />
              <Stat label="Languages" value={ddi.languages.length} />
            </div>
          </div>
        </div>

        {/* CREDENTIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CredentialCard icon={Fingerprint} title="Identity">
            <Row label="Status" value="Verified" verified />
            <Row label="Biometric" value={ddi.identity.biometric ? "Linked" : "Not linked"} verified={ddi.identity.biometric} />
          </CredentialCard>

          <CredentialCard icon={Globe} title="Licenses (cross-border)">
            {ddi.licenses.map((l) => (
              <Row key={l.type} label={l.type} value={l.issuer} verified={l.verified} />
            ))}
          </CredentialCard>

          <CredentialCard icon={Shield} title="Insurance (portable)">
            {ddi.insurance.map((i) => (
              <Row key={i.carrier} label={i.carrier} value={i.coverage === "global" ? "Global" : "Domestic"} verified={i.verified} />
            ))}
          </CredentialCard>

          <CredentialCard icon={Accessibility} title="Needs (always honored)">
            {Object.entries(needs).length === 0 ? (
              <Row label="Profile" value="No needs declared" verified />
            ) : (
              Object.entries(needs).map(([k, v]) => (
                <Row key={k} label={cap(k)} value={String(v)} verified />
              ))
            )}
          </CredentialCard>

          <CredentialCard icon={Languages} title="Languages">
            <div className="flex flex-wrap gap-2">
              {ddi.languages.map((l) => (
                <span key={l} className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs uppercase tracking-wider text-sky-200 font-medium">
                  {l}
                </span>
              ))}
            </div>
          </CredentialCard>

          <CredentialCard icon={Bot} title="In-cabin AI">
            <Row label="Tone" value={cap(ddi.aiPersona.tone)} verified />
            <Row label="Context" value="Loaded everywhere" verified />
          </CredentialCard>

          <CredentialCard icon={Wallet} title="Payment">
            <Row label="Primary" value={ddi.payment.primary} verified />
          </CredentialCard>

          <CredentialCard icon={Network} title="Trusted networks">
            <div className="flex flex-wrap gap-1.5">
              {ddi.trustedNetworks.map((n) => (
                <span key={n} className="rounded-md border border-white/10 bg-surface-100 px-2 py-1 text-[11px] text-gray-300">
                  {n}
                </span>
              ))}
            </div>
          </CredentialCard>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Stored locally. Revocable any time. The next car you enter will know exactly who you are.
          </p>
          <Button variant="ghost" onClick={handleRevoke} className="gap-2 text-red-400 hover:text-red-300">
            <Trash2 className="w-4 h-4" /> Revoke
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-xl font-bold text-white font-mono">{value}</p>
    </div>
  );
}

function CredentialCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </Card>
  );
}

function Row({ label, value, verified = false }: { label: string; value: string; verified?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="flex items-center gap-1.5 text-gray-200 font-medium">
        {value}
        {verified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
      </span>
    </div>
  );
}

function cap(s: string) {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
