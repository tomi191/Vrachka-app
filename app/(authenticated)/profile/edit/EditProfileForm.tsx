"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { calculateZodiacSign } from "@/lib/zodiac";

interface EditProfileFormProps {
  profile: any;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Calculate new zodiac sign if birth date changed
      const zodiac_sign = calculateZodiacSign(new Date(formData.birth_date));

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
    <form onSubmit={handleSubmit} className="space-y-4">
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
        {formData.birth_date !== profile?.birth_date && (
          <div className="mt-2 flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-200">
              Промяната на рождената дата ще промени и зодията ти
            </p>
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
