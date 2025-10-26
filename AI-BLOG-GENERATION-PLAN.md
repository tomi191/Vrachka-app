# 🤖 AI Blog Generation System - Master Plan

**Project**: Vrachka AI-Powered Blog Content Generator
**Created**: 2025-01-26
**Status**: Planning → Implementation
**Goal**: Automate high-quality, conversion-focused blog content generation with AI

---

## 📋 Executive Summary

### Vision
Create an admin interface that uses LLMs (Claude 3.5 Sonnet) and DALL-E 3 to automatically generate human-sounding, SEO-optimized blog articles in Bulgarian about occult topics (astrology, tarot, numerology, spirituality) that:
- Sound maximally human and natural
- Include auto-generated contextual images
- Lead to service conversions
- Scale content production from 2-4 articles/month (manual) to 20-30 articles/month (AI-assisted)

### Business Impact
- **Revenue**: 720-5,400 BGN/month per mature article (after 3-6 months)
- **Break-even**: 2-4 weeks per article
- **ROI**: 300-800% after 6 months
- **Traffic**: 10x organic growth potential

### Success Metrics
- ✅ Articles sound 95%+ human (undetectable by AI detectors)
- ✅ Average time on page: 3+ minutes
- ✅ Click-through to services: 5-10%
- ✅ SEO: Page 1 ranking for target keywords within 2-3 months
- ✅ Generation time: <10 minutes per article (vs 2-4 hours manual)

---

## 🏗️ Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      ADMIN INTERFACE                         │
│                   /admin/blog/create                         │
│  [Topic Input] [Keywords] [Type: TOFU/MOFU/BOFU/Advert]    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  LAYER 1: RESEARCH                           │
│  • Extract context from existing blog posts                 │
│  • Analyze top-ranking articles for keywords                │
│  • Generate content brief                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  LAYER 2: GENERATION                         │
│  • Claude 3.5 Sonnet via OpenRouter                         │
│  • Human-like prompt engineering                            │
│  • Bulgarian cultural context injection                     │
│  • Perplexity/burstiness variation                          │
│  • Strategic CTA placement                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  LAYER 3: OPTIMIZATION                       │
│  • DALL-E 3 image generation                                │
│  • SEO optimization (meta tags, keywords, internal links)   │
│  • Schema markup injection                                  │
│  • Readability scoring                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  PREVIEW & EDIT                              │
│  • Live preview with actual blog layout                     │
│  • Manual editing capability                                │
│  • Image repositioning                                      │
│  • CTA adjustment                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  PUBLISH                                     │
│  • Save to Supabase (blog_posts table)                      │
│  • Generate sitemap entry                                   │
│  • Auto-internal linking to related posts                   │
│  • Schedule or publish immediately                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Content Strategy

### Content Funnel

#### 1. TOFU (Top of Funnel) - Awareness
**Purpose**: Attract broad audience, build trust, SEO dominance
**Topics**:
- "Какво е ретрограден Меркурий и как да оцелееш"
- "12-те зодиакални знака обяснени просто"
- "История на Таро картите"
- "Нумерология за начинаещи"

**Characteristics**:
- 1,500-2,500 words
- Educational, informative
- Minimal CTAs (1-2 subtle mentions)
- High shareability
- Target keywords: high volume, low competition

#### 2. MOFU (Middle of Funnel) - Engagement
**Purpose**: Demonstrate expertise, build consideration
**Topics**:
- "Как да четеш натална карта (стъпка по стъпка)"
- "5-те най-точни таро разклади за любовта"
- "Лунен календар: кога да правиш важни неща"

**Characteristics**:
- 2,000-3,500 words
- How-to guides, tutorials
- 2-3 strategic CTAs to free features
- Lead magnets (downloadable charts)
- Target keywords: medium volume, medium competition

#### 3. BOFU (Bottom of Funnel) - Conversion
**Purpose**: Direct conversion to paid services
**Topics**:
- "Защо личната натална карта е по-точна от общия хороскоп"
- "Синастрия: научна любовна съвместимост"
- "Твоят личен месечен хороскоп: какво очаква теб"

**Characteristics**:
- 1,200-2,000 words
- Comparison content, case studies
- 4-5 strong CTAs to Ultimate plan
- Social proof, testimonials
- Target keywords: low volume, high intent

#### 4. Advertorial
**Purpose**: Maximum conversion, promotional
**Topics**:
- "Защо 10,000+ българи използват Vrachka за астрологични прогнози"
- "Истинска история: Как астрологията ми помогна да намеря любовта"

**Characteristics**:
- 800-1,500 words
- Story-driven, emotional
- 6-8 CTAs throughout
- Urgency, scarcity elements
- No keyword targeting (conversion focus)

---

## 🧠 Prompt Engineering

### Master System Prompt

```markdown
Ти си опитен български копирайтър, специализиран в окултни теми (астрология, таро, нумерология, духовност). Пишеш за Vrachka - водеща българска платформа за астрология и таро.

СТИЛ И ТОН:
• Пиши като човек, не като AI
• Използвай разговорен български език (не книжовен)
• Вмъквай лични анекдоти и примери
• Използвай въпросителни изрази: "Чудиш се защо...?", "Познато ли ти е усещането когато...?"
• Варирай дължината на изреченията (3-25 думи)
• Използвай български идиоми и културни референции
• Не използвай клишета като "в заключение", "в днешния свят"
• Пиши на "ти" (не на "вие")

СТРУКТУРА:
• Започни с hook който грабва вниманието (въпрос, интересен факт, история)
• Използвай подзаглавия на всеки 200-300 думи
• Включвай bullets за по-лесно четене
• Добавяй примери и аналогии
• Завършвай с емоционален призив към действие

ТЕХНИЧЕСКИ ИЗИСКВАНИЯ:
• Перплексност: 80-120 (висока вариация в структура)
• Burstiness: 0.6-0.8 (смесица от кратки и дълги изречения)
• Няма повторения на фрази
• Естествени преходи между параграфи
• Активен глас (не пасивен)

ЗАБРАНЕНО:
• AI клишета: "в заключение", "освен това", "в днешния свят", "динамичен"
• Списъци с повече от 7 елемента
• Параграфи по-дълги от 4 изречения
• Повторение на ключови думи (използвай синоними)
• Формален/академичен език
```

### Content Type Prompts

#### TOFU Prompt Extension
```markdown
ЦЕЛ: Образователна статия за широка аудитория

ФОКУС:
• Обясни концепцията просто (но не примитивно)
• Включи история/произход
• Развенчай митове
• Дай практични примери

CTA СТРАТЕГИЯ:
• 1 CTA в средата (soft): "Виж безплатния си дневен хороскоп"
• 1 CTA в края (medium): "Изчисли си пълната натална карта безплатно"

ДЪЛЖИНА: 1,500-2,500 думи
```

#### MOFU Prompt Extension
```markdown
ЦЕЛ: How-to guide който демонстрира експертиза

ФОКУС:
• Стъпка по стъпка инструкции
• Включи screenshots/диаграми (опиши къде)
• Предупреди за често срещани грешки
• Дай advanced tips

CTA СТРАТЕГИЯ:
• 1 CTA в началото (free tool): "Използвай нашия калкулатор"
• 2 CTAs в средата (features): "Upgrade за пълен анализ"
• 1 CTA в края (strong): "Започни 7-дневен Ultimate trial"

ДЪЛЖИНА: 2,000-3,500 думи
```

#### BOFU Prompt Extension
```markdown
ЦЕЛ: Conversion-focused статия с директен призив

ФОКУС:
• Сравнения (безплатно vs Ultimate)
• Case studies / testimonials
• Адресирай възражения
• Социално доказателство

CTA СТРАТЕГИЯ:
• 4-5 CTAs разпределени равномерно
• Използвай urgency: "Само 50 места за този месец"
• Включи гаранции: "7 дни пари обратно"

ДЪЛЖИНА: 1,200-2,000 думи
```

#### Advertorial Prompt Extension
```markdown
ЦЕЛ: Максимална конверсия чрез storytelling

ФОКУС:
• Разкажи реална история (или реалистична)
• Проблем → Решение → Трансформация
• Емоционална връзка
• Силно urgency

CTA СТРАТЕГИЯ:
• 6-8 CTAs навсякъде
• Използвай scarcity: "Офертата изтича в 23:59"
• Repetition на ключово benefit

ДЪЛЖИНА: 800-1,500 думи
```

---

## 🎨 Image Generation Strategy

### DALL-E 3 Prompts

#### Hero Image (Top of article)
```
Create a mystical, ethereal illustration for an astrology/tarot blog article about [TOPIC].

Style: Soft gradients, purple and pink tones (hex: #8b5cf6 to #e879f9), starry background, dreamy atmosphere, modern minimalist design.

Elements: [SPECIFIC TO TOPIC - e.g., "zodiac wheel", "tarot cards spread", "natal chart diagram"]

Mood: Mysterious, spiritual, professional yet approachable

Format: Wide horizontal banner (1200x630px), no text overlay
```

#### In-Article Images (Every 400-600 words)
```
Create a simple, clean diagram/illustration showing [SPECIFIC CONCEPT].

Style: Minimalist line art with purple/pink accent colors (#8b5cf6), white background, educational

Elements: [SPECIFIC - e.g., "12 zodiac signs in circle", "planet symbols with arrows", "tarot card positions"]

Mood: Clear, instructional, friendly

Format: Square or vertical (800x800px or 800x1200px)
```

#### CTA Supporting Images
```
Create an engaging visual representation of [VRACHKA FEATURE].

Style: Modern UI screenshot aesthetic with mystical overlay, purple/pink gradients

Elements: Subtle sparkles, stars, hint of zodiac/tarot imagery in corners

Mood: Inviting, professional, premium

Format: Horizontal (1000x600px)
```

### Image Placement Rules
- Hero image: Always at top (after title, before content)
- Supporting images: Every 400-600 words
- CTA images: Directly above each major CTA
- Minimum 4 images per article
- Maximum 8 images (avoid overload)
- Always include alt text with keywords

---

## 🗄️ Database Schema

### New Table: `blog_posts`

```sql
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Metadata
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT, -- Short description (150-160 chars)
  featured_image_url TEXT,

  -- Content
  content TEXT NOT NULL, -- HTML with embedded images
  reading_time INTEGER, -- Auto-calculated in minutes
  word_count INTEGER,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[], -- Array of keywords
  og_image_url TEXT,
  schema_markup JSONB, -- Structured data

  -- Categorization
  content_type TEXT CHECK (content_type IN ('tofu', 'mofu', 'bofu', 'advertorial')),
  category TEXT, -- 'astrology', 'tarot', 'numerology', 'spirituality'
  tags TEXT[],

  -- AI Generation Metadata
  ai_generated BOOLEAN DEFAULT TRUE,
  generation_prompt TEXT, -- Store prompt used
  model_used TEXT, -- e.g., 'claude-3.5-sonnet'
  generation_time INTERVAL,

  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,

  -- Analytics
  view_count INTEGER DEFAULT 0,
  cta_clicks INTEGER DEFAULT 0,
  avg_time_on_page INTERVAL,
  conversion_rate DECIMAL(5,2), -- Percentage

  -- Related Content
  related_posts UUID[], -- Array of blog_post IDs
  related_services TEXT[], -- Array of service IDs/names

  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_reading_time CHECK (reading_time > 0 AND reading_time < 60),
  CONSTRAINT valid_word_count CHECK (word_count > 0 AND word_count < 20000)
);

-- Indexes
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_keywords ON blog_posts USING GIN(keywords);

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- Admin can do everything
CREATE POLICY "Admin full access" ON blog_posts
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Update updated_at trigger
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### New Table: `blog_images`

```sql
CREATE TABLE IF NOT EXISTS blog_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,

  -- Image Data
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  caption TEXT,

  -- Generation
  ai_generated BOOLEAN DEFAULT TRUE,
  dalle_prompt TEXT,
  generation_time INTERVAL,

  -- Metadata
  width INTEGER,
  height INTEGER,
  file_size INTEGER, -- bytes
  format TEXT, -- 'png', 'jpg', 'webp'

  -- Position
  position_in_article INTEGER, -- 0 = hero, 1+ = in-article

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_dimensions CHECK (width > 0 AND height > 0),
  CONSTRAINT valid_position CHECK (position_in_article >= 0)
);

-- Indexes
CREATE INDEX idx_blog_images_blog_post_id ON blog_images(blog_post_id);

-- RLS
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read images for published posts" ON blog_images
  FOR SELECT
  USING (
    blog_post_id IN (
      SELECT id FROM blog_posts WHERE status = 'published'
    )
  );

CREATE POLICY "Admin full access to images" ON blog_images
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );
```

---

## 📂 File Structure

### New Files to Create

```
Vrachka-app/
├── app/
│   ├── (authenticated)/
│   │   └── admin/
│   │       └── blog/
│   │           ├── page.tsx                    # Blog list (all posts)
│   │           ├── create/
│   │           │   ├── page.tsx                # Create new post form
│   │           │   └── BlogGeneratorForm.tsx   # Main generator UI
│   │           ├── edit/
│   │           │   └── [id]/
│   │           │       └── page.tsx            # Edit existing post
│   │           └── analytics/
│   │               └── page.tsx                # Blog analytics dashboard
│   │
│   ├── api/
│   │   └── blog/
│   │       ├── generate/
│   │       │   └── route.ts                    # Main generation endpoint
│   │       ├── generate-image/
│   │       │   └── route.ts                    # DALL-E 3 image generation
│   │       ├── optimize-seo/
│   │       │   └── route.ts                    # SEO optimization
│   │       ├── publish/
│   │       │   └── route.ts                    # Publish post
│   │       └── analytics/
│   │           └── route.ts                    # Track views, clicks
│   │
│   └── blog/
│       ├── page.tsx                            # Public blog index
│       ├── [slug]/
│       │   └── page.tsx                        # Individual blog post
│       └── category/
│           └── [category]/
│               └── page.tsx                    # Category listing
│
├── components/
│   └── blog/
│       ├── BlogCard.tsx                        # Blog preview card
│       ├── BlogContent.tsx                     # Rendered blog content
│       ├── BlogCTA.tsx                         # Conversion CTAs
│       ├── BlogSidebar.tsx                     # Related posts, CTA
│       ├── BlogHeader.tsx                      # Title, meta, share
│       └── BlogImageGenerator.tsx              # Image gen UI component
│
├── lib/
│   ├── ai/
│   │   ├── blog-prompts.ts                     # All prompts
│   │   ├── content-generator.ts                # Claude API integration
│   │   └── image-generator.ts                  # DALL-E API integration
│   ├── blog/
│   │   ├── seo-optimizer.ts                    # SEO utilities
│   │   ├── content-analyzer.ts                 # Quality checks
│   │   └── schema-generator.ts                 # JSON-LD schemas
│   └── utils/
│       └── slug-generator.ts                   # URL slug generation
│
└── supabase/
    └── migrations/
        └── 20250126_create_blog_tables.sql     # Database schema
```

---

## 🚀 Implementation Plan

### Phase 1: MVP Blog Generator (6 hours) ✅ Priority 1

#### Tasks:

- [ ] **Database Setup** (30 min)
  - [ ] Create migration file `20250126_create_blog_tables.sql`
  - [ ] Add `blog_posts` table with all fields
  - [ ] Add `blog_images` table
  - [ ] Apply migration to Supabase
  - [ ] Verify RLS policies work

- [ ] **Admin UI - Blog List** (45 min)
  - [ ] Create `app/(authenticated)/admin/blog/page.tsx`
  - [ ] Show table of all blog posts (title, status, views, created)
  - [ ] Add filters: status, category, content_type
  - [ ] Add "Create New Post" button
  - [ ] Add edit/delete actions

- [ ] **Admin UI - Create Form** (1.5 hours)
  - [ ] Create `app/(authenticated)/admin/blog/create/page.tsx`
  - [ ] Create `BlogGeneratorForm.tsx` component with fields:
    - Topic/Title input
    - Keywords input (comma-separated)
    - Content type selector (TOFU/MOFU/BOFU/Advertorial)
    - Category selector (Astrology/Tarot/Numerology/Spirituality)
    - Tone selector (Educational/Conversational/Sales)
  - [ ] Add "Generate" button with loading state
  - [ ] Show generation progress (research → content → optimization)

- [ ] **Backend - Content Generation** (2 hours)
  - [ ] Create `lib/ai/blog-prompts.ts` with all prompt templates
  - [ ] Create `lib/ai/content-generator.ts` with:
    - `generateBlogContent()` function
    - OpenRouter API integration (Claude 3.5 Sonnet)
    - Prompt assembly logic
    - Error handling
  - [ ] Create `app/api/blog/generate/route.ts` with:
    - POST endpoint
    - Admin authentication check
    - Call content generator
    - Calculate reading time, word count
    - Return generated content

- [ ] **Preview & Edit** (1 hour)
  - [ ] Create preview component showing:
    - Generated title
    - Content with proper formatting
    - Placeholder for images (manual upload in Phase 1)
    - Reading time, word count
  - [ ] Add rich text editor (TipTap or similar) for manual edits
  - [ ] Add manual image upload capability
  - [ ] Add SEO fields (meta title, description, keywords)

- [ ] **Publish Mechanism** (30 min)
  - [ ] Create `app/api/blog/publish/route.ts`
  - [ ] Save to `blog_posts` table
  - [ ] Generate slug from title
  - [ ] Set status to 'published'
  - [ ] Redirect to published post

- [ ] **Public Blog Display** (45 min)
  - [ ] Create `app/blog/page.tsx` (blog index)
  - [ ] Create `app/blog/[slug]/page.tsx` (individual post)
  - [ ] Create `components/blog/BlogContent.tsx` for rendering
  - [ ] Add basic styling matching site design
  - [ ] Add share buttons (Facebook, Twitter, copy link)

#### Deliverables:
- ✅ Admin can generate blog post with AI
- ✅ Admin can edit and publish
- ✅ Public can view published posts
- ✅ Basic SEO meta tags
- ✅ Manual image upload (no DALL-E yet)

#### Test Cases:
1. Generate TOFU article about "Ретрограден Меркурий"
2. Edit generated content manually
3. Upload 3 images manually
4. Publish and verify public visibility
5. Check SEO meta tags in browser

---

### Phase 2: Automation & Enhancement (8 hours) ✅ Priority 2

#### Tasks:

- [ ] **DALL-E 3 Integration** (2 hours)
  - [ ] Create `lib/ai/image-generator.ts` with:
    - `generateBlogImage()` function
    - OpenAI DALL-E 3 API integration
    - Image prompt generation based on article context
    - Upload to Supabase Storage
    - Return public URL
  - [ ] Create `app/api/blog/generate-image/route.ts`
  - [ ] Update BlogGeneratorForm to auto-generate images:
    - 1 hero image
    - 3-5 in-article images based on headings
    - 2 CTA supporting images
  - [ ] Add image repositioning in preview (drag & drop)

- [ ] **Advanced SEO Optimization** (2 hours)
  - [ ] Create `lib/blog/seo-optimizer.ts` with:
    - Keyword density analyzer
    - Meta tag generator
    - Internal linking suggestions (scan existing posts)
    - Readability score (Flesch Reading Ease)
  - [ ] Create `lib/blog/schema-generator.ts` for JSON-LD:
    - Article schema
    - BreadcrumbList schema
    - Organization schema
  - [ ] Create `app/api/blog/optimize-seo/route.ts`
  - [ ] Auto-inject internal links to related posts/services
  - [ ] Add schema markup to blog post page

- [ ] **Strategic CTA Injection** (1.5 hours)
  - [ ] Create `components/blog/BlogCTA.tsx` with variants:
    - Soft CTA (free feature)
    - Medium CTA (upgrade prompt)
    - Strong CTA (urgency/scarcity)
  - [ ] Update content generator to mark CTA positions:
    - Parse content for logical insertion points
    - Add `<!-- CTA:type -->` markers
    - Replace markers with actual CTA components on render
  - [ ] Create CTA templates for each service:
    - Natal chart calculator
    - Synastry analysis
    - Personal horoscope
    - Ultimate plan upgrade

- [ ] **Enhanced Blog Layout** (1.5 hours)
  - [ ] Update `app/blog/[slug]/page.tsx` with:
    - Sticky sidebar with table of contents
    - Related posts section (based on category/tags)
    - Social share bar (sticky on scroll)
    - Reading progress indicator
    - "Back to top" button
  - [ ] Create `components/blog/BlogSidebar.tsx`:
    - ToC generated from headings
    - Popular posts
    - Newsletter signup
    - Ultimate plan CTA
  - [ ] Optimize for mobile responsiveness

- [ ] **Content Quality Analyzer** (1 hour)
  - [ ] Create `lib/blog/content-analyzer.ts` with checks:
    - Perplexity score (sentence structure variety)
    - Burstiness score (sentence length variation)
    - AI detection risk (flag suspicious patterns)
    - Readability score
    - Keyword stuffing detection
    - CTA balance check
  - [ ] Add quality score to preview (0-100)
  - [ ] Show warnings if quality issues detected
  - [ ] Suggest improvements

#### Deliverables:
- ✅ Fully automated image generation
- ✅ Advanced SEO optimization
- ✅ Strategic CTA placement
- ✅ Enhanced blog layout
- ✅ Quality control system

#### Test Cases:
1. Generate article with auto-images
2. Verify SEO score is 80+
3. Check CTAs appear at logical points
4. Verify schema markup validates
5. Test on mobile devices

---

### Phase 3: Scale & Optimize (Ongoing) ✅ Priority 3

#### Tasks:

- [ ] **Analytics Dashboard** (3 hours)
  - [ ] Create `app/(authenticated)/admin/blog/analytics/page.tsx`
  - [ ] Show metrics per post:
    - Views, unique visitors
    - Average time on page
    - CTA click-through rate
    - Conversion rate (views → service signups)
    - SEO ranking (manual input or API)
  - [ ] Create `app/api/blog/analytics/route.ts` for tracking
  - [ ] Add client-side tracking:
    - Page view (on mount)
    - Time on page (on unmount)
    - CTA clicks (onClick events)
    - Scroll depth
  - [ ] Aggregate dashboard showing:
    - Total views, CTR, conversion rate
    - Top performing posts
    - Best performing CTAs
    - Traffic sources (referrer tracking)

- [ ] **A/B Testing System** (4 hours)
  - [ ] Extend `blog_posts` table with `variant_of` field
  - [ ] Create duplicate post with different:
    - Title variations
    - CTA variations
    - Image variations
  - [ ] Implement traffic splitting (50/50)
  - [ ] Track performance per variant
  - [ ] Auto-promote winning variant after statistical significance

- [ ] **Content Calendar** (2 hours)
  - [ ] Create `app/(authenticated)/admin/blog/calendar/page.tsx`
  - [ ] Show posts on calendar view (scheduled, published)
  - [ ] Add drag-and-drop rescheduling
  - [ ] Auto-suggest topics based on:
    - Seasonal events (Mercury retrograde dates, full moons)
    - Trending keywords
    - Content gaps (topics not covered yet)
  - [ ] Bulk generation: Generate 10 posts at once with queue

- [ ] **Performance Optimization** (2 hours)
  - [ ] Implement edge caching for published posts
  - [ ] Add lazy loading for images
  - [ ] Optimize image sizes (WebP format)
  - [ ] Add RSS feed generation
  - [ ] Add sitemap auto-generation
  - [ ] Set up Vercel ISR (Incremental Static Regeneration)

- [ ] **Advanced Features** (Ongoing)
  - [ ] Multi-language support (English expansion)
  - [ ] User comments system (moderated)
  - [ ] Author profiles (multiple admins)
  - [ ] Content versioning (track edits)
  - [ ] Email newsletter integration (send top posts weekly)
  - [ ] Social media auto-posting (share on Facebook/Instagram)

#### Deliverables:
- ✅ Comprehensive analytics
- ✅ A/B testing capability
- ✅ Content planning tools
- ✅ Optimized performance

#### Test Cases:
1. Verify analytics tracking works
2. Run A/B test with 2 title variants
3. Schedule 5 posts for next week
4. Check page load time < 2 seconds
5. Verify RSS feed validates

---

## ✅ Quality Control Checklist

### Before Publishing Any Article:

#### Content Quality
- [ ] Sounds human and natural (no AI clichés)
- [ ] Contains personal anecdotes or examples
- [ ] Uses conversational Bulgarian (не книжовен)
- [ ] Sentence length varies (3-25 words)
- [ ] No repetitive phrases or keywords
- [ ] Active voice (not passive)
- [ ] Clear hook in first paragraph
- [ ] Smooth transitions between sections

#### Technical SEO
- [ ] Target keyword in title
- [ ] Target keyword in first paragraph
- [ ] Target keyword in at least 2 H2 headings
- [ ] Keyword density 1-2% (not stuffed)
- [ ] Meta title 50-60 characters
- [ ] Meta description 150-160 characters
- [ ] Alt text on all images with keywords
- [ ] Internal links to 3-5 related posts/pages
- [ ] External links to 1-2 authoritative sources
- [ ] Schema markup present and valid
- [ ] Mobile responsive
- [ ] Page load time < 3 seconds

#### Conversion Optimization
- [ ] CTAs placed at logical points (not spammy)
- [ ] CTA text is action-oriented and clear
- [ ] Value proposition clear in each CTA
- [ ] Urgency/scarcity where appropriate
- [ ] Social proof included (if BOFU/Advertorial)
- [ ] Low-friction conversion path

#### Images
- [ ] Hero image relevant and high-quality
- [ ] 4-8 images throughout article
- [ ] Images placed near relevant text
- [ ] All images have descriptive alt text
- [ ] Images optimized (< 200KB each)
- [ ] Images match brand aesthetic (purple/pink)

#### Readability
- [ ] Flesch Reading Ease: 60-80 (fairly easy)
- [ ] Paragraphs: 2-4 sentences max
- [ ] Headings every 200-300 words
- [ ] Bullet points used where appropriate
- [ ] Bold/italic for emphasis (sparingly)
- [ ] No walls of text

#### Legal & Ethical
- [ ] No copyright violations (images, text)
- [ ] Factually accurate (for astrology context)
- [ ] Not misleading or false claims
- [ ] Disclaimers where appropriate
- [ ] Privacy policy compliant

---

## 🎯 Success Metrics & KPIs

### Per Article Metrics

| Metric | Target | Excellent | Outstanding |
|--------|--------|-----------|-------------|
| **Organic Views (Month 1)** | 100-300 | 500-1,000 | 1,500+ |
| **Organic Views (Month 3)** | 500-1,500 | 2,000-5,000 | 7,000+ |
| **Organic Views (Month 6)** | 2,000-5,000 | 7,000-15,000 | 20,000+ |
| **Average Time on Page** | 2-3 min | 3-5 min | 5+ min |
| **Bounce Rate** | < 60% | < 50% | < 40% |
| **CTR to Services** | 3-5% | 5-8% | 10%+ |
| **Conversion Rate** | 0.5-1% | 1-2% | 3%+ |
| **SEO Ranking (Target KW)** | Page 2-3 | Page 1 (pos 4-10) | Page 1 (pos 1-3) |
| **Social Shares** | 5-15 | 15-50 | 50+ |

### Overall Blog Metrics (6 months)

| Metric | Target | Excellent |
|--------|--------|-----------|
| **Total Published Posts** | 20-30 | 40-60 |
| **Total Organic Traffic** | 10,000-30,000/mo | 50,000-100,000/mo |
| **Top 3 Ranking Keywords** | 5-10 | 15-30 |
| **Newsletter Signups** | 500-1,000 | 2,000-5,000 |
| **Blog-Attributed Conversions** | 50-150 | 200-500 |
| **Revenue from Blog Traffic** | 5,000-15,000 BGN | 20,000-50,000 BGN |

---

## 🛠️ Technical Specifications

### API Endpoints

#### POST `/api/blog/generate`
**Request:**
```typescript
{
  topic: string;
  keywords: string[];
  contentType: 'tofu' | 'mofu' | 'bofu' | 'advertorial';
  category: 'astrology' | 'tarot' | 'numerology' | 'spirituality';
  tone?: 'educational' | 'conversational' | 'sales';
  targetWordCount?: number; // Default: auto based on content type
  includeImages?: boolean; // Default: true
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    title: string;
    content: string; // HTML with <!-- CTA:type --> markers
    excerpt: string;
    readingTime: number; // minutes
    wordCount: number;
    suggestedSlug: string;
    seoMetadata: {
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
      suggestedInternalLinks: Array<{
        anchor: string;
        url: string;
        position: number; // Character position in content
      }>;
    };
    images: Array<{
      url: string;
      altText: string;
      position: number; // 0 = hero, 1+ = in-article
      dallePrompt: string;
    }>;
    qualityScore: {
      overall: number; // 0-100
      readability: number;
      seo: number;
      aiDetectionRisk: 'low' | 'medium' | 'high';
      warnings: string[];
    };
  };
  generationTime: number; // seconds
}
```

#### POST `/api/blog/generate-image`
**Request:**
```typescript
{
  prompt: string;
  type: 'hero' | 'in-article' | 'cta-support';
  articleContext?: string; // Optional: article title/excerpt for context
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    url: string; // Supabase Storage URL
    altText: string; // Auto-generated
    width: number;
    height: number;
    fileSize: number;
  };
  generationTime: number;
}
```

#### POST `/api/blog/publish`
**Request:**
```typescript
{
  title: string;
  slug: string;
  content: string; // HTML
  excerpt: string;
  featuredImageUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  tags: string[];
  contentType: string;
  status: 'draft' | 'published';
  scheduledFor?: string; // ISO date
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    slug: string;
    publishedAt: string;
    url: string; // Public URL
  };
}
```

#### POST `/api/blog/analytics` (Client-side tracking)
**Request:**
```typescript
{
  blogPostId: string;
  eventType: 'view' | 'cta_click' | 'time_on_page';
  eventData?: {
    ctaType?: string;
    ctaPosition?: number;
    timeSpent?: number; // seconds
    scrollDepth?: number; // percentage
  };
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

---

## 💰 ROI Calculation Model

### Assumptions
- **Content Creation Cost (Manual)**: 40-60 BGN/hour × 2-4 hours = 80-240 BGN per article
- **Content Creation Cost (AI)**: 40-60 BGN/hour × 0.5 hours editing = 20-30 BGN per article
- **API Costs**:
  - Claude 3.5 Sonnet: ~$0.50 per article (2,500 word generation)
  - DALL-E 3: ~$0.40 per image × 5 images = $2.00 per article
  - Total API: ~$2.50 per article ≈ 5 BGN
- **Total Cost per AI Article**: 25-35 BGN
- **Cost Savings vs Manual**: 55-205 BGN per article (70-85% reduction)

### Revenue Per Article (Mature, 6 months)
- **Organic Traffic**: 5,000-10,000 views/month
- **CTR to Services**: 5-10% = 250-1,000 clicks
- **Conversion Rate**: 1-2% = 2.5-20 conversions/month
- **Average Order Value**: 30 BGN (Ultimate plan monthly)
- **Monthly Revenue**: 75-600 BGN per article
- **Lifetime Value (12 months)**: 900-7,200 BGN per article

### Break-Even Analysis
- **Investment**: 25-35 BGN (creation cost)
- **Break-Even**: 1-2 conversions
- **Time to Break-Even**: 2-4 weeks (aggressive), 1-2 months (conservative)

### Scale Scenario (30 articles in 6 months)
- **Total Investment**: 30 × 30 BGN = 900 BGN
- **Total Monthly Revenue (after maturation)**: 30 × 300 BGN = 9,000 BGN
- **Annual Revenue**: 108,000 BGN
- **ROI**: 12,000% over 12 months

---

## 🚨 Risk Mitigation

### Risk 1: AI Detection
**Mitigation:**
- Advanced prompt engineering (perplexity, burstiness)
- Manual editing pass (20-30% of content)
- A/B test detected vs undetected articles
- Monitor bounce rate as proxy for quality

### Risk 2: Poor SEO Performance
**Mitigation:**
- Start with low-competition keywords
- Build internal linking structure
- Consistently publish (2-4 posts/week)
- Monitor GSC and adjust strategy

### Risk 3: Low Conversion Rates
**Mitigation:**
- A/B test CTA placement and copy
- Heatmap analysis (Hotjar/Microsoft Clarity)
- User feedback surveys
- Optimize landing pages post-click

### Risk 4: Content Quality Issues
**Mitigation:**
- Implement quality score system
- Human review before publishing
- User engagement metrics monitoring
- Iterative prompt improvement

### Risk 5: API Costs Spiral
**Mitigation:**
- Set monthly budget limits in code
- Cache generated content aggressively
- Use cheaper models for drafts (GPT-3.5)
- Monitor cost per article metric

---

## 📚 Example Advertorial Structure

### Title: "Как една случайна натална карта промени живота ми завинаги"

#### Hook (100 words)
```
Преди 8 месеца бях на дъното. Раздяла след 5-годишна връзка, работа която мразех,
чувство че животът ми е в задънена улица. Един ден приятелка ми изпрати линк:
"Изчисли си наталната карта, ще се изненадаш." Очаквах поредната глупост от
интернет. Нямах представа че този линк ще обърне всичко с главата надолу...
```

#### Problem Amplification (200 words)
```
Знаеш това чувство когато се губиш в собствения си живот? Всяка сутрин будилникът
звъни и първата ми мисъл беше "отново ли?". Психолозите казваха "намери цел",
приятелите "трябва да се опитваш повече", мама "време е да се оженяш и да
забравиш глупостите".

Но никой не разбираше. Не беше депресия. Не беше мързел. Беше усещането че
играя роля в грешен филм. Че истинският аз е заключен някъде и викам, но никой
не чува...

[Емоционално задълбочаване...]
```

#### Discovery (300 words)
```
Влязох във Vrachka чисто от любопитство. Попълних датата, часа и мястото на
раждане. Натиснах "Изчисли". След 10 секунди пред мен изскочи нещо като карта
на звездното небе, пълна с линии, символи, градуси...

Започнах да чета интерпретацията. Първите два изречения ме удариха като влак:

"Венера в 12-ти дом в Телец квадрат Нептун - потискаш емоционалните си нужди
заради чувство за вина. Живееш любовния живот който другите очакват, не който
душата ти иска."

Мразех да признавам, но беше 100% вярно...

[История как започва да използва платформата...]
[Открива още неща за себе си...]
[Преломна точка - решава да направи промени...]
```

#### Transformation (250 words)
```
Няма да лъжа и да кажа че всичко се оправи за една нощ. Но за първи път
имах компас. Разбрах защо винаги избирам грешния тип мъже (7-ми дом в Скорпион),
защо се чувствам задушена в корпоративната среда (МС в Стрелец), защо
приятелите винаги идват при мен с проблеми (Луна в 11-ти дом).

Започнах да правя различни избори. Малки стъпки:
- Отказах се от работата и започнах фрийланс (рисков, но в съзвучие с МС)
- Прекратих токсична връзка която влачех (Сатурн транзитира 7-ми дом)
- Започнах да слушам интуицията си (активирах 12-ти дом)

Три месеца по-късно срещнах човека с когото сега живея. Шест месеца по-късно
доходите ми се удвоиха. Не защото звездите ми донесоха късмет, а защото
най-накрая живеех в съзвучие с истинската си природа...

[CTA: Изчисли си наталната карта безплатно]
```

#### Social Proof (150 words)
```
Не съм единствена. Vrachka имат над 10,000 активни потребители в България.
Гледам в групата във Facebook как други споделят подобни истории. Жена от
Пловдив разбрала защо винаги саботира успеха си. Мъж от София открил скрит
талант чрез МС анализа. Двойка използвала Синастрия анализа и спасила брака си...

[Testimonials - 2-3 кратки цитата]
```

#### Urgency & Final CTA (100 words)
```
Честно? Съжалявам само че не открих това преди години. Колко време загубих
живеейки грешен живот...

Ако се чувстваш загубен/а, ако нещо не щяка но не знаеш какво, ако искаш
компас а не поредния съвет - опитай. Първата натална карта е безплатна.
Отнема 2 минути.

Най-лошото което може да се случи е да научиш нещо ново за себе си.
Най-доброто? Да намериш пътя си.

[ГОЛЯМ CTA БУТОН: Изчисли безплатната си натална карта сега]

P.S. За пълния пакет (Синастрия, месечни прогнози, транзити) има Ultimate план
за 30лв/месец. Аз го взех след първата седмица. Най-добрата инвестиция която
съм правила в себе си.
```

---

## 🎬 Next Steps (Immediate)

### Week 1: Foundation (Phase 1 MVP)
1. **Day 1-2**: Database setup + admin blog list UI
2. **Day 3-4**: Blog generator form + Claude integration
3. **Day 5**: Preview, edit, publish flow
4. **Day 6**: Public blog display pages
5. **Day 7**: Testing + first test article generation

### Week 2: Enhancement (Start Phase 2)
1. DALL-E 3 integration
2. SEO optimization layer
3. CTA injection system
4. Enhanced blog layout
5. Test with 3-5 real articles

### Week 3+: Scale (Phase 2 completion + Phase 3)
1. Analytics dashboard
2. Quality analyzer
3. Content calendar
4. Performance optimization
5. Full production launch - aim for 2-4 articles/week

---

## 📝 Notes & Considerations

### Bulgarian Language Specifics
- Use informal "ти" (not formal "вие")
- Avoid anglicisms where Bulgarian equivalent exists
- Use cultural references (Bulgarian holidays, traditions)
- Respect superstitions and folklore (важно за окултна аудитория)
- Cyrilllic-only (no latinization)

### Astrology Content Guidelines
- Balance mysticism with practical advice
- Don't make medical claims
- Use disclaimers: "За забавление и саморефлексия"
- Respect all zodiac signs equally (no negativity)
- Cite sources when using technical terms
- Provide both sun sign and rising sign content

### Conversion Psychology
- Build trust before asking (TOFU → BOFU journey)
- Value-first approach (give before asking)
- Social proof > features
- Fear of missing out (FOMO) > pressure
- Specificity > vague promises
- Story > statistics

---

## ✨ Success Criteria

This project will be considered successful when:

1. ✅ **Technical**: Admin can generate publication-ready article in < 10 minutes
2. ✅ **Quality**: Articles pass AI detection with < 30% AI probability
3. ✅ **SEO**: 50%+ of articles rank page 1 within 3 months
4. ✅ **Conversion**: 5%+ CTR from blog to services
5. ✅ **ROI**: Break-even within 4 weeks per article
6. ✅ **Scale**: Publishing 3-4 articles/week consistently

---

**Let's build this! 🚀**

*This document will be updated as we progress through implementation.*
