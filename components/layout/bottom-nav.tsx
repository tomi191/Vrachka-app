"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Днес",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Таро",
    href: "/tarot",
    icon: Sparkles,
  },
  {
    name: "Оракул",
    href: "/oracle",
    icon: MessageCircle,
    premium: true,
  },
  {
    name: "Профил",
    href: "/profile",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-mystic-950/95 backdrop-blur-lg border-t border-mystic-800 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative",
                isActive
                  ? "text-mystic-400"
                  : "text-mystic-600 hover:text-mystic-500"
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.premium && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-cosmic-500 rounded-full" />
                )}
              </div>
              <span className="text-xs font-medium">{item.name}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-mystic-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
