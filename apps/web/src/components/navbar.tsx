"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Zap, User, Car, Building2, LogOut } from "lucide-react";

const roleRoutes: Record<string, { href: string; label: string; icon: React.ReactNode }> = {
  DRIVER: { href: "/dashboard/driver", label: "My Identity", icon: <User className="w-4 h-4" /> },
  OWNER: { href: "/dashboard/owner", label: "My Vehicles", icon: <Car className="w-4 h-4" /> },
  FLEET_OPERATOR: { href: "/dashboard/fleet", label: "My Fleets", icon: <Building2 className="w-4 h-4" /> },
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
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-lg shadow-brand-600/25">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Futuristic
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {roleLink && (
                  <Link href={roleLink.href}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      {roleLink.icon}
                      {roleLink.label}
                    </Button>
                  </Link>
                )}
                <div className="text-sm text-gray-400">
                  {user.name}
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-gray-400">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
