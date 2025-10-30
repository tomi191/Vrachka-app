"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Sparkles,
  MessageCircle,
  User,
  BookOpen,
  Stars,
  LogOut,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  userPlan?: string;
  userName?: string;
  userEmail?: string;
}

const navItems = {
  main: [
    { name: "Днес", href: "/dashboard", icon: Home },
    { name: "Таро", href: "/tarot", icon: Sparkles },
    { name: "Оракул", href: "/oracle", icon: MessageCircle, premium: true },
    { name: "Профил", href: "/profile", icon: User },
  ],
  content: [
    { name: "Блог", href: "/blog", icon: BookOpen },
    { name: "Хороскопи", href: "/horoscope", icon: Stars },
  ],
};

export function Sidebar({ userPlan = "free", userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const planBadgeConfig = {
    free: { label: "Free", color: "bg-zinc-700 text-zinc-300" },
    basic: { label: "Basic", color: "bg-blue-600 text-white" },
    ultimate: { label: "Ultimate", color: "bg-gradient-to-r from-purple-600 to-pink-600 text-white" },
  };

  const badge = planBadgeConfig[userPlan as keyof typeof planBadgeConfig] || planBadgeConfig.free;

  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-72 bg-mystic-950 border-r border-mystic-800 z-50">
      <div className="flex flex-col h-full">
        {/* Logo & Plan Badge */}
        <div className="p-6 border-b border-mystic-800">
          <Link href="/dashboard" className="flex items-center gap-3 group mb-4">
            {/* Logo SVG */}
            <div className="relative">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300 group-hover:scale-110">
                <defs>
                  <radialGradient id="sidebar-logo-grad" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#e879f9"/>
                    <stop offset="30%" stopColor="#c084fc"/>
                    <stop offset="70%" stopColor="#8b5cf6"/>
                    <stop offset="100%" stopColor="#7c3aed"/>
                  </radialGradient>
                  <mask id="sidebar-logo-mask" maskUnits="userSpaceOnUse">
                    <rect width="48" height="48" fill="black"/>
                    <circle cx="24" cy="24" r="18" fill="white"/>
                    <ellipse cx="20" cy="20" rx="6" ry="8" fill="black"/>
                  </mask>
                </defs>
                <g mask="url(#sidebar-logo-mask)">
                  <circle cx="24" cy="24" r="18" fill="url(#sidebar-logo-grad)"/>
                </g>
                <g transform="translate(24,24) scale(0.6)">
                  <path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z" fill="#fef3c7"/>
                </g>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl gradient-text group-hover:text-white transition-colors">
                Vrachka
              </h1>
              <span className={cn(
                "inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1",
                badge.color
              )}>
                {badge.label}
              </span>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Webapp Section */}
          <div>
            <h3 className="text-xs font-semibold text-mystic-500 uppercase tracking-wider mb-2 px-3">
              Приложение
            </h3>
            <div className="space-y-1">
              {navItems.main.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                      isActive
                        ? "bg-mystic-900 text-mystic-400"
                        : "text-zinc-400 hover:bg-mystic-900/50 hover:text-zinc-200"
                    )}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {item.premium && (
                        <Zap className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />
                      )}
                    </div>
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-mystic-500 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Content Section */}
          <div>
            <h3 className="text-xs font-semibold text-mystic-500 uppercase tracking-wider mb-2 px-3">
              Съдържание
            </h3>
            <div className="space-y-1">
              {navItems.content.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                      isActive
                        ? "bg-mystic-900 text-mystic-400"
                        : "text-zinc-400 hover:bg-mystic-900/50 hover:text-zinc-200"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-mystic-500 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-mystic-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mystic-600 to-mystic-700 flex items-center justify-center">
              <User className="w-5 h-5 text-mystic-200" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">
                {userName || "Потребител"}
              </p>
              <p className="text-xs text-mystic-500 truncate">
                {userEmail || "email@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
              "text-red-400 hover:bg-red-950/30 hover:text-red-300",
              isLoggingOut && "opacity-50 cursor-not-allowed"
            )}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isLoggingOut ? "Излизане..." : "Изход"}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
