'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface BlogIdea {
  title: string;
  description: string;
  contentType: 'tofu' | 'mofu' | 'bofu' | 'advertorial';
  category: 'astrology' | 'tarot' | 'numerology' | 'spirituality' | 'general';
  keywords: string[];
  targetWordCount: number;
  estimatedPerformance: {
    seoScore: number;
    viralPotential: number;
    conversionPotential: number;
  };
}

interface GeneratedPost {
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
  images?: {
    url: string;
    prompt: string;
  }[];
}

export function BlogCreatorTab() {
  const router = useRouter();
  const [step, setStep] = useState<'ideas' | 'generate' | 'preview'>('ideas');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  // Ideas state
  const [ideas, setIdeas] = useState<BlogIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BlogIdea | null>(null);
  const [ideaFocus, setIdeaFocus] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('all');

  // Generation state
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');

  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true);
    setError(null);
    setProgress('Генериране на 10 blog идеи...');

    try {
      const response = await fetch('/api/blog/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focus: ideaFocus,
          category: ideaCategory !== 'all' ? ideaCategory : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Грешка при генериране на идеи');
      }

      const data = await response.json();
      setIdeas(data.ideas);
      setProgress('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка');
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleSelectIdea = (idea: BlogIdea) => {
    setSelectedIdea(idea);
    setStep('generate');
  };

  const handleGeneratePost = async (generateImages: boolean) => {
    if (!selectedIdea) return;

    setIsGeneratingPost(true);
    setError(null);
    setProgress('Генериране на blog съдържание...');

    try {
      // Generate blog content
      const contentResponse = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedIdea.title,
          keywords: selectedIdea.keywords,
          contentType: selectedIdea.contentType,
          category: selectedIdea.category,
          targetWordCount: selectedIdea.targetWordCount,
        }),
      });

      if (!contentResponse.ok) {
        throw new Error('Грешка при генериране на съдържание');
      }

      const contentData = await contentResponse.json();
      const post = contentData.data;

      // Generate images if requested
      if (generateImages) {
        setIsGeneratingImages(true);
        setProgress('Генериране на AI снимки (3x)...');

        try {
          const imagePrompts = [
            `Hero image for blog post about: ${selectedIdea.title}. Mystical, ethereal, professional.`,
            `Illustrative image representing the concept of: ${selectedIdea.keywords[0]}. Artistic, symbolic.`,
            `Supporting visual for article about ${selectedIdea.category}. Elegant, mysterious.`,
          ];

          const imagesResponse = await fetch('/api/blog/generate-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompts: imagePrompts,
              aspectRatio: '16:9',
              style: 'mystical, professional, Bulgarian cultural elements',
            }),
          });

          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            post.images = imagesData.images;
          }
        } catch (imgError) {
          console.error('Image generation failed:', imgError);
          // Continue without images
        } finally {
          setIsGeneratingImages(false);
        }
      }

      setGeneratedPost(post);
      setStep('preview');
      setProgress('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка');
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handlePublish = async (status: 'draft' | 'published') => {
    if (!generatedPost) return;

    try {
      const response = await fetch('/api/blog/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedPost.title,
          slug: generatedPost.suggestedSlug,
          content: generatedPost.content,
          excerpt: generatedPost.excerpt,
          metaTitle: generatedPost.seoMetadata.metaTitle,
          metaDescription: generatedPost.seoMetadata.metaDescription,
          keywords: generatedPost.seoMetadata.keywords,
          category: selectedIdea?.category,
          contentType: selectedIdea?.contentType,
          readingTime: generatedPost.readingTime,
          wordCount: generatedPost.wordCount,
          featuredImageUrl: generatedPost.images?.[0]?.url,
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
      setError(err instanceof Error ? err.message : 'Грешка');
    }
  };

  const contentTypeIcons = {
    tofu: Target,
    mofu: FileText,
    bofu: TrendingUp,
    advertorial: Sparkles,
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
      {/* STEP 1: Generate Ideas */}
      {step === 'ideas' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-zinc-50 mb-6">
              <Sparkles className="w-6 h-6 inline mr-2 text-accent-400" />
              Генерирай Blog Идеи с AI
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Фокус (опционално)
                </label>
                <input
                  type="text"
                  value={ideaFocus}
                  onChange={(e) => setIdeaFocus(e.target.value)}
                  placeholder="напр. ретрограден Меркурий 2025, любовни хороскопи"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Категория
                </label>
                <select
                  value={ideaCategory}
                  onChange={(e) => setIdeaCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100"
                >
                  <option value="all">Всички категории</option>
                  <option value="astrology">Астрология</option>
                  <option value="tarot">Таро</option>
                  <option value="numerology">Нумерология</option>
                  <option value="spirituality">Духовност</option>
                  <option value="general">Общо</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleGenerateIdeas}
              disabled={isGeneratingIdeas}
              className="w-full bg-accent-600 hover:bg-accent-700 py-6 text-lg"
            >
              {isGeneratingIdeas ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {progress}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Генерирай 10 Идеи (Безплатно)
                </>
              )}
            </Button>
          </div>

          {/* Ideas Grid */}
          {ideas.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-50">
                  Генерирани идеи ({ideas.length})
                </h3>
                <Button
                  variant="outline"
                  onClick={handleGenerateIdeas}
                  disabled={isGeneratingIdeas}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ideas.map((idea, index) => {
                  const Icon = contentTypeIcons[idea.contentType];
                  return (
                    <div
                      key={index}
                      className="glass-card p-5 hover:border-accent-500/40 transition-all cursor-pointer group"
                      onClick={() => handleSelectIdea(idea)}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Icon className="w-5 h-5 text-accent-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-zinc-100 group-hover:text-accent-400 transition-colors mb-1">
                            {idea.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span className="px-2 py-0.5 bg-accent-500/10 text-accent-400 rounded">
                              {categoryLabels[idea.category]}
                            </span>
                            <span>{idea.targetWordCount} думи</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-400 mb-4 line-clamp-3">
                        {idea.description}
                      </p>

                      {/* Performance Meters */}
                      <div className="space-y-2">
                        <PerformanceMeter
                          label="SEO"
                          score={idea.estimatedPerformance.seoScore}
                          color="green"
                        />
                        <PerformanceMeter
                          label="Viral"
                          score={idea.estimatedPerformance.viralPotential}
                          color="purple"
                        />
                        <PerformanceMeter
                          label="Conversion"
                          score={idea.estimatedPerformance.conversionPotential}
                          color="orange"
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 group-hover:bg-accent-600 group-hover:text-white group-hover:border-accent-600"
                      >
                        Избери тази идея
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="glass-card p-4 bg-red-500/10 border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Generate Full Post */}
      {step === 'generate' && selectedIdea && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setStep('ideas')}
            className="text-zinc-400"
          >
            ← Назад към идеите
          </Button>

          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-zinc-50 mb-2">
              {selectedIdea.title}
            </h2>
            <p className="text-zinc-400 mb-6">{selectedIdea.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedIdea.keywords.map((kw, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-accent-500/10 text-accent-400 rounded-full">
                  {kw}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => handleGeneratePost(true)}
                disabled={isGeneratingPost || isGeneratingImages}
                className="w-full bg-accent-600 hover:bg-accent-700 py-6 text-lg"
              >
                {isGeneratingPost || isGeneratingImages ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {progress}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Генерирай със снимки (3x AI images)
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleGeneratePost(false)}
                disabled={isGeneratingPost || isGeneratingImages}
                className="w-full py-6 text-lg"
              >
                {isGeneratingPost ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {progress}
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Генерирай без снимки (по-бързо)
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Preview & Publish */}
      {step === 'preview' && generatedPost && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setStep('generate')}
            className="text-zinc-400"
          >
            ← Назад
          </Button>

          <div className="glass-card p-4 bg-green-500/10 border-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-semibold text-green-300">Генерирането завърши успешно!</div>
                <div className="text-sm text-green-400/70 mt-1">
                  {generatedPost.wordCount} думи • {generatedPost.readingTime} мин четене
                  {generatedPost.images && ` • ${generatedPost.images.length} AI снимки`}
                </div>
              </div>
            </div>
          </div>

          {/* Images Preview */}
          {generatedPost.images && generatedPost.images.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-zinc-50 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-accent-400" />
                Генерирани снимки ({generatedPost.images.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generatedPost.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-3 flex items-end">
                      <p className="text-xs text-zinc-300">{img.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-2xl font-bold text-zinc-50">{generatedPost.title}</h3>
            <p className="text-zinc-300">{generatedPost.excerpt}</p>

            <div
              className="prose prose-invert prose-zinc max-w-none p-6 bg-zinc-900 rounded-lg max-h-[500px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: generatedPost.content }}
            />

            <div className="flex gap-3 pt-4 border-t border-zinc-800">
              <Button
                variant="outline"
                onClick={() => handlePublish('draft')}
                className="flex-1"
              >
                Запази като чернова
              </Button>
              <Button
                onClick={() => handlePublish('published')}
                className="flex-1 bg-accent-600 hover:bg-accent-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Публикувай
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PerformanceMeter({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: 'green' | 'purple' | 'orange';
}) {
  const colors = {
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 w-20">{label}</span>
      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} transition-all`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <span className="text-xs text-zinc-400 w-8 text-right">{score}/10</span>
    </div>
  );
}
