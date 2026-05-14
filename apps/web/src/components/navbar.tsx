"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePassport } from "@/lib/passport-context";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";
import { Fingerprint, Compass, LogOut, Play } from "lucide-react";

export function Navbar() {
  const { passport, revoke } = usePassport();
  const router = useRouter();

  const handleRevoke = () => {
    revoke();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={28} />
            <span className="text-lg font-bold text-white tracking-tight">Futuristic</span>
            <span className="text-[10px] text-sky-400 font-semibold border border-sky-500/20 rounded-full px-1.5 py-0.5 leading-none">
              DDI
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/journey">
              <Button variant="ghost" size="sm" className="gap-1.5 text-sky-400 hover:text-sky-300">
                <Compass className="w-4 h-4" />
                Journey
              </Button>
            </Link>
            {passport ? (
              <>
                <Link href="/passport">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Fingerprint className="w-4 h-4" />
                    My Passport
                  </Button>
                </Link>
                <span className="text-sm text-gray-400 hidden sm:inline">{passport.holderName}</span>
                <Button variant="ghost" size="sm" onClick={handleRevoke} className="gap-1.5 text-gray-400" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/journey">
                  <Button variant="ghost" size="sm" className="gap-1.5 sm:hidden">
                    <Play className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/claim">
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <Fingerprint className="w-4 h-4" />
                    Claim Passport
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
