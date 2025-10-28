"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Bell } from "lucide-react";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";

interface TopHeaderProps {
  streak?: number;
  showNotifications?: boolean;
}

export function TopHeader({ streak = 0, showNotifications = true }: TopHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count on mount
  useEffect(() => {
    if (showNotifications) {
      fetchUnreadCount();
    }
  }, [showNotifications]);

  async function fetchUnreadCount() {
    try {
      const response = await fetch('/api/notifications/count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }

  function toggleDropdown() {
    setIsDropdownOpen(prev => !prev);
  }

  function handleUnreadCountChange(count: number) {
    setUnreadCount(count);
  }

  return (
    <header className="sticky top-0 z-40 bg-mystic-950/95 backdrop-blur-lg border-b border-mystic-800">
      <div className="container max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="relative">
            {/* SVG Logo */}
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300 group-hover:scale-110">
              <defs>
                <radialGradient id="logo-grad" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#e879f9"/>
                  <stop offset="30%" stopColor="#c084fc"/>
                  <stop offset="70%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#7c3aed"/>
                </radialGradient>
                <radialGradient id="logo-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4"/>
                  <stop offset="50%" stopColor="#e879f9" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
                </radialGradient>
                <mask id="logo-mask" maskUnits="userSpaceOnUse">
                  <rect width="48" height="48" fill="black"/>
                  <circle cx="24" cy="24" r="18" fill="white"/>
                  <ellipse cx="20" cy="20" rx="6" ry="8" fill="black"/>
                </mask>
              </defs>

              {/* Outer glow */}
              <circle cx="24" cy="24" r="22" fill="url(#logo-glow)" opacity="0.3"/>

              {/* Crystal ball */}
              <g mask="url(#logo-mask)">
                <circle cx="24" cy="24" r="18" fill="url(#logo-grad)"/>
              </g>

              {/* Central star */}
              <g transform="translate(24,24) scale(0.6)">
                <path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z" fill="#fef3c7"/>
              </g>

              {/* Sparkles */}
              <circle cx="8" cy="14" r="1" fill="#fbbf24" opacity="0.7">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="40" cy="18" r="0.8" fill="#fbbf24" opacity="0.6">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
              </circle>
            </svg>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </div>
          <span className="font-bold text-lg gradient-text group-hover:text-white transition-colors duration-300">Vrachka</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-mystic-900/50 rounded-full">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-mystic-200">
                {streak}
              </span>
            </div>
          )}

          {/* Notifications */}
          {showNotifications && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="relative p-2 hover:bg-mystic-900/50 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5 text-mystic-400" />
                {/* Notification dot - show only if unread count > 0 */}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-cosmic-500 rounded-full" />
                )}
              </button>

              <NotificationsDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onUnreadCountChange={handleUnreadCountChange}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
