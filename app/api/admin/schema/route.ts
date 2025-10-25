import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  try {
    // Verify authenticated user and admin role
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Call RPC with service role to fetch schema overview
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.rpc('get_schema_overview');

    if (error) {
      console.error('[Schema API] RPC error:', error);
      return NextResponse.json({ error: 'Failed to fetch schema' }, { status: 500 });
    }

    return NextResponse.json({ schema: data }, { status: 200 });
  } catch (err) {
    console.error('[Schema API] Fatal error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

