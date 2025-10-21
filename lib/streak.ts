/**
 * Streak Tracking Utilities
 * Handles daily streak calculation and updates
 */

import { createClient } from "@/lib/supabase/server";

/**
 * Check if two dates are the same day (ignoring time)
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
}

/**
 * Check if date1 is exactly one day before date2
 */
function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return isSameDay(date1, yesterday);
}

/**
 * Updates user's daily streak based on last visit date
 *
 * Logic:
 * - If last_visit_date is null (first visit) → streak = 1
 * - If last_visit_date is today → do nothing (already visited today)
 * - If last_visit_date is yesterday → increment streak
 * - If last_visit_date is before yesterday → reset streak to 1
 *
 * @param userId - User ID to update streak for
 * @returns Updated streak value or null if error
 */
export async function updateDailyStreak(userId: string): Promise<number | null> {
  try {
    const supabase = await createClient();

    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("daily_streak, last_visit_date")
      .eq("id", userId)
      .single();

    if (fetchError || !profile) {
      console.error("[Streak] Error fetching profile:", fetchError);
      return null;
    }

    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    let newStreak = profile.daily_streak || 0;
    let shouldUpdate = false;

    // Case 1: First visit (no last_visit_date)
    if (!profile.last_visit_date) {
      newStreak = 1;
      shouldUpdate = true;
    } else {
      const lastVisit = new Date(profile.last_visit_date);

      // Case 2: Already visited today - do nothing
      if (isSameDay(lastVisit, today)) {
        // No update needed
        return profile.daily_streak || 0;
      }

      // Case 3: Last visit was yesterday - increment streak
      if (isYesterday(lastVisit, today)) {
        newStreak = (profile.daily_streak || 0) + 1;
        shouldUpdate = true;
      }

      // Case 4: Last visit was before yesterday - reset streak
      if (!isSameDay(lastVisit, today) && !isYesterday(lastVisit, today)) {
        newStreak = 1;
        shouldUpdate = true;
      }
    }

    // Update if needed
    if (shouldUpdate) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          daily_streak: newStreak,
          last_visit_date: today.toISOString().split('T')[0], // YYYY-MM-DD format
        })
        .eq("id", userId);

      if (updateError) {
        console.error("[Streak] Error updating streak:", updateError);
        return null;
      }

      console.log(`[Streak] Updated for user ${userId}: ${newStreak} days`);
    }

    return newStreak;
  } catch (error) {
    console.error("[Streak] Unexpected error:", error);
    return null;
  }
}
