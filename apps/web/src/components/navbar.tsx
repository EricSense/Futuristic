"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePassport } from "@/lib/passport-context";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";
import { Fingerprint, Compass, LogOut, Eye, Network, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/recognize", label: "Recognize", icon: Eye },
  { href: "/journey", label: "Journey", icon: Compass },
  { href: "/platform", label: "Platform", icon: Network },
];

export function Navbar() {
  const { passport, revoke } = usePassport();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleRevoke = () => {
    revoke();
    setOpen(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <LogoMark size={28} />
            <span className="text-lg font-bold text-white tracking-tight">Futuristic</span>
            <span className="text-[10px] text-sky-400 font-semibold border border-sky-500/20 rounded-full px-1.5 py-0.5 leading-none">
              DDI
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Button>
              </Link>
            ))}
            <div className="w-px h-5 bg-white/10 mx-2" />
            {passport ? (
              <>
                <Link href="/passport">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5" />
                    My Passport
                  </Button>
                </Link>
                <span className="text-sm text-gray-400 hidden lg:inline ml-1">
                  {passport.holderName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRevoke}
                  className="gap-1.5 text-gray-400"
                  title="Revoke passport"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link href="/claim">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5" />
                  Claim Passport
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-300 p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all border-t border-white/5",
            open ? "max-h-96 py-3" : "max-h-0 py-0",
          )}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
            <div className="h-px bg-white/5 my-2" />
            {passport ? (
              <>
                <Link href="/passport" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <Fingerprint className="w-4 h-4" />
                    My Passport ({passport.holderName})
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRevoke}
                  className="w-full justify-start gap-2 text-gray-400"
                >
                  <LogOut className="w-4 h-4" />
                  Revoke passport
                </Button>
              </>
            ) : (
              <Link href="/claim" onClick={() => setOpen(false)}>
                <Button variant="primary" size="sm" className="w-full justify-start gap-2">
                  <Fingerprint className="w-4 h-4" />
                  Claim Passport
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
