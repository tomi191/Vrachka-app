'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ImagePlus, Loader2, CheckCircle2 } from 'lucide-react';

interface AddImagesButtonProps {
  slug: string;
  hasFeaturedImage: boolean;
}

export function AddImagesButton({ slug, hasFeaturedImage }: AddImagesButtonProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddImages = async () => {
    if (!confirm('Искаш ли да генерираш AI снимки за тази статия? (безплатно)')) {
      return;
    }

    setIsGenerating(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/blog/add-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Грешка при генериране');
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh(); // Refresh to show new images
      }, 1500);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Грешка при генериране на снимки');
    } finally {
      setIsGenerating(false);
    }
  };

  if (success) {
    return (
      <button
        className="p-2 bg-green-500/10 rounded-lg"
        title="Снимките са добавени"
        disabled
      >
        <CheckCircle2 className="w-4 h-4 text-green-400" />
      </button>
    );
  }

  return (
    <button
      onClick={handleAddImages}
      disabled={isGenerating}
      className={`p-2 rounded-lg transition-colors ${
        hasFeaturedImage
          ? 'hover:bg-zinc-700 text-zinc-500'
          : 'hover:bg-accent-900/30 text-accent-400'
      }`}
      title={hasFeaturedImage ? 'Регенерирай снимки' : 'Добави AI снимки'}
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ImagePlus className="w-4 h-4" />
      )}
    </button>
  );
}
