"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePassport } from "@/lib/passport-context";
import { Navbar } from "@/components/navbar";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export default function PassportPage() {
  const { passport, loading, revoke } = usePassport();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !passport) router.push("/claim");
  }, [loading, passport, router]);

  if (loading || !passport) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh] text-gray-400 animate-pulse">
          Loading your DDI...
        </div>
      </div>
    );
  }

  const issued = new Date(passport.issuedAt);
  const credentialCount =
    1 +
    passport.licenses.length +
    passport.insurance.length +
    (Object.keys(passport.accessibility).length > 0 ? 1 : 0) +
    1 + // languages
    1; // payment

  const handleRevoke = () => {
    if (confirm("Revoke your DDI? You can issue a new one anytime.")) {
      revoke();
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Universal Mobility Passport</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Verified credentials that travel with you to every vehicle, mode, and border.
            </p>
          </div>
          <Link href="/journey">
            <Button className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0">
              <Compass className="w-4 h-4" /> Run Journey
            </Button>
          </Link>
        </div>

        {/* PASSPORT CARD */}
        <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-950/50 via-surface-50 to-surface p-8 sm:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px]" />

          <div className="relative">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <LogoMark size={48} />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-sky-300/80 font-semibold">
                    Universal Mobility Passport
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Issued by Futuristic DDI Authority</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Trust score</p>
                <p className="text-2xl font-bold text-sky-300 font-mono">{passport.trustScore}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Holder</p>
                <p className="text-2xl font-bold text-white">{passport.holderName}</p>
                <p className="text-sm text-gray-400 mt-1">{passport.homeCity}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">DDI ID</p>
                <p className="text-sm font-mono text-sky-200 break-all">{passport.id}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Issued {issued.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10">
              <Stat label="Credentials" value={credentialCount} />
              <Stat label="Networks" value={passport.trustedNetworks.length} />
              <Stat label="Languages" value={passport.languages.length} />
            </div>
          </div>
        </div>

        {/* CREDENTIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CredentialCard icon={Fingerprint} title="Identity">
            <Row label="Status" value="Verified" verified />
            <Row label="Biometric" value={passport.identity.biometric ? "Linked" : "Not linked"} verified={passport.identity.biometric} />
          </CredentialCard>

          <CredentialCard icon={Globe} title="Cross-Border Licenses">
            {passport.licenses.map((l) => (
              <Row key={l.type} label={l.type} value={l.issuer} verified={l.verified} />
            ))}
          </CredentialCard>

          <CredentialCard icon={Shield} title="Insurance Portability">
            {passport.insurance.map((i) => (
              <Row key={i.carrier} label={i.carrier} value={i.coverage === "global" ? "Global" : "Domestic"} verified={i.verified} />
            ))}
          </CredentialCard>

          <CredentialCard icon={Accessibility} title="Adaptive Accessibility">
            {Object.entries(passport.accessibility).length === 0 ? (
              <Row label="Profile" value="No needs declared" verified />
            ) : (
              Object.entries(passport.accessibility).map(([k, v]) => (
                <Row key={k} label={cap(k)} value={String(v)} verified />
              ))
            )}
          </CredentialCard>

          <CredentialCard icon={Languages} title="Languages">
            <div className="flex flex-wrap gap-2">
              {passport.languages.map((l) => (
                <span
                  key={l}
                  className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs uppercase tracking-wider text-sky-200 font-medium"
                >
                  {l}
                </span>
              ))}
            </div>
          </CredentialCard>

          <CredentialCard icon={Bot} title="AI Travel Assistant">
            <Row label="Tone" value={cap(passport.aiPersona.tone)} verified />
            <Row label="Context" value="Loaded everywhere" verified />
          </CredentialCard>

          <CredentialCard icon={Wallet} title="Payment">
            <Row label="Primary" value={passport.payment.primary} verified />
          </CredentialCard>

          <CredentialCard icon={Network} title="Trusted Networks">
            <div className="flex flex-wrap gap-1.5">
              {passport.trustedNetworks.map((n) => (
                <span
                  key={n}
                  className="rounded-md border border-white/10 bg-surface-100 px-2 py-1 text-[11px] text-gray-300"
                >
                  {n}
                </span>
              ))}
            </div>
          </CredentialCard>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Your passport is stored locally and revocable at any time.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/journey">
              <Button variant="secondary" className="gap-2">
                <Compass className="w-4 h-4" /> Take Journey
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleRevoke} className="gap-2 text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4" /> Revoke
            </Button>
          </div>
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

function Row({
  label,
  value,
  verified = false,
}: {
  label: string;
  value: string;
  verified?: boolean;
}) {
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
  return s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}
