const { test } = require('node:test');
const assert = require('node:assert/strict');
const server = require('../src/utils/shootPath');

const CASES = [
  [{ slug: 'ramya-lathendra', category: 'Wedding' }, '/portfolio/wedding/ramya-lathendra'],
  [{ slug: 'ujwal-vibha', category: 'Pre-wedding' }, '/portfolio/pre-wedding/ujwal-vibha'],
  [{ slug: 'x', category: 'Pre Wedding' }, '/portfolio/pre-wedding/x'],
  [{ slug: 'x', category: 'PRE-WEDDING SHOOT' }, '/portfolio/pre-wedding/x'],
  [{ slug: 'ragini', category: 'Portrait' }, '/portfolio/portrait/ragini'],
  [{ slug: 'y', category: 'Destination Wedding' }, '/portfolio/wedding/y'],
  [{ slug: 'z', category: '' }, '/portfolio/wedding/z'],
];

test('couple page addresses follow the portfolio section', () => {
  for (const [shoot, expected] of CASES) assert.equal(server.shootPath(shoot), expected);
});

test('the website and the server build the same addresses', async () => {
  const site = await import('../../frontend/src/utils/shootPath.js');
  for (const [shoot] of CASES) assert.equal(site.shootPath(shoot), server.shootPath(shoot));
  for (const s of require('../shoots-db.json')) assert.equal(site.shootPath(s), server.shootPath(s));
});
