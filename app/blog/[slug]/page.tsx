import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye, TrendingUp, Bookmark, MessageCircle } from 'lucide-react';
import { Metadata } from 'next';
import { MysticBackground } from '@/components/background/MysticBackground';
import ReadingProgress from '@/components/blog/ReadingProgress';
import AuthorBio from '@/components/blog/AuthorBio';
import RelatedPosts from '@/components/blog/RelatedPosts';
import Breadcrumbs, { generateBreadcrumbSchema } from '@/components/blog/Breadcrumbs';
import ShareButtons from '@/components/blog/ShareButtons';
import BackToTop from '@/components/blog/BackToTop';
import NewsletterSubscribe from '@/components/blog/NewsletterSubscribe';
import { Navigation } from '@/components/Navigation';
import { TopHeader } from '@/components/layout/top-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/Footer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, meta_title, meta_description, excerpt, featured_image_url, keywords')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return { title: 'Статия не е намерена | Vrachka' };
  }

  // Use hero image as OG image for social sharing
  const ogImage = post.featured_image_url || '/og-image-blog.png';

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    keywords: post.keywords?.join(', '),
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: [ogImage],
      type: 'article',
      url: `https://vrachka.eu/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    notFound();
  }

  // Increment view count
  await supabase
    .from('blog_posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id);

  // Fetch related/popular posts for sidebar
  const { data: popularPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, view_count, reading_time, featured_image_url')
    .eq('status', 'published')
    .neq('id', post.id)
    .order('view_count', { ascending: false })
    .limit(5);

  // Fetch related posts (same category)
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, image_urls, reading_time, view_count, published_at')
    .eq('status', 'published')
    .eq('category', post.category)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3);

  const categoryLabels: Record<string, string> = {
    astrology: 'Астрология',
    tarot: 'Таро',
    numerology: 'Нумерология',
    spirituality: 'Духовност',
    general: 'Общо',
  };

  // Parse content if it's JSON (backward compatibility fix)
  const parseContent = (rawContent: string): string => {
    const trimmed = rawContent.trim();
    if (trimmed.startsWith('{') && trimmed.includes('"content"')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.content && typeof parsed.content === 'string') {
          return parsed.content;
        }
      } catch {
        // Not valid JSON, return as is
      }
    }
    return rawContent;
  };

  // Remove old inline table of contents from legacy posts
  const removeOldTableOfContents = (htmlContent: string) => {
    // Remove all old styled TOC blocks with inline styles
    let cleaned = htmlContent;

    // Pattern 1: "В тази статия:" format
    cleaned = cleaned.replace(
      /<div\s+style="[^"]*">\s*<h2[^>]*>В тази статия:<\/h2>\s*<ol[\s\S]*?<\/ol>\s*<\/div>/gi,
      ''
    );

    // Pattern 2: "В тази статия ще разгледаме:" format
    cleaned = cleaned.replace(
      /<div\s+style="[^"]*">\s*<h2[^>]*>В тази статия ще разгледаме:<\/h2>\s*<ol[\s\S]*?<\/ol>\s*<\/div>/gi,
      ''
    );

    // Pattern 3: Any TOC with inline styles (catch-all)
    cleaned = cleaned.replace(
      /<div\s+style="padding:\s*20px[^"]*">\s*<h2[^>]*>В тази статия[^<]*<\/h2>\s*<ol[\s\S]*?<\/ol>\s*<\/div>/gi,
      ''
    );

    return cleaned;
  };

  // Process Vrachka expert quotes
  const processVrachkaQuotes = (htmlContent: string) => {
    // Match <!-- VRACHKA:quote:текст -->
    return htmlContent.replace(
      /<!--\s*VRACHKA:quote:(.*?)\s*-->/g,
      (_, quoteText) => {
        return `<blockquote class="my-8 pl-6 pr-4 py-4 border-l-4 border-accent-500 bg-gradient-to-r from-accent-500/10 to-transparent rounded-r-lg italic">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 flex-shrink-0 text-accent-400 mt-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <div class="flex-1">
              <p class="text-sm font-semibold text-accent-300 mb-2">Съвет от Врачка:</p>
              <p class="text-zinc-300 text-sm leading-relaxed">${quoteText.trim()}</p>
            </div>
          </div>
        </blockquote>`;
      }
    );
  };

  // Generate Table of Contents from H2/H3 headings
  const generateTableOfContents = (htmlContent: string): { toc: string; content: string } => {
    
    const slugify = (text: string): string => {
        if (!text) return '';

        const cyrillicMap: { [key: string]: string } = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
            'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
            'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht',
            'ъ': 'a', 'ь': 'y', 'ю': 'yu', 'я': 'ya'
        };

        return text.toLowerCase()
            .split('').map(char => cyrillicMap[char] || char).join('')
            .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
    };

    // 1. First, remove any old, hardcoded TOC to prevent duplicates.
    const contentWithoutOldToc = htmlContent.replace(
      /<div class="glass-card.*?">\s*<h2.*?>.*?В тази статия.*?<\/h2>[\s\S]*?<\/ol>\s*<\/div>/gi,
      ''
    );

    const headingRegex = /<(h2|h3|h4)([^>]*)>(.*?)<\/(h2|h3|h4)>/gi;
    const headings: Array<{ text: string; id: string; level: number }> = [];
    let match;

    // 2. Extract all H2, H3, and H4 headings.
    while ((match = headingRegex.exec(contentWithoutOldToc)) !== null) {
      let level = 0;
      if (match[1] === 'h2') level = 2;
      else if (match[1] === 'h3' || match[1] === 'h4') level = 3; // Treat h3 and h4 as level 3 for TOC

      const headingText = match[3].replace(/<[^>]*>/g, '').trim();
      if (!headingText || level === 0) continue;

      const slug = slugify(headingText);
      if (slug) {
        headings.push({ text: headingText, id: slug, level });
      }
    }

    // 3. Generate the HTML for the TOC.
    let tocHtml = '';
    if (headings.length > 1) { // Only show TOC if there's more than one heading
      tocHtml = `
        <div class="glass-card p-6 my-8 border border-accent-500/20 bg-gradient-to-br from-zinc-900/80 to-zinc-900/60">
          <h2 class="text-xl font-bold text-accent-400 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
            В тази статия
          </h2>
          <ol class="space-y-2 text-zinc-300">
            ${headings
              .map(
                (h, i) =>
                  `<li class="flex items-start gap-3 group hover:text-accent-300 transition-colors ${h.level === 3 ? 'ml-4' : ''}">
                     <span class="text-accent-500/60 font-semibold flex-shrink-0 min-w-[1.5rem]">${i + 1}.</span>
                     <a href="#${h.id}" class="hover:underline">${h.text}</a>
                   </li>`
              )
              .join('')}
          </ol>
        </div>
      `;
    }

    // 4. Add the generated slug IDs to the H2/H3/H4 elements in the content and promote H4 to H3.
    let processedContent = contentWithoutOldToc.replace(headingRegex, (originalTag, tagName, attrs, innerText) => {
        const headingText = innerText.replace(/<[^>]*>/g, '').trim();
        if (!headingText) return originalTag;
        
        const slug = slugify(headingText);
        
        // Remove existing ID attribute from attrs
        const cleanedAttrs = attrs.replace(/\s+id\s*=\s*"[^"]*"/i, '');
        
        const finalTagName = tagName === 'h4' ? 'h3' : tagName; // Promote h4 to h3

        return `<${finalTagName}${cleanedAttrs} id="${slug}">${innerText}</${finalTagName}>`;
    });

    // 5. Insert the new TOC.
    const tocMarker = /<!--\s*TOC\s*-->/gi;
    if (tocMarker.test(processedContent)) {
      processedContent = processedContent.replace(tocMarker, tocHtml);
    } else {
      // If no marker, insert it after the first paragraph for graceful fallback.
      const firstParagraphEnd = processedContent.indexOf('</p>');
      if (firstParagraphEnd !== -1) {
        processedContent = 
          processedContent.slice(0, firstParagraphEnd + 4) + 
          tocHtml + 
          processedContent.slice(firstParagraphEnd + 4);
      } else {
        processedContent = tocHtml + processedContent; // Fallback to top
      }
    }

    return { toc: tocHtml, content: processedContent };
  };

  // Extract FAQ schema for SEO
  const extractFAQSchema = (htmlContent: string) => {
    const faqItems: Array<{ question: string; answer: string }> = [];

    // Look for FAQ section - typically marked by H2 "FAQ" or similar
    const faqSectionRegex = /<h2[^>]*>.*?(FAQ|Често задавани въпроси|Въпроси и отговори).*?<\/h2>([\s\S]*?)(?=<h2|$)/i;
    const faqMatch = htmlContent.match(faqSectionRegex);

    if (faqMatch && faqMatch[2]) {
      const faqContent = faqMatch[2];

      // Extract Q&A pairs (H3 questions + following paragraph answers)
      const questionRegex = /<h3[^>]*>(.*?)<\/h3>\s*<p>(.*?)<\/p>/gi;
      let qaMatch;

      while ((qaMatch = questionRegex.exec(faqContent)) !== null) {
        const question = qaMatch[1].replace(/<[^>]*>/g, '').trim();
        const answer = qaMatch[2].replace(/<[^>]*>/g, '').trim();

        if (question && answer) {
          faqItems.push({ question, answer });
        }
      }
    }

    if (faqItems.length === 0) {
      return null;
    }

    // Generate FAQPage schema
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  };

  // Generate Article schema
  const generateArticleSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt || post.meta_description,
      image: post.image_urls && post.image_urls.length > 0 ? post.image_urls[0] : undefined,
      author: {
        '@type': 'Organization',
        name: 'Врачка',
        url: 'https://vrachka.eu',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Врачка',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vrachka.eu/logo.png',
        },
      },
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://vrachka.eu/blog/${post.slug}`,
      },
    };
  };

  // Process inline images from IMAGE markers with captions
  const processInlineImages = (htmlContent: string, imageUrls?: string[]) => {
    if (!imageUrls || imageUrls.length < 2) {
      return htmlContent; // No inline images to insert
    }

    // Replace <!-- IMAGE:1 --> with second image (index 1)
    // Replace <!-- IMAGE:2 --> with third image (index 2)
    let processedContent = htmlContent;

    processedContent = processedContent.replace(
      /<!--\s*IMAGE:1\s*-->/g,
      imageUrls[1]
        ? `<figure class="my-8 w-full group">
             <div class="relative overflow-hidden rounded-lg">
               <img
                 src="${imageUrls[1]}"
                 alt="Илюстрация към статията"
                 class="w-full h-auto shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                 loading="lazy"
               />
             </div>
             <figcaption class="text-center text-sm text-zinc-400 mt-3 italic px-4">
               Илюстрация 1
             </figcaption>
           </figure>`
        : ''
    );

    processedContent = processedContent.replace(
      /<!--\s*IMAGE:2\s*-->/g,
      imageUrls[2]
        ? `<figure class="my-8 w-full group">
             <div class="relative overflow-hidden rounded-lg">
               <img
                 src="${imageUrls[2]}"
                 alt="Допълнителна визуализация"
                 class="w-full h-auto shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                 loading="lazy"
               />
             </div>
             <figcaption class="text-center text-sm text-zinc-400 mt-3 italic px-4">
               Илюстрация 2
             </figcaption>
           </figure>`
        : ''
    );

    return processedContent;
  };

  // Legacy CTA processing (for old blog posts)
  // New posts will have inline links instead of markers
  const processLegacyCTAs = (htmlContent: string) => {
    return htmlContent
      .replace(/<!-- CTA:soft -->/g, '<p class="text-zinc-400 italic my-4 text-sm"><a href="/natal-chart" class="text-accent-400 hover:text-accent-300 underline decoration-dotted">Изчисли безплатната си натална карта</a> и открий още повече за себе си.</p>')
      .replace(/<!-- CTA:medium -->/g, '<p class="text-zinc-400 italic my-4 text-sm">Искаш по-задълбочен анализ? <a href="/pricing" class="text-accent-400 hover:text-accent-300 underline decoration-dotted">Виж Ultimate плана</a>.</p>')
      .replace(/<!-- CTA:strong -->/g, '<div class="my-6 p-4 border-l-2 border-accent-500/50 bg-accent-500/5 rounded-r"><p class="text-zinc-300 text-sm mb-2"><strong>Персонализирани прогнози само за теб</strong></p><p class="text-zinc-400 text-sm">Upgrade до Ultimate и получи месечни и годишни хороскопи базирани на твоята натална карта. <a href="/pricing" class="text-accent-400 hover:text-accent-300 underline">Започни Trial</a></p></div>')
      .replace(/<!-- CTA:free -->/g, '<p class="text-zinc-400 italic my-4 text-sm"><a href="/dashboard" class="text-blue-400 hover:text-blue-300 underline decoration-dotted">Използвай нашите безплатни инструменти</a> в Dashboard.</p>')
      .replace(/<!-- CTA:feature -->/g, '<p class="text-zinc-400 italic my-4 text-sm"><a href="/features" class="text-purple-400 hover:text-purple-300 underline decoration-dotted">Открий повече функции</a> на Vrachka.</p>')
      .replace(/<!-- CTA:conversion -->/g, '<div class="my-6 p-4 border-l-2 border-accent-500/50 bg-accent-500/5 rounded-r"><p class="text-zinc-300 text-sm">Искаш персонализирани прогнози? <a href="/pricing" class="text-accent-400 hover:text-accent-300 font-semibold underline">Виж плановете →</a></p></div>')
      .replace(/<!-- CTA:urgent -->/g, '<div class="my-6 p-4 border-l-2 border-accent-500 bg-gradient-to-r from-accent-500/10 to-purple-500/10 rounded-r"><p class="text-zinc-200 text-sm font-semibold mb-1">Ограничена оферта!</p><p class="text-zinc-400 text-sm">Започни Ultimate план и получи първата седмица безплатно. <a href="/pricing" class="text-accent-400 hover:text-accent-300 font-semibold underline">Активирай сега →</a></p></div>');
  };

  // Generate schemas
  const faqSchema = extractFAQSchema(post.content);
  const articleSchema = generateArticleSchema();
  const breadcrumbSchema = generateBreadcrumbSchema(
    post.category,
    categoryLabels[post.category as keyof typeof categoryLabels] || post.category,
    post.slug,
    post.title
  );

  return (
    <>
      {/* Structured Data - SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Desktop: Navigation with Profile dropdown */}
      <div className="hidden lg:block">
        <Navigation user={user} />
      </div>

      {/* Mobile: TopHeader with hamburger (if logged in) or Navigation */}
      <div className="lg:hidden">
        {user ? <TopHeader /> : <Navigation />}
      </div>

      <MysticBackground />
      <div className="relative min-h-screen">
        {/* Container with max-width */}
        <div className="container mx-auto px-4 sm:px-6 pt-32 pb-16">
          <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-50 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Назад към блога</span>
          </Link>

          {/* Breadcrumbs */}
          <Breadcrumbs
            category={post.category}
            categoryLabel={categoryLabels[post.category as keyof typeof categoryLabels] || post.category}
            title={post.title}
          />

          {/* Two column layout: Main content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main content - 9 columns on large screens (wider for better readability) */}
            <article className="lg:col-span-9">
              {/* Hero image */}
              {post.featured_image_url && (
                <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] overflow-hidden rounded-lg mb-6 sm:mb-8 shadow-2xl">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              )}

              {/* Category badge */}
              {post.category && (
                <Link
                  href={`/blog/category/${post.category}`}
                  className="inline-block text-xs sm:text-sm px-3 py-1 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-3 sm:mb-4 hover:bg-accent-500/20 transition-colors"
                >
                  {categoryLabels[post.category]}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-50 mb-4 sm:mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-400 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-zinc-800/50">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                  {post.published_at && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">
                        {new Date(post.published_at).toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="sm:hidden">
                        {new Date(post.published_at).toLocaleDateString('bg-BG', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {post.reading_time && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {post.reading_time} мин
                    </div>
                  )}
                  {post.view_count > 0 && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {post.view_count > 1000 ? `${(post.view_count / 1000).toFixed(1)}k` : post.view_count}
                    </div>
                  )}
                </div>

                {/* Share Buttons */}
                <div className="sm:ml-auto">
                  <ShareButtons
                    url={`/blog/${post.slug}`}
                    title={post.title}
                    description={post.excerpt}
                  />
                </div>
              </div>

              {/* Article content */}
              <div
                className="prose prose-invert prose-zinc prose-sm sm:prose-base md:prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-zinc-50
                  prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pt-8 prose-h2:border-t prose-h2:border-zinc-800 prose-h2:scroll-mt-20
                  prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-5
                  prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-accent-400 prose-a:no-underline hover:prose-a:text-accent-300 hover:prose-a:underline prose-a:transition-colors
                  prose-strong:text-zinc-100 prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:my-6 prose-ul:space-y-2 prose-ol:list-decimal prose-ol:my-6 prose-ol:space-y-2
                  prose-li:text-zinc-300 prose-li:leading-relaxed
                  prose-img:rounded-lg prose-img:shadow-2xl prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-accent-500 prose-blockquote:bg-zinc-900/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-zinc-200
                  prose-code:text-accent-300 prose-code:bg-zinc-900 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:shadow-xl prose-pre:my-8
                  [&>*]:break-words"
                dangerouslySetInnerHTML={{
                  __html: processInlineImages(
                    processVrachkaQuotes(
                      processLegacyCTAs(
                        generateTableOfContents(
                          removeOldTableOfContents(parseContent(post.content))
                        ).content
                      )
                    ),
                    post.image_urls || []
                  )
                }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-800/50">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, i: number) => (
                      <Link
                        key={i}
                        href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 bg-zinc-800/50 text-zinc-300 rounded-full hover:bg-accent-500/20 hover:text-accent-400 hover:border-accent-500/30 border border-transparent transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments section */}
              <div className="mt-12 pt-8 border-t border-zinc-800/50">
                <h3 className="text-xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-accent-400" />
                  Коментари
                </h3>
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-8 text-center">
                  <p className="text-zinc-400 mb-4">Системата за коментари е в разработка</p>
                  <p className="text-sm text-zinc-500">
                    Междувременно можеш да споделиш мислите си в нашата{' '}
                    <Link href="/dashboard" className="text-accent-400 hover:text-accent-300 underline">
                      общност
                    </Link>
                  </p>
                </div>
              </div>

              {/* Author Bio */}
              <AuthorBio />

              {/* Related Posts */}
              {relatedPosts && relatedPosts.length > 0 && (
                <RelatedPosts posts={relatedPosts} />
              )}
            </article>

            {/* Sidebar - 3 columns on large screens (narrower to give more space to content) */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Most Popular Posts */}
              {popularPosts && popularPosts.length > 0 && (
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-zinc-50 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent-400" />
                    Най-четени
                  </h3>
                  <div className="space-y-4">
                    {popularPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="flex gap-3 group"
                      >
                        {relatedPost.featured_image_url && (
                          <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                            <img
                              src={relatedPost.featured_image_url}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-accent-400 transition-colors line-clamp-2 mb-1">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Eye className="w-3 h-3" />
                            {relatedPost.view_count || 0} прегледа
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-zinc-50 mb-4 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-accent-400" />
                  Категории
                </h3>
                <div className="space-y-2">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <Link
                      key={key}
                      href={`/blog?category=${key}`}
                      className="block px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-accent-400 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Subscription */}
              <NewsletterSubscribe
                source="blog-post"
                interests={post.category ? [post.category] : []}
              />
            </aside>
          </div>
        </div>

        {post.schema_markup && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schema_markup) }} />
        )}
      </div>

      <Footer />

      {/* Bottom Navigation - mobile only for logged-in users */}
      {user && <BottomNav />}

      {/* Back to Top Button */}
      <BackToTop />
    </>
  );
}
