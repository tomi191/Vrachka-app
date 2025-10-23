import { createClient } from '@/lib/supabase/server'

export type SubscriptionTier = 'free' | 'basic' | 'ultimate'

interface TrialStatus {
  isActive: boolean
  tier: SubscriptionTier | null
  endsAt: Date | null
  daysRemaining: number | null
}

/**
 * Дава 3-дневен Ultimate trial на нов потребител
 */
export async function grantTrial(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    // Проверка дали потребителят вече има trial
    const { data: profile } = await supabase
      .from('profiles')
      .select('trial_tier, trial_end')
      .eq('id', userId)
      .single()

    // Ако вече има trial или е имал такъв, не даваме нов
    if (profile?.trial_tier || profile?.trial_end) {
      return false
    }

    // Изчисляване на trial_end (3 дни от сега)
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 3)

    // Обновяване на профила с trial данни
    const { error } = await supabase
      .from('profiles')
      .update({
        trial_tier: 'ultimate',
        trial_end: trialEnd.toISOString(),
      })
      .eq('id', userId)

    if (error) {
      console.error('[Trial] Error granting trial:', error)
      return false
    }

    console.log(`[Trial] Granted 3-day Ultimate trial to user ${userId}, expires at ${trialEnd.toISOString()}`)
    return true
  } catch (error) {
    console.error('[Trial] Unexpected error in grantTrial:', error)
    return false
  }
}

/**
 * Проверява статуса на trial за даден потребител
 */
export async function checkTrialStatus(userId: string): Promise<TrialStatus> {
  try {
    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('trial_tier, trial_end')
      .eq('id', userId)
      .single()

    if (!profile?.trial_tier || !profile?.trial_end) {
      return {
        isActive: false,
        tier: null,
        endsAt: null,
        daysRemaining: null,
      }
    }

    const now = new Date()
    const endsAt = new Date(profile.trial_end)
    const isActive = now < endsAt

    if (!isActive) {
      // Trial е изтекъл, изчистваме данните
      await expireTrial(userId)
      return {
        isActive: false,
        tier: null,
        endsAt: null,
        daysRemaining: null,
      }
    }

    // Изчисляване на оставащи дни
    const diffTime = endsAt.getTime() - now.getTime()
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return {
      isActive: true,
      tier: profile.trial_tier as SubscriptionTier,
      endsAt,
      daysRemaining,
    }
  } catch (error) {
    console.error('[Trial] Error checking trial status:', error)
    return {
      isActive: false,
      tier: null,
      endsAt: null,
      daysRemaining: null,
    }
  }
}

/**
 * Изтрива trial данните след изтичане
 */
export async function expireTrial(userId: string): Promise<void> {
  try {
    const supabase = await createClient()

    await supabase
      .from('profiles')
      .update({
        trial_tier: null,
        trial_end: null,
      })
      .eq('id', userId)

    console.log(`[Trial] Expired trial for user ${userId}`)
  } catch (error) {
    console.error('[Trial] Error expiring trial:', error)
  }
}

/**
 * Връща ефективния subscription tier за потребител
 * (приоритет: trial > платен subscription > free)
 */
export async function getEffectiveSubscriptionTier(userId: string): Promise<SubscriptionTier> {
  try {
    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('trial_tier, trial_end, subscription_tier, subscription_status')
      .eq('id', userId)
      .single()

    if (!profile) {
      return 'free'
    }

    // 1. Проверка за активен trial
    if (profile.trial_tier && profile.trial_end) {
      const now = new Date()
      const endsAt = new Date(profile.trial_end)
      if (now < endsAt) {
        return profile.trial_tier as SubscriptionTier
      } else {
        // Trial е изтекъл, изчистваме го
        await expireTrial(userId)
      }
    }

    // 2. Проверка за активен платен subscription
    if (
      profile.subscription_tier &&
      profile.subscription_status === 'active'
    ) {
      return profile.subscription_tier as SubscriptionTier
    }

    // 3. Default: free tier
    return 'free'
  } catch (error) {
    console.error('[Trial] Error getting effective tier:', error)
    return 'free'
  }
}

/**
 * Проста проверка дали trial е активен
 */
export async function isTrialActive(userId: string): Promise<boolean> {
  const status = await checkTrialStatus(userId)
  return status.isActive
}

/**
 * Проверява дали потребителят е използвал trial-а си преди
 */
export async function hasUsedTrial(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('trial_end')
      .eq('id', userId)
      .single()

    // Ако има trial_end (дори изтекъл), значи е използвал trial
    return !!profile?.trial_end
  } catch (error) {
    console.error('[Trial] Error checking if trial was used:', error)
    return false
  }
}

/**
 * Проверка на permissions за features според tier
 */
export function getFeatureAccess(tier: SubscriptionTier) {
  return {
    dailyHoroscope: tier !== 'free', // free също има достъп до базов дневен хороскоп
    tarotReading: tier === 'basic' || tier === 'ultimate',
    tarotReadingsPerDay: tier === 'ultimate' ? Infinity : tier === 'basic' ? 3 : 0,
    oracleQuestions: tier === 'ultimate' || tier === 'basic',
    oracleQuestionsPerDay: tier === 'ultimate' ? 10 : tier === 'basic' ? 3 : 0,
    weeklyForecast: tier === 'basic' || tier === 'ultimate',
    monthlyForecast: tier === 'ultimate',
    numerology: tier === 'ultimate',
    natalChart: tier === 'ultimate',
    compatibility: tier === 'ultimate',
    lunarCalendar: tier === 'ultimate',
    prioritySupport: tier === 'ultimate',
  }
}
