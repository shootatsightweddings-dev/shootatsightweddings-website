const img1 = "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_DSC3521_-_Copy.webp";
const img2 = "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_DSC0075_-_Copy.webp";
const img3 = "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_DSC2178_-_Copy.webp";
const img4 = "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/SAS_3280.webp";

// The four articles the site has always advertised on /blog. Previously
// these only opened in a client-side modal with no real URL — a crawler
// (or anyone sharing a link) had no page to land on. Moving them here so
// both the listing page and the individual post route share one source.
export const localBlogPosts = [
  {
    id: 1,
    slug: 'finding-the-light-in-candid-moments',
    title: 'Finding the Light in Candid Moments',
    date: 'April 24, 2026',
    cat: 'ARTISTRY',
    excerpt: 'Exploring the technical and emotional aspects of low-light candid photography in high-end weddings.',
    content: [
      'Golden hour is that magical window of time just before sunset where the sun is low in the sky, producing a warm, soft light that behaves like a natural filter. In Hyderabad, the sunset light reflecting off heritage stone and lake vistas creates a dreamlike amber glow. To capture this, timing is everything.',
      'We coordinate with our couples to block out exactly 45 minutes of their schedule. Tips for your shoot: 1. Keep moving. Low-angle light is perfect for capturing natural movement. 2. Lean into the flare. Backlighting creates a halo effect on hair and dresses. 3. Colors matter. Earthy colors, pastel pinks, and ivory reflect this light spectacularly.',
      'Beyond technical specifications, candid lighting is about emotional pacing. We watch for silent cues—a heavy breath before the ceremony, a slight touch of hands, or tears half-hidden by a veil. Allowing these moments to occur naturally, without forcing unnatural lighting grids, keeps the integrity of the frame pure.'
    ],
    img: img1,
    featured: true
  },
  {
    id: 2,
    slug: 'how-to-stay-natural-on-camera-5-essential-tips',
    title: 'How to Stay Natural on Camera: 5 Essential Tips',
    date: 'March 15, 2026',
    cat: 'GUIDE',
    excerpt: 'Feeling stiff or nervous in front of the lens? Read our guide on how to let go of the camera and focus on each other.',
    content: [
      'The biggest fear couples share with us is "We aren\'t photogenic" or "We feel awkward." We hear you! The secret to natural photos is simple: stop posing and start interacting. Here are 5 tips we use to keep things authentic:',
      '1. Whisper a joke: Whispering something silly instantly breaks the tension and brings out real laughter. 2. Walk and talk: Walking gives your body a natural action, distracting you from the lens. 3. Touch points: Keep a hand on their waist or hold fingers. Physical contact grounds you.',
      '4. Trust your photographer: We capture the spaces between the poses where your real connection shines. 5. Forget perfection: The most beautiful images are the ones with wind-blown hair and spontaneous smiles. Let go, look at each other, and let us handle the frames.'
    ],
    img: img2
  },
  {
    id: 3,
    slug: 'behind-the-lens-designing-your-pre-wedding-moodboard',
    title: 'Behind the Lens: Designing Your Pre-wedding Moodboard',
    date: 'February 28, 2026',
    cat: 'INSPIRATION',
    excerpt: 'How we collaborate with couples to design customized, high-fashion visual concepts before taking a single shot.',
    content: [
      'A pre-wedding shoot isn\'t just about taking pictures in a nice park—it is about telling your unique story. We begin every project by collaborating on a digital moodboard. We look at cinematic films, editorial fashion magazines, and vintage color grading to find a theme that resonates.',
      'Whether it is "Classic Noir" in an urban setting or "Moody Romanticism" in the mountains, a moodboard ensures our wardrobe, styling, locations, and cameras are completely aligned.',
      'By planning color coordination and movement patterns beforehand, we reduce the stress on the day of the shoot. This level of curated planning is what elevates a standard couple shoot into a bespoke work of fine art.'
    ],
    img: img3
  },
  {
    id: 4,
    slug: 'misty-mountains-capturing-love-in-ootys-valleys',
    title: 'Misty Mountains: Capturing Love in Ooty\'s Valleys',
    date: 'January 10, 2026',
    cat: 'DESTINATIONS',
    excerpt: 'A deep dive into our cinematic experience shooting in the cold, foggy tea-gardens of Ooty.',
    content: [
      'Ooty offers a completely different vibe compared to the grand, warm palaces of Hyderabad. The fog, the deep greens of tea estates, and the cold air create an incredibly moody, intimate atmosphere.',
      'During our recent shoot with Vikram & Anjali, the mist rolled in so thick that the background completely disappeared. This allowed us to focus purely on their expressions and the soft texture of their sweaters.',
      'It is a testament to how weather can become a powerful storytelling tool in photography. Instead of hiding from rain or fog, we lean directly into them to capture the high-contrast, moody colors of the environment.'
    ],
    img: img4
  }
];
