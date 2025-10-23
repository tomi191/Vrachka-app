import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProfiles() {
  console.log('🔍 Checking Supabase profiles table...\n');

  // Get all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, onboarding_completed, is_admin, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching profiles:', error);
    return;
  }

  if (!profiles || profiles.length === 0) {
    console.log('⚠️  No profiles found in database');
    return;
  }

  console.log(`✅ Found ${profiles.length} profile(s):\n`);

  profiles.forEach((profile, index) => {
    console.log(`--- Profile ${index + 1} ---`);
    console.log(`ID: ${profile.id}`);
    console.log(`Name: ${profile.full_name || 'N/A'}`);
    console.log(`Email: ${profile.email || 'N/A'}`);
    console.log(`Onboarding Completed: ${profile.onboarding_completed ? '✅ YES' : '❌ NO'}`);
    console.log(`Is Admin: ${profile.is_admin ? '✅ YES' : '❌ NO'}`);
    console.log(`Created: ${profile.created_at}`);
    console.log('');
  });

  // Check for users without completed onboarding
  const incompleteProfiles = profiles.filter(p => !p.onboarding_completed);
  if (incompleteProfiles.length > 0) {
    console.log(`\n⚠️  ${incompleteProfiles.length} profile(s) have NOT completed onboarding:`);
    incompleteProfiles.forEach(p => {
      console.log(`   - ${p.email || p.full_name || p.id}`);
    });
  }

  // Check auth users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    console.error('\n❌ Error fetching auth users:', authError);
    return;
  }

  console.log(`\n📧 Found ${authData.users.length} auth user(s):`);
  authData.users.forEach((user, index) => {
    console.log(`\n--- Auth User ${index + 1} ---`);
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Email Confirmed: ${user.email_confirmed_at ? '✅ YES' : '❌ NO'}`);
    console.log(`Last Sign In: ${user.last_sign_in_at || 'Never'}`);

    // Check if profile exists for this user
    const hasProfile = profiles.some(p => p.id === user.id);
    console.log(`Has Profile: ${hasProfile ? '✅ YES' : '❌ NO (PROBLEM!)'}`);

    if (hasProfile) {
      const profile = profiles.find(p => p.id === user.id);
      console.log(`Onboarding Status: ${profile?.onboarding_completed ? '✅ Completed' : '❌ Not Completed'}`);
    }
  });
}

checkProfiles().catch(console.error);
