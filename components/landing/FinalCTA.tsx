'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Button } from '@/components/ui/button';

export function FinalCTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/20 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-3xl rounded-full" />
      </div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-500/20 to-purple-500/20 mb-8">
          <Sparkles className="w-10 h-10 text-accent-400" />
        </div>

        {/* Heading */}
        <h2 className="text-5xl md:text-6xl font-bold text-zinc-50 mb-6">
          Започни духовното си
          <br />
          <span className="bg-gradient-to-r from-accent-400 to-purple-400 bg-clip-text text-transparent">
            пътуване днес
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Присъедини се към 10,000+ потребители, които използват Vrachka за дневни насоки, самопознание и духовно развитие.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register">
            <ShimmerButton className="text-lg px-8 h-14">
              Започни безплатно
              <ArrowRight className="ml-2 w-5 h-5" />
            </ShimmerButton>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-900 px-8 h-14 text-lg">
              Виж цените
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Без кредитна карта</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Отмяна по всяко време</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>GDPR защитени данни</span>
          </div>
        </div>
      </div>
    </section>
  );
}
