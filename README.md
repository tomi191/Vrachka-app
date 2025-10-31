# Vrachka - Твоят Духовен Гид

Modern PWA приложение за персонализирани хороскопи, таро четения, натални карти и AI оракул.

## 📊 Quick Stats

- ✅ **16 Core Features** Fully Functional (13 core + 3 flagship ULTIMATE)
- 🔧 **5 Features** Partially Implemented
- 📊 **25+ Database Tables** with comprehensive RLS
- 🤖 **Hybrid AI Strategy** (Gemini Flash FREE, Claude Sonnet ULTIMATE)
- 💳 **3 Subscription Tiers** (FREE, BASIC 9.99 лв, ULTIMATE 19.99 лв)
- 🌟 **78 Tarot Cards** (Major + Minor Arcana)
- 🔐 **40+ API Endpoints** Protected with rate limiting
- 🎯 **Status:** MVP Ready for Production + Growth Phase

## Status: ✅ Production Ready + Growth Phase

### Core Features - Fully Functional

#### 🎯 13 Core Features:
- **AI Horoscopes** - Дневни/Седмични/Месечни хороскопи с hybrid AI (Gemini + Claude)
- **Tarot Readings** - 78 таро карти (Major + Minor Arcana) с AI интерпретации
- **Digital Oracle** - Premium AI чат асистент (Jung + Stoicism + Daoism)
- **Authentication** - Пълен auth flow (Email/Password + OAuth с Google/Facebook)
- **Payments & Subscriptions** - Stripe integration (Checkout + Webhooks + Customer Portal)
- **Admin Dashboard** - Content management, users, subscriptions, analytics
- **Blog System** - Пълна система с категории, тагове, и schema markup
- **PWA Support** - Installable app с offline functionality
- **Mobile-First UI** - Professional dark mode с bottom navigation
- **Daily Content** - Automated caching и daily updates
- **Rate Limiting** - IP-based и plan-based daily limits
- **Email System** - Newsletter integration с Resend
- **Security** - Comprehensive RLS policies на всички таблици

#### 👑 3 Flagship ULTIMATE Features:
- **Natal Chart Calculator** - Пълна натална карта с 10 планети, 12 houses, aspects, AI интерпретация
- **Synastry (Съвместимост)** - Детайлна синастрия между две натални карти
- **Personal Horoscope** - Персонализиран хороскоп базиран на пълна натална карта

### 📚 Documentation

- **[PROJECT-STATUS.md](./PROJECT-STATUS.md)** - ⭐ Single source of truth за текущото състояние на проекта
- **[ideas/Update-PLANING.md](./ideas/Update-PLANING.md)** - Детайлен план за следващите features и приоритизация
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment checklist (if exists)
- **[ENV_VARIABLES.md](./ENV_VARIABLES.md)** - Detailed guide for environment variables (if exists)
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Stripe integration guide (if exists)

### Partially Implemented (Needs Enhancement)

- **Email Campaigns** - Newsletter API готов, липсва cron job за daily emails
- **Push Notifications** - Web Push library installed, липсва VAPID setup
- **Referral System** - Database tables готови, липсва UI
- **In-App Notifications** - Database ready, липсва UI component
- **Streak Rewards** - Tracking работи, но няма rewards механизъм

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS + Custom Mystic Theme (Shadcn/UI)
- **Database**: Supabase (PostgreSQL) + Row Level Security (RLS)
- **Authentication**: Supabase Auth (Email/Password + OAuth)
- **Payments**: Stripe (Checkout + Webhooks + Customer Portal)
- **AI Models**: OpenRouter (Hybrid Strategy)
  - 🆓 FREE: Gemini 2.0 Flash (google/gemini-2.0-flash-exp:free)
  - 👑 ULTIMATE: Claude 3.5 Sonnet (anthropic/claude-3.5-sonnet)
  - 🔄 Fallback: DeepSeek Chat (deepseek/deepseek-chat)
  - 🖼️ Images: Gemini 2.5 Flash Image (google/gemini-2.5-flash-image)
- **Email**: Resend
- **Astrology**: circular-natal-horoscope-js
- **Animations**: Framer Motion + GSAP
- **Deployment**: Vercel
- **PWA**: next-pwa

## 📁 Project Structure

```
vrachka-app/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public pages
│   │   ├── about/           # About page
│   │   ├── auth/            # Auth pages (login, signup, forgot-password)
│   │   ├── blog/            # Blog system (categories, tags, posts)
│   │   ├── horoscope/       # Horoscope pages (daily, weekly, monthly)
│   │   ├── onboarding/      # User onboarding flow
│   │   └── page.tsx         # Landing page
│   ├── (authenticated)/     # Protected routes (requires auth)
│   │   ├── dashboard/       # Main dashboard
│   │   ├── natal-chart/     # Natal Chart Calculator (ULTIMATE)
│   │   ├── oracle/          # AI Oracle chat
│   │   ├── personal-horoscope/  # Personal Horoscope (ULTIMATE)
│   │   ├── profile/         # User profile & settings
│   │   ├── subscription/    # Subscription management
│   │   ├── synastry/        # Synastry calculator (ULTIMATE)
│   │   └── tarot/           # Tarot readings
│   ├── admin/               # Admin dashboard (protected)
│   │   ├── analytics/       # Analytics & stats
│   │   ├── blog/            # Blog management
│   │   ├── content/         # Content management
│   │   ├── subscriptions/   # Subscription overview
│   │   └── users/           # User management
│   └── api/                 # API routes
│       ├── admin/           # Admin APIs
│       ├── horoscope/       # Horoscope generation
│       ├── natal-chart/     # Natal chart calculations
│       ├── oracle/          # AI Oracle API
│       ├── tarot/           # Tarot reading API
│       └── webhooks/        # Stripe webhooks
├── components/
│   ├── astrology/           # Astrology-specific components
│   ├── blog/                # Blog components
│   ├── layout/              # Layout components (nav, header, footer)
│   ├── oracle/              # Oracle chat components
│   ├── subscription/        # Subscription components
│   ├── tarot/               # Tarot components
│   └── ui/                  # Shadcn UI components
├── lib/
│   ├── astrology/           # Astrology calculations & interpretations
│   ├── openrouter.ts        # AI model configuration
│   ├── supabase/            # Supabase clients (client, server, admin)
│   ├── stripe.ts            # Stripe integration
│   ├── types.ts             # TypeScript types
│   ├── utils.ts             # Utility functions
│   └── zodiac.ts            # Zodiac logic
└── supabase/
    └── migrations/          # 30+ Database migrations (full schema)
```

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier OK for development)
- OpenRouter API key (supports free models like Gemini Flash)
- Stripe account (test mode OK for development)
- Resend account (for emails)
- Vercel account (for deployment)

### Local Development

1. **Clone and install**
```bash
git clone https://github.com/tomi191/Vrachka-app.git
cd vrachka
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env.local
```

Fill in all required variables. See **[ENV_VARIABLES.md](./ENV_VARIABLES.md)** for detailed guide.

3. **Setup Supabase database**
- Create project at supabase.com
- Run migration: `supabase/migrations/001_initial_schema.sql`
- Copy API keys to `.env.local`

4. **Setup Stripe products**
- Create two products: Basic (9.99 лв) and Ultimate (19.99 лв)
- Copy price IDs to `.env.local`
- See **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** for details

5. **Run dev server**
```bash
npm run dev
```

Open http://localhost:3000

### Production Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment checklist.

**Critical Post-Deployment Step:**
```bash
# Seed Tarot cards (one-time operation)
curl -X POST https://your-domain.vercel.app/api/admin/seed-tarot
```

## 🎨 Design System

### Color Palette
- **Mystic Purple**: Primary color for UI elements
- **Cosmic Pink**: Accent color for special features
- **Dark Background**: Gradient from mystic-950 to cosmic-950

### Typography
- **Font**: Geist Sans (body), Geist Mono (code)
- **Headings**: Bold, gradient text effect
- **Body**: Clean, readable mystic-200/300

### Components
All components follow Shadcn/UI patterns with custom mystic theme.

## 📱 Mobile-First Approach

- Fixed bottom navigation (4 tabs)
- Sticky top header with streak & notifications
- Touch-optimized UI elements
- PWA-ready for installation

## 🔐 Authentication Flow (✅ WORKING)

1. **Landing page** → Sign up/Login buttons
2. **Auth options:**
   - Email/Password (Supabase Auth)
   - Google OAuth
   - Facebook OAuth
3. **Onboarding flow:**
   - Welcome screen
   - Name + Birth date collection
   - Zodiac sign auto-calculation
   - Redirect to Dashboard
4. **Protected routes** - Middleware checks auth status

## 💳 Subscription Tiers (✅ WORKING)

### 🆓 FREE Plan
- Daily horoscope (all 12 signs)
- Card of the day (tarot)
- Streak tracking
- Blog access
- Basic profile
- **Limits:** 1 tarot reading/day, no AI Oracle

### 💙 BASIC Premium (9.99 лв/месец)
- All FREE features
- Weekly/Monthly horoscopes
- **5 tarot readings/day** (vs 1 free)
- **3 AI Oracle questions/day**
- Better AI models (Gemini Pro)
- Priority email support

### 👑 ULTIMATE Premium (19.99 лв/месец)
- All BASIC features
- **Unlimited tarot readings**
- **10 AI Oracle questions/day**
- **🌟 Natal Chart Calculator** - Пълна натална карта с AI интерпретация
- **🌟 Synastry Calculator** - Съвместимост между две натални карти
- **🌟 Personal Horoscope** - Персонализиран дневен хороскоп базиран на натална карта
- Premium AI models (Claude 3.5 Sonnet)
- Priority support

## 📊 Database Schema (25+ Tables)

### Core Tables
- **`profiles`** - User profile data (name, birth date, zodiac, streak)
- **`subscriptions`** - Stripe subscription management
- **`subscription_tiers`** - Tier configuration (FREE, BASIC, ULTIMATE)

### Content & Caching
- **`daily_horoscopes`** - Cached daily horoscopes (24h revalidation)
- **`weekly_horoscopes`** - Cached weekly horoscopes
- **`monthly_horoscopes`** - Cached monthly horoscopes
- **`tarot_cards`** - 78 tarot cards (Major + Minor Arcana)
- **`tarot_readings`** - User reading history

### AI & Oracle
- **`oracle_conversations`** - Chat history with AI Oracle
- **`oracle_messages`** - Individual messages
- **`ai_models`** - AI model configuration
- **`ai_usage_logs`** - Token usage tracking

### Astrology (ULTIMATE Features)
- **`natal_charts`** - Saved natal charts
- **`natal_chart_interpretations`** - AI interpretations
- **`synastry_readings`** - Compatibility readings
- **`personal_horoscopes`** - Personalized daily horoscopes

### Blog System
- **`blog_posts`** - Blog articles
- **`blog_categories`** - Categories
- **`blog_tags`** - Tags
- **`blog_post_tags`** - Many-to-many relation

### Engagement & Limits
- **`api_usage_limits`** - Daily rate limiting (IP + plan-based)
- **`user_streaks`** - Consecutive login tracking
- **`notifications`** - In-app notifications (DB ready)
- **`newsletter_subscribers`** - Email list

### Referrals & Rewards (Partially implemented)
- **`referral_codes`** - User referral codes
- **`referral_rewards`** - Reward tracking

### Admin
- **`admin_logs`** - Admin action logging
- **`feature_flags`** - Feature toggles

**All tables have comprehensive RLS (Row Level Security) policies.**

See `supabase/migrations/` for full schema (30+ migration files).

## 🤖 AI Integration (Hybrid OpenRouter Strategy)

### AI Model Selection Logic

**Tier-Based Model Assignment:**
- 🆓 **FREE Users** → Gemini 2.0 Flash (google/gemini-2.0-flash-exp:free)
- 💙 **BASIC Users** → Gemini 2.0 Flash Pro
- 👑 **ULTIMATE Users** → Claude 3.5 Sonnet (anthropic/claude-3.5-sonnet)

**Fallback Chain:**
1. Primary model (based on tier)
2. DeepSeek Chat (deepseek/deepseek-chat)
3. Error message with retry option

**Cost Optimization:**
- FREE tier uses $0 cost models (Gemini Flash free version)
- Paid tiers get premium models for better quality
- Token usage logged for analytics

### Professional Prompts Based on World-Class Astrologers

**Horoscopes** (Susan Miller + Chani Nicholas methodology)
- Персонален, окуражаващ тон
- Конкретни съвети (не генерични фрази)
- Love/Career/Health breakdown
- Lucky numbers

**Tarot** (Rachel Pollack + Arthur Waite)
- Класически + психологически интерпретации
- Spread types: Single, 3-Card, Love, Career
- Reversed card logic
- Практични съвети

**Oracle** (Carl Jung + Stoicism + Daoism)
- Философска мъдрост
- Не дава готови решения - дава перспектива
- Насочва към собствена мъдрост
- Метафори от природата

### API Routes (40+ Endpoints)

#### Public APIs
- `GET /api/horoscope` - Generate daily horoscopes (all signs)
- `GET /api/horoscope/weekly` - Weekly horoscopes
- `GET /api/horoscope/monthly` - Monthly horoscopes
- `GET /api/blog` - Blog posts list
- `GET /api/blog/categories` - Blog categories
- `GET /api/blog/tags` - Blog tags
- `POST /api/newsletter/subscribe` - Newsletter subscription

#### Authenticated APIs
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/streak` - Get streak data
- `POST /api/tarot/reading` - Generate tarot reading
- `GET /api/tarot/history` - Reading history
- `POST /api/oracle` - Send message to AI Oracle
- `GET /api/oracle/conversations` - Conversation list
- `DELETE /api/oracle/conversation/[id]` - Delete conversation

#### ULTIMATE APIs (Premium)
- `POST /api/natal-chart/calculate` - Generate natal chart
- `GET /api/natal-chart/list` - User's natal charts
- `GET /api/natal-chart/[id]` - Get specific chart
- `DELETE /api/natal-chart/[id]` - Delete chart
- `POST /api/synastry/calculate` - Calculate synastry
- `GET /api/synastry/list` - Synastry readings
- `POST /api/personal-horoscope` - Generate personal horoscope

#### Subscription APIs
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/portal` - Create customer portal session
- `GET /api/subscription` - Get current subscription
- `POST /api/webhooks/stripe` - Stripe webhook handler

#### Admin APIs (Protected)
- `GET /api/admin/users` - List all users
- `GET /api/admin/subscriptions` - Subscription overview
- `GET /api/admin/analytics` - Platform analytics
- `POST /api/admin/seed-tarot` - Seed tarot cards (one-time)
- `POST /api/admin/blog` - Create/edit blog posts

### Caching & Rate Limiting

- **Horoscopes**: Cached 24h per zodiac sign
- **Tarot**: Rate limited by subscription (1/day free, 5/day basic, 20/day ultimate)
- **Oracle**: Rate limited (3/day basic, 10/day ultimate)
- **Usage tracking**: Stored in `api_usage_limits` table

## 🚀 Deployment към Vercel

### Стъпка 1: Push към GitHub

```bash
# Инициализирай Git (ако не е направено)
git init

# Добави всички файлове
git add .

# Направи initial commit
git commit -m "Initial commit - Vrachka app ready for deployment"

# Добави remote repository
git branch -M main
git remote add origin https://github.com/tomi191/Vrachka-app.git

# Push към GitHub
git push -u origin main
```

### Стъпка 2: Import в Vercel

1. Отиди на [vercel.com](https://vercel.com) и влез с GitHub акаунт
2. Кликни **"Add New..." → Project**
3. Import **tomi191/Vrachka-app** repository
4. **ВАЖНО**: Промени **Root Directory** на `vrachka` (не root!)
5. Кликни **Deploy** (засега БЕЗ environment variables)

### Стъпка 3: Добави Environment Variables

След deploy, отиди на **Settings → Environment Variables** и добави:

```env
# Supabase (копирай от .env.local)
NEXT_PUBLIC_SUPABASE_URL=https://kpdumthwuahkuaggilpz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=твоя_anon_key
SUPABASE_SERVICE_ROLE_KEY=твоя_service_role_key

# Stripe (TEST keys за първоначално тестване)
STRIPE_SECRET_KEY=sk_test_твоя_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_твоя_key
STRIPE_WEBHOOK_SECRET=whsec_temp_placeholder
STRIPE_BASIC_PRICE_ID=price_твоя_basic_id
STRIPE_ULTIMATE_PRICE_ID=price_твоя_ultimate_id

# OpenAI
OPENAI_API_KEY=sk-твоя_openai_key

# App URL (ВАЖНО - промени след deploy!)
NEXT_PUBLIC_APP_URL=https://твоя-vercel-url.vercel.app
```

**ВАЖНО**: След добавяне на всички variables, кликни **Redeploy** за да заредят промените!

### Стъпка 4: Setup Production Stripe Webhooks

1. Копирай твоя Vercel URL (напр. `https://vrachka.vercel.app`)
2. Отиди на [Stripe Dashboard](https://dashboard.stripe.com) → **Developers → Webhooks**
3. Кликни **+ Add endpoint**
4. Попълни:
   - **Endpoint URL**: `https://твоя-url.vercel.app/api/webhooks/stripe`
   - **Description**: `Vrachka Production Webhooks`
5. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. Кликни **Add endpoint**
7. **Копирай Signing secret** (започва с `whsec_...`)
8. Върни се във Vercel → Settings → Environment Variables
9. **Промени** `STRIPE_WEBHOOK_SECRET` на новия production secret
10. **Redeploy** отново!

### Стъпка 5: Тестване на Production

1. Отвори `https://твоя-url.vercel.app`
2. Регистрирай нов акаунт
3. Тествай checkout flow с Stripe test card: `4242 4242 4242 4242`
4. Провери дали webhook event се получава в Stripe Dashboard
5. Провери дали subscription се обновява в Supabase

### 🔴 Production Checklist

- [ ] GitHub repo е private или public (според предпочитанията)
- [ ] Всички environment variables са добавени във Vercel
- [ ] `NEXT_PUBLIC_APP_URL` е променен към production URL
- [ ] Production Stripe webhook е създаден и signing secret добавен
- [ ] Test checkout работи в production
- [ ] Supabase RLS policies позволяват operations
- [ ] `.env.local` НЕ е commit-ван в Git (проверка!)

### 🚀 Бъдещи Deployments

След първоначалния deploy, промени се автоматично deploy-ват:

```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel автоматично ще deploy-не новата версия!

### 📝 Custom Domain (Optional)

1. Vercel Settings → Domains
2. Добави твой домейн (напр. `vrachka.eu`)
3. Конфигурирай DNS според Vercel инструкциите
4. **Промени** `NEXT_PUBLIC_APP_URL` в environment variables
5. **Промени** Stripe webhook URL към новия домейн

## 🗺️ Roadmap

### ✅ Phase 1 - MVP (COMPLETED)
- [x] Authentication + Onboarding flow
- [x] AI Horoscopes (Daily/Weekly/Monthly)
- [x] Tarot Readings (78 cards - Major + Minor Arcana)
- [x] Digital Oracle (AI chat)
- [x] Stripe Payments + Webhooks
- [x] Admin Dashboard
- [x] Subscription Management (3 tiers)
- [x] Blog System (categories, tags, schema markup)
- [x] PWA Support
- [x] **👑 Natal Chart Calculator** (ULTIMATE)
- [x] **👑 Synastry Calculator** (ULTIMATE)
- [x] **👑 Personal Horoscope** (ULTIMATE)

### 🚀 Phase 2 - Growth & SEO (CURRENT - Next 2-3 months)

#### P0 - Critical (Weeks 1-2)
- [ ] Homepage SEO optimization (H1, meta, 200+ words)
- [ ] Horoscope page SEO (educational content, FAQ)
- [ ] About page enrichment (300+ words)
- [ ] Tarot page SEO (500+ words, FAQ)
- [ ] Daily email cron job (Vercel cron)
- [ ] Moon Phase Tracker widget
- [ ] Rating system (1-5 stars)

#### P1 - High Priority (Weeks 3-5)
- [ ] Service pages expansion (/tarot/love, /tarot/career, etc.)
- [ ] Blog category/tag SEO descriptions
- [ ] Welcome email sequence
- [ ] Beautiful share cards (@vercel/og)
- [ ] Premium teasers in UI
- [ ] Feature comparison table
- [ ] Social proof counters

#### P2 - Medium Priority (Months 2-3)
- [ ] Weekly/Monthly calendar views
- [ ] AI Chat Widget (floating bubble)
- [ ] Astrology Events Calendar
- [ ] Planetary Transits Widget
- [ ] Interactive Compatibility Calculator (quick version)
- [ ] Specialized AI Oracles (Love, Career, Health)
- [ ] Streak rewards system
- [ ] Referral program UI

### 🎯 Phase 3 - Advanced Features (Months 4-6)
- [ ] Push Notifications (VAPID setup)
- [ ] Numerology Calculator
- [ ] Charts & Trends Visualization
- [ ] Video/Audio Horoscope (Text-to-Speech)
- [ ] Community Comments (moderated)
- [ ] 3D Visual Effects (WebGL)
- [ ] Advanced gamification

### 🌍 Phase 4 - Scaling (6+ months)
- [ ] Mobile apps (React Native)
- [ ] Multi-language support (EN, DE, etc.)
- [ ] API for third-party integration
- [ ] White-label solution
- [ ] Analytics dashboard (Posthog/Mixpanel)
- [ ] A/B testing infrastructure

## 📝 Contributing

This is a private project. Contact the team for contribution guidelines.

## 📄 License

Proprietary - All rights reserved © 2025 Vrachka

## 🙏 Credits

- UI Framework: [Shadcn/UI](https://ui.shadcn.com/)
- Icons: [Lucide Icons](https://lucide.dev/)
- Fonts: [Geist](https://vercel.com/font)
- Database: [Supabase](https://supabase.com)

---

**Built with ❤️ and ✨ by the Vrachka team**
