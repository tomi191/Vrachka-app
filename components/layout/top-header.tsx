"use client";

import { useEffect, useState } from "react";
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mystic-500 to-cosmic-500 flex items-center justify-center text-white font-bold text-sm">
            V
          </div>
          <span className="font-bold text-lg gradient-text">Vrachka</span>
        </div>

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
