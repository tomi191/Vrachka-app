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
  qualityScore?: {
    overall: number;
    wordCountQuality: number;
    readability: number;
    seo: number;
    aiDetectionRisk: string;
    warnings: string[];
    metrics: {
      wordCount: number;
      targetWordCount: number;
      optimalWordCount: number;
      percentageOfTarget: number;
    };
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

  // Ideas tab state
  const [ideasTab, setIdeasTab] = useState<'generate' | 'saved'>('generate');
  const [savedIdeas, setSavedIdeas] = useState<BlogIdea[]>([]);
  const [savedIdeasCategory, setSavedIdeasCategory] = useState('all');
  const [ideasCounts, setIdeasCounts] = useState<Record<string, number>>({});
  const [isLoadingSavedIdeas, setIsLoadingSavedIdeas] = useState(false);

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

  const loadSavedIdeas = async (category: string = 'all') => {
    setIsLoadingSavedIdeas(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        category,
        status: 'pending',
        limit: '100',
      });

      const response = await fetch(`/api/blog/list-ideas?${params}`);

      if (!response.ok) {
        throw new Error('Грешка при зареждане на идеи');
      }

      const data = await response.json();
      setSavedIdeas(data.ideas);
      setIdeasCounts(data.counts || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка');
    } finally {
      setIsLoadingSavedIdeas(false);
    }
  };

  // Load saved ideas when tab changes
  const handleTabChange = (tab: 'generate' | 'saved') => {
    setIdeasTab(tab);
    if (tab === 'saved') {
      loadSavedIdeas(savedIdeasCategory);
    }
  };

  // Load saved ideas when category changes
  const handleSavedCategoryChange = (category: string) => {
    setSavedIdeasCategory(category);
    loadSavedIdeas(category);
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
          const noTextRequirement = 'NO TEXT, NO LETTERS, NO WORDS on the image. Pure visual only.';

          const imagePrompts = [
            `Hero image for blog post about: ${selectedIdea.title}. Mystical, ethereal, professional. ${noTextRequirement}`,
            `Illustrative image representing the concept of: ${selectedIdea.keywords[0]}. Artistic, symbolic. ${noTextRequirement}`,
            `Supporting visual for article about ${selectedIdea.category}. Elegant, mysterious. ${noTextRequirement}`,
          ];

          const imagesResponse = await fetch('/api/blog/generate-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompts: imagePrompts,
              aspectRatio: '16:9',
              style: 'mystical, professional, Bulgarian cultural elements, NO TEXT',
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
          imageUrls: generatedPost.images?.map(img => img.url) || [],
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
          {/* Tab Switcher */}
          <div className="flex gap-2 border-b border-zinc-800">
            <button
              onClick={() => handleTabChange('generate')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                ideasTab === 'generate'
                  ? 'text-accent-400'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Генерирай Нови
              {ideasTab === 'generate' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-400" />
              )}
            </button>
            <button
              onClick={() => handleTabChange('saved')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                ideasTab === 'saved'
                  ? 'text-accent-400'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Запазени Идеи
              {ideasCounts.all > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-accent-500/20 text-accent-400 rounded-full">
                  {ideasCounts.all}
                </span>
              )}
              {ideasTab === 'saved' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-400" />
              )}
            </button>
          </div>

          {/* Generate New Ideas Tab */}
          {ideasTab === 'generate' && (
            <>
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

              {/* Generated Ideas Grid */}
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
            </>
          )}

          {/* Saved Ideas Tab */}
          {ideasTab === 'saved' && (
            <>
              {/* Category Filters */}
              <div className="glass-card p-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'Всички' },
                    { key: 'astrology', label: 'Астрология' },
                    { key: 'tarot', label: 'Таро' },
                    { key: 'numerology', label: 'Нумерология' },
                    { key: 'spirituality', label: 'Духовност' },
                    { key: 'general', label: 'Общо' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => handleSavedCategoryChange(key)}
                      disabled={isLoadingSavedIdeas}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        savedIdeasCategory === key
                          ? 'bg-accent-600 text-white'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {label}
                      {ideasCounts[key] > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                          {ideasCounts[key]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading State */}
              {isLoadingSavedIdeas && (
                <div className="glass-card p-12 text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-accent-400" />
                  <p className="text-zinc-400">Зареждане на запазени идеи...</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoadingSavedIdeas && savedIdeas.length === 0 && (
                <div className="glass-card p-12 text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                  <h3 className="text-lg font-semibold text-zinc-400 mb-2">
                    Няма запазени идеи
                  </h3>
                  <p className="text-zinc-500 mb-6">
                    Генерирайте нови идеи и те автоматично ще се запазят тук
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleTabChange('generate')}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Генерирай Идеи
                  </Button>
                </div>
              )}

              {/* Saved Ideas Grid */}
              {!isLoadingSavedIdeas && savedIdeas.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-50">
                      {savedIdeasCategory === 'all' ? 'Всички' : categoryLabels[savedIdeasCategory as keyof typeof categoryLabels]} идеи ({savedIdeas.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedIdeas.map((idea, index) => {
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
            </>
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
              <div className="flex-1">
                <div className="font-semibold text-green-300">Генерирането завърши успешно!</div>
                <div className="text-sm text-green-400/70 mt-1">
                  {generatedPost.wordCount} думи • {generatedPost.readingTime} мин четене
                  {generatedPost.images && ` • ${generatedPost.images.length} AI снимки`}
                </div>
                {generatedPost.qualityScore && (
                  <div className="mt-2 flex items-center gap-4 text-xs">
                    <span className="text-green-300">
                      Общо качество: {generatedPost.qualityScore.overall}%
                    </span>
                    <span className="text-green-400/70">
                      Word Count: {generatedPost.qualityScore.wordCountQuality}%
                    </span>
                    <span className="text-green-400/70">
                      {generatedPost.qualityScore.metrics.percentageOfTarget}% от целта
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quality Warnings */}
          {generatedPost.qualityScore?.warnings && generatedPost.qualityScore.warnings.length > 0 && (
            <div className={`glass-card p-5 ${
              generatedPost.qualityScore.wordCountQuality < 80
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-yellow-500/10 border-yellow-500/20'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                  generatedPost.qualityScore.wordCountQuality < 80 ? 'text-red-400' : 'text-yellow-400'
                }`} />
                <div className="flex-1">
                  <div className={`font-bold mb-3 ${
                    generatedPost.qualityScore.wordCountQuality < 80 ? 'text-red-300' : 'text-yellow-300'
                  }`}>
                    {generatedPost.qualityScore.wordCountQuality < 80 ? '🚫 Критична грешка!' : '⚠️ Предупреждения за качество:'}
                  </div>

                  {/* Word Count Progress Bar */}
                  {generatedPost.qualityScore.metrics && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className={generatedPost.qualityScore.wordCountQuality < 80 ? 'text-red-200' : 'text-yellow-200'}>
                          Word Count Progress
                        </span>
                        <span className={`font-semibold ${
                          generatedPost.qualityScore.wordCountQuality < 80 ? 'text-red-300' : 'text-yellow-300'
                        }`}>
                          {generatedPost.qualityScore.metrics.percentageOfTarget}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            generatedPost.qualityScore.wordCountQuality < 80
                              ? 'bg-gradient-to-r from-red-600 to-red-500'
                              : 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                          }`}
                          style={{ width: `${Math.min(generatedPost.qualityScore.metrics.percentageOfTarget, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1 text-zinc-500">
                        <span>{generatedPost.qualityScore.metrics.wordCount} думи</span>
                        <span>Target: {generatedPost.qualityScore.metrics.targetWordCount} думи</span>
                      </div>
                    </div>
                  )}

                  <ul className="space-y-1.5 mb-3">
                    {generatedPost.qualityScore.warnings.map((warning, i) => (
                      <li key={i} className={`text-sm ${
                        (generatedPost.qualityScore?.wordCountQuality || 0) < 80 ? 'text-red-200/90' : 'text-yellow-200/80'
                      }`}>{warning}</li>
                    ))}
                  </ul>

                  {/* Suggestion to regenerate */}
                  {(generatedPost.qualityScore?.wordCountQuality || 0) < 80 && (
                    <div className="mt-3 p-3 bg-red-950/30 border border-red-500/20 rounded-lg">
                      <p className="text-xs text-red-200 font-medium">
                        💡 Препоръка: Генерирай отново със същата идея за да постигнеш минимум {generatedPost.qualityScore?.metrics?.targetWordCount} думи.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
