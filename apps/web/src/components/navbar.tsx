"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";
import { User, Car, Building2, LogOut, Play, Fingerprint } from "lucide-react";

const roleRoutes: Record<string, { href: string; label: string; icon: React.ReactNode }> = {
  DRIVER: { href: "/dashboard/driver", label: "My DDI", icon: <Fingerprint className="w-4 h-4" /> },
  OWNER: { href: "/dashboard/owner", label: "Vehicles", icon: <Car className="w-4 h-4" /> },
  FLEET_OPERATOR: { href: "/dashboard/fleet", label: "Fleets", icon: <Building2 className="w-4 h-4" /> },
};

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const roleLink = user ? roleRoutes[user.role] : null;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={28} />
            <span className="text-lg font-bold text-white tracking-tight">Futuristic</span>
            <span className="text-[10px] text-sky-400 font-semibold border border-sky-500/20 rounded-full px-1.5 py-0.5 leading-none">DDI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="gap-1.5 text-sky-400 hover:text-sky-300">
                <Play className="w-3.5 h-3.5" />
                Demo
              </Button>
            </Link>
            {user ? (
              <>
                {roleLink && (
                  <Link href={roleLink.href}>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      {roleLink.icon}
                      {roleLink.label}
                    </Button>
                  </Link>
                )}
                <div className="text-sm text-gray-400">{user.name}</div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-gray-400">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Create DDI</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
