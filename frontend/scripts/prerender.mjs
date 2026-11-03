// Prerenders every public route to static HTML after `vite build`.
//
// Why this exists: this is a client-side-only React SPA. Without this step,
// every route served the *same* empty `<div id="root"></div>` shell to any
// crawler that doesn't execute JavaScript (GPTBot, ClaudeBot, PerplexityBot,
// CCBot, Applebot, Amazonbot, and inconsistently Bing) — see the Sept 2026
// SEO/AEO/GEO audit, finding #1. Real browsers still hydrate normally; this
// only changes what the *first* HTML response contains.
//
// How it works: boots the actual production Express server (same server.js
// that runs in deployment, so API calls resolve exactly like production),
// then uses a headless browser to visit each route, waits for useSEO's
// effect + data fetches to settle, and writes the final DOM out as
// dist/<route>/index.html. express.static then serves these directly
// (directory-with-index-file resolution), so no server.js route changes are
// needed for GETs to work — see server.js for the real-404 fallback logic.
//
// Run via `npm run build` (postbuild-style chain in package.json). Requires
// `vite build` to have already produced dist/.

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(FRONTEND_DIR, '..');
const DIST_DIR = path.join(FRONTEND_DIR, 'dist');
const BACKEND_DIR = path.join(REPO_ROOT, 'backend');

const SITE_URL = 'https://www.shootatsightweddings.com';
const PORT = process.env.PRERENDER_PORT || 5099;
const BASE_URL = `http://localhost:${PORT}`;

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/portfolio', changefreq: 'weekly', priority: '0.9' },
  { path: '/portfolio/wedding', changefreq: 'weekly', priority: '0.8' },
  { path: '/portfolio/pre-wedding', changefreq: 'weekly', priority: '0.8' },
  { path: '/films', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/blog', changefreq: 'weekly', priority: '0.6' },
];

// Deliberately excluded from prerendering, the sitemap, and robots.txt:
// /admin, /admin/login, /admin/dashboard, /blog/admin-login (noindex, and
// disallowed in public/robots.txt).

function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) return resolve();
      } catch {
        // server not up yet
      }
      if (Date.now() - start > timeoutMs) return reject(new Error(`Timed out waiting for ${url}`));
      setTimeout(attempt, 300);
    };
    attempt();
  });
}

async function getShootSlugs() {
  try {
    const res = await fetch(`${BASE_URL}/api/shoots`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data.map((s) => ({ slug: s.slug, updatedAt: s.updatedAt }));
    }
  } catch (err) {
    console.warn('[prerender] Could not fetch /api/shoots, falling back to shoots-db.json:', err.message);
  }
  try {
    const local = JSON.parse(readFileSync(path.join(BACKEND_DIR, 'shoots-db.json'), 'utf8'));
    return local.map((s) => ({ slug: s.slug, updatedAt: s.updatedAt }));
  } catch {
    return [];
  }
}

const LOCAL_BLOG_SLUGS = [
  'finding-the-light-in-candid-moments',
  'how-to-stay-natural-on-camera-5-essential-tips',
  'behind-the-lens-designing-your-pre-wedding-moodboard',
  'misty-mountains-capturing-love-in-ootys-valleys',
];

async function getBlogSlugs() {
  // Always include the 4 hardcoded articles (frontend/src/data/localBlogPosts.js)
  // regardless of CMS state, plus whatever's published in the DB.
  const slugs = LOCAL_BLOG_SLUGS.map((slug) => ({ slug, updatedAt: undefined }));
  try {
    const res = await fetch(`${BASE_URL}/api/blogs?limit=50`);
    const data = await res.json();
    if (data.success && Array.isArray(data.blogs)) {
      data.blogs.forEach((b) => slugs.push({ slug: b.slug, updatedAt: b.updatedAt }));
    }
  } catch (err) {
    console.warn('[prerender] Could not fetch /api/blogs (CMS posts skipped):', err.message);
  }
  return slugs;
}

function routeToDistFile(routePath) {
  if (routePath === '/') return path.join(DIST_DIR, 'index.html');
  const trimmed = routePath.replace(/^\/|\/$/g, '');
  return path.join(DIST_DIR, trimmed, 'index.html');
}

async function prerenderRoute(page, routePath) {
  const url = `${BASE_URL}${routePath}`;
  // networkidle everywhere except the homepage: some pages (e.g. the
  // wedding gallery) classify each shoot by loading its hero image
  // client-side before rendering cards, so snapshotting before those
  // requests finish captures an empty grid. The homepage's looping
  // autoplay hero video is the one page where network never truly goes
  // idle, so it falls back to 'load' plus a longer fixed settle instead.
  const isHomepage = routePath === '/';
  await page.goto(url, {
    waitUntil: isHomepage ? 'load' : 'networkidle',
    timeout: 30000,
  });
  // Extra settle time for GSAP/useEffect-driven content, the useSiteConfig
  // and useSEO fetch/effect calls, and useSEO's head mutations to finish.
  await page.waitForTimeout(isHomepage ? 4000 : 1500);

  const html = await page.content();
  const outFile = routeToDistFile(routePath);
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, html, 'utf8');
  return html;
}

function buildSitemap(entries) {
  const now = new Date().toISOString();
  const urls = entries
    .map(({ path: p, changefreq, priority, lastmod }) => `  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${lastmod || now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    console.error('[prerender] dist/ not found — run `vite build` first.');
    process.exit(1);
  }

  console.log(`[prerender] Starting production server on port ${PORT}...`);
  const server = spawn(process.execPath, ['server.js'], {
    cwd: BACKEND_DIR,
    env: { ...process.env, NODE_ENV: 'production', PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', (d) => process.stdout.write(`[server] ${d}`));
  server.stderr.on('data', (d) => process.stderr.write(`[server] ${d}`));

  let browser;
  try {
    await waitForServer(`${BASE_URL}/api/health`);
    console.log('[prerender] Server is up.');

    const shoots = await getShootSlugs();
    console.log(`[prerender] Found ${shoots.length} shoot(s) to prerender.`);
    const blogPosts = await getBlogSlugs();
    console.log(`[prerender] Found ${blogPosts.length} blog post(s) to prerender.`);

    const dynamicRoutes = [
      ...shoots.map((s) => ({
        path: `/shoot/${s.slug}`,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: s.updatedAt,
      })),
      ...blogPosts.map((b) => ({
        path: `/blog/${b.slug}`,
        changefreq: 'monthly',
        priority: '0.5',
        lastmod: b.updatedAt,
      })),
    ];

    const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];

    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    for (const route of allRoutes) {
      process.stdout.write(`[prerender] ${route.path} ... `);
      try {
        const html = await prerenderRoute(page, route.path);
        const hasH1 = /<h1[\s>]/i.test(html);
        console.log(`ok (${(html.length / 1024).toFixed(0)} KiB, h1: ${hasH1 ? 'yes' : 'NO'})`);
      } catch (err) {
        console.log(`FAILED: ${err.message}`);
      }
    }

    const sitemapXml = buildSitemap(allRoutes);
    writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
    console.log(`[prerender] Wrote sitemap.xml with ${allRoutes.length} URLs.`);

    const manifest = allRoutes.map((r) => r.path);
    writeFileSync(path.join(DIST_DIR, 'route-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  } finally {
    if (browser) await browser.close();
    server.kill();
  }

  console.log('[prerender] Done.');
}

main().catch((err) => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
