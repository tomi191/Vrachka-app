"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sunrise, Sunset, Loader2, ExternalLink } from "lucide-react";
import SunCalc from "suncalc";
import type { ZodiacSign } from "@/lib/zodiac";

interface MoonData {
  phase: number; // 0-1 where 0=new moon, 0.5=full moon
  illumination: number; // 0-100%
  phaseName: string;
  emoji: string;
  moonrise: string | null;
  moonset: string | null;
  spiritualMeaning: string;
}

/**
 * Get moon phase name and emoji based on phase value (0-1)
 */
function getMoonPhaseInfo(phase: number): { name: string; emoji: string; meaning: string } {
  // Normalize phase to 0-1
  const normalizedPhase = phase % 1;

  if (normalizedPhase < 0.03 || normalizedPhase > 0.97) {
    return {
      name: "Новолуние",
      emoji: "🌑",
      meaning: "Време за нови начала и поставяне на намерения. Идеален момент за планиране и визуализация на целите ти."
    };
  } else if (normalizedPhase < 0.22) {
    return {
      name: "Нарастваща луна",
      emoji: "🌒",
      meaning: "Фаза на растеж и развитие. Добро време за действие и реализация на плановете си."
    };
  } else if (normalizedPhase < 0.28) {
    return {
      name: "Първа четвърт",
      emoji: "🌓",
      meaning: "Време за вземане на решения и преодоляване на препятствия. Бъди активен и решителен."
    };
  } else if (normalizedPhase < 0.47) {
    return {
      name: "Нарастваща луна",
      emoji: "🌔",
      meaning: "Енергията се усилва. Продължавай да работиш усилено към целите си - резултатите идват."
    };
  } else if (normalizedPhase < 0.53) {
    return {
      name: "Пълнолуние",
      emoji: "🌕",
      meaning: "Кулминация и завършеност. Време за празнуване на постиженията и освобождаване от ненужното."
    };
  } else if (normalizedPhase < 0.72) {
    return {
      name: "Намаляваща луна",
      emoji: "🌖",
      meaning: "Фаза на рефлексия и благодарност. Добро време за анализ на опита и преосмисляне."
    };
  } else if (normalizedPhase < 0.78) {
    return {
      name: "Последна четвърт",
      emoji: "🌗",
      meaning: "Време за пускане и прощаване. Освободи се от старите навици и убеждения."
    };
  } else {
    return {
      name: "Намаляваща луна",
      emoji: "🌘",
      meaning: "Подготовка за нов цикъл. Почини се, медитирай и подготви се за нови начала."
    };
  }
}

/**
 * Format time in HH:MM format
 */
function formatTime(date: Date | null): string | null {
  if (!date) return null;

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Get personalized moon advice based on zodiac sign and phase
 */
function getPersonalizedAdvice(phaseName: string, zodiacSign?: ZodiacSign): string {
  if (!zodiacSign) {
    return "Регистрирай се за персонализирани препоръки според твоята зодия.";
  }

  // Fire signs (Aries, Leo, Sagittarius)
  const fireSigns: ZodiacSign[] = ["aries", "leo", "sagittarius"];
  // Earth signs (Taurus, Virgo, Capricorn)
  const earthSigns: ZodiacSign[] = ["taurus", "virgo", "capricorn"];
  // Air signs (Gemini, Libra, Aquarius)
  const airSigns: ZodiacSign[] = ["gemini", "libra", "aquarius"];
  // Water signs (Cancer, Scorpio, Pisces)
  const waterSigns: ZodiacSign[] = ["cancer", "scorpio", "pisces"];

  const isFire = fireSigns.includes(zodiacSign);
  const isEarth = earthSigns.includes(zodiacSign);
  const isAir = airSigns.includes(zodiacSign);
  const isWater = waterSigns.includes(zodiacSign);

  if (phaseName === "Новолуние") {
    if (isFire) return "Новолунието е твоето време за действие! Постави смели цели и започни нещо дръзко.";
    if (isEarth) return "Заземи намеренията си. Създай конкретен план с практични стъпки.";
    if (isAir) return "Визуализирай и комуникирай целите си. Говори за мечтите си с близки.";
    return "Почувствай дълбоко какво искаш. Доверѝ се на интуицията си.";
  }

  if (phaseName === "Пълнолуние") {
    if (isFire) return "Отпразнувай победите си! Енергията ти е на връх - искри ще хвърчат.";
    if (isEarth) return "Благодари за постигнатото и отпусни контрола. Довери се на процеса.";
    if (isAir) return "Обмисли постиженията си и сподели благодарността си с другите.";
    return "Емоциите могат да са силни - практикувай освобождаваща медитация.";
  }

  if (phaseName.includes("Нарастваща")) {
    if (isFire) return "Действай смело! Енергията расте - време е да вземеш инициативата.";
    if (isEarth) return "Градѝ последователно. Всяка малка стъпка те приближава към целта.";
    if (isAir) return "Мрежи се и комуникирай. Споделяй идеите си с единомишленици.";
    return "Слушай интуицията си - тя те води към правилната посока.";
  }

  if (phaseName.includes("Намаляваща")) {
    if (isFire) return "Намали темпото. Дори огънят се нуждае от почивка преди новото пламъче.";
    if (isEarth) return "Организирай и почисти - физически и емоционално. Подреди пространството си.";
    if (isAir) return "Рефлектирай и анализирай. Какво научи в последните седмици?";
    return "Почини се и обработи емоциите си. Медитацията е твой приятел сега.";
  }

  return "Работи съзнателно с енергията на луната според твоята зодия.";
}

interface MoonPhaseWidgetProps {
  zodiacSign?: ZodiacSign;
}

export function MoonPhaseWidget({ zodiacSign }: MoonPhaseWidgetProps = {}) {
  const [moonData, setMoonData] = useState<MoonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();

      // Sofia, Bulgaria coordinates (default location)
      const lat = 42.6977;
      const lng = 23.3219;

      // Calculate moon illumination and phase
      const moonIllumination = SunCalc.getMoonIllumination(now);
      const moonTimes = SunCalc.getMoonTimes(now, lat, lng);

      // Get phase info
      const phaseInfo = getMoonPhaseInfo(moonIllumination.phase);

      // Format moon data
      const data: MoonData = {
        phase: moonIllumination.phase,
        illumination: Math.round(moonIllumination.fraction * 100),
        phaseName: phaseInfo.name,
        emoji: phaseInfo.emoji,
        moonrise: formatTime(moonTimes.rise),
        moonset: formatTime(moonTimes.set),
        spiritualMeaning: phaseInfo.meaning
      };

      setMoonData(data);
    } catch (err) {
      console.error('Moon phase calculation error:', err);
      setError('Не успяхме да заредим лунната фаза.');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-20 pb-20">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-accent-400 animate-spin" />
            <p className="text-zinc-400 text-sm">Изчисляваме лунната фаза...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !moonData) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <p className="text-red-400 text-center">{error || 'Грешка при зареждане'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-zinc-50">
          <Moon className="w-6 h-6 text-accent-400" />
          <div className="flex-1">
            <div>Лунна Фаза</div>
            <div className="text-sm font-normal text-zinc-400">
              {new Date().toLocaleDateString('bg-BG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Moon Phase Display */}
        <div className="flex items-center gap-6 mb-6">
          <div className="text-7xl">{moonData.emoji}</div>
          <div className="flex-1">
            <div className="text-2xl font-semibold text-zinc-100 mb-1">
              {moonData.phaseName}
            </div>
            <div className="text-zinc-400">
              Осветеност: <span className="text-accent-400 font-semibold">{moonData.illumination}%</span>
            </div>
          </div>
        </div>

        {/* Moon Rise/Set Times */}
        {(moonData.moonrise || moonData.moonset) && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {moonData.moonrise && (
              <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                  <Sunrise className="w-4 h-4" />
                  <span>Изгрев</span>
                </div>
                <div className="text-zinc-100 font-semibold text-lg">
                  {moonData.moonrise}
                </div>
              </div>
            )}

            {moonData.moonset && (
              <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                  <Sunset className="w-4 h-4" />
                  <span>Залез</span>
                </div>
                <div className="text-zinc-100 font-semibold text-lg">
                  {moonData.moonset}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Spiritual Meaning */}
        <div className="p-4 bg-accent-950/20 rounded-lg border border-accent-800/30 mb-4">
          <div className="text-sm text-accent-300 mb-2 font-semibold flex items-center gap-2">
            <span className="text-lg">✨</span>
            Духовно значение
          </div>
          <div className="text-zinc-200 text-sm leading-relaxed">
            {moonData.spiritualMeaning}
          </div>
        </div>

        {/* Personalized Advice */}
        <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-800/30 mb-4">
          <div className="text-sm text-purple-300 mb-2 font-semibold flex items-center gap-2">
            <span className="text-lg">🔮</span>
            {zodiacSign ? "Лично за теб" : "Персонализиран съвет"}
          </div>
          <div className="text-zinc-200 text-sm leading-relaxed">
            {getPersonalizedAdvice(moonData.phaseName, zodiacSign)}
          </div>
        </div>

        {/* Link to full moon phase page */}
        <Link
          href="/moon-phase"
          className="flex items-center justify-center gap-2 text-sm text-accent-400 hover:text-accent-300 transition-colors"
        >
          <span>Виж пълния лунен календар</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
