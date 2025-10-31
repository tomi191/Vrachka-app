"use client";

import { useEffect, useState } from "react";
import SunCalc from "suncalc";
import { Moon, Sunrise, Sunset } from "lucide-react";

interface MoonData {
  phase: number; // 0-1
  illumination: number; // 0-100%
  phaseName: string;
  emoji: string;
  moonrise: string | null;
  moonset: string | null;
  spiritualMeaning: string;
}

function getMoonPhaseInfo(phase: number): { name: string; emoji: string; meaning: string } {
  const normalizedPhase = phase % 1;

  if (normalizedPhase < 0.03 || normalizedPhase > 0.97) {
    return {
      name: "Новолуние",
      emoji: "🌑",
      meaning: "Време за нови начала и поставяне на намерения. Идеално за стартиране на проекти и визуализация на целите.",
    };
  } else if (normalizedPhase < 0.22) {
    return {
      name: "Нарастваща луна",
      emoji: "🌒",
      meaning: "Фаза на растеж и развитие. Време да вземеш действие по плановете си и да градиш нови навици.",
    };
  } else if (normalizedPhase < 0.28) {
    return {
      name: "Първа четвърт",
      emoji: "🌓",
      meaning: "Време за решителност и преодоляване на препятствия. Вземи решения и действай смело.",
    };
  } else if (normalizedPhase < 0.47) {
    return {
      name: "Нарастваща гърбава луна",
      emoji: "🌔",
      meaning: "Финализирай проектите и усъвършенствай плановете си. Почти сме готови за кулминация.",
    };
  } else if (normalizedPhase < 0.53) {
    return {
      name: "Пълнолуние",
      emoji: "🌕",
      meaning: "Връхна точка на лунния цикъл. Време за благодарност, празнуване и пускане на старото.",
    };
  } else if (normalizedPhase < 0.72) {
    return {
      name: "Намаляваща гърбава луна",
      emoji: "🌖",
      meaning: "Време за споделяне на мъдрост и благодарност. Рефлектирай върху постигнатото.",
    };
  } else if (normalizedPhase < 0.78) {
    return {
      name: "Последна четвърт",
      emoji: "🌗",
      meaning: "Освобождаване и прощаване. Отпусни това, което не ти служи вече.",
    };
  } else {
    return {
      name: "Намаляваща луна",
      emoji: "🌘",
      meaning: "Почивка и подготовка за нов цикъл. Време за медитация и вътрешна работа.",
    };
  }
}

export function LiveMoonPhaseWidget() {
  const [moonData, setMoonData] = useState<MoonData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateMoonData = () => {
      const now = new Date();
      setCurrentTime(now);

      // Sofia coordinates
      const lat = 42.6977;
      const lng = 23.3219;

      const illumination = SunCalc.getMoonIllumination(now);
      const times = SunCalc.getMoonTimes(now, lat, lng);

      const phaseInfo = getMoonPhaseInfo(illumination.phase);

      setMoonData({
        phase: illumination.phase,
        illumination: Math.round(illumination.fraction * 100),
        phaseName: phaseInfo.name,
        emoji: phaseInfo.emoji,
        spiritualMeaning: phaseInfo.meaning,
        moonrise: times.rise
          ? times.rise.toLocaleTimeString("bg-BG", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        moonset: times.set
          ? times.set.toLocaleTimeString("bg-BG", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
      });
    };

    updateMoonData();

    // Update every minute
    const interval = setInterval(updateMoonData, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!moonData) {
    return (
      <div className="glass-card p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 border-2 border-accent-500/30">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 text-sm text-accent-400 mb-4">
          <Moon className="w-4 h-4" />
          <span>Текуща фаза</span>
        </div>
        <h2 className="text-3xl font-bold text-zinc-50 mb-2">
          {currentTime.toLocaleDateString("bg-BG", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>

      {/* Moon Display */}
      <div className="flex flex-col items-center mb-8">
        {/* Large emoji with glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-accent-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative text-9xl" style={{ filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.5))" }}>
            {moonData.emoji}
          </div>
        </div>

        {/* Phase name */}
        <h3 className="text-3xl font-bold text-zinc-50 mb-2">{moonData.phaseName}</h3>

        {/* Illumination */}
        <div className="flex items-center gap-3 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-400">{moonData.illumination}%</div>
            <div className="text-sm text-zinc-500">осветена</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mb-6">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${moonData.illumination}%` }}
            />
          </div>
        </div>

        {/* Moonrise/Moonset */}
        <div className="flex gap-6">
          {moonData.moonrise && (
            <div className="flex items-center gap-2">
              <Sunrise className="w-5 h-5 text-accent-400" />
              <div>
                <div className="text-xs text-zinc-500">Изгрев</div>
                <div className="text-sm font-semibold text-zinc-300">{moonData.moonrise}</div>
              </div>
            </div>
          )}
          {moonData.moonset && (
            <div className="flex items-center gap-2">
              <Sunset className="w-5 h-5 text-accent-400" />
              <div>
                <div className="text-xs text-zinc-500">Залез</div>
                <div className="text-sm font-semibold text-zinc-300">{moonData.moonset}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spiritual meaning */}
      <div className="p-6 bg-gradient-to-br from-accent-500/10 to-purple-500/10 rounded-lg border border-accent-500/20">
        <h4 className="text-sm font-semibold text-accent-300 mb-2">Духовно значение</h4>
        <p className="text-zinc-300 leading-relaxed">{moonData.spiritualMeaning}</p>
      </div>
    </div>
  );
}
