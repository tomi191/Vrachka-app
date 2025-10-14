# Vrachka - Твоят Духовен Гид 🔮

Modern PWA приложение за персонализирани хороскопи, таро четения и AI оракул.

## 📋 Текущ Статус

### ✅ Завършено
- [x] Next.js 15 setup (TypeScript + Tailwind CSS + App Router)
- [x] Професионален dark mode UI дизайн (zinc/slate палитра)
- [x] Supabase database schema (7 tables)
- [x] Mobile-first layout с bottom navigation
- [x] Пълен authentication flow (Login, Register, Logout)
- [x] Onboarding процес (име, рожденна дата, зодия)
- [x] Admin dashboard с analytics
- [x] Stripe integration (checkout, webhooks, customer portal)
- [x] Pricing page (Free, Basic 9.99 лв, Ultimate 19.99 лв)
- [x] Profile page със subscription management
- [x] Environment configuration
- [x] Ready for deployment

### 🚧 В процес на разработка
- [ ] Daily horoscope интеграция (OpenAI API)
- [ ] Card of the Day с flip анимация
- [ ] 3-card Tarot reading (Premium)
- [ ] Digital Oracle Q&A (Premium)
- [ ] Streak система и gamification
- [ ] PWA setup (manifest, service worker)

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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key (upcoming)
- Stripe account (upcoming)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd vrachka
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Supabase**
- Create project at [supabase.com](https://supabase.com)
- Run migrations from `supabase/migrations/001_initial_schema.sql`
- Run seed data from `supabase/seed.sql`
- See `supabase/README.md` for detailed instructions

4. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Fill in (виж `.env.local.example` за пълен пример):
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_BASIC_PRICE_ID=price_your_basic_price_id
STRIPE_ULTIMATE_PRICE_ID=price_your_ultimate_price_id

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**ВАЖНО**: Виж [STRIPE_SETUP.md](./STRIPE_SETUP.md) за детайлни Stripe инструкции.

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

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

## 🔮 AI Integration (Upcoming)

### OpenAI Prompts
- Daily horoscope generation
- Tarot card interpretations
- Oracle Q&A responses
- Numerology reports

### Caching Strategy
- Daily horoscopes: 24 hours per zodiac
- Tarot meanings: Per card per day
- Oracle answers: Stored for history

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

## 📈 Roadmap

### Phase 2 (Current Sprint)
- [ ] Complete authentication
- [ ] Onboarding flow
- [ ] Real horoscope generation (OpenAI)
- [ ] Card of the Day functionality

### Phase 3
- [ ] Premium features
- [ ] Stripe integration
- [ ] 3-card tarot reading
- [ ] Digital Oracle Q&A

### Phase 4
- [ ] Numerology
- [ ] Compatibility
- [ ] Natal chart
- [ ] Streak rewards
- [ ] Referral program

### Phase 5 (Future)
- [ ] Push notifications
- [ ] Email campaigns
- [ ] Social sharing
- [ ] Admin dashboard
- [ ] Mobile apps (React Native)

## 🐛 Known Issues

- Daily horoscope използва placeholder data (OpenAI интеграция в процес)
- Card of the Day без flip анимация (предстои)
- Tarot readings и Oracle функционалности (предстоят)
- Stripe е тестван само локално (production webhook след deploy)

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
