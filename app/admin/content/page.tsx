import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  ArrowLeft,
  CreditCard,
  MessageSquare,
  Database,
} from "lucide-react";
import Link from "next/link";

export default async function AdminContentPage() {
  const supabase = await createClient();

  const [
    { data: dailyContent },
    { data: tarotCards },
    { data: tarotReadings },
    { data: oracleConversations },
    { data: contentCache },
  ] = await Promise.all([
    supabase.from("daily_content").select("*").order("content_date", { ascending: false }).limit(20),
    supabase.from("tarot_cards").select("*").order("card_number", { ascending: true }),
    supabase
      .from("tarot_readings")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("oracle_conversations")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase.from("content_cache").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <div className="min-h-screen bg-brand-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="text-zinc-400 hover:text-zinc-300 flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад към Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-zinc-50">Съдържание</h1>
          <p className="text-zinc-400">Управление на всичко съдържание</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatsCard
            label="Дневно съдържание"
            value={dailyContent?.length || 0}
            icon={<FileText className="w-4 h-4 text-blue-400" />}
          />
          <StatsCard
            label="Таро карти"
            value={tarotCards?.length || 0}
            icon={<CreditCard className="w-4 h-4 text-orange-400" />}
          />
          <StatsCard
            label="Таро четения"
            value={tarotReadings?.length || 0}
            icon={<CreditCard className="w-4 h-4 text-accent-400" />}
          />
          <StatsCard
            label="Oracle разговори"
            value={oracleConversations?.length || 0}
            icon={<MessageSquare className="w-4 h-4 text-cyan-400" />}
          />
          <StatsCard
            label="Кеш записи"
            value={contentCache?.length || 0}
            icon={<Database className="w-4 h-4 text-green-400" />}
          />
        </div>

        {/* Daily Content */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Дневно съдържание
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dailyContent && dailyContent.length > 0 ? (
                dailyContent.map((content) => (
                  <div
                    key={content.id}
                    className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-zinc-100">
                          {content.zodiac_sign} • {content.content_type}
                        </p>
                        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                          {content.content}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {new Date(content.content_date).toLocaleDateString(
                          "bg-BG"
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-8">
                  Няма дневно съдържание
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tarot Cards */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-400" />
              Таро карти ({tarotCards?.length || 0}/78)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {tarotCards && tarotCards.length > 0 ? (
                tarotCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-center"
                  >
                    <p className="text-sm font-semibold text-zinc-100">
                      {card.name_bg}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">{card.suit}</p>
                    <p className="text-xs text-zinc-600">#{card.card_number}</p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 col-span-full text-center py-8">
                  Няма таро карти
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tarot Readings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent-400" />
              Последни таро четения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tarotReadings && tarotReadings.length > 0 ? (
                tarotReadings.map((reading) => (
                  <div
                    key={reading.id}
                    className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-zinc-100">
                          {reading.profiles?.full_name || "Unknown"}
                        </p>
                        <p className="text-sm text-zinc-400">
                          {reading.reading_type} • {reading.cards_count} карти
                        </p>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {new Date(reading.created_at).toLocaleDateString(
                          "bg-BG"
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-8">Няма четения</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Oracle Conversations */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Последни Oracle разговори
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {oracleConversations && oracleConversations.length > 0 ? (
                oracleConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-zinc-100">
                          {conv.profiles?.full_name || "Unknown"}
                        </p>
                        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                          Q: {conv.question}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {new Date(conv.created_at).toLocaleDateString("bg-BG")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-8">
                  Няма разговори
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="flex justify-center mb-2">{icon}</div>
          <p className="text-2xl font-bold text-zinc-50">{value}</p>
          <p className="text-xs text-zinc-400 mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
