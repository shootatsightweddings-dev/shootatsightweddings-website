// Server copy of frontend/src/utils/shootPath.js (the frontend is ESM, the
// server CommonJS). backend/tests/shoot-path.test.js checks the two agree.

function shootSection(category = '') {
  const c = String(category).toLowerCase().trim();
  if (/pre[\s-]?wedding/.test(c)) return 'pre-wedding';
  if (c.includes('wedding')) return 'wedding';
  return c.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'wedding';
}

const shootPath = (shoot) => `/portfolio/${shootSection(shoot?.category)}/${shoot?.slug}`;

module.exports = { shootSection, shootPath };
