import { Card, CardContent } from "@/components/ui/card";
import { Lock, Sparkles, Target, Star } from "lucide-react";

export default function OraclePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">
          Дигитален Оракул
        </h1>
        <p className="text-zinc-400">
          Задай въпрос и получи духовен съвет
        </p>
      </div>

      {/* Premium Lock Screen */}
      <Card className="glass-card border-accent-500/30">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="inline-flex p-6 bg-accent-900/20 rounded-full border border-accent-500/30">
              <Sparkles className="w-12 h-12 text-accent-400" />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-zinc-100">
                AI Асистент за Духовни Въпроси
              </h2>
              <p className="text-zinc-300 max-w-md mx-auto">
                Попитай Дигиталния Оракул за любов, кариера, здраве или личностно
                развитие. Получи мъдри съвети, базирани на твоята зодия и енергия.
              </p>
            </div>

            {/* Example Questions */}
            <div className="space-y-2 text-left max-w-sm mx-auto">
              <p className="text-sm text-zinc-400 font-semibold mb-3">
                Примерни въпроси:
              </p>
              {[
                "Да приема ли новата работа?",
                "Какво ме очаква в любовта?",
                "Как да подобря енергията си?",
              ].map((question, i) => (
                <div
                  key={i}
                  className="px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm text-zinc-300"
                >
                  "{question}"
                </div>
              ))}
            </div>

            {/* Lock indicator */}
            <div className="flex items-center justify-center gap-2 text-accent-400">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-semibold">Премиум функция</span>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <button className="w-full px-6 py-4 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-all font-semibold text-lg shadow-lg">
                Отключи за 9.99 лв./месец
              </button>
              <p className="text-xs text-zinc-500">
                Basic: 3 въпроса/ден • Ultimate: 10 въпроса/ден
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 text-accent-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-200">
              Персонализирани отговори
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6 text-center">
            <Star className="w-8 h-8 text-accent-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-200">
              Базирани на зодията ти
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
