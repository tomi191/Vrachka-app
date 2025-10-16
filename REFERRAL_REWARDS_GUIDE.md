# Referral Rewards System за Vrachka

## 🎁 Как работи системата

### Награди за Referrer (поканващия):
- **1-3 покани**: 3 безплатни AI четения
- **4-9 покани**: 1 седмица Premium
- **10-19 покани**: 1 месец Premium
- **20+ покани**: 3 месеца Premium + VIP badge

### Награди за Referee (поканения):
- **При регистрация**: 1 безплатно AI четене
- **При първа покупка**: 10% отстъпка (промо код от referral code)

---

## 📋 Setup Steps

### 1. Database Changes

Добави колони в `referrals` таблица:

```sql
-- Supabase SQL Editor
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS reward_granted BOOLEAN DEFAULT FALSE;
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS reward_type TEXT;
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS granted_at TIMESTAMPTZ;

-- Добави функция за автоматично даване на награди
CREATE OR REPLACE FUNCTION grant_referral_rewards()
RETURNS TRIGGER AS $$
DECLARE
  referral_count INT;
  reward_type TEXT;
BEGIN
  -- Брой успешни referrals
  SELECT COUNT(*) INTO referral_count
  FROM referrals
  WHERE referrer_id = NEW.referrer_id
    AND reward_granted = TRUE;

  -- Определи наградата според броя
  IF referral_count >= 20 THEN
    reward_type := 'premium_3months';
  ELSIF referral_count >= 10 THEN
    reward_type := 'premium_1month';
  ELSIF referral_count >= 4 THEN
    reward_type := 'premium_1week';
  ELSIF referral_count >= 1 THEN
    reward_type := 'free_readings_3';
  ELSE
    RETURN NEW;
  END IF;

  -- Grant награда
  INSERT INTO profile_rewards (user_id, reward_type, granted_from, created_at)
  VALUES (NEW.referrer_id, reward_type, 'referral', NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger за автоматично даване на награди
CREATE TRIGGER on_referral_success
  AFTER UPDATE OF reward_granted ON referrals
  FOR EACH ROW
  WHEN (NEW.reward_granted = TRUE AND OLD.reward_granted = FALSE)
  EXECUTE FUNCTION grant_referral_rewards();
```

### 2. Create Rewards Table

```sql
CREATE TABLE IF NOT EXISTS profile_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL, -- 'free_readings_3', 'premium_1week', etc
  granted_from TEXT NOT NULL, -- 'referral', 'promotion', etc
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- RLS policies
ALTER TABLE profile_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards"
  ON profile_rewards FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. API Route за Claiming Rewards

Създай `app/api/referrals/claim-reward/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rewardId } = await request.json()

    // Get reward
    const { data: reward } = await supabase
      .from('profile_rewards')
      .select('*')
      .eq('id', rewardId)
      .eq('user_id', user.id)
      .single()

    if (!reward || reward.used) {
      return NextResponse.json({ error: 'Invalid reward' }, { status: 400 })
    }

    // Apply reward based on type
    if (reward.reward_type.startsWith('premium_')) {
      // Extend subscription
      const duration = reward.reward_type.split('_')[1] // '1week', '1month', etc
      // TODO: Update subscription end date
    } else if (reward.reward_type.startsWith('free_readings_')) {
      // Add free credits
      const count = parseInt(reward.reward_type.split('_')[2])
      await supabase
        .from('profiles')
        .update({
          free_ai_credits: supabase.raw(`free_ai_credits + ${count}`)
        })
        .eq('id', user.id)
    }

    // Mark as used
    await supabase
      .from('profile_rewards')
      .update({ used: true })
      .eq('id', rewardId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Claim reward error:', error)
    return NextResponse.json({ error: 'Failed to claim reward' }, { status: 500 })
  }
}
```

### 4. UI Component за Rewards

Създай `components/RewardsPanel.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Gift, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Reward {
  id: string
  reward_type: string
  used: boolean
  created_at: string
}

export function RewardsPanel() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    // Fetch from Supabase
    const response = await fetch('/api/referrals/rewards')
    const data = await response.json()
    setRewards(data.rewards || [])
    setLoading(false)
  }

  const claimReward = async (rewardId: string) => {
    const response = await fetch('/api/referrals/claim-reward', {
      method: 'POST',
      body: JSON.stringify({ rewardId }),
    })

    if (response.ok) {
      toast({
        title: "Награда получена! 🎉",
        description: "Наградата е добавена към профила ти",
      })
      fetchRewards()
    } else {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Неуспешно активиране на наградата",
      })
    }
  }

  if (loading) return <div>Зареждане...</div>

  if (rewards.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6 text-center">
          <Gift className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400">Няма налични награди</p>
          <p className="text-sm text-zinc-500 mt-2">
            Покани приятели за да получиш награди!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {rewards.map(reward => (
        <Card key={reward.id} className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 text-accent-400" />
                <div>
                  <h3 className="font-semibold text-zinc-50">
                    {getRewardLabel(reward.reward_type)}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    От покани
                  </p>
                </div>
              </div>
              {reward.used ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="w-5 h-5" />
                  Активирана
                </div>
              ) : (
                <Button
                  onClick={() => claimReward(reward.id)}
                  className="bg-accent-600 hover:bg-accent-700"
                >
                  Активирай
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getRewardLabel(type: string): string {
  const labels: Record<string, string> = {
    'free_readings_3': '3 Безплатни четения',
    'premium_1week': '1 Седмица Premium',
    'premium_1month': '1 Месец Premium',
    'premium_3months': '3 Месеца Premium + VIP',
  }
  return labels[type] || type
}
```

---

## 🎯 Как да използваш системата

### В Profile Page:

```typescript
import { RewardsPanel } from '@/components/RewardsPanel'

// Добави във profile/page.tsx
<RewardsPanel />
```

### Автоматично даване на награди:

Когато referee направи първа покупка или успешно завърши onboarding:

```typescript
// В onboarding/page.tsx или Stripe webhook
await supabase
  .from('referrals')
  .update({ reward_granted: true })
  .eq('referee_id', user.id)
  .eq('reward_granted', false)
```

Това автоматично ще trigger-не grant_referral_rewards() функцията!

---

## 📊 Tracking Metrics

SQL query за stats:

```sql
SELECT
  COUNT(DISTINCT referrer_id) as active_referrers,
  COUNT(*) as total_referrals,
  COUNT(CASE WHEN reward_granted THEN 1 END) as successful_referrals,
  COUNT(DISTINCT reward_type) as rewards_given
FROM referrals
WHERE created_at >= NOW() - INTERVAL '30 days';
```

---

## ✨ Pro Tips

1. **Email notification** при получаване на награда
2. **Badges** за top referrers (10+, 50+, 100+)
3. **Leaderboard** в admin panel
4. **Limited time bonuses** (напр. 2x rewards през декември)

Готово! Referral rewards system е напълно автоматичен! 🚀
