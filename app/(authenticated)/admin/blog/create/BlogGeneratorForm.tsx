'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  Target,
  TrendingUp,
} from 'lucide-react';

interface GenerationProgress {
  step: 'idle' | 'generating' | 'optimizing' | 'complete' | 'error';
  message: string;
}

interface GeneratedContent {
  title: string;
  content: string;
  excerpt: string;
  readingTime: number;
  wordCount: number;
  suggestedSlug: string;
  seoMetadata: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export function BlogGeneratorForm() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    step: 'idle',
    message: '',
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    keywords: '',
    contentType: 'tofu' as 'tofu' | 'mofu' | 'bofu' | 'advertorial',
    category: 'astrology' as 'astrology' | 'tarot' | 'numerology' | 'spirituality' | 'general',
    targetWordCount: 2000,
  });

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError('Моля въведи тема за статията');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress({ step: 'generating', message: 'Генерирам съдържание с Claude 3.5 Sonnet...' });

    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          keywords: formData.keywords.split(',').map((k) => k.trim()).filter(Boolean),
          contentType: formData.contentType,
          category: formData.category,
          targetWordCount: formData.targetWordCount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Грешка при генериране');
      }

      const data = await response.json();

      setProgress({ step: 'complete', message: 'Генерирането завърши успешно!' });
      setGeneratedContent(data.data);
    } catch (err) {
      setProgress({ step: 'error', message: 'Грешка при генериране' });
      setError(err instanceof Error ? err.message : 'Нещо се обърка');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async (status: 'draft' | 'published') => {
    if (!generatedContent) return;

    try {
      const response = await fetch('/api/blog/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedContent.title,
          slug: generatedContent.suggestedSlug,
          content: generatedContent.content,
          excerpt: generatedContent.excerpt,
          metaTitle: generatedContent.seoMetadata.metaTitle,
          metaDescription: generatedContent.seoMetadata.metaDescription,
          keywords: generatedContent.seoMetadata.keywords,
          category: formData.category,
          contentType: formData.contentType,
          readingTime: generatedContent.readingTime,
          wordCount: generatedContent.wordCount,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Грешка при публикуване');
      }

      const { data } = await response.json();

      if (status === 'published') {
        router.push(`/blog/${data.slug}`);
      } else {
        router.push('/admin/blog');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при публикуване');
    }
  };

  const contentTypeLabels = {
    tofu: { label: 'TOFU - Awareness', desc: 'Образователно съдържание за широка аудитория', icon: Target },
    mofu: { label: 'MOFU - Engagement', desc: 'How-to guides и tutorials', icon: FileText },
    bofu: { label: 'BOFU - Conversion', desc: 'Директна конверсия към услуги', icon: TrendingUp },
    advertorial: { label: 'Advertorial', desc: 'Максимална конверсия чрез storytelling', icon: Sparkles },
  };

  const categoryLabels = {
    astrology: 'Астрология',
    tarot: 'Таро',
    numerology: 'Нумерология',
    spirituality: 'Духовност',
    general: 'Общо',
  };

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      {!generatedContent && (
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-bold text-zinc-50">Настройки на генерацията</h2>

          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Тема / Заглавие *
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="напр. Какво е ретрограден Меркурий и как да оцелееш"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-accent-500"
              disabled={isGenerating}
            />
            <p className="text-xs text-zinc-500 mt-1">
              Въведи конкретна тема за статията. AI ще генерира съдържание базирано на това.
            </p>
          </div>

          {/* Keywords Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Ключови думи (comma-separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="напр. ретрограден меркурий, астрология, планети"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-accent-500"
              disabled={isGenerating}
            />
            <p className="text-xs text-zinc-500 mt-1">
              Ключови думи за SEO оптимизация, разделени със запетая
            </p>
          </div>

          {/* Content Type Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Тип съдържание *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.keys(contentTypeLabels) as Array<keyof typeof contentTypeLabels>).map((type) => {
                const { label, desc, icon: Icon } = contentTypeLabels[type];
                return (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, contentType: type })}
                    disabled={isGenerating}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.contentType === type
                        ? 'border-accent-500 bg-accent-500/10'
                        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${formData.contentType === type ? 'text-accent-400' : 'text-zinc-500'}`} />
                      <div>
                        <div className="font-semibold text-zinc-100">{label}</div>
                        <div className="text-sm text-zinc-400 mt-1">{desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Категория *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              disabled={isGenerating}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
            >
              {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Target Word Count */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Целева дължина (думи)
            </label>
            <input
              type="number"
              value={formData.targetWordCount}
              onChange={(e) => setFormData({ ...formData, targetWordCount: parseInt(e.target.value) || 2000 })}
              min={500}
              max={5000}
              step={100}
              disabled={isGenerating}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
            />
            <p className="text-xs text-zinc-500 mt-1">
              TOFU: 1,500-2,500 | MOFU: 2,000-3,500 | BOFU: 1,200-2,000 | Advertorial: 800-1,500
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-red-300">{error}</div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.topic.trim()}
            className="w-full bg-accent-600 hover:bg-accent-700 py-6 text-lg font-semibold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {progress.message}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Генерирай статия с AI
              </>
            )}
          </Button>

          {/* Progress Steps */}
          {isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {progress.step === 'generating' ? (
                  <Loader2 className="w-4 h-4 text-accent-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                )}
                <span className="text-sm text-zinc-300">Генериране на съдържание...</span>
              </div>
              <div className="flex items-center gap-3">
                {progress.step === 'optimizing' ? (
                  <Loader2 className="w-4 h-4 text-accent-400 animate-spin" />
                ) : progress.step === 'complete' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-700" />
                )}
                <span className="text-sm text-zinc-300">SEO оптимизация...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {generatedContent && (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="glass-card p-4 bg-green-500/10 border-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-semibold text-green-300">Статията е генерирана успешно!</div>
                <div className="text-sm text-green-400/70 mt-1">
                  {generatedContent.wordCount} думи • {generatedContent.readingTime} мин четене
                </div>
              </div>
            </div>
          </div>

          {/* Generated Content Preview */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-50">Преглед</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedContent(null);
                  setProgress({ step: 'idle', message: '' });
                }}
              >
                Генерирай отново
              </Button>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide">Заглавие</label>
              <div className="text-2xl font-bold text-zinc-50 mt-1">{generatedContent.title}</div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide">Excerpt</label>
              <div className="text-zinc-300 mt-1">{generatedContent.excerpt}</div>
            </div>

            {/* SEO Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-900 rounded-lg">
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wide">Meta Title</label>
                <div className="text-sm text-zinc-300 mt-1">{generatedContent.seoMetadata.metaTitle}</div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wide">Keywords</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedContent.seoMetadata.keywords.map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-accent-500/10 text-accent-400 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-zinc-500 uppercase tracking-wide">Meta Description</label>
                <div className="text-sm text-zinc-300 mt-1">{generatedContent.seoMetadata.metaDescription}</div>
              </div>
            </div>

            {/* Content Preview */}
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide mb-2 block">Съдържание</label>
              <div
                className="prose prose-invert prose-zinc max-w-none p-6 bg-zinc-900 rounded-lg overflow-y-auto max-h-[500px]"
                dangerouslySetInnerHTML={{ __html: generatedContent.content }}
              />
            </div>

            {/* Publish Buttons */}
            <div className="flex gap-3 pt-4 border-t border-zinc-800">
              <Button
                onClick={() => handlePublish('draft')}
                variant="outline"
                className="flex-1"
              >
                Запази като чернова
              </Button>
              <Button
                onClick={() => handlePublish('published')}
                className="flex-1 bg-accent-600 hover:bg-accent-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Публикувай
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
