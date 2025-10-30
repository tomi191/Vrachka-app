"use client";

import { useState, useEffect } from "react";
import { Mail, Moon, Check, Loader2, Shield, Lock, AtSign } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
  userEmail: string;
}

interface UserPreferences {
  email_notifications: boolean;
  weekly_digest: boolean;
}

export function SettingsForm({ userEmail }: SettingsFormProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyDigest: false,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Security settings state
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailChanging, setEmailChanging] = useState(false);
  const [passwordChanging, setPasswordChanging] = useState(false);

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
            weeklyDigest: data.weekly_digest,
          });
        } else {
          // Create default preferences
          await supabase
            .from('user_preferences')
            .insert({
              user_id: user.id,
              email_notifications: true,
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

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail || newEmail === userEmail) {
      setError("Моля, въведете нов имейл адрес");
      setTimeout(() => setError(""), 3000);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError("Моля, въведете валиден имейл адрес");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setEmailChanging(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      setSaved(true);
      setNewEmail("");
      setTimeout(() => {
        setSaved(false);
        setError("Моля, проверете имейла си за потвърждение на промяната");
      }, 2000);
      setTimeout(() => setError(""), 5000);
    } catch (err) {
      console.error("Email change error:", err);
      setError(err instanceof Error ? err.message : "Грешка при смяна на имейл");
      setTimeout(() => setError(""), 3000);
    } finally {
      setEmailChanging(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Моля, попълнете всички полета");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Паролите не съвпадат");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (newPassword.length < 6) {
      setError("Паролата трябва да е поне 6 символа");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setPasswordChanging(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Password change error:", err);
      setError(err instanceof Error ? err.message : "Грешка при смяна на парола");
      setTimeout(() => setError(""), 3000);
    } finally {
      setPasswordChanging(false);
    }
  };

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !settings[key];

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

      {/* Security Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-zinc-400" />
          <h3 className="text-lg font-semibold text-zinc-100">Сигурност</h3>
        </div>

        {/* Change Email */}
        <form onSubmit={handleEmailChange} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AtSign className="w-4 h-4 text-zinc-400" />
            <h4 className="font-medium text-zinc-200">Смяна на имейл</h4>
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-zinc-400">
              Текущ имейл: <span className="text-zinc-300">{userEmail}</span>
            </label>
            <input
              type="email"
              placeholder="Нов имейл адрес"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={emailChanging}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={emailChanging || !newEmail}
              className="w-full bg-accent-600 hover:bg-accent-700 disabled:opacity-50"
            >
              {emailChanging ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Променям...
                </>
              ) : (
                "Смени имейл"
              )}
            </Button>
            <p className="text-xs text-zinc-500">
              Ще получите потвърждение на новия имейл адрес
            </p>
          </div>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordChange} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-zinc-400" />
            <h4 className="font-medium text-zinc-200">Смяна на парола</h4>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Нова парола"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={passwordChanging}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-50"
            />
            <input
              type="password"
              placeholder="Потвърди новата парола"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={passwordChanging}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={passwordChanging || !newPassword || !confirmPassword}
              className="w-full bg-accent-600 hover:bg-accent-700 disabled:opacity-50"
            >
              {passwordChanging ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Променям...
                </>
              ) : (
                "Смени парола"
              )}
            </Button>
            <p className="text-xs text-zinc-500">
              Паролата трябва да е поне 6 символа
            </p>
          </div>
        </form>
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
