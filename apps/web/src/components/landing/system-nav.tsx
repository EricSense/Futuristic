"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const anchors = [
  { href: "#demo", label: "DEMO" },
  { href: "#architecture", label: "SYSTEM" },
  { href: "#thesis", label: "THESIS" },
  { href: "#proof", label: "PROOF" },
];

export function SystemNav() {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-void/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-sm font-bold tracking-[0.35em] text-white">
          FUTURISTIC
        </Link>

        {!isAuth && (
          <div className="hidden items-center gap-8 md:flex">
            {anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="font-mono text-[10px] tracking-[0.25em] text-muted transition hover:text-accent"
              >
                {a.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isAuth && (
            <>
              <span className="hidden items-center gap-2 font-mono text-[10px] tracking-wider text-emerald-400 sm:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                IDENTITY ACTIVE
              </span>
              <Link href="/login" className="btn-ghost px-3 py-1.5 text-xs">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary px-3 py-1.5 text-xs">
                Enter
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
