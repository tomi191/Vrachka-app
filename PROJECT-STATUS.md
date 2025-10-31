# 📊 VRACHKA - PROJECT STATUS (Source of Truth)

**Last Updated:** 31 Октомври 2025
**Status:** ✅ DEPLOYED to Production (Vercel)
**Version:** 1.2.0 - Blog System Enhanced

---

## 🎯 QUICK OVERVIEW

| Metric | Value |
|--------|-------|
| **Production Status** | ✅ LIVE on Vercel |
| **Current Version** | 1.2.0 - Blog System Enhanced |
| **Core Features** | 14 working (added Moon Phase) |
| **Advanced Features** | 3 flagship (Natal Chart, Synastry, Personal Horoscope) |
| **Public Landing Pages** | 3 (Tarot, Natal Chart, Moon Phase) |
| **Blog Posts** | 4 published with enhanced UX |
| **Total Routes** | 98 routes |
| **API Endpoints** | 40+ |
| **Database Tables** | 25+ |
| **AI Models** | 5 (Gemini 2.5 Pro for blogs, Claude, DeepSeek, GPT-4, Gemini Image) |
| **Subscription Tiers** | 3 (Free/Basic/Ultimate) |
| **Stripe Integration** | ✅ Working (Test + Production) |
| **Build Time** | ~50 seconds |

---

## 📝 BLOG SYSTEM ENHANCEMENTS (Version 1.2.0 - 31 Oct 2025)

Complete overhaul of blog post rendering, UX, and AI generation for professional, engaging content.

### 🎨 Visual & UX Improvements

#### 1. Typography & Spacing - FIXED ✅
**Problem:** Blog posts looked cramped, unprofessional with tight H2 spacing.

**Solution:**
- H2 headings: `mt-10 mb-5` → `mt-16 mb-8 pt-8` with `border-top`
- Paragraph spacing: `mb-3` → `mb-6` for breathing room
- List spacing: `my-3 space-y-1` → `my-6 space-y-2`
- Enhanced blockquotes: Added `bg-zinc-900/50`, `border-l-4`, `py-4 px-6`
- Code blocks: Added `bg-zinc-950`, `border`, `shadow-xl`
- Links: Added transition effects and hover states

**Files Modified:**
- `app/blog/[slug]/page.tsx` - Comprehensive prose classes update

---

#### 2. Image Display System - FIXED ✅
**Problem:** Only hero image showing, 2 inline images missing from blog posts.

**Solution:**
- Added `image_urls TEXT[]` column to `blog_posts` table
- Updated `processInlineImages()` to render all 3 images:
  - Hero image in post header
  - Image 1 at `<!-- IMAGE:1 -->` marker
  - Image 2 at `<!-- IMAGE:2 -->` marker
- Added `<figure>` and `<figcaption>` structure
- Added hover scale effects for better UX
- Alt text and captions for SEO

**Migration:**
- `supabase/migrations/20250131_add_blog_image_urls.sql`
- Populated `image_urls` for 4 existing blog posts
- Script: `scripts/run-blog-migration.mjs`

**Files Modified:**
- `app/blog/[slug]/page.tsx` - Enhanced image rendering with captions
- `app/api/blog/publish/route.ts` - Store `image_urls` array in DB
- `lib/ai/blog-prompts.ts` - Fixed marker format to `IMAGE:1`, `IMAGE:2`

---

#### 3. Table of Contents (TOC) - NEW ✅
**Added:** Sticky sidebar component with auto-generated TOC from H2/H3 headings.

**Features:**
- Automatic extraction of headings
- Active section highlighting on scroll (Intersection Observer)
- Smooth scroll navigation
- Responsive (hidden on mobile to save space)
- Beautiful glass-card styling

**Files Added:**
- `components/blog/TableOfContents.tsx` - New client component

**Files Modified:**
- `app/blog/[slug]/page.tsx` - Integrated TOC in sidebar

---

#### 4. Layout Width - OPTIMIZED ✅
**Problem:** Main content column too narrow (66%), wasting horizontal space.

**Solution:**
- Grid layout: `8/4 columns` → `9/3 columns`
- Content width: 66% → 75% (+9% more space)
- Sidebar: 33% → 25% (still enough for widgets)
- Gap: Responsive `gap-6 lg:gap-8`

**Result:** Better readability, modern blog appearance.

---

#### 5. TOC Duplication - FIXED ✅
**Problem:** AI was generating inline "В тази статия" TOC + we added sidebar TOC = confusing duplication.

**Solution:**
- Removed `<!-- TOC -->` marker from AI prompts
- AI no longer generates inline TOC
- Only sidebar TOC component is used

**Files Modified:**
- `lib/ai/blog-prompts.ts` - Removed TOC marker instruction

---

### 🤖 AI Model Switch - Gemini 2.5 Pro

#### Switched from Claude 3.5 Sonnet to Google Gemini 2.5 Pro

**Reasons:**
1. **Better Bulgarian Language** 🇧🇬
   - More natural, conversational tone
   - Avoids complex/academic words
   - Matches Vrachka brand voice

2. **Word Count Compliance** 📝
   - Claude often generated 400-800 words instead of 2000
   - Gemini better at following requirements
   - Increased `max_tokens`: 8000 → 12000

3. **Cost Efficiency** 💰
   - Claude: $3/$15 per 1M tokens
   - Gemini: $1.25/$5 per 1M tokens
   - **2.4x cheaper!**

**Technical Changes:**
```typescript
// Before:
model: 'anthropic/claude-3.5-sonnet',
max_tokens: 8000,

// After:
model: 'google/gemini-2.5-pro',
max_tokens: 12000,
```

**Files Modified:**
- `app/api/blog/generate/route.ts` - Model and max_tokens updated
- `app/api/blog/publish/route.ts` - `model_used` field updated

---

### 📊 Database Changes

**Migration:** `20250131_add_blog_image_urls.sql`

```sql
-- Add image_urls column
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Populate from blog_images table
UPDATE blog_posts bp
SET image_urls = (
  SELECT ARRAY_AGG(bi.url ORDER BY bi.position_in_article)
  FROM blog_images bi
  WHERE bi.blog_post_id = bp.id
);
```

**Result:**
- 4 blog posts updated
- All have `image_urls` array with 3 URLs
- Dynamic image replacement now possible

---

### 🐛 Bug Fixes

1. **Build Error:** `generatedIdeas` undefined → Fixed to `ideas`
2. **Build Error:** `generationTime` undefined → Removed from response
3. **Marker Format:** `IMAGE_2`/`IMAGE_3` → `IMAGE:1`/`IMAGE:2` (with colon)

---

### 📈 Impact & Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Content Width** | 66% | 75% | +9% more space |
| **H2 Spacing** | mt-10 mb-5 | mt-16 mb-8 pt-8 | +60% breathing room |
| **Images Shown** | 1/3 (33%) | 3/3 (100%) | ✅ All images |
| **TOC** | None / Inline duplicate | Sticky sidebar | ✅ Better UX |
| **AI Cost** | $3/$15 per 1M | $1.25/$5 per 1M | 2.4x cheaper |
| **Word Count** | ~400-800 | 2000+ target | ✅ Full articles |

---

## 🆕 PHASE 2 P0 FEATURES (DEPLOYED - 31 Oct 2025)

This section documents the features deployed in Version 1.1.0 - moon phase system and public landing pages.

### 🌙 Moon Phase System
**Status:** ✅ LIVE in Production

Complete moon phase tracking system with real-time calculations and personalized advice.

**Features:**
- ✅ **LiveMoonPhaseWidget** - Real-time moon phase display with spiritual meaning
  - Current phase name and emoji (8 phases: New Moon, Waxing Crescent, First Quarter, etc.)
  - Illumination percentage calculation
  - Moonrise/moonset times (calculated for Sofia, Bulgaria)
  - Spiritual meaning for each phase
  - Personalized advice based on user's zodiac sign element (Fire/Earth/Air/Water)
- ✅ **MoonCalendar** - Full lunar calendar view
  - 30-day moon phase visualization
  - Daily phase names and illumination
  - Interactive calendar interface
- ✅ **Public Landing Page** - `/moon-phase`
  - SEO-optimized public page
  - CTA for registration/subscription
  - Educational content about moon phases

**Technical Details:**
- Library: `suncalc` for astronomical calculations
- Location: Sofia, Bulgaria (42.6977°N, 23.3219°E) as default
- Refresh: Real-time calculation on component mount
- Personalization: Zodiac-based advice for 4 element groups

**Files:**
- `components/MoonPhaseWidget.tsx` - Dashboard widget
- `components/LiveMoonPhaseWidget.tsx` - Public page widget
- `components/MoonCalendar.tsx` - Calendar component
- `app/moon-phase/page.tsx` - Public landing page
- `app/(authenticated)/dashboard/page.tsx` - Integrated on dashboard

**User Access:**
- 🆓 FREE: Public page view only
- 💙 BASIC: Dashboard widget with personalized advice
- 👑 ULTIMATE: Full access with zodiac personalization

---

### 🎴 Public SEO Landing Pages
**Status:** ✅ LIVE in Production

Three new public landing pages designed for SEO and conversion optimization.

**Pages:**
1. **`/tarot`** - Tarot Readings Landing Page
   - TarotSpreadsGrid component showcasing all 4 spread types
   - Plan badges (🆓 FREE, 💙 BASIC, 👑 ULTIMATE)
   - Lock indicators for premium spreads
   - SignupPromptDialog for free users
   - Direct links to authenticated spreads for logged-in users
   - Images for each spread type

2. **`/natal-chart`** - Natal Chart Teaser Page
   - Educational content about natal charts
   - Feature highlights (10 planets, 12 houses, aspects)
   - Upgrade CTA for non-Ultimate users
   - Direct access for Ultimate plan users

3. **`/moon-phase`** - Moon Phase Landing Page
   - LiveMoonPhaseWidget with current phase
   - MoonCalendar with 30-day view
   - Educational content about lunar cycles
   - Registration CTA for personalized experience

**SEO Optimization:**
- Proper meta tags and descriptions
- Structured data (in progress)
- Keyword-optimized content
- Mobile-responsive design
- Fast loading times

**Conversion Elements:**
- Clear CTAs based on user state (logged in/out)
- Plan-based access indicators
- Benefit-focused messaging
- Signup modals with feature lists

**Files:**
- `app/tarot/page.tsx` - Tarot landing
- `app/natal-chart/page.tsx` - Natal chart landing (Ultimate teaser)
- `app/moon-phase/page.tsx` - Moon phase landing
- `components/tarot/TarotSpreadsGrid.tsx` - Spread showcase component

---

### 🗂️ Route Restructuring
**Status:** ✅ COMPLETE

Reorganized routes to clearly separate public vs authenticated pages for better SEO and UX.

**Changes:**
- `/tarot` → Public landing page (NEW)
- `/tarot-readings` → Authenticated tarot readings (RENAMED from `/tarot`)
- `/tarot-readings/three-card` → Three-card spread
- `/tarot-readings/love` → Love spread (Ultimate)
- `/tarot-readings/career` → Career spread (Ultimate)
- `/natal-chart` → Public landing page (NEW, Ultimate teaser)
- `/moon-phase` → Public landing page (NEW)

**Benefits:**
- Clear separation of public marketing pages vs app features
- Better for SEO (public pages indexable)
- Improved navigation structure
- Easier to add more public content pages

**Files Updated:**
- `components/layout/bottom-nav.tsx` - Updated navigation links
- `components/layout/mobile-menu.tsx` - Updated menu structure
- `components/tarot/TarotSpreadsGrid.tsx` - Updated spread URLs
- All tarot reading components - Updated internal links

---

### 🎨 UX Improvements
**Status:** ✅ LIVE in Production

Multiple user experience enhancements based on usability testing.

**Improvements:**
1. **Darker Dropdown Menus**
   - Changed from `mystic-800` to `mystic-950` backgrounds
   - Better contrast and readability
   - Reduced eye strain in dark mode
   - Files: `components/layout/user-dropdown.tsx`, `components/layout/mobile-menu.tsx`

2. **Enhanced Signup Prompts**
   - New `SignupPromptDialog` component with rich benefit lists
   - Feature-specific messaging (e.g., "Безплатна Таро Карта Всеки Ден")
   - Emoji-enhanced benefit bullets
   - Clear call-to-action buttons
   - File: `components/auth/SignupPromptDialog.tsx`

3. **Plan-Based Access Control Improvements**
   - Visual lock indicators on premium content
   - Plan badges on all feature cards
   - Clear upgrade prompts with benefit explanations
   - "Unlock" buttons redirect to appropriate pages (pricing vs registration)

4. **Mobile Menu Enhancements**
   - Improved animation (slide-in from right)
   - Backdrop blur effect
   - Better touch targets
   - Organized sections (Content, Account)

**Files:**
- `components/auth/SignupPromptDialog.tsx` - New reusable signup modal
- `components/layout/user-dropdown.tsx` - Darker dropdown
- `components/layout/mobile-menu.tsx` - Enhanced mobile navigation
- `components/tarot/TarotSpreadsGrid.tsx` - Plan-based access UI

---

### 🚀 Production Deployment
**Status:** ✅ DEPLOYED to Vercel

Successfully deployed to production after fixing build errors.

**Deployment Details:**
- **Platform:** Vercel
- **Build Time:** ~50 seconds
- **Total Routes:** 98 routes
- **Build Status:** ✅ SUCCESS
- **Date:** 31 October 2025

**Build Fixes:**
Three TypeScript errors fixed during deployment:

1. **Dashboard Type Error** (`app/(authenticated)/dashboard/page.tsx:60`)
   - Fixed: ZodiacSign type casting to allow `undefined`
   - Commit: `cfd83da`

2. **MoonPhaseWidget Import Error** (`components/MoonPhaseWidget.tsx:8`)
   - Fixed: Wrong ZodiacSign type import path
   - Changed from `/lib/constants/zodiac` to `/lib/zodiac`
   - Commit: `f88d57d`

3. **TarotSpreadsGrid Property Error** (`components/tarot/TarotSpreadsGrid.tsx:104`)
   - Fixed: Removed unused `spread.icon` property access
   - Commit: `4e08950`

**Build Warnings:**
- ~160 ESLint warnings (unused imports, `any` types, image optimization)
- **Status:** Ignored for now (non-blocking, will address in Phase 2 P1)
- All warnings are non-critical and don't affect functionality

**Environment:**
- Production Supabase database
- Production Stripe keys (test mode for initial testing)
- All AI providers configured
- Email service (Resend) connected

---

## ✅ WORKING FEATURES (Production Ready)

### 🔐 Authentication & User Management
- ✅ Email/Password registration and login
- ✅ Email verification enforcement (middleware)
- ✅ Password reset flow (forgot + reset)
- ✅ Onboarding flow (name, birth date, zodiac)
- ✅ User profiles (avatar, streak tracking)
- ✅ Admin role system (`is_admin` flag)

**Files:**
- `app/auth/*` - Auth pages
- `app/onboarding/page.tsx` - Onboarding
- `middleware.ts` - Email verification enforcement

---

### 🏠 Landing Page & Public Pages
- ✅ Professional landing page (bento grids, hero, features, testimonials, FAQ)
- ✅ Pricing page (Free/Basic/Ultimate with currency selector BGN/EUR)
- ✅ About, Contact, Features pages
- ✅ Privacy policy (BG + EN)
- ✅ Cookies policy (BG + EN)
- ✅ Blog index and individual posts (SEO optimized)

**Files:**
- `app/page.tsx` - Landing page
- `app/pricing/page.tsx` - Pricing
- `app/blog/*` - Blog system
- `components/landing/*` - Landing components

---

### ⭐ Horoscope System
- ✅ Public daily horoscopes за всички 12 зодии
- ✅ AI generation с Gemini Flash
- ✅ 24h caching в `daily_content` table
- ✅ SEO-optimized individual zodiac pages (`/horoscope/[sign]`)
- ✅ Element colors, planet icons, zodiac icons (SVG)

**Files:**
- `app/horoscope/*` - Horoscope pages
- `components/HoroscopeCard.tsx` - Horoscope card
- `lib/zodiac.ts` - Zodiac utilities
- API: `GET /api/horoscope?sign={sign}&type={daily|weekly|monthly}`

**Subscription Access:**
- 🆓 FREE: Daily horoscopes
- 💙 BASIC: Daily + Weekly + Monthly
- 👑 ULTIMATE: All + Personalized (with natal chart)

---

### 🃏 Tarot System
- ✅ 78 tarot cards (22 Major + 56 Minor Arcana) в DB
- ✅ 4 spread types: Single, Three-card, Love, Career
- ✅ Reversed card logic
- ✅ AI interpretations (Gemini Flash)
- ✅ Plan-based access control
- ✅ Reading history tracking (`tarot_readings` table)
- ✅ Daily limits per plan

**Files:**
- `app/(authenticated)/tarot/*` - Tarot pages
- `components/TarotReading.tsx` - Main interface
- `components/ThreeCardSpread.tsx` - 3-card spread
- `components/LoveReading.tsx` - Love spread (5 cards)
- `components/CareerReading.tsx` - Career spread (5 cards)
- API: `POST /api/tarot`

**Subscription Access:**
- 🆓 FREE: 1 single card/day
- 💙 BASIC: 3 readings/day, three-card spread
- 👑 ULTIMATE: Unlimited, love/career spreads

---

### 💬 Oracle (AI Assistant)
- ✅ AI conversation interface (Jung + Stoicism + Daoism philosophy)
- ✅ Conversation memory (last 5-10 messages)
- ✅ Plan-based AI quality (Basic → Gemini Flash, Ultimate → Claude Sonnet)
- ✅ Rate limiting and daily quotas
- ✅ Conversation history storage (`oracle_conversations` table)

**Files:**
- `app/(authenticated)/oracle/page.tsx` - Oracle page
- `components/OracleChat.tsx` - Chat interface
- API: `POST /api/oracle`, `GET /api/oracle`

**Subscription Access:**
- 🆓 FREE: No access
- 💙 BASIC: 3 questions/day (Gemini Flash)
- 👑 ULTIMATE: 10 questions/day (Claude Sonnet)

---

### 🌌 Natal Chart Calculator (ULTIMATE FLAGSHIP)
- ✅ Пълна натална карта с 10 планети, 12 houses, aspects
- ✅ Uses `circular-natal-horoscope-js` library
- ✅ AI interpretation с Claude Sonnet (8 sections)
- ✅ Multiple charts per user (unlimited)
- ✅ Birth data form с quick-select Bulgarian cities
- ✅ Latitude/longitude validation
- ✅ Multi-tab interface (Overview, Planets, Houses, Aspects)

**Files:**
- `app/natal-chart/*` - Natal chart pages
- `app/natal-chart/[id]/*` - Individual chart view
- `lib/astrology/natal-chart.ts` - Calculations
- `lib/astrology/interpretations.ts` - AI interpretations
- API: `POST /api/natal-chart/calculate`, `GET /api/natal-chart/list`, `GET /api/natal-chart/[id]`

**Database:**
- Table: `natal_charts` (migration 016)
- RLS: Users CRUD own charts

**Subscription Access:**
- 🆓 FREE: No access (shows upgrade teaser)
- 💙 BASIC: No access
- 👑 ULTIMATE: Full access

---

### 💕 Synastry (Compatibility Analysis) (ULTIMATE)
- ✅ Two natal chart comparison
- ✅ Love, communication, sexual chemistry, long-term potential scores (0-10)
- ✅ AI analysis с Claude Sonnet
- ✅ Compatibility data saved (`synastry_reports` table)

**Files:**
- `app/(authenticated)/synastry/page.tsx` - Synastry page
- `lib/astrology/synastry.ts` - Calculations
- API: `POST /api/synastry/calculate`

**Database:**
- Table: `synastry_reports` (migration 20250126)

**Subscription Access:**
- 👑 ULTIMATE only

---

### 🔮 Personal Horoscope (Transit Analysis) (ULTIMATE)
- ✅ Monthly/Yearly forecasts based on natal chart
- ✅ Transit analysis (current planets vs natal planets)
- ✅ AI generation с Claude Sonnet
- ✅ Recent horoscopes list

**Files:**
- `app/(authenticated)/personal-horoscope/*` - Personal horoscope pages
- `lib/astrology/transits.ts` - Transit calculations
- API: `POST /api/personal-horoscope/generate`

**Database:**
- Table: `personal_horoscopes` (migration 20250126)

**Subscription Access:**
- 👑 ULTIMATE only

---

### 📝 Blog System
- ✅ AI blog generation (Claude 3.5 Sonnet)
- ✅ Content types: TOFU, MOFU, BOFU, Advertorial
- ✅ Categories: Astrology, Tarot, Numerology, Spirituality, General
- ✅ SEO metadata (meta tags, OG images, structured data)
- ✅ AI image generation (Gemini 2.5 Flash Image - free)
- ✅ Reading time calculation
- ✅ View tracking
- ✅ Related posts
- ✅ Newsletter subscription widget

**Files:**
- `app/blog/*` - Blog pages
- `app/admin/blog/*` - Blog management
- `components/blog/*` - Blog components
- `lib/blog/generator.ts` - AI generation
- API: `POST /api/blog/generate`, `POST /api/blog/publish`, `POST /api/blog/update`, `DELETE /api/blog/delete`

**Database:**
- Tables: `blog_posts`, `blog_images`, `blog_ideas` (migration 20250126)

**Admin Only:** Blog creation/editing requires `is_admin = true`

---

### 💳 Subscription & Payments
- ✅ 3 subscription tiers (Free/Basic/Ultimate)
- ✅ Stripe integration (Checkout + Webhooks + Customer Portal)
- ✅ Currency support (BGN/EUR)
- ✅ Trial system (`trial_tier` + `trial_end` в profiles)
- ✅ Access control на всички нива (page/API/feature)
- ✅ Rate limiting (IP-based + plan-based daily limits)

**Files:**
- `app/pricing/page.tsx` - Pricing page
- `app/subscription/*` - Subscription pages
- `lib/subscription.ts` - Access control logic
- `lib/config/plans.ts` - Plan configuration
- `lib/stripe/*` - Stripe clients
- API: `POST /api/checkout`, `POST /api/customer-portal`, `POST /api/webhooks/stripe`

**Database:**
- Table: `subscriptions` (user_id UNIQUE - one subscription per user)
- Trigger: `on_profile_created` → creates free subscription

**Stripe Webhooks:**
- `checkout.session.completed` - Create subscription
- `customer.subscription.*` - Update subscription
- `invoice.payment_succeeded` - Renewal
- `invoice.payment_failed` - Payment failed

**Plan Details:**
| Tier | Price BGN | Price EUR | Oracle/day | Tarot/day | Premium Features |
|------|-----------|-----------|------------|-----------|------------------|
| 🆓 FREE | 0 | 0 | 0 | 1 (single) | Daily horoscope |
| 💙 BASIC | 9.99 | 4.99 | 3 (Gemini) | 3 | Weekly/monthly horoscopes, three-card spread |
| 👑 ULTIMATE | 19.99 | 9.99 | 10 (Claude) | Unlimited | Natal chart, synastry, personal horoscope, love/career spreads |

---

### 📊 Admin Dashboard
- ✅ Statistics overview (users, subscriptions, readings, conversations)
- ✅ User management (grant premium, toggle admin, change plan)
- ✅ Subscription management (create manual, cancel)
- ✅ Blog management (AI generation, edit, publish, delete)
- ✅ Financial tracking (AI costs, revenue analytics)
- ✅ Recent activity feeds

**Files:**
- `app/admin/*` - Admin pages
- `components/admin/*` - Admin components
- API: `POST /api/admin/*`

**Access:** Requires `is_admin = true` в profiles table

**Financial Tracking:**
- Table: `ai_cost_tracking` - AI usage costs per feature
- Table: `revenue_tracking` - Revenue transactions

---

### 📱 PWA (Progressive Web App)
- ✅ PWA configured с `next-pwa`
- ✅ Installable на mobile/desktop
- ✅ Offline page (`/offline`)
- ✅ Service worker setup
- ✅ Manifest file

**Files:**
- `next.config.js` - PWA config
- `app/offline/page.tsx` - Offline fallback

---

### 🎨 UI/UX
- ✅ Mobile-first design
- ✅ Bottom navigation (4 tabs: Dashboard, Tarot, Oracle, Profile)
- ✅ Top header с streak tracking и notifications
- ✅ Dark mode theme (glass morphism, градиенти)
- ✅ Bento grid layouts (modern aesthetic)
- ✅ Zodiac icons (SVG, 12 signs)
- ✅ Planet & element icons
- ✅ Shimmer buttons
- ✅ Gradient text effects
- ✅ Loading skeletons
- ✅ Toast notifications (Shadcn/UI)
- ✅ Animated backgrounds (GSAP constellations)

**Files:**
- `components/layout/*` - Layout components
- `components/ui/*` - Shadcn UI components
- `components/background/*` - Animated backgrounds
- `components/icons/*` - Zodiac and astrology icons

---

## 🔶 PARTIALLY IMPLEMENTED / IN PROGRESS

### 📧 Email Campaigns
- 🔶 **Status:** Templates готови, Resend client setup, automation липсва
- 🔶 **Ready:** Welcome email, verification email, password reset
- 🔶 **Missing:** Cron job implementations
  - Daily horoscope emails (7:00 AM)
  - Renewal reminders
  - Trial expiring warnings
  - Upsell campaigns
  - Weekly digest

**Files:**
- `lib/email/*` - Email client and templates
- `app/api/cron/*` - Cron endpoints (defined but not triggered)
- API: `GET /api/cron/send-daily-horoscope`, `GET /api/cron/renewal-reminder`, etc.

**Needed:** Vercel Cron configuration в `vercel.json`

---

### 🎁 Referral System
- 🔶 **Status:** Database schema готов, API endpoints липсват
- 🔶 **Ready:**
  - Tables: `referral_codes`, `referral_redemptions`
  - Function: `generate_referral_code()` работи
  - UI: Referral page exists (`/profile/referral`)
- 🔶 **Missing:**
  - Reward granting logic
  - Email notifications за referrer
  - Admin referral analytics
  - Referral code validation API

**Database:**
- Tables: `referral_codes`, `referral_redemptions` (migrations 003, 017)

---

### 🔔 Push Notifications
- 🔶 **Status:** Database schema готов, implementation липсва
- 🔶 **Ready:** Table `push_subscriptions` (migration 004)
- 🔶 **Missing:**
  - Service worker registration logic
  - Push sending API (`web-push` library installed but unused)
  - Notification handling UI
  - User preferences integration

---

### 📩 Newsletter
- 🔶 **Status:** Database table готова, API endpoints готови, sending липсва
- 🔶 **Ready:**
  - Table: `newsletter_subscribers` (migration 20250129)
  - API: `POST /api/newsletter/subscribe`, `POST /api/newsletter/unsubscribe`
  - Form: `components/NewsletterSubscribeForm.tsx`
- 🔶 **Missing:**
  - Email sending implementation (daily horoscope emails)
  - Unsubscribe page UI (`/unsubscribe` exists but minimal)
  - Newsletter templates

---

### 🔔 In-App Notifications
- 🔶 **Status:** Database schema готов, dropdown component exists, logic липсва
- 🔶 **Ready:**
  - Table: `in_app_notifications` (migration 010)
  - Component: `components/NotificationsDropdown.tsx`
- 🔶 **Missing:**
  - Notification creation logic (triggers for various events)
  - Real-time updates (websocket/polling)
  - Notification types implementation

---

### 🎮 Геймификация (Streaks)
- 🔶 **Status:** Streak tracking работи, rewards липсват
- 🔶 **Ready:**
  - `profiles.daily_streak` field
  - `profiles.last_visit_date` field
  - Streak display в header
  - `lib/streak.ts` calculation logic
- 🔶 **Missing:**
  - Reward system (badges, points, discounts)
  - Streak milestones (7-day, 30-day, etc.)
  - Streak recovery logic (freeze days)
  - Leaderboard

**Comment from project:** "За момента е не нужно защото не даваме нищо ако си последователен!"

---

## ❌ PLANNED BUT NOT STARTED

### 🌐 Multi-Language Support (i18n)
- ❌ **Status:** Само Bulgarian
- **Planned:** English version
- **Needed:**
  - i18n library setup (next-intl or similar)
  - Translation files (bg.json, en.json)
  - Language selector UI
  - `/en/*` URL structure

**Decision:** Фокус върху Bulgarian пазар за MVP (per Update-PLANING.md)

---

### 📱 Native Mobile Apps
- ❌ **Status:** PWA ready, native apps not started
- **Planned:** React Native apps (iOS + Android)

---

### 📊 Advanced Analytics Dashboard
- ❌ **Current:** Basic view tracking в `blog_posts`
- **Planned:**
  - Full analytics dashboard
  - Conversion tracking
  - User behavior analysis
  - Cohort analysis

---

### 🧪 A/B Testing
- ❌ **Planned:** Test pricing, CTAs, landing variants
- **Status:** Not implemented

---

### 🏢 White-Label Solution
- ❌ **Planned:** Multi-tenant for other astrology services
- **Status:** Not planned for MVP

---

## 🗄️ DATABASE SCHEMA (25+ Tables)

### Core Tables
| Table | Purpose | RLS | Key Features |
|-------|---------|-----|--------------|
| `profiles` | User profiles | ✅ Users CRUD own | full_name, birth_date, zodiac_sign, avatar_url, daily_streak, is_admin, trial_tier |
| `subscriptions` | User subscriptions | ✅ Users view own | stripe_customer_id, plan_type, status, current_period_end |
| `api_usage_limits` | Daily usage tracking | ✅ Users CRUD own | oracle_questions_count, tarot_readings_count |
| `daily_content` | Cached AI content | ✅ Auth users read | Horoscopes, tarot meanings (24h cache) |

### Tarot Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `tarot_cards` | 78 tarot cards | ✅ Public read |
| `tarot_readings` | Reading history | ✅ Users view own |

### Oracle Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `oracle_conversations` | AI conversations | ✅ Users view own, PRIVATE from others |

### Natal Chart Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `natal_charts` | Natal chart data | ✅ Users CRUD own |
| `synastry_reports` | Compatibility reports | ✅ Users view/create own |
| `personal_horoscopes` | Transit forecasts | ✅ Users view/create own |

### Blog Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `blog_posts` | Blog articles | ✅ Public read published, admin CRUD |
| `blog_images` | Blog images | ✅ Public read |
| `blog_ideas` | Content ideas | ✅ Admin only |
| `newsletter_subscribers` | Email list | ✅ Public insert (subscribe) |

### Financial Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `ai_cost_tracking` | AI usage costs | ✅ Admin only |
| `revenue_tracking` | Revenue transactions | ✅ Admin only |

### Notification Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `in_app_notifications` | In-app notifications | ✅ Users view/update own |
| `push_subscriptions` | Push notification subscriptions | ✅ Users CRUD own |
| `user_preferences` | User preferences | ✅ Users CRUD own |

### Referral Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `referral_codes` | Referral codes | ✅ Users view own |
| `referral_redemptions` | Redemption tracking | ✅ Users view own (both sides) |

### Backend Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `rate_limit_backend` | Rate limiting | ✅ Service role only |

**Total Migrations:** 30+ migration files

---

## 🔌 API ENDPOINTS (40+)

### Authentication APIs
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/send-verification` - Send verification email
- `POST /api/auth/grant-trial` - Grant trial (Admin)

### Horoscope API
- `GET /api/horoscope?sign={sign}&type={daily|weekly|monthly}` - Get horoscope (public за daily)

### Tarot API
- `POST /api/tarot` - Create tarot reading (auth required, plan-based)
- `GET /api/tarot` - Get available spreads and limits

### Oracle API
- `POST /api/oracle` - Ask Oracle (Premium only: Basic/Ultimate)
- `GET /api/oracle` - Get conversation history

### Natal Chart APIs
- `POST /api/natal-chart/calculate` - Calculate natal chart (ULTIMATE only)
- `GET /api/natal-chart/list` - List user's charts
- `GET /api/natal-chart/[id]` - Get specific chart
- `DELETE /api/natal-chart/[id]` - Delete chart

### Synastry API
- `POST /api/synastry/calculate` - Calculate compatibility (ULTIMATE only)

### Personal Horoscope API
- `POST /api/personal-horoscope/generate` - Generate forecast (ULTIMATE only)

### Blog APIs (Admin Only)
- `POST /api/blog/generate` - AI blog generation
- `POST /api/blog/publish` - Publish blog post
- `POST /api/blog/update` - Update blog post
- `DELETE /api/blog/delete` - Delete blog post
- `POST /api/blog/generate-ideas` - AI idea generation
- `POST /api/blog/generate-images` - AI image generation
- `POST /api/blog/add-images` - Add images to post

### Subscription & Payments
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/customer-portal` - Create customer portal session
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Admin APIs
- `POST /api/admin/seed-tarot` - Seed tarot cards (one-time)
- `GET /api/admin/schema` - Get DB schema (service role only)
- `POST /api/admin/users/change-plan` - Change user plan
- `POST /api/admin/users/toggle-admin` - Toggle admin status
- `POST /api/admin/subscriptions/create-manual` - Create manual subscription
- `POST /api/admin/subscriptions/cancel` - Cancel subscription

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe

### Cron Jobs (not triggered, need Vercel Cron config)
- `GET /api/cron/daily-horoscopes` - Generate daily horoscopes
- `GET /api/cron/send-daily-horoscope` - Send horoscope emails
- `GET /api/cron/renewal-reminder` - Subscription renewals
- `GET /api/cron/trial-expiring` - Trial expiring warnings
- `GET /api/cron/upsell-campaign` - Upsell campaigns
- `GET /api/cron/weekly-digest` - Weekly digest emails

### Other
- `GET /api/og` - Dynamic OG image generation
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/count` - Unread count

---

## 🤖 AI MODELS & STRATEGY

### Model Configuration

| Model | Provider | Cost | Use Case |
|-------|----------|------|----------|
| **Gemini Flash** | Google | FREE | Horoscopes, Tarot, Oracle Basic |
| **Gemini 2.5 Pro** | Google | $1.25/$5 per 1M | Blog content generation (natural Bulgarian) |
| **Claude Sonnet** | Anthropic | $3/$15 per 1M | Oracle Ultimate, Natal Chart, Synastry, Personal Horoscope |
| **Claude Haiku** | Anthropic | $0.25/$1.25 per 1M | Blog idea generation (fast & cheap) |
| **DeepSeek Chat** | DeepSeek | $0.27/$1.10 per 1M | Ultra-cheap fallback |
| **GPT-4 Turbo** | OpenAI | $10/$30 per 1M | Legacy (not primary) |
| **Gemini Image** | Google | FREE | Blog image generation |

### Feature-to-Model Mapping

| Feature | Primary Model | Fallback Chain | Plan Required |
|---------|---------------|----------------|---------------|
| **Daily Horoscope** | Gemini Flash | DeepSeek → GPT-4 | Free+ |
| **Tarot Reading** | Gemini Flash | DeepSeek → GPT-4 | Free+ (plan limits) |
| **Oracle Basic** | Gemini Flash | DeepSeek → GPT-4 | Basic |
| **Oracle Ultimate** | Claude Sonnet | Gemini → DeepSeek | Ultimate |
| **Natal Chart** | Claude Sonnet | Gemini → DeepSeek | Ultimate |
| **Synastry** | Claude Sonnet | Gemini → DeepSeek | Ultimate |
| **Personal Horoscope** | Claude Sonnet | Gemini → DeepSeek | Ultimate |
| **Blog Content** | Gemini Flash | DeepSeek → Claude | Admin |
| **Blog Images** | Gemini Image | - | Admin |

### AI Cost Tracking
- ✅ All AI calls tracked в `ai_cost_tracking` table
- ✅ Metrics: feature_type, model_used, prompt_tokens, completion_tokens, total_cost
- ✅ Admin dashboard показва AI costs breakdown

---

## 📁 KEY FILES & DIRECTORIES

### App Structure
```
app/
├── (authenticated)/          # Protected routes
│   ├── dashboard/           # Main dashboard
│   ├── tarot/               # Tarot system
│   ├── oracle/              # Oracle AI chat
│   ├── profile/             # User profile
│   └── natal-chart/         # Natal chart (ULTIMATE)
├── auth/                    # Authentication pages
├── onboarding/              # Onboarding flow
├── admin/                   # Admin dashboard
├── blog/                    # Blog system
├── horoscope/               # Public horoscopes
├── pricing/                 # Pricing page
└── api/                     # API routes
```

### Components
```
components/
├── layout/                  # Navigation, header, footer
├── landing/                 # Landing page sections
├── blog/                    # Blog components
├── admin/                   # Admin components
├── background/              # Animated backgrounds
├── icons/                   # Zodiac & astrology icons
└── ui/                      # Shadcn UI components
```

### Libraries
```
lib/
├── ai/                      # AI clients (OpenRouter, OpenAI)
├── astrology/               # Astrology calculations & interpretations
├── supabase/                # Supabase clients (server, client, storage)
├── stripe/                  # Stripe integration
├── email/                   # Email client & templates
├── subscription.ts          # Access control logic
├── config/plans.ts          # Plan configuration
├── rate-limit.ts            # Rate limiting
├── zodiac.ts                # Zodiac utilities
└── utils.ts                 # General utilities
```

### Database
```
supabase/
└── migrations/              # 30+ migration files
```

---

## 🚀 DEPLOYMENT STATUS

### Current Deployment
- **Platform:** ✅ Vercel (LIVE)
- **Status:** Production - Version 1.1.0
- **Deployment Date:** 31 October 2025
- **Database:** Supabase (production)
- **Payments:** Stripe (configured, test mode for now)
- **Build Time:** ~50 seconds
- **Routes:** 98 total
- **Environment:** All environment variables configured

### Deployment Checklist
- ✅ MVP features working
- ✅ Phase 2 P0 features deployed
- ✅ Database schema complete
- ✅ RLS policies in place
- ✅ Stripe integration tested
- ✅ Production environment variables configured
- ✅ Vercel deployment successful
- ⚠️ Vercel Cron configuration needed (Phase 2 P1)
- ⚠️ Custom domain setup (planned)
- ⚠️ Stripe production mode activation (after testing)

### Required Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_BASIC_PRICE_ID_BGN=
STRIPE_BASIC_PRICE_ID_EUR=
STRIPE_ULTIMATE_PRICE_ID_BGN=
STRIPE_ULTIMATE_PRICE_ID_EUR=

# OpenRouter
OPENROUTER_API_KEY=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## 🔒 SECURITY STATUS

### Implemented Security Measures ✅
- ✅ Row Level Security (RLS) enabled на всички таблици
- ✅ Email verification enforcement (middleware)
- ✅ Admin route protection (`is_admin` check)
- ✅ API authentication checks
- ✅ Rate limiting (IP + user-based)
- ✅ Stripe webhook signature verification
- ✅ Environment variables not committed (.gitignore)
- ✅ Service role key isolation
- ✅ Private conversations (RLS policy prevents cross-user access)

### Security Considerations
- ⚠️ No CAPTCHA на forms (potential spam risk)
- ⚠️ No 2FA (two-factor authentication)
- ⚠️ No IP blocking mechanism

---

## ⚡ PERFORMANCE OPTIMIZATIONS

### Implemented ✅
- ✅ Horoscope caching (24h в daily_content table)
- ✅ Database indexes (migration 007)
- ✅ Next.js 15 App Router (Server Components)
- ✅ Lazy loading (Suspense за BlogSection)
- ✅ Rate limiting prevents abuse
- ✅ Turbo mode enabled (`npm run dev --turbo`)

### Recommended
- ⚠️ Image optimization (use Next.js Image component consistently)
- ⚠️ CDN for static assets
- ⚠️ Redis for rate limiting (current: in-memory + DB fallback)

---

## 📝 NEXT ACTIONS (Prioritized)

### 🔴 Critical (Week 1-2)
1. [ ] Configure Vercel Cron jobs (`vercel.json`)
   - Daily horoscope email (7:00 AM)
   - Renewal reminders
   - Trial expiring warnings
2. [ ] Implement daily email sending logic
   - Connect cron endpoint to Resend
   - Test with newsletter subscribers
3. [ ] Deploy to Vercel production
   - Setup environment variables
   - Test Stripe webhooks
   - Verify RLS policies

### 🟠 High Priority (Week 3-4)
4. [ ] Complete referral system
   - Reward granting logic
   - Email notifications
   - Analytics tracking
5. [ ] Implement push notifications
   - Service worker registration
   - Push sending API
   - User preferences UI
6. [ ] Add missing documentation
   - ENV_VARIABLES.md
   - DEPLOYMENT.md
   - STRIPE_SETUP.md

### 🟡 Medium Priority (Month 2)
7. [ ] Геймификация enhancements
   - Reward system (badges, points)
   - Streak milestones
   - Leaderboard
8. [ ] Blog feature enhancements
   - Comments system
   - Social sharing improvements
   - Analytics dashboard integration
9. [ ] Multi-language support (if needed)
   - i18n setup
   - English translations
   - Language selector

### 🟢 Low Priority (Month 3+)
10. [ ] Native mobile apps (React Native)
11. [ ] Advanced analytics dashboard
12. [ ] A/B testing infrastructure
13. [ ] White-label solution exploration

---

## 📊 METRICS TO TRACK

### User Metrics
- Total users
- Active users (daily/weekly/monthly)
- New signups per day
- Onboarding completion rate
- Daily streak average

### Subscription Metrics
- Free users count
- Basic subscribers count
- Ultimate subscribers count
- Trial conversions (trial → paid)
- Churn rate
- MRR (Monthly Recurring Revenue)
- Average revenue per user (ARPU)

### Feature Usage Metrics
- Horoscope views per day
- Tarot readings per day
- Oracle questions per day
- Natal chart calculations per day
- Blog post views
- Newsletter subscribers

### Financial Metrics
- AI costs per feature
- Cost per user
- Revenue per feature
- Profit margin
- Stripe fees

### Performance Metrics
- Page load times
- API response times
- Database query performance
- Error rates
- Rate limit hits

---

## 🐛 KNOWN ISSUES

### Minor Issues
1. **Streak tracking:** Works but no rewards yet (commented: "За момента е не нужно защото не даваме нищо ако си последователен!")
2. **Push notifications:** Database ready but not implemented
3. **Referral rewards:** Schema ready but logic missing
4. **Email automation:** Templates ready but cron not configured
5. **Documentation:** Missing ENV_VARIABLES.md, DEPLOYMENT.md, STRIPE_SETUP.md files referenced в README

### Cleanup Needed
- Unused component: `components/layout/sidebar.tsx`
- Unused utility: `lib/sounds.ts`
- Unused utility: `lib/ai/question-classifier.ts`
- Test migration files can be removed

---

## 🎯 SUCCESS CRITERIA (MVP)

### Must Have (Completed ✅)
- ✅ User authentication and onboarding
- ✅ 3-tier subscription system working
- ✅ Stripe payments functional
- ✅ Core features working (Horoscope, Tarot, Oracle)
- ✅ Premium features working (Natal Chart, Synastry, Personal Horoscope)
- ✅ Admin dashboard functional
- ✅ Blog system with AI generation
- ✅ Mobile-first UI
- ✅ PWA support

### Nice to Have (Partially Done 🔶)
- 🔶 Email automation (templates ready, cron missing)
- 🔶 Push notifications (schema ready, implementation missing)
- 🔶 Referral system (schema ready, logic missing)
- 🔶 Геймификация rewards (tracking works, rewards missing)

### Future Goals (Planned ❌)
- ❌ Multi-language support
- ❌ Native mobile apps
- ❌ Advanced analytics
- ❌ A/B testing

---

## 📞 SUPPORT & MAINTENANCE

### Regular Maintenance Tasks
- [ ] Monitor AI costs (weekly)
- [ ] Review subscription metrics (weekly)
- [ ] Check error logs (daily via Sentry when set up)
- [ ] Update blog content (2-3 posts per week)
- [ ] Respond to user feedback
- [ ] Database backups (Supabase automatic)

### Emergency Contacts
- **Developer:** [Your name/contact]
- **Supabase Support:** https://supabase.com/support
- **Stripe Support:** https://support.stripe.com
- **Vercel Support:** https://vercel.com/support

---

## 🔄 UPDATE LOG

**31 Oct 2025 (Evening):** 📝 Blog System ENHANCED - Version 1.2.0
- **Typography & Spacing:** H2 margins increased (+60%), better prose classes, enhanced blockquotes/code blocks
- **Image System:** Fixed - all 3 images now showing (hero + 2 inline with captions)
- **Table of Contents:** NEW sticky sidebar component with active section highlighting
- **Layout Width:** Optimized from 66% to 75% content width (9/3 grid)
- **TOC Duplication:** Fixed - removed inline TOC marker from AI prompts
- **AI Model Switch:** Claude 3.5 Sonnet → Gemini 2.5 Pro (better Bulgarian, 2.4x cheaper, 2000+ words)
- **Database Migration:** Added `image_urls TEXT[]` column, populated 4 blog posts
- **Bug Fixes:** Fixed 2 TypeScript build errors (generatedIdeas, generationTime)
- **Git Commits:** 5 commits (a8e3b58, 4fdfaf2, d7d47ac, caa0980, eb27031)

**31 Oct 2025 (Morning):** 🚀 Phase 2 P0 DEPLOYED to Vercel Production
- Added Moon Phase System (LiveMoonPhaseWidget, MoonCalendar, public page)
- Added 3 public SEO landing pages (/tarot, /natal-chart, /moon-phase)
- Route restructuring (separated public vs authenticated routes)
- UX improvements (darker dropdowns, enhanced signup prompts)
- Fixed 3 TypeScript build errors
- Successfully deployed 98 routes to Vercel
- Updated version to 1.1.0

**30 Oct 2025:** Initial PROJECT-STATUS.md created based on comprehensive codebase analysis

---

**📌 Note:** This file should be updated after every significant change to the project. Update the "Last Updated" date at the top.

**🎯 This is the SINGLE SOURCE OF TRUTH for project status.**
