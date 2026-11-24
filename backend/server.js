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
const contentPages = require('./src/services/contentPageService');
const { shootPath } = require('./src/utils/shootPath');

connectDB();

const app = express();

// HSTS, nosniff, frameguard, etc. enabled at their safe defaults. CSP is
// report-only for now — YouTube embeds and Google Tag Manager/Ads make an
// enforced policy risky to get right blind; report-only surfaces violations
// without breaking autoplay embeds or conversion tracking. Tighten to
// enforced once a few days of reports come back clean.
app.use(helmet({
  // Off: require-corp (helmet's default) can silently block cross-origin
  // YouTube iframes unless that origin sends matching CORP headers, which we
  // can't control or verify from here.
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    reportOnly: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'https://www.clarity.ms'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://img.youtube.com', 'https://www.googletagmanager.com', 'https://www.google.com'],
      mediaSrc: ["'self'"],
      fontSrc: ["'self'", 'data:'],
      frameSrc: ['https://www.youtube.com', 'https://www.youtube-nocookie.com'],
      connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://www.googletagmanager.com', 'https://www.clarity.ms', 'https://*.clarity.ms'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
}));

// Preserve every path and query when requests reach this app on the apex host.
// A CDN/legacy origin must apply the same rule before it returns its own 404.
app.use((req,res,next) => {
  if (req.hostname === 'shootatsightweddings.com') {
    return res.redirect(301, 'https://www.shootatsightweddings.com' + req.originalUrl);
  }
  next();
});

app.use(cors());
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});
app.use(express.json());

// Images uploaded through the admin panel (backend/uploads).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Site photos and videos stored on this server (backend/media), served at
// their folder paths (e.g. /common/team.webp).
app.use(express.static(path.join(__dirname, 'media')));

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
    '/blog', '/contact', '/faq', '/services', '/locations',
    // SEO landing pages (frontend/src/data/landingPageRoutes.json).
    ...require('../frontend/src/data/landingPageRoutes.json').routes,
  ]);
  const ADMIN_ROUTES = new Set([
    '/admin', '/admin/login', '/admin/dashboard', '/blog/admin-login',
  ]);
  const LOCAL_SHOOTS_PATH = path.join(__dirname, 'shoots-db.json');

  // Returns { slug, category } for a published shoot, or null.
  const findShoot = async (slug) => {
    try {
      const found = await Promise.race([
        Shoot.findOne({ slug }, { slug: 1, category: 1 }).lean(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
      ]);
      if (found) return found;
    } catch {
      // fall through to local fallback below
    }
    try {
      const local = JSON.parse(fs.readFileSync(LOCAL_SHOOTS_PATH, 'utf8'));
      return local.find((s) => s.slug === slug) || null;
    } catch {
      return null;
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
      // is missing (e.g. a fresh admin login, or a prerender failure). Use the
      // clean shell saved by prerender.mjs: dist/index.html is the homepage
      // snapshot, which would flash homepage content and start its hero video.
      if (err) {
        const shell = path.join(DIST_DIR, 'shell.html');
        res.sendFile(fs.existsSync(shell) ? shell : path.join(DIST_DIR, 'index.html'));
      }
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

    const pageMatch = reqPath.match(/^\/(services|locations)\/([a-z0-9-]+)$/);
    if (pageMatch) {
      try {
        const page = await contentPages.getPage(pageMatch[1] === 'services' ? 'service' : 'location',pageMatch[2]);
        if (page) return sendRoute(res,reqPath);
      } catch {
        return res.status(503).send('This page is temporarily unavailable.');
      }
    }

    // Couple pages: /portfolio/<section>/<slug> (section from the category,
    // see src/utils/shootPath.js). The old /shoot/<slug> address, and a
    // section that no longer matches the category, 301-redirect there so
    // shared links and search rankings carry over.
    const oldShoot = reqPath.match(/^\/shoot\/([a-z0-9-]+)$/i);
    const newShoot = reqPath.match(/^\/portfolio\/([a-z0-9-]+)\/([a-z0-9-]+)$/i);
    const shootSlug = oldShoot?.[1] || newShoot?.[2];
    if (shootSlug) {
      const shoot = await findShoot(shootSlug);
      if (shoot) {
        const canonical = shootPath(shoot);
        if (reqPath !== canonical) {
          const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
          return res.redirect(301, canonical + query);
        }
        return sendRoute(res, reqPath);
      }
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
  // Resume video conversions left over from a restart or deploy. The build's
  // prerender server sets DISABLE_VIDEO_JOBS so only the live server converts.
  if (!process.env.DISABLE_VIDEO_JOBS) {
    require('./src/services/videoProcessing').resumePending();
    require('./src/services/chunkedUploads').cleanupStale();
  }
});
