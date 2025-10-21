"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { getZodiacSign, zodiacSigns, type ZodiacSign } from "@/lib/zodiac";
import { AvatarUpload } from "@/components/AvatarUpload";

interface EditProfileFormProps {
  profile: {
    full_name: string;
    birth_date: string;
    birth_time?: string;
    birth_place?: string;
    avatar_url?: string | null;
  } | null;
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    birth_date: profile?.birth_date || "",
    birth_time: profile?.birth_time || "",
    birth_place: profile?.birth_place || "",
  });

  // Calculate zodiac signs for preview
  const originalZodiac = useMemo(() => {
    if (!profile?.birth_date) return null;
    const sign = getZodiacSign(new Date(profile.birth_date));
    return zodiacSigns[sign as ZodiacSign];
  }, [profile?.birth_date]);

  const newZodiac = useMemo(() => {
    if (!formData.birth_date) return null;
    const sign = getZodiacSign(new Date(formData.birth_date));
    return zodiacSigns[sign as ZodiacSign];
  }, [formData.birth_date]);

  const zodiacChanged = formData.birth_date !== profile?.birth_date && originalZodiac && newZodiac && originalZodiac.name !== newZodiac.name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Calculate new zodiac sign if birth date changed
      const zodiac_sign = getZodiacSign(new Date(formData.birth_date));

      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          zodiac_sign,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Грешка при запазване");
      }

      setSuccess(true);

      // Redirect back to profile after 1 second
      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нещо се обърка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <AvatarUpload
        currentAvatarUrl={profile?.avatar_url}
        userName={formData.full_name || "User"}
        onUploadSuccess={(url) => {
          // Avatar is saved separately, just refresh
          router.refresh();
        }}
        onRemove={() => {
          // Avatar is removed separately, just refresh
          router.refresh();
        }}
      />

      <div className="border-t border-zinc-800 pt-6" />

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Пълно име
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          required
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-accent-500 focus:outline-none"
          placeholder="Име"
        />
      </div>

      {/* Birth Date */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Рождена дата
        </label>
        <input
          type="date"
          value={formData.birth_date}
          onChange={(e) =>
            setFormData({ ...formData, birth_date: e.target.value })
          }
          required
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-accent-500 focus:outline-none"
        />
        {zodiacChanged && originalZodiac && newZodiac && (
          <div className="mt-2 flex items-center gap-3 p-3 bg-accent-950/30 border border-accent-600/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-accent-400 flex-shrink-0" />
            <div className="flex-1 flex items-center gap-2 text-sm">
              <span className="text-zinc-300">
                {originalZodiac.emoji} {originalZodiac.name}
              </span>
              <ArrowRight className="w-4 h-4 text-accent-400" />
              <span className="text-accent-300 font-semibold">
                {newZodiac.emoji} {newZodiac.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Birth Time (Optional) */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Час на раждане <span className="text-zinc-500">(опционално)</span>
        </label>
        <input
          type="time"
          value={formData.birth_time}
          onChange={(e) =>
            setFormData({ ...formData, birth_time: e.target.value })
          }
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-accent-500 focus:outline-none"
        />
      </div>

      {/* Birth Place (Optional) */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Място на раждане <span className="text-zinc-500">(опционално)</span>
        </label>
        <input
          type="text"
          value={formData.birth_place}
          onChange={(e) =>
            setFormData({ ...formData, birth_place: e.target.value })
          }
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-accent-500 focus:outline-none"
          placeholder="Град, Държава"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
          <p className="text-sm text-green-200">
            Промените са запазени успешно!
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Запазване...
          </>
        ) : (
          "Запази промените"
        )}
      </button>
    </form>
  );
}
