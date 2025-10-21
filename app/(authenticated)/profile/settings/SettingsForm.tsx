"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, Moon, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { subscribeToPush, unsubscribeFromPush, isPushSupported } from "@/lib/push/client";

interface SettingsFormProps {
  userEmail: string;
}

interface UserPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  daily_reminders: boolean;
  weekly_digest: boolean;
}

export function SettingsForm({ userEmail }: SettingsFormProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dailyReminders: true,
    weeklyDigest: false,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load preferences from database
  useEffect(() => {
    async function loadPreferences() {
      const supabase = createClient();
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get or create preferences
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading preferences:', error);
          return;
        }

        // If preferences exist, load them
        if (data) {
          setSettings({
            emailNotifications: data.email_notifications,
            pushNotifications: data.push_notifications,
            dailyReminders: data.daily_reminders,
            weeklyDigest: data.weekly_digest,
          });
        } else {
          // Create default preferences
          await supabase
            .from('user_preferences')
            .insert({
              user_id: user.id,
              email_notifications: true,
              push_notifications: false,
              daily_reminders: true,
              weekly_digest: false,
            });
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, []);

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !settings[key];

    // Special handling for push notifications
    if (key === 'pushNotifications') {
      if (!isPushSupported()) {
        setError('Push notifications не се поддържат в този браузър');
        setTimeout(() => setError(''), 3000);
        return;
      }

      try {
        if (newValue) {
          // Subscribe to push
          await subscribeToPush();
        } else {
          // Unsubscribe from push
          await unsubscribeFromPush();
        }
      } catch (err) {
        console.error('Push notification error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Грешка при активиране на notifications'
        );
        setTimeout(() => setError(''), 3000);
        return;
      }
    }

    // Optimistically update UI
    setSettings((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Map camelCase to snake_case
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase() as keyof UserPreferences;

      // Update in database
      const { error } = await supabase
        .from('user_preferences')
        .update({ [dbKey]: newValue })
        .eq('user_id', user.id);

      if (error) throw error;

      // Show saved indicator
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save preference:', err);
      setError('Грешка при запазване на настройките');

      // Revert optimistic update
      setSettings((prev) => ({
        ...prev,
        [key]: !newValue,
      }));

      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-accent-400 animate-spin" />
        <span className="ml-2 text-zinc-400">Зареждане на настройки...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Save Indicator */}
      {saved && (
        <div className="fixed top-4 right-4 z-50 p-3 bg-green-900/90 border border-green-600/50 rounded-lg shadow-lg animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-100">Запазено</span>
        </div>
      )}

      {/* Error Indicator */}
      {error && (
        <div className="fixed top-4 right-4 z-50 p-3 bg-red-900/90 border border-red-600/50 rounded-lg shadow-lg animate-fade-in">
          <span className="text-sm text-red-100">{error}</span>
        </div>
      )}

      {/* Email Notifications */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-zinc-400" />
          <h3 className="text-lg font-semibold text-zinc-100">
            Email Известия
          </h3>
        </div>

        <SettingToggle
          label="Email нотификации"
          description={`Изпращане на имейли към ${userEmail}`}
          checked={settings.emailNotifications}
          onChange={() => handleToggle("emailNotifications")}
        />

        <SettingToggle
          label="Седмичен дайджест"
          description="Резюме на седмицата всяка неделя"
          checked={settings.weeklyDigest}
          onChange={() => handleToggle("weeklyDigest")}
        />
      </div>

      <div className="border-t border-zinc-800" />

      {/* Push Notifications */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-zinc-400" />
          <h3 className="text-lg font-semibold text-zinc-100">
            Push Известия
          </h3>
        </div>

        <SettingToggle
          label="Push notifications"
          description="Получавай уведомления в браузъра"
          checked={settings.pushNotifications}
          onChange={() => handleToggle("pushNotifications")}
        />

        <SettingToggle
          label="Дневни напомняния"
          description="Напомняне да проверите хороскопа си"
          checked={settings.dailyReminders}
          onChange={() => handleToggle("dailyReminders")}
        />
      </div>

      <div className="border-t border-zinc-800" />

      {/* Theme (Future) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5 text-zinc-400" />
          <h3 className="text-lg font-semibold text-zinc-100">Изглед</h3>
        </div>

        <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
          <p className="text-sm text-zinc-400">
            Vrachka използва тъмна тема по подразбиране.
            <br />
            Светла тема ще бъде добавена скоро!
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-zinc-200">{label}</p>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          checked ? "bg-accent-600" : "bg-zinc-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
