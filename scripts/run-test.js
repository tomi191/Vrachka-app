/**
 * Wrapper script to load .env.local before running the test
 */

const { config } = require('dotenv');
const { resolve } = require('path');
const { spawn } = require('child_process');

// Load .env.local
const envPath = resolve(__dirname, '../.env.local');
console.log('📂 Loading environment from:', envPath);
config({ path: envPath });

console.log('✅ Environment loaded');
console.log('');

// Now run the actual test with environment variables inherited
const test = spawn('npx', ['tsx', 'scripts/test-image-generation.ts'], {
  cwd: resolve(__dirname, '..'),
  stdio: 'inherit',
  shell: true,
  env: process.env // Pass all environment variables
});

test.on('close', (code) => {
  process.exit(code);
});
