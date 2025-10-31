const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestSubscriber() {
  console.log('Creating test subscriber...');

  // First, check if subscriber already exists
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('email', 'caspere63@gmail.com')
    .single();

  if (existing) {
    console.log('Subscriber already exists, updating...');
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({
        zodiac_sign: 'leo',
        frequency: 'daily',
        status: 'confirmed',
        name: 'Test User'
      })
      .eq('email', 'caspere63@gmail.com')
      .select();

    if (error) {
      console.error('Error updating subscriber:', error);
      return;
    }

    console.log('✅ Subscriber updated:', data);
  } else {
    console.log('Creating new subscriber...');
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: 'caspere63@gmail.com',
        name: 'Test User',
        zodiac_sign: 'leo',
        frequency: 'daily',
        status: 'confirmed',
        subscribed_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error creating subscriber:', error);
      return;
    }

    console.log('✅ Subscriber created:', data);
  }
}

createTestSubscriber();
