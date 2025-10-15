import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get last 20 tarot readings
  const { data: readings } = await supabase
    .from("tarot_readings")
    .select("*")
    .eq("user_id", user!.id)
    .order("read_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        href="/profile"
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад към профил
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-50 mb-2">
          История на четенията
        </h1>
        <p className="text-zinc-400">
          Последните {readings?.length || 0} таро четения
        </p>
      </div>

      {/* Readings List */}
      {readings && readings.length > 0 ? (
        <div className="space-y-4">
          {readings.map((reading) => (
            <Card key={reading.id} className="glass-card">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Card Image */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-20 h-28 rounded-lg overflow-hidden shadow-lg"
                      style={{
                        transform: reading.is_reversed ? 'rotate(180deg)' : 'none'
                      }}
                    >
                      <img
                        src={reading.card_image_url}
                        alt={reading.card_name_bg}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-100">
                          {reading.card_name_bg}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          {reading.card_name}
                        </p>
                        {reading.is_reversed && (
                          <span className="text-xs text-red-400 font-semibold">
                            ОБЪРНАТА
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(reading.read_at).toLocaleDateString("bg-BG", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
                        <p className="text-xs font-semibold text-accent-300 mb-1">
                          Послание
                        </p>
                        <p className="text-sm text-zinc-300 line-clamp-2">
                          {reading.interpretation}
                        </p>
                      </div>

                      <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
                        <p className="text-xs font-semibold text-accent-300 mb-1">
                          Съвет
                        </p>
                        <p className="text-sm text-zinc-300 line-clamp-2">
                          {reading.advice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-zinc-400">
                Все още нямаш четения. Започни като тегл ишпърва карта! 🎴
              </p>
              <Link
                href="/tarot"
                className="inline-block mt-4 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
              >
                Тегли карта
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
