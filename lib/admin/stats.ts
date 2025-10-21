/**
 * Admin Statistics Helper Functions
 * Централизирани функции за извличане на админ статистики
 */

import { createClient } from "@/lib/supabase/server";
import { subDays, format } from "date-fns";

export interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  activeSubscriptions: number;
  totalReadings: number;
  totalConversations: number;
  totalNotifications: number;
  userGrowth: { date: string; users: number }[];
  revenueData: { month: string; revenue: number }[];
}

/**
 * Fetch comprehensive admin statistics
 */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: premiumUsers },
    { count: activeSubscriptions },
    { count: totalReadings },
    { count: totalConversations },
    { count: totalNotifications },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).neq("plan_type", "free"),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("tarot_readings").select("*", { count: "exact", head: true }),
    supabase.from("oracle_conversations").select("*", { count: "exact", head: true }),
    supabase.from("notifications").select("*", { count: "exact", head: true }),
  ]);

  // Get user growth data (last 30 days)
  const userGrowth = await getUserGrowthData();

  // Get revenue data (last 6 months)
  const revenueData = await getRevenueData();

  return {
    totalUsers: totalUsers || 0,
    premiumUsers: premiumUsers || 0,
    activeSubscriptions: activeSubscriptions || 0,
    totalReadings: totalReadings || 0,
    totalConversations: totalConversations || 0,
    totalNotifications: totalNotifications || 0,
    userGrowth,
    revenueData,
  };
}

/**
 * Get user growth data for last 30 days
 */
async function getUserGrowthData(): Promise<{ date: string; users: number }[]> {
  const supabase = await createClient();

  const thirtyDaysAgo = subDays(new Date(), 30);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  if (!profiles) return [];

  // Group by date
  const groupedByDate = profiles.reduce((acc, profile) => {
    const date = format(new Date(profile.created_at), "yyyy-MM-dd");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and fill missing dates with 0
  const result: { date: string; users: number }[] = [];
  for (let i = 30; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    result.push({
      date,
      users: groupedByDate[date] || 0,
    });
  }

  return result;
}

/**
 * Get revenue data for last 6 months
 */
async function getRevenueData(): Promise<{ month: string; revenue: number }[]> {
  // Placeholder - реални данни трябва да идват от Stripe
  // За демонстрация използваме subscription counts
  const supabase = await createClient();

  const sixMonthsAgo = subDays(new Date(), 180);

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("created_at, plan_type")
    .gte("created_at", sixMonthsAgo.toISOString())
    .neq("plan_type", "free")
    .order("created_at", { ascending: true });

  if (!subscriptions) return [];

  // Group by month
  const groupedByMonth = subscriptions.reduce((acc, sub) => {
    const month = format(new Date(sub.created_at), "MMM yyyy");
    const revenue = sub.plan_type === "ultimate" ? 29.99 : 9.99; // Примерни цени
    acc[month] = (acc[month] || 0) + revenue;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array
  return Object.entries(groupedByMonth).map(([month, revenue]) => ({
    month,
    revenue: Math.round(revenue * 100) / 100,
  }));
}

/**
 * Get daily active users (DAU)
 */
export async function getDailyActiveUsers(): Promise<number> {
  const supabase = await createClient();

  const today = format(new Date(), "yyyy-MM-dd");

  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("last_visit_date", today);

  return count || 0;
}

/**
 * Get monthly active users (MAU)
 */
export async function getMonthlyActiveUsers(): Promise<number> {
  const supabase = await createClient();

  const thirtyDaysAgo = subDays(new Date(), 30);

  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("last_visit_date", format(thirtyDaysAgo, "yyyy-MM-dd"));

  return count || 0;
}
