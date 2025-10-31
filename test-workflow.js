require('dotenv').config({ path: '.env.local' });

async function testWorkflow() {
  const CRON_SECRET = process.env.CRON_SECRET;

  if (!CRON_SECRET) {
    console.error('❌ CRON_SECRET not found in .env.local');
    return;
  }

  console.log('🚀 Starting Daily Horoscope Workflow test...');
  console.log('This will:');
  console.log('  1. Generate horoscopes for all 12 zodiac signs');
  console.log('  2. Send email to caspere63@gmail.com (Leo horoscope)');
  console.log('');

  // Use local dev server
  const url = 'http://localhost:3001/api/cron/daily-horoscope-workflow';

  console.log(`Calling: ${url}`);
  console.log('');

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Body:', JSON.stringify(data, null, 2));
    console.log('');

    if (response.ok) {
      console.log('✅ Workflow completed successfully!');
      console.log('');
      console.log('📊 Summary:');
      console.log(`  - Horoscopes generated: ${data.horoscopes?.generated || 0}`);
      console.log(`  - Horoscopes skipped: ${data.horoscopes?.skipped || 0}`);
      console.log(`  - Emails sent: ${data.emails?.sent || 0}`);
      console.log(`  - Emails failed: ${data.emails?.failed || 0}`);
      console.log('');
      console.log('📧 Check your inbox at caspere63@gmail.com!');
    } else {
      console.error('❌ Workflow failed:', data.error || data.message);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testWorkflow();
