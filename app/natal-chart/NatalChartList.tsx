"use client";

import { MapPin, Calendar, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NatalChart {
  id: string;
  birth_date: string;
  birth_time: string;
  birth_location: {
    city: string;
    country: string;
  };
  created_at: string;
}

interface NatalChartListProps {
  charts: NatalChart[];
}

export function NatalChartList({ charts: initialCharts }: NatalChartListProps) {
  const router = useRouter();
  const [charts, setCharts] = useState(initialCharts);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (chartId: string) => {
    if (!confirm('Сигурен ли си, че искаш да изтриеш тази натална карта?')) {
      return;
    }

    setDeleting(chartId);

    try {
      const response = await fetch(`/api/natal-chart/${chartId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete chart');
      }

      // Remove from list
      setCharts(charts.filter(c => c.id !== chartId));
    } catch (error) {
      console.error('Error deleting chart:', error);
      alert('Грешка при изтриване на натална карта');
    } finally {
      setDeleting(null);
    }
  };

  if (charts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
          <Calendar className="w-8 h-8 text-zinc-600" />
        </div>
        <p className="text-zinc-400">
          Все още нямаш създадени натални карти
        </p>
        <p className="text-sm text-zinc-500 mt-2">
          Използвай формата вляво за да създадеш първата си натална карта
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {charts.map((chart) => {
        const birthDate = new Date(chart.birth_date);
        const createdDate = new Date(chart.created_at);

        return (
          <div
            key={chart.id}
            className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-accent-500/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-accent-400" />
                  <span className="text-zinc-200 font-medium">
                    {birthDate.toLocaleDateString('bg-BG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">{chart.birth_time}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400 text-sm">
                    {chart.birth_location.city}, {chart.birth_location.country}
                  </span>
                </div>

                <p className="text-xs text-zinc-600">
                  Създадена на{' '}
                  {createdDate.toLocaleDateString('bg-BG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/natal-chart/${chart.id}`)}
                  className="p-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
                  title="Виж натална карта"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(chart.id)}
                  disabled={deleting === chart.id}
                  className="p-2 bg-zinc-800 hover:bg-red-600 text-zinc-400 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Изтрий"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
