require('dotenv').config();

// Strip surrounding quotes from environment variables (pasted from .env in Railway/Render)
for (const key in process.env) {
  if (typeof process.env[key] === 'string') {
    process.env[key] = process.env[key].trim().replace(/^["']|["']$/g, '');
  }
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const connectDB = require('./src/config/db');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');
const Shoot = require('./src/models/Shoot');
const Blog = require('./src/models/Blog');

connectDB();

const app = express();

// HSTS, nosniff, frameguard, etc. enabled at their safe defaults. CSP is
// report-only for now — YouTube embeds, Google Tag Manager/Ads, and the R2
// media host make an enforced policy risky to get right blind; report-only
// surfaces violations without breaking autoplay embeds or conversion
// tracking. Tighten to enforced once a few days of reports come back clean.
app.use(helmet({
  // Off: require-corp (helmet's default) can silently block cross-origin
  // YouTube iframes and R2-hosted media unless those origins send matching
  // CORP headers, which we can't control or verify from here.
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    reportOnly: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'https://www.clarity.ms'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev', 'https://img.youtube.com', 'https://www.googletagmanager.com', 'https://www.google.com'],
      mediaSrc: ["'self'", 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev'],
      fontSrc: ["'self'", 'data:'],
      frameSrc: ['https://www.youtube.com', 'https://www.youtube-nocookie.com'],
      connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://www.googletagmanager.com', 'https://www.clarity.ms', 'https://*.clarity.ms'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
}));

app.use(cors());
app.use(express.json());

// Serve uploads folder statically for local fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

// Serve compiled React frontend statically in production
if (process.env.NODE_ENV === 'production') {
  const DIST_DIR = path.join(__dirname, '../frontend/dist');

  // Every real client-side route. Static entries are prerendered to their
  // own dist/<route>/index.html by scripts/prerender.mjs at build time;
  // express.static below serves those directly. Admin routes are excluded
  // from prerendering/sitemap/robots but must still resolve to the SPA
  // shell so the client-side app can render them (see useSEO noindex).
  const STATIC_ROUTES = new Set([
    '/', '/films', '/about', '/portfolio', '/portfolio/wedding', '/portfolio/pre-wedding',
    '/blog', '/contact', '/faq',
  ]);
  const ADMIN_ROUTES = new Set([
    '/admin', '/admin/login', '/admin/dashboard', '/blog/admin-login',
  ]);
  const LOCAL_SHOOTS_PATH = path.join(__dirname, 'shoots-db.json');

  const shootSlugExists = async (slug) => {
    try {
      const found = await Promise.race([
        Shoot.exists({ slug }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
      ]);
      if (found) return true;
    } catch {
      // fall through to local fallback below
    }
    try {
      const local = JSON.parse(fs.readFileSync(LOCAL_SHOOTS_PATH, 'utf8'));
      return local.some((s) => s.slug === slug);
    } catch {
      return false;
    }
  };

  // The four articles hardcoded in frontend/src/data/localBlogPosts.js —
  // always valid regardless of CMS/DB state, same list duplicated there.
  const LOCAL_BLOG_SLUGS = new Set([
    'finding-the-light-in-candid-moments',
    'how-to-stay-natural-on-camera-5-essential-tips',
    'behind-the-lens-designing-your-pre-wedding-moodboard',
    'misty-mountains-capturing-love-in-ootys-valleys',
  ]);

  const blogSlugExists = async (slug) => {
    if (LOCAL_BLOG_SLUGS.has(slug)) return true;
    try {
      const found = await Promise.race([
        Blog.exists({ slug, isPublished: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
      ]);
      return !!found;
    } catch {
      // DB unreachable and no local mirror for CMS posts to fall back to —
      // fail closed (404) rather than 200 every /blog/* path, which is
      // exactly the soft-404 pattern the audit flagged as critical. A real
      // CMS post 404ing during a rare DB outage is an acceptable tradeoff
      // for never training crawlers that unknown URLs return 200.
      return false;
    }
  };

  // Long-lived immutable cache for Vite's hashed /assets/* bundle files;
  // short/no cache for HTML so deploys (and re-prerendered content) show up
  // immediately instead of being served stale from a browser/CDN cache.
  app.use(express.static(DIST_DIR, {
    // Prerendered routes live at dist/<route>/index.html; without this,
    // serve-static 301-redirects e.g. /about -> /about/ (directory
    // resolution), adding a redirect hop this site otherwise doesn't have.
    redirect: false,
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    },
  }));

  // Mirrors scripts/prerender.mjs's routeToDistFile(): each route's own
  // prerendered file, not the generic shell — with redirect:false above,
  // express.static no longer resolves directory/index.html automatically,
  // so this route explicitly serves the *matching* prerendered page.
  const resolveRouteFile = (routePath) => (
    routePath === '/'
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, routePath.replace(/^\//, ''), 'index.html')
  );

  const sendRoute = (res, routePath) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(resolveRouteFile(routePath), (err) => {
      // Falls back to the generic shell only if that route's own prerender
      // is missing (e.g. a fresh admin login, or a prerender failure).
      if (err) res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
  };

  // Anything not served as a static/prerendered file above: serve the
  // matching SPA page for known routes, and a real 404 for everything
  // else — no more soft-404s where unknown URLs return HTTP 200.
  app.get('/*splat', async (req, res) => {
    const reqPath = (req.path.replace(/\/+$/, '') || '/');

    if (STATIC_ROUTES.has(reqPath) || ADMIN_ROUTES.has(reqPath)) {
      return sendRoute(res, reqPath);
    }

    const shootMatch = reqPath.match(/^\/shoot\/([a-z0-9-]+)$/i);
    if (shootMatch && (await shootSlugExists(shootMatch[1]))) {
      return sendRoute(res, reqPath);
    }

    const blogMatch = reqPath.match(/^\/blog\/([a-z0-9-]+)$/i);
    if (blogMatch && (await blogSlugExists(blogMatch[1]))) {
      return sendRoute(res, reqPath);
    }

    res.status(404).sendFile(path.join(DIST_DIR, '404.html'), (err) => {
      if (err) res.status(404).send('Not Found');
    });
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
