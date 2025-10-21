"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationsDropdown({
  isOpen,
  onClose,
  onUnreadCountChange,
}: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  async function fetchNotifications() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/notifications?limit=10');

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications || []);

      // Update unread count
      const unreadCount = data.notifications.filter((n: Notification) => !n.read).length;
      onUnreadCountChange?.(unreadCount);
    } catch (err) {
      console.error('Notifications fetch error:', err);
      setError('Не успяхме да заредим известията');
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId: string, link: string | null) {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );

      // Update unread count
      const unreadCount = notifications.filter(n => n.id !== notificationId && !n.read).length;
      onUnreadCountChange?.(unreadCount);

      // Mark as read in backend
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });

      // Navigate if has link
      if (link) {
        router.push(link);
        onClose();
      }
    } catch (err) {
      console.error('Mark as read error:', err);
      // Revert optimistic update on error
      fetchNotifications();
    }
  }

  async function markAllAsRead() {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      onUnreadCountChange?.(0);

      // Mark all as read in backend
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
    } catch (err) {
      console.error('Mark all as read error:', err);
      // Revert on error
      fetchNotifications();
    }
  }

  if (!isOpen) return null;

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] z-50"
    >
      <Card className="glass-card shadow-xl border border-mystic-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-mystic-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-mystic-400" />
            <h3 className="font-semibold text-zinc-50">Известия</h3>
            {unreadNotifications.length > 0 && (
              <span className="text-xs bg-cosmic-500 text-white px-2 py-0.5 rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-mystic-900/50 rounded transition-colors"
          >
            <X className="w-4 h-4 text-mystic-400" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 text-accent-400 animate-spin" />
              <p className="text-sm text-zinc-400">Зареждаме известията...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Bell className="w-8 h-8 text-zinc-600" />
              <p className="text-zinc-400 text-sm">Няма нови известия</p>
            </div>
          ) : (
            <>
              {/* Mark all as read button */}
              {unreadNotifications.length > 0 && (
                <div className="p-2 border-b border-mystic-800">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-accent-400 hover:text-accent-300 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Маркирай всички като прочетени
                  </button>
                </div>
              )}

              {/* Notifications list */}
              <div className="divide-y divide-mystic-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id, notification.link)}
                    className={`p-4 cursor-pointer transition-colors ${
                      notification.read
                        ? 'hover:bg-mystic-900/30'
                        : 'bg-mystic-900/50 hover:bg-mystic-900/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread dot */}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-cosmic-500 rounded-full mt-1.5 flex-shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-50 mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-zinc-600 mt-1">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

/**
 * Format relative time (e.g., "преди 5 минути")
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'току-що';
  if (diffMins < 60) return `преди ${diffMins} ${diffMins === 1 ? 'минута' : 'минути'}`;
  if (diffHours < 24) return `преди ${diffHours} ${diffHours === 1 ? 'час' : 'часа'}`;
  if (diffDays < 7) return `преди ${diffDays} ${diffDays === 1 ? 'ден' : 'дни'}`;

  return date.toLocaleDateString('bg-BG', { day: 'numeric', month: 'short' });
}
