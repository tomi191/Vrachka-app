import { ZodiacSign } from './zodiac';

export type PlanType = 'free' | 'basic' | 'ultimate';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
export type ContentType = 'horoscope' | 'tarot_daily_meaning' | 'weekly_horoscope' | 'monthly_horoscope';

export interface Profile {
  id: string;
  full_name: string;
  birth_date: string;
  birth_time?: string;
  birth_place?: string;
  zodiac_sign: ZodiacSign;
  avatar_url?: string;
  onboarding_completed: boolean;
  daily_streak: number;
  last_visit_date?: string;
  total_oracle_questions_asked: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyContent {
  id: number;
  content_type: ContentType;
  target_date: string;
  target_key: string; // zodiac sign or card name
  content_body: {
    text: string;
    keywords?: string[];
    mood?: 'positive' | 'neutral' | 'challenging';
    lucky_numbers?: number[];
    lucky_color?: string;
  };
  generated_at: string;
}

export interface TarotCard {
  id: number;
  name: string;
  name_bg: string;
  card_type: 'major_arcana' | 'minor_arcana';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  image_url: string;
  upright_meaning: string;
  reversed_meaning?: string;
}

export interface OracleConversation {
  id: number;
  user_id: string;
  question: string;
  answer: string;
  tokens_used?: number;
  asked_at: string;
}
