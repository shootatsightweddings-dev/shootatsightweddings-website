const ContentPage = require('../models/ContentPage');
const { validateSeo } = require('./seoFields');

// Initial pages describe existing offerings only. Database entries override these,
// including drafts, so unpublishing a starter page never resurrects its fallback.
const defaults = [
  { kind: 'service', slug: 'wedding-photography', title: 'Wedding Photography', body: 'Wedding photography that follows the people, traditions and details of your celebration. Our approach combines candid moments with considered portraits.\n\nShare your wedding dates, venues and the events you would like photographed. We will discuss the coverage and delivery with you before confirming your booking.' },
  { kind: 'service', slug: 'cinematic-wedding-films', title: 'Cinematic Wedding Films', body: 'Wedding films bring together movement, sound and the moments that connect your celebration. Explore our films to see how we tell each story.\n\nTell us about your events and the kind of film you would like to receive. Contact the studio to discuss coverage, editing and delivery.' },
  { kind: 'service', slug: 'pre-wedding-photography', title: 'Pre-Wedding and Engagement Photography', body: 'A pre-wedding or engagement session is an opportunity to create portraits together before the wedding. We discuss your ideas, preferred setting and comfort in front of the camera.\n\nContact the studio with your dates and location ideas so we can plan the session together.' },
  { kind: 'service', slug: 'drone-aerial-coverage', title: 'Drone and Aerial Coverage', body: 'Aerial photography and film can show a celebration in the context of its venue and surroundings. Discuss aerial coverage with the studio when planning your event.\n\nAvailability depends on the location, venue permissions, weather and applicable flight restrictions. Contact us to discuss what is suitable for your celebration.' },
  { kind: 'location', slug: 'bangalore', title: 'Wedding Photography in Bangalore', areaServed: 'Bengaluru', body: 'Shoot At Sight Weddings is based in Bengaluru. Explore our wedding photographs and films, then tell us about your celebration in Bangalore.\n\nShare your event dates, venues and the coverage you need. We will discuss availability and how we can document your wedding, engagement or pre-wedding session.' },
].map(page => ({ ...page, metaTitle: '', metaDescription: page.body.split('\n')[0], heroImage: '', heroImageAlt: '', faqs: [], isPublished: true }));

async function listPages(includeDrafts = false) {
  if (ContentPage.db.readyState !== 1) {
    const error = new Error('Page content is temporarily unavailable.'); error.statusCode = 503; throw error;
  }
  const stored = await ContentPage.find().maxTimeMS(3000).lean();
  const key = page => `${page.kind}/${page.slug}`;
  const overridden = new Set(stored.map(key));
  const pages = [...stored, ...defaults.filter(page => !overridden.has(key(page)))];
  return includeDrafts ? pages : pages.filter(page => page.isPublished);
}

async function getPage(kind, slug) {
  return (await listPages()).find(page => page.kind === kind && page.slug === slug) || null;
}

async function savePage(data) {
  validateSeo(data);
  const allowed = ['kind', 'slug', 'title', 'metaTitle', 'metaDescription', 'canonicalUrl', 'heroImage', 'heroImageAlt', 'body', 'areaServed', 'faqs', 'isPublished'];
  const update = Object.fromEntries(allowed.filter(key => data[key] !== undefined).map(key => [key, data[key]]));
  if (!['service','location'].includes(update.kind) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(update.slug || '') || !update.title?.trim() || !update.body?.trim()) {
    const error = new Error('A page type, lowercase hyphenated slug, title and body are required.'); error.statusCode = 400; throw error;
  }
  if (update.heroImage && !update.heroImageAlt?.trim()) { const error = new Error('Describe the page hero image.'); error.statusCode = 400; throw error; }
  return ContentPage.findOneAndUpdate({kind:update.kind,slug:update.slug}, {$set:update}, {upsert:true,new:true,runValidators:true});
}

module.exports = { listPages, getPage, savePage };
