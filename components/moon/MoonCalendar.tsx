"use client";

import { useState, useEffect } from "react";
import SunCalc from "suncalc";
import { ChevronLeft, ChevronRight, Moon } from "lucide-react";

interface DayMoonData {
  date: Date;
  day: number;
  phase: number;
  phaseName: string;
  emoji: string;
  isToday: boolean;
  isImportant: boolean; // New moon or full moon
}

function getMoonPhaseEmoji(phase: number): { emoji: string; name: string; important: boolean } {
  const normalizedPhase = phase % 1;

  if (normalizedPhase < 0.03 || normalizedPhase > 0.97) {
    return { emoji: "🌑", name: "Новолуние", important: true };
  } else if (normalizedPhase < 0.22) {
    return { emoji: "🌒", name: "Нарастваща", important: false };
  } else if (normalizedPhase < 0.28) {
    return { emoji: "🌓", name: "Първа четвърт", important: false };
  } else if (normalizedPhase < 0.47) {
    return { emoji: "🌔", name: "Нарастваща гърбава", important: false };
  } else if (normalizedPhase < 0.53) {
    return { emoji: "🌕", name: "Пълнолуние", important: true };
  } else if (normalizedPhase < 0.72) {
    return { emoji: "🌖", name: "Намаляваща гърбава", important: false };
  } else if (normalizedPhase < 0.78) {
    return { emoji: "🌗", name: "Последна четвърт", important: false };
  } else {
    return { emoji: "🌘", name: "Намаляваща", important: false };
  }
}

export function MoonCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<DayMoonData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayMoonData | null>(null);

  useEffect(() => {
    generateCalendar(currentMonth);
  }, [currentMonth]);

  const generateCalendar = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: DayMoonData[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty slots for days before month starts (Sunday = 0)
    for (let i = 0; i < startingDayOfWeek; i++) {
      const emptyDate = new Date(year, monthIndex, -startingDayOfWeek + i + 1);
      const illumination = SunCalc.getMoonIllumination(emptyDate);
      const phaseInfo = getMoonPhaseEmoji(illumination.phase);

      days.push({
        date: emptyDate,
        day: emptyDate.getDate(),
        phase: illumination.phase,
        phaseName: phaseInfo.name,
        emoji: phaseInfo.emoji,
        isToday: false,
        isImportant: false,
      });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const illumination = SunCalc.getMoonIllumination(date);
      const phaseInfo = getMoonPhaseEmoji(illumination.phase);

      const isToday = date.getTime() === today.getTime();

      days.push({
        date,
        day,
        phase: illumination.phase,
        phaseName: phaseInfo.name,
        emoji: phaseInfo.emoji,
        isToday,
        isImportant: phaseInfo.important,
      });
    }

    setCalendarDays(days);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const weekDays = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  return (
    <div className="glass-card p-6">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-400" />
        </button>

        <h3 className="text-xl font-bold text-zinc-50">
          {currentMonth.toLocaleDateString("bg-BG", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-zinc-500 pb-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((dayData, idx) => {
          const isCurrentMonth = dayData.date.getMonth() === currentMonth.getMonth();

          return (
            <button
              key={idx}
              onClick={() => setSelectedDay(dayData)}
              className={`
                aspect-square p-2 rounded-lg transition-all duration-200 relative
                ${isCurrentMonth ? "text-zinc-300" : "text-zinc-600"}
                ${dayData.isToday ? "bg-accent-500/20 border-2 border-accent-500" : "hover:bg-zinc-800/50"}
                ${dayData.isImportant && isCurrentMonth ? "ring-2 ring-purple-500/50" : ""}
                ${selectedDay?.date.getTime() === dayData.date.getTime() ? "bg-accent-600" : ""}
              `}
            >
              {/* Day number */}
              <div className="text-xs font-semibold mb-1">{dayData.day}</div>

              {/* Moon emoji */}
              <div className="text-lg">{dayData.emoji}</div>

              {/* Important indicator */}
              {dayData.isImportant && isCurrentMonth && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day details */}
      {selectedDay && (
        <div className="mt-6 p-4 bg-gradient-to-br from-accent-500/10 to-purple-500/10 rounded-lg border border-accent-500/20 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{selectedDay.emoji}</span>
            <div>
              <h4 className="font-semibold text-zinc-200">{selectedDay.phaseName}</h4>
              <p className="text-sm text-zinc-400">
                {selectedDay.date.toLocaleDateString("bg-BG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-zinc-800/50">
        <div className="flex items-center gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-accent-500" />
            <span>Днес</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded ring-2 ring-purple-500/50" />
            <span>Важна фаза</span>
          </div>
        </div>
      </div>
    </div>
  );
}
