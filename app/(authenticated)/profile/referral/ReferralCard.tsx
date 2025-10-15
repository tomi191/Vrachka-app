"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface ReferralCardProps {
  code: string;
  usesCount: number;
}

export function ReferralCard({ code, usesCount }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const referralUrl = `${window.location.origin}/auth/register?ref=${code}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Присъедини се към Vrachka",
          text: `Използвай моя код ${code} и получи специална отстъпка!`,
          url: referralUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-4">
      {/* Your Code */}
      <div>
        <label className="block text-sm text-zinc-400 mb-2">Твоят код</label>
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-center">
          <p className="text-2xl font-bold text-accent-400 tracking-wider">
            {code}
          </p>
        </div>
      </div>

      {/* Referral Link */}
      <div>
        <label className="block text-sm text-zinc-400 mb-2">
          Референтен линк
        </label>
        <div className="flex gap-2">
          <div className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm truncate">
            {referralUrl}
          </div>
          <button
            onClick={copyToClipboard}
            className="px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors flex items-center gap-2"
            title="Копирай линк"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={shareReferral}
        className="w-full px-4 py-3 border border-accent-600 text-accent-300 rounded-lg hover:bg-accent-900/20 transition-colors flex items-center justify-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Сподели с приятели
      </button>

      {/* Stats */}
      <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Използвания</span>
          <span className="text-xl font-bold text-zinc-100">{usesCount}</span>
        </div>
      </div>
    </div>
  );
}
