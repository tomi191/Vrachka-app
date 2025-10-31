"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  BookOpen,
  Stars,
  Info,
  Mail,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSections = {
  public: [
    { name: "Блог", href: "/blog", icon: BookOpen },
    { name: "Хороскопи", href: "/horoscope", icon: Stars },
    { name: "За нас", href: "/about", icon: Info },
    { name: "Контакти", href: "/contact", icon: Mail },
  ],
  account: [
    { name: "Настройки", href: "/profile/settings", icon: Settings },
  ],
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger animation after mount
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950/98 backdrop-blur-xl z-[70]",
          "shadow-2xl border-l border-zinc-700",
          "transition-transform duration-300 ease-out",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h2 className="text-lg font-bold text-zinc-50">Меню</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-mystic-900 rounded-lg transition-colors"
            aria-label="Затвори меню"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {/* Public Section */}
          <div className="p-4 space-y-1">
            <h3 className="text-xs font-semibold text-mystic-500 uppercase tracking-wider mb-2">
              Съдържание
            </h3>
            {menuSections.public.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                    isActive
                      ? "bg-mystic-900 text-mystic-400"
                      : "text-zinc-400 hover:bg-mystic-900/50 hover:text-zinc-200"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 font-medium">{item.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-700 my-2" />

          {/* Account Section */}
          <div className="p-4 space-y-1">
            <h3 className="text-xs font-semibold text-mystic-500 uppercase tracking-wider mb-2">
              Акаунт
            </h3>
            {menuSections.account.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                    isActive
                      ? "bg-mystic-900 text-mystic-400"
                      : "text-zinc-400 hover:bg-mystic-900/50 hover:text-zinc-200"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 font-medium">{item.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                "text-red-400 hover:bg-red-950/30 hover:text-red-300",
                isLoggingOut && "opacity-50 cursor-not-allowed"
              )}
            >
              <LogOut className="w-5 h-5" />
              <span className="flex-1 font-medium text-left">
                {isLoggingOut ? "Излизане..." : "Изход"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
