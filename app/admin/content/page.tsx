import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  ArrowLeft,
  CreditCard,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { OracleConversationsTab } from "@/components/admin/OracleConversationsTab";

export default async function AdminContentPage() {
  const supabase = await createClient();

  // Verify user is admin (security check)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    throw new Error('Forbidden - Admin access required');
  }

  // Fetch oracle conversations using RPC function (includes user emails)
  const { data: oracleConversationsRaw } = await supabase
    .rpc('get_oracle_conversations_admin', { limit_count: 100 });

  // Map to expected format for OracleConversationsTab component
  const oracleConversations = oracleConversationsRaw?.map((conv: any) => ({
    ...conv,
    profiles: {
      full_name: conv.user_full_name,
      email: conv.user_email,
    }
  })) || [];

  const [
    { data: dailyContent },
    { data: tarotCards },
    { data: tarotReadings },
  ] = await Promise.all([
    supabase
      .from("daily_content")
      .select("*")
      .order("target_date", { ascending: false })
      .limit(50),
    supabase.from("tarot_cards").select("*").order("id", { ascending: true }),
    supabase
      .from("tarot_readings")
      .select("*, profiles(full_name)")
      .order("read_at", { ascending: false })
      .limit(50),
  ]);

  // Count total items
  const { count: totalDailyContent } = await supabase
    .from("daily_content")
    .select("*", { count: "exact", head: true });

  const { count: totalTarotCards } = await supabase
    .from("tarot_cards")
    .select("*", { count: "exact", head: true });

  const { count: totalTarotReadings } = await supabase
    .from("tarot_readings")
    .select("*", { count: "exact", head: true });

  const totalOracleConversations = oracleConversations?.length || 0;

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
          <p className="text-zinc-400">Управление на всичко съдържание и AI разговори</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            label="Дневни хороскопи"
            value={totalDailyContent || 0}
            icon={<FileText className="w-4 h-4 text-blue-400" />}
          />
          <StatsCard
            label="Таро карти"
            value={totalTarotCards || 0}
            icon={<CreditCard className="w-4 h-4 text-orange-400" />}
          />
          <StatsCard
            label="Таро четения"
            value={totalTarotReadings || 0}
            icon={<CreditCard className="w-4 h-4 text-accent-400" />}
          />
          <StatsCard
            label="Oracle разговори"
            value={totalOracleConversations || 0}
            icon={<MessageSquare className="w-4 h-4 text-cyan-400" />}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="horoscopes" className="w-full">
          <TabsList className="glass-card w-full justify-start overflow-x-auto">
            <TabsTrigger value="horoscopes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Хороскопи ({dailyContent?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="oracle" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Оракул ({oracleConversations?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="tarot" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Таро ({tarotReadings?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Таро карти ({tarotCards?.length || 0}/78)
            </TabsTrigger>
          </TabsList>

          {/* Horoscopes Tab */}
          <TabsContent value="horoscopes" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-zinc-50 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Дневни хороскопи
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dailyContent && dailyContent.length > 0 ? (
                    dailyContent.map((content: any) => (
                      <div
                        key={content.id}
                        className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded">
                                {content.target_key}
                              </span>
                              <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                                {content.content_type}
                              </span>
                            </div>
                            <div className="text-sm text-zinc-300">
                              <p className="font-medium text-zinc-100 mb-1">Общо:</p>
                              <p className="line-clamp-2">{content.content_body?.general || 'N/A'}</p>
                            </div>
                            <div className="flex gap-4 text-xs text-zinc-500">
                              <span>❤️ {content.content_body?.loveStars || 'N/A'}/5</span>
                              <span>💼 {content.content_body?.careerStars || 'N/A'}/5</span>
                              <span>🏃 {content.content_body?.healthStars || 'N/A'}/5</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-zinc-400">
                              {new Date(content.target_date).toLocaleDateString("bg-BG")}
                            </p>
                            <p className="text-xs text-zinc-600 mt-1">
                              {new Date(content.generated_at).toLocaleTimeString("bg-BG")}
                            </p>
                          </div>
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
          </TabsContent>

          {/* Oracle Tab */}
          <TabsContent value="oracle" className="mt-6">
            <OracleConversationsTab conversations={oracleConversations || []} />
          </TabsContent>

          {/* Tarot Readings Tab */}
          <TabsContent value="tarot" className="mt-6">
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
                    tarotReadings.map((reading: any) => (
                      <div
                        key={reading.id}
                        className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold text-zinc-100">
                                {reading.profiles?.full_name || "Unknown"}
                              </p>
                              {reading.is_reversed && (
                                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded">
                                  reversed
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-zinc-400">
                              {reading.card_name_bg} - {reading.card_name}
                            </p>
                            <p className="text-sm text-zinc-300 mt-2 line-clamp-2">
                              {reading.interpretation}
                            </p>
                          </div>
                          <p className="text-xs text-zinc-500">
                            {new Date(reading.read_at).toLocaleDateString("bg-BG")}
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
          </TabsContent>

          {/* Tarot Cards Tab */}
          <TabsContent value="cards" className="mt-6">
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
                    tarotCards.map((card: any) => (
                      <div
                        key={card.id}
                        className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-center hover:border-orange-900/50 transition-colors"
                      >
                        <p className="text-sm font-semibold text-zinc-100">
                          {card.name_bg}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {card.card_type}
                        </p>
                        {card.suit && (
                          <p className="text-xs text-zinc-600">{card.suit}</p>
                        )}
                        <p className="text-xs text-zinc-700 mt-1">#{card.id}</p>
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
          </TabsContent>
        </Tabs>
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
