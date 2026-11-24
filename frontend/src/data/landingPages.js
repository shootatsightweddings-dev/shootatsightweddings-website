// SEO landing pages, stored locally so they render (and prerender) without the
// database, admin panel or API. Source of truth for the page list, keywords and
// URLs: the "shoot_at_sight.xlsx" keyword plan ("pages to create" sheet).
//
// URLs must stay in sync with landingPageRoutes.json, which the prerender script
// and the Express server read (tests/landing-pages.test.mjs checks this).
//
// Text supports [label](/path) links. Every fact must already be confirmed by
// the studio (FAQ, About, Contact, real portfolio shoots). Items marked
// "CONFIRM" in docs/seo-handoff.md need the client's sign-off before launch.

import routeConfig from './landingPageRoutes.json' with { type: 'json' };

// While false: shareable links only (noindex, no sitemap, no site links).
export const LANDING_PAGES_PUBLIC = routeConfig.public === true;

// Photos and video are served from this site's own server (backend/media).
const MEDIA = '';

const img = {
  raghuHero: `${MEDIA}/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6702.webp`,
  raghu1: `${MEDIA}/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6707.webp`,
  raghu2: `${MEDIA}/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6712.webp`,
  aishHero: `${MEDIA}/aishwarya%20and%20akshay/KRP_8213.webp`,
  aish1: `${MEDIA}/aishwarya%20and%20akshay/KRP_6193.webp`,
  aish2: `${MEDIA}/aishwarya%20and%20akshay/KRP_7208.webp`,
  aish3: `${MEDIA}/aishwarya%20and%20akshay/KRP_7791.webp`,
  aish4: `${MEDIA}/aishwarya%20and%20akshay/KRP_7896.webp`,
  naveenHero: `${MEDIA}/NAVEEN%20AND%20KATE/SYD08467.webp`,
  naveen1: `${MEDIA}/NAVEEN%20AND%20KATE/SYD07968.webp`,
  naveen2: `${MEDIA}/NAVEEN%20AND%20KATE/SYD07976.webp`,
  ragini1: `${MEDIA}/ragini/_I3A6607.webp`,
  ragini2: `${MEDIA}/ragini/_I3A6392.webp`,
  ragini3: `${MEDIA}/ragini/_I3A6939.webp`,
};

const TEASER = {
  src: `${MEDIA}/Naveen%20%26%20Kate%204K%20Teaser.mp4`,
  poster: img.naveenHero,
  title: 'Naveen & Kate — wedding film teaser, Sydney',
};

// Facts shared across pages (from FAQ.jsx / Contact.jsx).
const PRICE = '₹1.7 lakh';

export const landingPages = [
  // 1 ─────────────────────────────────────────────────────────────────────
  {
    path: '/wedding-photography-bangalore',
    hub: 'locations',
    navLabel: 'Wedding Photography in Bangalore',
    primaryKeyword: 'candid wedding photographer bangalore',
    metaTitle: 'Candid Wedding Photographer in Bangalore | Shoot At Sight Weddings',
    metaDescription: `Candid, editorial wedding photography and films from a Bengaluru studio. Lead photographer and second shooter, delivery in 6–8 weeks. From ${PRICE}.`,
    eyebrow: 'Bengaluru wedding studio',
    h1: 'Candid Wedding Photographer in Bangalore',
    intro: [
      'Shoot At Sight Weddings is a wedding photography and film studio based in Bengaluru. We photograph weddings candidly: we follow the people, rituals and quiet in-between moments as they happen, rather than staging the day.',
      'We still make time for the portraits and family photographs you want to keep. Most of our celebrations take place in and around Bangalore, from intimate home ceremonies to multi-day weddings with several events.',
    ],
    hero: { src: img.aishHero, alt: 'Aishwarya and Akshay holding hands on stage at their wedding reception, with cold sparklers either side' },
    gallery: [
      { src: img.raghu1, alt: 'A laughing guest in a green kurta and jasmine garland at Raghu Dixit and Varijashree’s wedding' },
      { src: img.aish2, alt: 'Haldi ceremony: family members applying turmeric to the groom’s face' },
      { src: img.raghu2, alt: 'Black-and-white candid of an elderly woman in a garland at Raghu Dixit and Varijashree’s wedding' },
      { src: img.aish1, alt: 'Smiling woman in a green silk sari among garden foliage at Aishwarya and Akshay’s wedding' },
      { src: img.raghuHero, alt: 'Black-and-white candid of an elderly man in garlands greeting guests' },
      { src: img.ragini3, alt: 'Smiling portrait in an orange lehenga against a stone wall, from Ragini’s Bangalore session' },
    ],
    sections: [
      {
        heading: 'Recent weddings we photographed in Bangalore',
        paragraphs: ['These are real celebrations from our Bengaluru portfolio. Each one opens the full gallery.'],
        bullets: [
          '[Raghu Dixit & Varijashree](/shoot/raghudixith-varijashree) — a musical celebration of love and art',
          '[Aishwarya & Akshay](/shoot/aishwarya-and-akshay) — an editorial wedding story',
          '[Ragini](/shoot/ragini) — a portrait session in soft, cinematic light',
        ],
      },
      {
        heading: 'What candid wedding photography means to us',
        paragraphs: [
          'Candid photography is about being present without directing every moment. On the day, we read the room — who is about to laugh, who is close to tears, which grandparent is watching from the side — and position ourselves for it.',
          'That approach sits alongside a considered edit: true-to-life skin tones, balanced contrast and warmth, without heavy presets that date quickly. If you want a more fashion-led, styled look, see our [editorial wedding photography](/editorial-wedding-photography-bangalore).',
        ],
      },
      {
        heading: 'What your coverage includes',
        bullets: [
          'A lead photographer and a second shooter on the wedding day, so preparation, ceremony and reception are all covered',
          'Additional photographers for larger events, on request',
          '[Cinematic wedding films](/wedding-films-bangalore), from a 3–5 minute highlight film to a full-length documentary film',
          '[Aerial coverage](/drone-wedding-coverage) where the venue and airspace allow it',
          'A private online gallery with full-resolution downloads you can share with family',
        ],
      },
      {
        heading: 'Pricing',
        paragraphs: [`Wedding photography and film packages start at ${PRICE}. The final quote depends on the number of events, hours of coverage, team size and add-ons. See [wedding photography packages and pricing in Bangalore](/wedding-photography-packages-bangalore) for inclusions and payment terms.`],
      },
      {
        heading: 'When to book',
        paragraphs: ['Bengaluru’s peak wedding season runs from October to February. For those months, book 9–12 months ahead; for other months, around six months is usually enough. Edited photographs are delivered within 6–8 weeks of the wedding.'],
      },
      {
        heading: 'Pre-wedding shoots and weddings outside Bangalore',
        paragraphs: ['Planning a couple shoot first? Read our guide to [pre-wedding shoot locations in Bangalore](/pre-wedding-shoot-locations-bangalore), or consider a [pre-wedding shoot in Ooty](/pre-wedding-shoot-ooty). We also travel for weddings across India and abroad — see [destination wedding photography](/destination-wedding-photographer).'],
      },
    ],
    faqs: [
      { q: 'Are you based in Bangalore?', a: 'Yes. Shoot At Sight Weddings is based in Bengaluru, and most of the weddings we photograph take place in and around the city.' },
      { q: 'How much does a candid wedding photographer cost in Bangalore?', a: `Our wedding photography and film packages start at ${PRICE}. The final quote depends on the number of events, hours of coverage, team size and any films or pre-wedding sessions you add.` },
      { q: 'How many photographers will cover our wedding?', a: 'Our standard packages include a lead photographer and a second shooter. Additional photographers can be arranged for larger events; for intimate weddings, one photographer may be enough.' },
      { q: 'How far in advance should we book?', a: 'For October to February, book 9–12 months ahead. For other months, around six months is usually sufficient.' },
      { q: 'How long until we receive our photographs?', a: 'Edited photographs are delivered within 6–8 weeks of the wedding through a private online gallery.' },
    ],
    schema: { type: 'Service', serviceType: 'Wedding photography', areaServed: 'Bengaluru' },
  },

  // 2 ─────────────────────────────────────────────────────────────────────
  {
    path: '/editorial-wedding-photography-bangalore',
    hub: 'services',
    navLabel: 'Editorial Wedding Photography',
    primaryKeyword: 'editorial wedding photography bangalore',
    metaTitle: 'Editorial Wedding Photography in Bangalore | Shoot At Sight Weddings',
    metaDescription: 'Fashion-led, magazine-style wedding photography from a Bengaluru studio: styled portraits and documentary storytelling with a timeless edit.',
    eyebrow: 'Fashion-led wedding portraiture',
    h1: 'Editorial Wedding Photography in Bangalore',
    intro: [
      'Editorial wedding photography borrows from fashion and magazine work: deliberate composition, strong use of light and architecture, and portraits that feel styled rather than snapped.',
      'It is the approach our studio is built around. We pair it with documentary coverage of the day, so you receive both — high-fashion portraits and the honest, unscripted story of your wedding.',
    ],
    hero: { src: img.aish3, alt: 'Editorial bridal portrait: the bride in an embroidered blouse, looking down in low, warm light' },
    gallery: [
      { src: img.aish4, alt: 'Editorial portrait of the groom in a velvet tuxedo jacket, seated against heavy curtains' },
      { src: img.naveen1, alt: 'Bride in a black and gold lehenga seated in an ornate, lamp-lit room' },
      { src: img.ragini1, alt: 'Portrait in a red sari with a long train on steps beside a carved wooden door' },
      { src: img.naveen2, alt: 'Fashion-style portrait of the bride doubled in a reflection, framed by soft gold blur' },
      { src: img.ragini2, alt: 'Red sari spread across the floor in front of an ornate carved doorway' },
      { src: img.ragini3, alt: 'Playful portrait in an orange lehenga against a textured stone wall' },
    ],
    sections: [
      {
        heading: 'How editorial differs from candid',
        paragraphs: [
          'Candid photography waits for moments; editorial photography also builds them. For portraits we choose the setting, direct posture and movement lightly, and use the light and lines of your venue the way a fashion shoot would.',
          'We do not pose the whole day. Ceremonies and family moments are still documented as they happen — see our [candid wedding photography in Bangalore](/wedding-photography-bangalore). Editorial work is concentrated in planned portrait sessions within your timeline.',
        ],
      },
      {
        heading: 'Editorial stories from our portfolio',
        bullets: [
          '[Aishwarya & Akshay](/shoot/aishwarya-and-akshay) — an editorial wedding narrative captured with timeless sophistication, Bangalore',
          '[Naveen & Kate](/shoot/naveen-kate) — a high-fashion wedding celebration, Sydney',
          '[Ragini](/shoot/ragini) — a portrait story of grace, in soft, cinematic light, Bangalore',
        ],
      },
      {
        heading: 'Planning an editorial wedding shoot',
        bullets: [
          'Share a mood board — magazine spreads, fashion campaigns, colours and textures you like',
          'We plan dedicated portrait windows into your timeline, ideally in good light',
          'Outfit changes, jewellery and styling are considered as part of the frame',
          'A [pre-wedding shoot](/pre-wedding-shoot-locations-bangalore) is a good place to try the editorial look before the wedding',
        ],
      },
      {
        heading: 'The edit',
        paragraphs: ['We apply a refined, timeless edit — true-to-life skin tones, balanced contrast and cinematic warmth — rather than heavy presets or filters that can look dated in a few years. Packages start at ' + PRICE + '; see [packages and pricing](/wedding-photography-packages-bangalore).'],
      },
    ],
    faqs: [
      { q: 'What is editorial wedding photography?', a: 'A fashion- and magazine-influenced approach to wedding photography: considered composition, strong use of light and styled portraits, combined with documentary coverage of the day.' },
      { q: 'Will the whole wedding be posed?', a: 'No. Editorial portraits happen in planned portrait windows. Ceremonies, rituals and family moments are documented naturally as they unfold.' },
      { q: 'Can we share reference images?', a: 'Yes. We encourage a mood board before the wedding, and we always make sure your must-have portraits and family formals are captured.' },
    ],
    schema: { type: 'Service', serviceType: 'Editorial wedding photography', areaServed: 'Bengaluru' },
  },

  // 3 ─────────────────────────────────────────────────────────────────────
  {
    path: '/wedding-films-bangalore',
    hub: 'services',
    navLabel: 'Cinematic Wedding Films',
    primaryKeyword: 'cinematic wedding films bangalore',
    metaTitle: 'Cinematic Wedding Films in Bangalore | Shoot At Sight Weddings',
    metaDescription: 'Cinematic wedding films from a Bengaluru studio: 3–5 minute highlight films and full-length documentary films. Add to photography or book on their own.',
    eyebrow: 'Wedding cinematography',
    h1: 'Cinematic Wedding Films in Bangalore',
    intro: [
      'A wedding film keeps what photographs cannot: voices, music, movement and the way people react to one another. We film with the same documentary eye we bring to photography, then edit for story rather than a checklist of events.',
      'Films can be added to any photography package or booked as a standalone service.',
    ],
    hero: { src: img.raghu1, alt: 'A laughing guest in a green kurta and jasmine garland at Raghu Dixit and Varijashree’s wedding' },
    video: TEASER,
    sections: [
      {
        heading: 'Film options',
        table: {
          head: ['Film', 'Length', 'Delivery'],
          rows: [
            ['Highlight film', '3–5 minutes', '8–12 weeks'],
            ['Full-length documentary film', 'Longer; keeps ceremonies and speeches in fuller detail', 'Up to 16 weeks'],
          ],
        },
        paragraphs: ['Films are shared through a private streaming link.'],
      },
      {
        heading: 'Story first: linear and non-linear films',
        paragraphs: [
          'Not every wedding film should run in order from morning to night. A non-linear film might open on the vows or a speech, then move back and forth through the day to build towards it — the way a feature film is structured.',
          'Other weddings are best told in sequence. We decide the structure with you once we know your events and what matters most to you.',
        ],
      },
      {
        heading: 'Film and photography together',
        paragraphs: ['Booking both from one studio means one team planning around your timeline. Combine your film with [candid wedding photography](/wedding-photography-bangalore), and add [aerial footage](/drone-wedding-coverage) where the venue allows. Packages start at ' + PRICE + ' — see [packages and pricing](/wedding-photography-packages-bangalore).'],
      },
      {
        heading: 'Watch more',
        paragraphs: ['See more of our work on the [films page](/films).'],
      },
    ],
    faqs: [
      { q: 'Can we book a wedding film without photography?', a: 'Yes. Films can be added to any photography package or booked as a standalone service.' },
      { q: 'How long is a wedding highlight film?', a: 'Highlight films usually run 3–5 minutes. Full-length documentary films are longer and keep the ceremonies and speeches in more detail.' },
      { q: 'When will our wedding film be ready?', a: 'Highlight films take 8–12 weeks. Full-length documentary films can take up to 16 weeks because of the depth of editing.' },
    ],
    schema: { type: 'Service', serviceType: 'Wedding videography', areaServed: 'Bengaluru' },
  },

  // 4 ─────────────────────────────────────────────────────────────────────
  {
    path: '/pre-wedding-shoot-locations-bangalore',
    hub: 'locations',
    navLabel: 'Pre-Wedding Shoot Locations in Bangalore',
    primaryKeyword: 'pre wedding shoot locations in bangalore',
    metaTitle: 'Pre-Wedding Shoot Locations in Bangalore | Shoot At Sight Weddings',
    metaDescription: 'Lalbagh, Cubbon Park, Bangalore Palace and Nandi Hills for a pre-wedding shoot: the look of each, the best light, and permission notes.',
    eyebrow: 'Guide',
    h1: 'Pre-Wedding Shoot Locations in Bangalore',
    intro: [
      'Bangalore has more variety for a pre-wedding shoot than most couples expect: century-old gardens, colonial architecture, a palace and, an hour or two north, hills that sit above the clouds at sunrise.',
      'Below are four of the most popular places for a pre-wedding photoshoot in Bangalore, what each looks like on camera, when the light is best, and what to check before you go. Rules, timings and fees change, so we confirm current permissions while planning every shoot.',
    ],
    hero: { src: img.ragini2, alt: 'Portrait in a red sari spread across the floor in front of an ornate carved doorway' },
    sections: [
      {
        heading: '1. Lalbagh Botanical Garden',
        paragraphs: [
          'Lalbagh is one of Bangalore’s best-known gardens, with its Victorian-style Glass House, a lake, mature trees and an ancient rock outcrop that looks out over the city. It suits romantic, classic portraits and gives you several distinct looks in one location.',
        ],
        bullets: [
          'Best light: early morning, soon after the gates open, before the garden fills up',
          'Avoid: weekends and flower-show periods, when it is crowded',
          'Permissions: Lalbagh is run by the Karnataka Horticulture Department; professional photo and video shoots need prior permission and a fee',
        ],
      },
      {
        heading: '2. Cubbon Park',
        paragraphs: [
          'Cubbon Park sits in the middle of the city, close to the Vidhana Soudha. Tree-lined avenues, bamboo groves and the red colonial State Central Library give it a calm, green and slightly vintage feel — easy to reach from almost anywhere in Bangalore.',
        ],
        bullets: [
          'Best light: early morning, when the tree canopy filters soft light across the paths',
          'Good to know: parts of the park are closed to traffic at certain times, which makes it quieter for a shoot',
          'Permissions: also managed by the Horticulture Department; commercial shoots need permission in advance',
        ],
      },
      {
        heading: '3. Bangalore Palace',
        paragraphs: [
          'Built in the late nineteenth century in a Tudor-inspired style, Bangalore Palace has turrets, arches and carved interiors that suit a regal, editorial look — a strong backdrop for traditional outfits.',
        ],
        bullets: [
          'Best light: depends on the area of the palace you shoot; we plan around the opening hours',
          'Permissions: the palace is privately owned; pre-wedding shoots are arranged with its management and are charged separately from regular entry',
          'Pairs well with: an [editorial wedding photography](/editorial-wedding-photography-bangalore) look',
        ],
      },
      {
        heading: '4. Nandi Hills',
        paragraphs: [
          'About 60 km north of the city, Nandi Hills is known for sunrise above a sea of clouds, old stone structures and wide views. It gives the most dramatic, cinematic results of the four — if you are happy to start very early.',
        ],
        bullets: [
          'Best light: sunrise; plan to leave Bangalore well before dawn',
          'Avoid: weekends and holidays, when traffic and visitor numbers are high',
          'Good to know: mist depends on the season and the day — there is no guarantee of clouds below you',
          'Drones: flying is restricted in many areas around Bangalore; see our note on [drone permissions](/drone-wedding-coverage)',
        ],
      },
      {
        heading: 'Choosing between them',
        table: {
          head: ['Location', 'Look', 'Distance from the city', 'Best time'],
          rows: [
            ['Lalbagh', 'Garden, glasshouse, lake', 'Central (south)', 'Early morning, weekdays'],
            ['Cubbon Park', 'Green avenues, colonial buildings', 'Central', 'Early morning'],
            ['Bangalore Palace', 'Regal, architectural', 'Central (north)', 'Within opening hours'],
            ['Nandi Hills', 'Sunrise, clouds, hills', 'About 60 km north', 'Sunrise, weekdays'],
          ],
        },
      },
      {
        heading: 'Planning your pre-wedding shoot',
        paragraphs: [
          'Start with your ideas — the places that matter to you, the mood you want and what you will wear. A mood board helps; read our guide to [designing a pre-wedding moodboard](/blog/behind-the-lens-designing-your-pre-wedding-moodboard). We then suggest a location and time of day that suit the light and the look.',
          'Pre-wedding sessions are available as an add-on to wedding coverage or as a standalone booking. Want somewhere outside the city? See our [pre-wedding shoot in Ooty](/pre-wedding-shoot-ooty). Browse recent sessions in the [pre-wedding portfolio](/portfolio/pre-wedding).',
        ],
      },
    ],
    faqs: [
      { q: 'Do we need permission for a pre-wedding shoot in Lalbagh or Cubbon Park?', a: 'Yes. Both are managed by the Karnataka Horticulture Department, and professional photo or video shoots need prior permission and a fee. We check the current rules while planning.' },
      { q: 'What is the best time of day for a pre-wedding shoot in Bangalore?', a: 'Early morning, for soft light and fewer people. For Nandi Hills, plan for sunrise.' },
      { q: 'Can we book a pre-wedding shoot without wedding coverage?', a: 'Yes. Pre-wedding sessions are available as a standalone booking or as an add-on to wedding coverage.' },
    ],
    schema: { type: 'Article' },
  },

  // 5 ─────────────────────────────────────────────────────────────────────
  {
    path: '/pre-wedding-shoot-ooty',
    hub: 'locations',
    navLabel: 'Pre-Wedding Shoot in Ooty',
    primaryKeyword: 'pre wedding shoot in ooty',
    metaTitle: 'Pre-Wedding Shoot in Ooty from Bangalore | Shoot At Sight Weddings',
    metaDescription: 'Plan a pre-wedding shoot in Ooty with a Bengaluru studio: tea estates, pine forests and mist. Packages, travel and the best months to go.',
    eyebrow: 'Destination pre-wedding shoot',
    h1: 'Pre-Wedding Shoot in Ooty',
    intro: [
      'Ooty, in the Nilgiris, gives a pre-wedding shoot a look you cannot find in the city: rolling tea estates, tall pine forests, cold air and mist that can soften a whole landscape in minutes.',
      'We are based in Bengaluru and travel to Ooty for couple shoots. Here is how an Ooty pre-wedding shoot works, the best time to go, and how packages are priced.',
    ],
    // No hero until the studio supplies photographs actually taken in Ooty.
    sections: [
      {
        heading: 'Where we shoot in Ooty',
        bullets: [
          'Tea estates — layered green slopes that work in clear light and in mist (most are private, so access is arranged in advance)',
          'Pine forests — tall, straight trunks and filtered light for a quiet, cinematic look',
          'Lakes and open grassland — wide frames and reflections early in the morning',
          'Heritage buildings and the hill railway — a vintage feel that suits more styled looks',
        ],
      },
      {
        heading: 'Best time for an Ooty pre-wedding shoot',
        paragraphs: [
          'Ooty is cool all year. The winter months are cold and often clear; the monsoon brings heavy mist and rain, which can be beautiful but makes scheduling harder; the summer holidays bring the most visitors. We plan the dates with you around the look you want.',
          'We lean into the weather rather than fighting it — fog and soft light are part of what makes an Ooty shoot distinctive. Read more in [Misty Mountains: Capturing Love in Ooty’s Valleys](/blog/misty-mountains-capturing-love-in-ootys-valleys).',
        ],
      },
      {
        heading: 'Ooty pre-wedding shoot packages and cost',
        paragraphs: [
          'Ooty pre-wedding shoots are quoted individually. The price depends on the number of shoot days, the locations and permissions involved, and the size of the team. Travel and accommodation are billed separately, based on the location.',
          'Pre-wedding sessions can be booked on their own or added to wedding coverage. Send us your preferred dates and ideas and we will reply with a quote. For wedding packages, see [packages and pricing](/wedding-photography-packages-bangalore).',
        ],
      },
      {
        heading: 'Travel from Bangalore',
        bullets: [
          'Ooty is a long drive from Bengaluru, usually via Mysuru and the forest ghat roads — most couples plan at least one night there',
          'Some forest stretches on the way are closed to traffic at night, so travel is planned for daylight',
          'Shoots are scheduled for early morning and late afternoon, when the light is softest',
          'We help you plan outfits for the cold — layers, shawls and knitwear photograph beautifully in Ooty',
        ],
      },
      {
        heading: 'Prefer to stay in the city?',
        paragraphs: ['See our guide to [pre-wedding shoot locations in Bangalore](/pre-wedding-shoot-locations-bangalore), or browse the [pre-wedding portfolio](/portfolio/pre-wedding).'],
      },
    ],
    faqs: [
      { q: 'How much does a pre-wedding shoot in Ooty cost?', a: 'Ooty shoots are quoted individually, based on shoot days, locations and team size. Travel and accommodation are billed separately. Contact us with your dates for a quote.' },
      { q: 'Do you travel from Bangalore to Ooty for pre-wedding shoots?', a: 'Yes. We are based in Bengaluru and travel to Ooty for pre-wedding shoots.' },
      { q: 'Can we shoot in the tea estates?', a: 'Many tea estates are private, so access has to be arranged with the owners in advance. We plan this with you.' },
    ],
    schema: { type: 'Service', serviceType: 'Pre-wedding photography', areaServed: 'Ooty' },
  },

  // 6 ─────────────────────────────────────────────────────────────────────
  {
    path: '/destination-wedding-photographer',
    hub: 'services',
    navLabel: 'Destination Wedding Photography',
    primaryKeyword: 'destination wedding photographer bangalore',
    metaTitle: 'Destination Wedding Photographer from Bangalore | Shoot At Sight',
    metaDescription: 'Bengaluru wedding photographers and filmmakers who travel worldwide: France, Italy, Switzerland, Thailand, Dubai, the Netherlands and Belgium.',
    eyebrow: 'India and international',
    h1: 'Destination Wedding Photographer from Bangalore',
    intro: [
      'We are a Bengaluru studio, and we travel for weddings — across India and abroad, with work in France, Italy, Switzerland, Thailand, Dubai, the Netherlands and Belgium. A destination wedding gets the same team, the same editorial approach and the same delivery as a wedding at home.',
      'A destination wedding is a bigger decision than a local one: you are trusting a team to arrive prepared, work in an unfamiliar venue and bring the story home. Here is how we handle it.',
    ],
    hero: { src: img.naveenHero, alt: 'Naveen and Kate standing in a palm garden, framed by a carved arched window' },
    gallery: [
      { src: img.naveen1, alt: 'Bride in a black and gold lehenga seated in an ornate, lamp-lit room' },
      { src: img.naveen2, alt: 'Fashion-style portrait of the bride doubled in a reflection, framed by soft gold blur' },
    ],
    video: TEASER,
    sections: [
      {
        heading: 'Where we have worked',
        paragraphs: ['Outside India, our team has photographed and filmed in:'],
        bullets: [
          'France',
          'Italy',
          'Switzerland',
          'Thailand',
          'Dubai, United Arab Emirates',
          'The Netherlands',
          'Brussels, Belgium',
          'Sydney, Australia — [Naveen & Kate](/shoot/naveen-kate), a high-fashion wedding celebration photographed and filmed by our team',
        ],
      },
      {
        heading: 'How destination weddings work',
        bullets: [
          'Tell us where your celebration is and the events planned there',
          'We plan the team, schedule and travel around your itinerary, including any events before the wedding',
          'Travel and accommodation are billed separately, based on the location',
          'Photography, [films](/wedding-films-bangalore) and pre-wedding sessions can all be booked for destination weddings',
        ],
      },
      {
        heading: 'Weddings that bring traditions together',
        paragraphs: ['Destination weddings often bring families, languages and rituals together. Share the order of ceremonies and anything we should know about each tradition, and we will plan where to be for the moments that matter to both sides.'],
      },
      {
        heading: 'Pricing and delivery',
        paragraphs: [`Packages start at ${PRICE} before travel — see [packages and pricing](/wedding-photography-packages-bangalore). Delivery timelines are the same as for weddings in Bengaluru: 6–8 weeks for edited photographs and 8–12 weeks for highlight films.`],
      },
      {
        heading: 'Getting married in Bangalore instead?',
        paragraphs: ['See our [wedding photography in Bangalore](/wedding-photography-bangalore).'],
      },
    ],
    faqs: [
      { q: 'Do you travel for destination weddings?', a: 'Yes. Besides weddings across India, we have worked in France, Italy, Switzerland, Thailand, Dubai, the Netherlands, Belgium and Australia. Tell us where your celebration is and we will plan accordingly.' },
      { q: 'Who pays for travel and accommodation?', a: 'Travel and accommodation are billed separately, based on the location.' },
      { q: 'Is delivery slower for destination weddings?', a: 'No. Edited photographs are delivered within 6–8 weeks and highlight films within 8–12 weeks, the same as for weddings in Bengaluru.' },
    ],
    schema: {
      type: 'Service', serviceType: 'Destination wedding photography',
      areaServed: ['India', 'France', 'Italy', 'Switzerland', 'Thailand', 'United Arab Emirates', 'Netherlands', 'Belgium', 'Australia'],
    },
  },

  // 7 ─────────────────────────────────────────────────────────────────────
  {
    path: '/drone-wedding-coverage',
    hub: 'services',
    navLabel: 'Drone & Aerial Wedding Coverage',
    primaryKeyword: 'drone wedding videography bangalore',
    metaTitle: 'Drone Wedding Videography in Bangalore | Shoot At Sight Weddings',
    metaDescription: 'Aerial wedding photography and drone videography in Bangalore, and what airport no-fly zones like HAL mean for your venue.',
    eyebrow: 'Aerial photography and film',
    h1: 'Drone and Aerial Wedding Coverage in Bangalore',
    intro: [
      'Aerial photography and drone videography show a wedding in the context of its venue — the scale of a mandap, a baraat arriving, the setting of an outdoor ceremony. Used well, a few aerial shots give a wedding film its sense of place.',
      'Drone coverage is planned as part of your [wedding photography](/wedding-photography-bangalore) or [wedding film](/wedding-films-bangalore), not as a separate shoot.',
    ],
    // No hero until the studio supplies its own aerial footage (see seo-handoff.md).
    sections: [
      {
        heading: 'Where you can fly a drone in Bangalore',
        paragraphs: [
          'Not everywhere. Under India’s Drone Rules, 2021, airspace is divided into green, yellow and red zones on the government’s Digital Sky airspace map, and drones must respect them.',
          'Bangalore has a lot of controlled airspace. Areas around HAL Airport, Kempegowda International Airport and the Yelahanka Air Force Station are restricted, and some government and defence areas in the city are no-fly zones. A venue that looks open can still sit inside restricted airspace.',
        ],
        bullets: [
          'We check your venue against the airspace map while planning',
          'The venue must also allow drones — some do not, whatever the airspace',
          'Weather and wind on the day can still rule out a flight',
          'If aerial coverage is not possible at your venue, we tell you plainly before you book it',
        ],
      },
      {
        heading: 'Aerial shots that work at weddings',
        bullets: [
          'Establishing shots of the venue and its surroundings',
          'Arrivals and processions seen from above',
          'Large group photographs that are hard to fit in from the ground',
          'Slow, cinematic movement that opens or closes a [wedding film](/wedding-films-bangalore)',
        ],
      },
      {
        heading: 'FPV drone shots',
        paragraphs: ['FPV (first-person-view) drones fly close and fast through spaces, giving a single unbroken, immersive shot. Because they fly near people and structures, they need careful safety planning and the venue’s agreement. Ask us whether FPV suits your venue.'],
      },
    ],
    faqs: [
      { q: 'Can you fly a drone at any wedding venue in Bangalore?', a: 'No. Many areas — including around HAL Airport, Kempegowda International Airport and Yelahanka Air Force Station — are restricted airspace. The venue must also permit drones, and weather can rule out a flight. We check this while planning.' },
      { q: 'Is drone coverage booked separately?', a: 'Aerial coverage is planned as part of your wedding photography or film, where the venue and airspace allow it.' },
    ],
    schema: { type: 'Service', serviceType: 'Aerial wedding videography', areaServed: 'Bengaluru' },
  },

  // 8 ─────────────────────────────────────────────────────────────────────
  {
    path: '/wedding-photography-packages-bangalore',
    hub: 'services',
    navLabel: 'Packages & Pricing',
    primaryKeyword: 'wedding photography packages bangalore',
    metaTitle: 'Wedding Photography Packages in Bangalore | Shoot At Sight Weddings',
    metaDescription: `Wedding photography and film packages in Bangalore start at ${PRICE}. What is included, what affects the price, and how booking and payment work.`,
    eyebrow: 'Packages and pricing',
    h1: 'Wedding Photography Packages and Pricing in Bangalore',
    intro: [
      `Our wedding photography and film packages start at ${PRICE}. Every wedding is different, so the final quote is built around the scale and plan of your celebration.`,
      'Here is exactly what the package includes, what changes the price, and how booking and payment work — so there are no surprises.',
    ],
    hero: { src: img.aish4, alt: 'The groom in a velvet tuxedo jacket, seated against heavy curtains' },
    sections: [
      {
        heading: `The wedding package — from ${PRICE}`,
        bullets: [
          'A lead photographer and a second shooter on the wedding day (a single photographer may suit intimate weddings)',
          'Coverage from preparation through ceremony and reception',
          'A refined, timeless edit of your photographs',
          'A private online gallery with full-resolution downloads you can share',
          'Edited photographs delivered within 6–8 weeks',
        ],
      },
      {
        heading: 'What affects the price',
        bullets: [
          'The number of events you want covered (for example haldi, mehendi, sangeet, wedding and reception)',
          'Hours of coverage for each event',
          'Team size, including additional photographers for larger weddings',
          'Add-ons: a [cinematic wedding film](/wedding-films-bangalore), a [pre-wedding shoot](/pre-wedding-shoot-locations-bangalore) or [aerial coverage](/drone-wedding-coverage)',
          'Travel and accommodation for weddings outside Bengaluru, billed separately — see [destination weddings](/destination-wedding-photographer)',
        ],
      },
      {
        heading: 'How booking and payment work',
        table: {
          head: ['Stage', 'Payment'],
          rows: [
            ['Booking (with signed contract)', '30% of the total package'],
            ['Event day', '60%'],
            ['Before raw images are delivered', 'Final 10%'],
          ],
        },
      },
      {
        heading: 'Getting a quote',
        paragraphs: ['Send us your dates, venues, the events you want covered and any films or sessions you are considering, and we will reply with availability and a quote. For the October–February season, get in touch 9–12 months ahead.'],
      },
    ],
    faqs: [
      { q: 'How much does wedding photography cost in Bangalore?', a: `Our wedding photography and film packages start at ${PRICE}. The final price depends on the number of events, hours of coverage, team size, add-ons and any travel.` },
      { q: 'How do we confirm our booking?', a: 'With a signed contract and an initial payment of 30% of the total package. The remaining 60% is paid on the event day and the final 10% before the raw images are delivered.' },
      { q: 'Is a wedding film included?', a: 'Films can be added to any photography package or booked on their own; they are quoted as part of your package.' },
      { q: 'Are travel costs included?', a: 'No. For weddings outside Bengaluru, travel and accommodation are billed separately based on the location.' },
    ],
    schema: { type: 'Service', serviceType: 'Wedding photography', areaServed: 'Bengaluru', price: '170000' },
  },
];

export const landingPageByPath = Object.fromEntries(landingPages.map(page => [page.path, page]));
