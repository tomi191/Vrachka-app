import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kpdumthwuahkuaggilpz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZHVtdGh3dWFoa3VhZ2dpbHB6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM2MTY3NywiZXhwIjoyMDc1OTM3Njc3fQ.AW3rYwgNTE6yE_6YkAFSTi7DKquNTjaD4jpGb7aiomU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Checking profiles in Supabase...\n');

// Get profiles
const { data: profiles, error: profileError } = await supabase
  .from('profiles')
  .select('id, full_name, birth_date, zodiac_sign, onboarding_completed, is_admin, created_at')
  .order('created_at', { ascending: false });

if (profileError) {
  console.error('❌ Error:', profileError);
  process.exit(1);
}

console.log(`Found ${profiles.length} profile(s):\n`);

profiles.forEach((p, i) => {
  console.log(`--- Profile ${i + 1} ---`);
  console.log(`ID: ${p.id}`);
  console.log(`Name: ${p.full_name || 'N/A'}`);
  console.log(`Birth Date: ${p.birth_date || 'N/A'}`);
  console.log(`Zodiac: ${p.zodiac_sign || 'N/A'}`);
  console.log(`Onboarding: ${p.onboarding_completed ? '✅ COMPLETED' : '❌ NOT COMPLETED'}`);
  console.log(`Is Admin: ${p.is_admin ? 'YES' : 'NO'}`);
  console.log(`Created: ${p.created_at}`);
  console.log('');
});

// Get auth users
const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

if (authError) {
  console.error('❌ Auth error:', authError);
} else {
  console.log(`\n📧 Found ${authData.users.length} auth user(s):\n`);

  authData.users.forEach((user, i) => {
    const profile = profiles.find(p => p.id === user.id);
    console.log(`--- Auth User ${i + 1} ---`);
    console.log(`Email: ${user.email}`);
    console.log(`Has Profile: ${profile ? 'YES' : '❌ NO (MISSING!)'}`);
    if (profile) {
      console.log(`Onboarding: ${profile.onboarding_completed ? '✅ COMPLETED' : '❌ NOT COMPLETED'}`);
    }
    console.log('');
  });
}
