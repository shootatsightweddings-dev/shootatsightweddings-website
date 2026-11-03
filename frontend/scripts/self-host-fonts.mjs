// One-off maintenance script (not part of the build) that regenerates
// public/fonts/ and src/fonts.css from Google Fonts. Re-run manually
// whenever a font family/weight/style is added or removed from the design.
//
// Downloads only the latin-subset (U+0000-00FF) woff2 for each variant —
// this site's content is English-only, so the other ~130 unicode-range
// subsets Google serves (cyrillic, vietnamese, greek, etc.) would be dead
// weight. Update FONT_QUERY below and re-run if that ever changes.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(__dirname, '..');
const FONTS_DIR = path.join(FRONTEND_DIR, 'public', 'fonts');
mkdirSync(FONTS_DIR, { recursive: true });

const FONT_QUERY = [
  'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700',
  'family=Inter:wght@300;400;500;600;700',
  'family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700',
  'family=Poppins:wght@300;400;500;600;700',
  'family=Great+Vibes',
  'family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500',
  'display=swap',
].join('&');

// A browser UA is required — Google Fonts serves woff (not woff2) to
// non-browser user agents like curl's default.
const res = await fetch(`https://fonts.googleapis.com/css2?${FONT_QUERY}`, {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
});
const raw = await res.text();

const blocks = raw.split('@font-face').slice(1).map((b) => '@font-face' + b.split('}')[0] + '}');
const latinBlocks = blocks.filter((b) => /U\+0000-00FF/.test(b));
console.log(`Found ${latinBlocks.length} latin-subset font-face blocks.`);

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const results = [];

for (const block of latinBlocks) {
  const family = block.match(/font-family:\s*'([^']+)'/)?.[1];
  const style = block.match(/font-style:\s*(\w+)/)?.[1];
  const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
  const url = block.match(/url\(([^)]+)\)/)?.[1];
  if (!family || !url) continue;

  const filename = `${slugify(family)}-${weight}-${style}.woff2`;
  const fileRes = await fetch(url);
  const buf = Buffer.from(await fileRes.arrayBuffer());
  writeFileSync(path.join(FONTS_DIR, filename), buf);
  console.log(`Downloaded ${filename} (${(buf.length / 1024).toFixed(1)} KiB)`);

  results.push({ family, style, weight, filename });
}

const css = results
  .map(({ family, style, weight, filename }) => `@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('/fonts/${filename}') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`)
  .join('\n\n');

writeFileSync(path.join(FRONTEND_DIR, 'src', 'fonts.css'), css + '\n', 'utf8');
console.log(`Wrote src/fonts.css with ${results.length} @font-face rules.`);
