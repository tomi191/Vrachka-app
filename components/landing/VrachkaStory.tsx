'use client';

import Link from 'next/link';
import { VrachkaIntro } from './VrachkaIntro';
import { VrachkaExpertise } from './VrachkaExpertise';
import { ProblemsWeSolve } from './ProblemsWeSolve';

/**
 * VrachkaStory Component (Wrapper)
 * Combines intro, expertise, and problems sections with final CTA
 */
export function VrachkaStory() {
  return (
    <section className="py-20 px-6">
      {/* Introduction Section */}
      <VrachkaIntro />

      {/* AI Expertise Section */}
      <VrachkaExpertise />

      {/* Problems We Solve Section */}
      <ProblemsWeSolve />

      {/* Call to Action */}
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-zinc-50 mb-4">
              Готов да започнеш своето духовно пътуване?
            </h3>
            <p className="text-zinc-400 mb-6">
              Присъедини се към хиляди българи, които вече откриха силата на AI астрологията.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/horoscope" className="px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold text-center">
                Виж своя хороскоп днес
              </Link>
              <Link href="/features" className="px-6 py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 rounded-lg transition-colors text-center">
                Научи повече
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
