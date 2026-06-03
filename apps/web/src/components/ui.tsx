"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function Nav() {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-accent to-glow bg-clip-text text-transparent">
            Futuristic
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {!isAuth && (
            <>
              <Link href="/login" className="btn-ghost px-4 py-2 text-sm">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary px-4 py-2 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function DashboardNav({
  role,
  onLogout,
}: {
  role: string;
  onLogout: () => void;
}) {
  const links =
    role === "DRIVER"
      ? [{ href: "/dashboard/driver", label: "My DDI" }]
      : role === "OWNER"
        ? [{ href: "/dashboard/owner", label: "Surfaces" }]
        : [{ href: "/dashboard/fleet", label: "Operations" }];

  return (
    <nav className="border-b border-border/40 bg-surface/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold">
          <span className="bg-gradient-to-r from-accent to-glow bg-clip-text text-transparent">
            Futuristic
          </span>
        </Link>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-zinc-400 hover:text-white">
              {l.label}
            </Link>
          ))}
          <button onClick={onLogout} className="text-sm text-muted hover:text-white">
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

export function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={clsx("card", accent && "border-glow/30 bg-glow/5")}>
      <p className="label">{label}</p>
      <p className="font-display text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}

export function ProgressRing({ percent }: { percent: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="relative inline-flex h-24 w-24 items-center justify-center">
      <svg className="-rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#1e1e2e" strokeWidth="6" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="url(#grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute font-display text-lg font-bold">{percent}%</span>
    </div>
  );
}
