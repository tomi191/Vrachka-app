# Vrachka - Твоят Духовен Гид

Modern PWA приложение за персонализирани хороскопи, таро четения и AI оракул с GPT-4.

## Status: MVP Ready for Production

### Core Features - Fully Functional

- **AI Horoscopes** - Дневни хороскопи генерирани с GPT-4 (Susan Miller + Chani Nicholas стил)
- **Tarot Readings** - Работещи таро четения с AI интерпретации (Rachel Pollack + Arthur Waite)
- **Digital Oracle** - Premium AI асистент за духовни въпроси (Jung + Stoicism + Daoism)
- **Authentication** - Пълен auth flow (Email/Password + OAuth)
- **Payments** - Stripe integration (Checkout + Webhooks + Customer Portal)
- **Subscription Tiers** - Free / Basic (9.99 лв) / Ultimate (19.99 лв)
- **Admin Dashboard** - Content management, users, subscriptions
- **Mobile-First UI** - Professional dark mode дизайн с bottom navigation

### Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment checklist and post-deployment steps
- **[ENV_VARIABLES.md](./ENV_VARIABLES.md)** - Detailed guide for all environment variables
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Stripe integration guide

### What's Not Included in MVP

- Natal chart calculator (Phase 2)
- Minor Arcana tarot cards (only 22 Major Arcana)
- Push notifications
- Email campaigns
- Referral rewards system

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Custom Mystic Theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel
- **PWA**: next-pwa

## 📁 Project Structure

```
vrachka/
├── app/
│   ├── (authenticated)/      # Protected routes
│   │   ├── dashboard/        # Main dashboard
│   │   ├── tarot/            # Tarot readings
│   │   ├── oracle/           # AI Oracle (Premium)
│   │   └── profile/          # User profile
│   ├── auth/                 # Auth pages (upcoming)
│   ├── onboarding/           # Onboarding flow (upcoming)
│   └── page.tsx              # Landing page
├── components/
│   ├── layout/               # Layout components
│   │   ├── bottom-nav.tsx    # Mobile navigation
│   │   └── top-header.tsx    # Header with streak
│   └── ui/                   # UI components (Shadcn)
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── types.ts              # TypeScript types
│   ├── utils.ts              # Utility functions
│   └── zodiac.ts             # Zodiac logic
└── supabase/
    ├── migrations/           # Database migrations
    └── seed.sql              # Seed data (tarot cards)
```

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- OpenAI API key (with billing setup)
- Stripe account
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

## 🔐 Authentication Flow (Upcoming)

1. Landing page → Sign up/Login
2. Email/Password OR Google/Facebook OAuth
3. Onboarding (name, birth date, zodiac calculation)
4. Redirect to Dashboard

## 💳 Monetization (Upcoming)

### Free Plan
- Daily horoscope
- Card of the day
- Streak tracking

### Basic Premium (9.99 лв./месец)
- Weekly/Monthly horoscopes
- Tarot readings (3/day)
- AI Oracle (3 questions/day)
- Numerology
- Compatibility

### Ultimate Premium (16.99 лв./месец)
- All Basic features
- Unlimited tarot readings
- 10 Oracle questions/day
- Detailed natal chart
- Priority support

## 📊 Database Schema

### Main Tables
- `profiles` - User profile data
- `subscriptions` - Subscription management
- `daily_content` - Cached AI content
- `tarot_cards` - Tarot card data
- `oracle_conversations` - Chat history
- `api_usage_limits` - Rate limiting
- `referral_codes` - Referral program

See `supabase/migrations/` for full schema.

## AI Integration (GPT-4)

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

### API Routes

- `GET /api/horoscope` - Generate daily/weekly/monthly horoscopes
- `POST /api/oracle` - AI conversations (Premium)
- `GET /api/oracle` - Conversation history
- `POST /api/tarot` - Tarot readings with AI interpretations
- `GET /api/tarot` - Available spreads and limits
- `POST /api/admin/seed-tarot` - Seed tarot cards (one-time)

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
2. Добави твой домейн (напр. `vrachka.bg`)
3. Конфигурирай DNS според Vercel инструкциите
4. **Промени** `NEXT_PUBLIC_APP_URL` в environment variables
5. **Промени** Stripe webhook URL към новия домейн

## Roadmap

### Phase 1 - MVP (COMPLETED)
- [x] Authentication + Onboarding
- [x] AI Horoscopes (GPT-4)
- [x] Tarot Readings
- [x] Digital Oracle
- [x] Stripe Payments
- [x] Admin Dashboard
- [x] Subscription Management

### Phase 2 - Enhancements (Next)
- [ ] Weekly/Monthly horoscopes optimization
- [ ] Minor Arcana tarot cards (56 more cards)
- [ ] Natal chart calculator
- [ ] Numerology reports
- [ ] Compatibility checker
- [ ] Streak rewards system
- [ ] Referral program

### Phase 3 - Growth
- [ ] Push notifications
- [ ] Email campaigns
- [ ] Social sharing
- [ ] Analytics dashboard
- [ ] A/B testing
- [ ] SEO optimization

### Phase 4 - Scaling
- [ ] Mobile apps (React Native)
- [ ] Multi-language support
- [ ] API for third-party integration
- [ ] White-label solution

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
