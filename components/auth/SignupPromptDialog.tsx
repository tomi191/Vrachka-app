"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Sparkles, Check } from "lucide-react";
import Link from "next/link";

interface SignupPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  benefits?: string[];
  feature?: string;
}

export function SignupPromptDialog({
  open,
  onOpenChange,
  title = "Безплатна Таро Карта Всеки Ден",
  description = "Регистрирай се за да получиш достъп до безплатни таро четения и още много функции",
  benefits = [
    "1 безплатна таро карта на ден",
    "Достъп до дневни хороскопи за всички зодии",
    "История на твоите четения",
    "Персонализирани астрологични прогнози",
  ],
  feature = "tarot"
}: SignupPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-zinc-950 via-mystic-950 to-zinc-950 border-2 border-accent-500/40 shadow-2xl shadow-accent-500/20 p-0 overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* Content wrapper with padding */}
        <div className="relative z-10 p-6 sm:p-8">
          <DialogHeader className="space-y-4">
            {/* Icon with glow effect */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-500/30 rounded-full blur-xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent-500/30 to-purple-500/30 flex items-center justify-center border border-accent-500/50 shadow-lg">
                  <Sparkles className="w-10 h-10 text-accent-400 drop-shadow-lg" />
                </div>
              </div>
            </div>

            <DialogTitle className="text-center text-2xl sm:text-3xl font-bold text-zinc-50 leading-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center text-base text-zinc-400 leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          {/* Benefits List with enhanced design */}
          <div className="space-y-3 my-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-accent-500/30 transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 border border-accent-500/40">
                  <Check className="w-3.5 h-3.5 text-accent-400 font-bold" strokeWidth={3} />
                </div>
                <span className="text-sm text-zinc-200 leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons with enhanced styling */}
          <div className="space-y-3 mt-8">
            <Link href={`/auth/register?redirect=${feature}`} className="block" onClick={() => onOpenChange(false)}>
              <ShimmerButton className="w-full text-base py-3.5 shadow-lg shadow-accent-500/20 hover:shadow-accent-500/30 transition-all">
                <Sparkles className="w-4 h-4 mr-2" />
                Регистрирай се - Безплатно
              </ShimmerButton>
            </Link>
            <Link
              href={`/auth/login?redirect=${feature}`}
              className="block"
              onClick={() => onOpenChange(false)}
            >
              <button className="w-full px-6 py-3.5 rounded-lg bg-zinc-900/60 border border-zinc-700/50 text-zinc-100 font-medium hover:bg-zinc-800/80 hover:border-accent-500/30 transition-all duration-200 shadow-md">
                Вече имам акаунт
              </button>
            </Link>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-zinc-800/50">
            <p className="text-xs text-zinc-500 text-center flex items-center justify-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500/60 animate-pulse" />
              Регистрацията отнема само 30 секунди
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
