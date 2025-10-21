import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Sparkles, MessageCircle } from "lucide-react";

interface OracleHistoryCardProps {
  question: string;
  answer: string;
  askedAt: string;
  conversationId?: string | null;
}

export function OracleHistoryCard({
  question,
  answer,
  askedAt,
  conversationId,
}: OracleHistoryCardProps) {
  const questionWordCount = question.trim().split(/\s+/).length;
  const answerWordCount = answer.trim().split(/\s+/).length;

  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-accent-300">
                Врачката
              </span>
              {conversationId && (
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <MessageCircle className="w-3 h-3" />
                  <span>Разговор</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Calendar className="w-3 h-3" />
              {new Date(askedAt).toLocaleDateString("bg-BG", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Question */}
          <div className="p-4 bg-accent-950/20 border border-accent-600/20 rounded-lg">
            <p className="text-xs font-semibold text-accent-300 mb-2 flex items-center justify-between">
              <span>Твоят въпрос</span>
              <span className="text-zinc-500">{questionWordCount} думи</span>
            </p>
            <p className="text-sm text-zinc-200 leading-relaxed">{question}</p>
          </div>

          {/* Answer */}
          <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
            <p className="text-xs font-semibold text-accent-300 mb-2 flex items-center justify-between">
              <span>Отговор</span>
              <span className="text-zinc-500">{answerWordCount} думи</span>
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {answer}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
