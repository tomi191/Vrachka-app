import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAvatarFilename } from "@/lib/utils/image";

/**
 * POST /api/profile/avatar
 * Upload user avatar to Supabase Storage
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get file from form data
    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Няма качен файл" },
        { status: 400 }
      );
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Файлът е твърде голям. Максимум 2MB" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Моля, качете JPG, PNG или WebP файл" },
        { status: 400 }
      );
    }

    // Delete old avatar if exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profile?.avatar_url) {
      // Extract filename from URL
      const oldFilename = profile.avatar_url.split("/").pop();
      if (oldFilename) {
        const oldPath = `${user.id}/${oldFilename}`;
        await supabase.storage.from("avatars").remove([oldPath]);
      }
    }

    // Generate unique filename
    const filename = generateAvatarFilename(user.id);

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Грешка при качване на файла" },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filename);

    // Update profile with avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      // Try to clean up uploaded file
      await supabase.storage.from("avatars").remove([filename]);
      return NextResponse.json(
        { error: "Грешка при обновяване на профила" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Нещо се обърка" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/avatar
 * Remove user avatar
 */
export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current avatar URL
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (!profile?.avatar_url) {
      return NextResponse.json(
        { error: "Няма аватар за премахване" },
        { status: 400 }
      );
    }

    // Extract filename from URL
    const filename = profile.avatar_url.split("/").pop();
    if (filename) {
      const path = `${user.id}/${filename}`;
      await supabase.storage.from("avatars").remove([path]);
    }

    // Update profile - remove avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: "Грешка при обновяване на профила" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Avatar delete error:", error);
    return NextResponse.json(
      { error: "Нещо се обърка" },
      { status: 500 }
    );
  }
}
