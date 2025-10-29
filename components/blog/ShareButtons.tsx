/**
 * Social Share Buttons Component
 * Allows users to share blog posts on social media
 */

'use client';

import { useState } from 'react';
import { Share2, Check, Facebook, Twitter } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://vrachka.eu${url}`;
  const shareText = description || title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-400 font-medium">Сподели:</span>

      <div className="flex items-center gap-2">
        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/50 hover:bg-blue-600/20 border border-zinc-700/50 hover:border-blue-500/50 transition-all group"
          aria-label="Сподели във Facebook"
        >
          <Facebook className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
        </button>

        {/* Twitter */}
        <button
          onClick={handleTwitterShare}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/50 hover:bg-sky-600/20 border border-zinc-700/50 hover:border-sky-500/50 transition-all group"
          aria-label="Сподели в Twitter"
        >
          <Twitter className="w-5 h-5 text-zinc-400 group-hover:text-sky-400 transition-colors" />
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/50 hover:bg-accent-600/20 border border-zinc-700/50 hover:border-accent-500/50 transition-all group"
          aria-label="Копирай линк"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Share2 className="w-5 h-5 text-zinc-400 group-hover:text-accent-400 transition-colors" />
          )}
        </button>
      </div>

      {copied && (
        <span className="text-xs text-green-400 animate-fade-in">
          Копирано!
        </span>
      )}
    </div>
  );
}
