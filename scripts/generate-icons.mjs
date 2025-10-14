import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create SVG for the icon
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.15}"/>
  <text
    x="50%"
    y="52%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="${size * 0.6}"
    font-weight="bold"
    fill="white"
  >V</text>
</svg>
`;

async function generateIcons() {
  const publicDir = join(__dirname, '..', 'public');

  // Generate 192x192 icon
  console.log('Generating icon-192.png...');
  await sharp(Buffer.from(createIconSVG(192)))
    .png()
    .toFile(join(publicDir, 'icon-192.png'));

  // Generate 512x512 icon
  console.log('Generating icon-512.png...');
  await sharp(Buffer.from(createIconSVG(512)))
    .png()
    .toFile(join(publicDir, 'icon-512.png'));

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
