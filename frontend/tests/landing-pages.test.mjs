import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { landingPages, LANDING_PAGES_PUBLIC } from '../src/data/landingPages.js';
import { shootPath } from '../src/utils/shootPath.js';

const routeConfig = JSON.parse(readFileSync(new URL('../src/data/landingPageRoutes.json', import.meta.url), 'utf8'));
const routes = routeConfig.routes;
// Couple pages live at /portfolio/<section>/<slug> (see src/utils/shootPath.js).
const shootPaths = JSON.parse(readFileSync(new URL('../../backend/shoots-db.json', import.meta.url), 'utf8')).map(shootPath);
const blog = readFileSync(new URL('../src/data/localBlogPosts.js', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const STATIC = ['/', '/films', '/about', '/portfolio', '/portfolio/wedding', '/portfolio/pre-wedding', '/blog', '/contact', '/faq', '/services', '/locations'];

const allText = page => JSON.stringify([page.intro, page.sections, page.faqs]);
const links = page => [...allText(page).matchAll(/\]\((\/[^)\s]*)\)/g)].map(m => m[1]);

test('route list used by the server and prerender matches the local page data', () => {
  assert.deepEqual([...routes].sort(), landingPages.map(p => p.path).sort());
  assert.equal(new Set(routes).size, routes.length);
  assert.match(app, /landingPages\.map/);
});

test('every internal link points at a real route', () => {
  for (const page of landingPages) {
    for (const href of links(page)) {
      const ok = STATIC.includes(href) || routes.includes(href)
        || shootPaths.includes(href)
        || (href.startsWith('/blog/') && blog.includes(`'${href.slice(6)}'`));
      assert.ok(ok, `${page.path} links to unknown route ${href}`);
    }
  }
});

test('meta titles and descriptions are present, unique and reasonably sized', () => {
  const titles = new Set(), descriptions = new Set();
  for (const page of landingPages) {
    assert.ok(page.metaTitle.length <= 70, `${page.path} title is ${page.metaTitle.length} chars`);
    assert.ok(page.metaDescription.length >= 70 && page.metaDescription.length <= 160, `${page.path} description is ${page.metaDescription.length} chars`);
    assert.ok(!titles.has(page.metaTitle) && !descriptions.has(page.metaDescription), `${page.path} duplicates another page's meta`);
    titles.add(page.metaTitle); descriptions.add(page.metaDescription);
    assert.ok(page.h1 && page.intro.length && page.sections.length && page.faqs.length);
    for (const image of [page.hero, ...(page.gallery || [])].filter(Boolean)) assert.ok(image.alt?.trim(), `${page.path} has an image without alt text`);
  }
});

test('no competitor pricing appears on the pages', () => {
  for (const page of landingPages) {
    const prices = allText(page).match(/₹\s?[\d.,]+\s?(lakh|L|,000)?/gi) || [];
    for (const price of prices) assert.match(price, /₹1\.7 lakh/, `${page.path} mentions an unconfirmed price: ${price}`);
  }
});

test('while unpublished, no other page on the site links to the landing pages', () => {
  assert.equal(LANDING_PAGES_PUBLIC, routeConfig.public === true);
  if (LANDING_PAGES_PUBLIC) return;
  const files = [];
  const walk = dir => { for (const e of readdirSync(dir, { withFileTypes: true })) { const p = new URL(e.name + (e.isDirectory() ? '/' : ''), dir); if (e.isDirectory()) walk(p); else if (/\.(jsx?|json)$/.test(e.name)) files.push(p); } };
  walk(new URL('../src/', import.meta.url));
  const allowed = /(landingPages\.js|landingPageRoutes\.json|LandingPage\.jsx)$/;
  for (const file of files) {
    if (allowed.test(file.pathname)) continue;
    const text = readFileSync(file, 'utf8');
    for (const route of routes) assert.ok(!text.includes(`'${route}'`) && !text.includes(`"${route}"`) && !text.includes(`(${route})`), `${file.pathname} links to hidden page ${route}`);
  }
});
