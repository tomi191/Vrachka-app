"use server";

/**
 * Server Actions for Streak Tracking
 */

import { createClient } from "@/lib/supabase/server";
import { updateDailyStreak } from "@/lib/streak";

/**
 * Updates the user's daily streak
 * Called automatically when user visits the app
 */
export async function trackDailyVisit(): Promise<{ success: boolean; streak?: number }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false };
    }

    // Update streak
    const streak = await updateDailyStreak(user.id);

    if (streak === null) {
      return { success: false };
    }

    return { success: true, streak };
  } catch (error) {
    console.error("[Streak Action] Error:", error);
    return { success: false };
  }
}
