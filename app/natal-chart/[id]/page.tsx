import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MysticBackground } from '@/components/background/MysticBackground';
import { GradientText } from '@/components/ui/gradient-text';
import { NatalChartView } from './NatalChartView';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Твоята Натална Карта',
  description: 'Детайлна натална карта с AI интерпретация',
};

export default async function NatalChartDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/natal-chart');
  }

  // Await params
  const { id } = await params;

  // Fetch natal chart
  const { data: chart, error } = await supabase
    .from('natal_charts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !chart) {
    notFound();
  }

  // Get user profile for name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const birthDate = new Date(chart.birth_date);
  const birthDateFormatted = birthDate.toLocaleDateString('bg-BG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <MysticBackground />

        <div className="max-w-7xl mx-auto px-4 pt-32 pb-16">
          {/* Back Button */}
          <Link
            href="/natal-chart"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад към всички натални карти
          </Link>

          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">
              <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
                Твоята Натална Карта
              </GradientText>
            </h1>

            <div className="text-lg text-zinc-300">
              <p>{profile?.full_name || 'Твоята карта'}</p>
              <p className="text-zinc-500">
                {birthDateFormatted} • {chart.birth_time} • {chart.birth_location.city}
              </p>
            </div>
          </div>

          {/* Chart View */}
          <NatalChartView chart={chart} />
        </div>

        <Footer />
      </div>
    </>
  );
}
