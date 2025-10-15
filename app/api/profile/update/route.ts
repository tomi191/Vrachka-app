import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { full_name, birth_date, birth_time, birth_place, zodiac_sign } =
      await req.json();

    // Validate required fields
    if (!full_name || !birth_date || !zodiac_sign) {
      return NextResponse.json(
        { error: "Име, рожденадата и зодия са задължителни" },
        { status: 400 }
      );
    }

    // Update profile
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name,
        birth_date,
        birth_time: birth_time || null,
        birth_place: birth_place || null,
        zodiac_sign,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json(
        { error: "Грешка при запазване на профила" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Нещо се обърка" },
      { status: 500 }
    );
  }
}
