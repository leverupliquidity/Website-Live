// Renders public/og-default.png (1200 × 630 social share image) from text, so the words
// inside the image can be changed and checked like any other copy.
//   node tools/og-image.mjs [out.png]
// Needs Source Serif 4 SemiBold and IBM Plex Sans (Regular, SemiBold) installed as system
// fonts; the woff2 files ship in node_modules (@fontsource/source-serif-4, @ibm/plex-sans).
// Run `node scripts/guard.mjs --text tools/og-image.txt` after editing the words.
import sharp from 'sharp';


const out = process.argv[2] ?? 'public/og-default.png';
// Words in the image. Keep in sync with tools/og-image.txt (the guard checks that file).
const headline = ['Cannabis business financing', 'for licensed operators.'];
const lede = ['We match licensed operators with funders.'];
const url = 'leverupliquidity.com';
const phone = '(947) 238-6272';

const W = 1200, H = 630, BG = '#0c2b3a';
const logo = await sharp('src/assets/logos/logo-primary-reverse.png').trim().resize({ width: 420 }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="${BG}"/>
  ${headline.map((l, i) => `<text x="80" y="${312 + i * 78}" font-family="Source Serif 4" font-weight="600" font-size="70" fill="#ffffff">${esc(l)}</text>`).join('')}
  ${lede.map((l, i) => `<text x="80" y="${464 + i * 42}" font-family="IBM Plex Sans" font-size="29.5" fill="#a9c3ce">${esc(l)}</text>`).join('')}
  <rect x="80" y="540" width="1040" height="2" fill="#1a4a5e"/>
  <text x="80" y="589" font-family="IBM Plex Sans" font-weight="600" font-size="27" fill="#76cfc5">${esc(url)}</text>
  <text x="1120" y="589" text-anchor="end" font-family="IBM Plex Sans" font-weight="600" font-size="27" fill="#c3dae3">${esc(phone)}</text>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: logo, left: 80, top: 80 + Math.round((46 - logoMeta.height) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile(out);
console.log(`Wrote ${out}`);

