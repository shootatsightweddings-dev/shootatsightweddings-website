// Couple pages live under the portfolio section they belong to:
//   /portfolio/wedding/ramya-lathendra
//   /portfolio/pre-wedding/<slug>
// Other categories (e.g. "Portrait") get their own section name. Old
// /shoot/<slug> links are 301-redirected here by the server (backend/server.js
// uses the same rule in backend/src/utils/shootPath.js; a test keeps them equal).

export const PORTFOLIO_SECTIONS = ['wedding', 'pre-wedding'];

export function shootSection(category = '') {
  const c = String(category).toLowerCase().trim();
  if (/pre[\s-]?wedding/.test(c)) return 'pre-wedding';
  if (c.includes('wedding')) return 'wedding';
  return c.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'wedding';
}

export function shootPath(shoot) {
  return `/portfolio/${shootSection(shoot?.category ?? shoot?.cat)}/${shoot?.slug ?? shoot?.id}`;
}
