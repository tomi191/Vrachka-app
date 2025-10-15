"use client";

import { useState } from "react";
import { Bell, Mail, Moon, Check } from "lucide-react";

interface SettingsFormProps {
  userEmail: string;
}

export function SettingsForm({ userEmail }: SettingsFormProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dailyReminders: true,
    weeklyDigest: false,
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = async (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    // Show saved indicator
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // TODO: Save to database when preferences table is created
    console.log("Settings updated:", { ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      {/* Save Indicator */}
      {saved && (
        <div className="fixed top-4 right-4 z-50 p-3 bg-green-900/90 border border-green-600/50 rounded-lg shadow-lg animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-100">Запазено</span>
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
          description="Известия в браузъра (скоро)"
          checked={settings.pushNotifications}
          onChange={() => handleToggle("pushNotifications")}
          disabled
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
