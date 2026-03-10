const sharp = require('sharp');
const path = require('path');

const OUTPUT = path.join(__dirname, '..', 'public', 'assets', 'logo', 'og-image.png');
const LOGO = path.join(__dirname, '..', 'public', 'assets', 'logo', '11.png');

async function generate() {
  // Create gradient background 1200x630
  const width = 1200;
  const height = 630;

  // SVG gradient background with ministry name
  const svgBg = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#094239" />
          <stop offset="100%" style="stop-color:#0a6e5c" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)" />
      <text x="${width / 2}" y="${height - 100}" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="42" fill="white" opacity="0.95">
        وزارة الاقتصاد والصناعة
      </text>
      <text x="${width / 2}" y="${height - 50}" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.7">
        الجمهورية العربية السورية
      </text>
    </svg>`;

  // Resize logo to fit nicely (300x300 centered)
  const logoResized = await sharp(LOGO)
    .resize(280, 280, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Compose: gradient bg + centered logo + text
  await sharp(Buffer.from(svgBg))
    .png()
    .composite([
      {
        input: logoResized,
        top: Math.round((height - 280) / 2) - 60,
        left: Math.round((width - 280) / 2),
      },
    ])
    .toFile(OUTPUT);

  console.log('OG image generated:', OUTPUT);
}

generate().catch(console.error);
