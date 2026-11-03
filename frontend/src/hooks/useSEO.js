import { useEffect } from 'react';

const SITE_URL = 'https://www.shootatsightweddings.com';
const BRAND = 'Shoot At Sight Weddings';
const DEFAULT_OG_IMAGE = 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08467.webp';

const setMetaByName = (name, content) => {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const setMetaByProperty = (property, content) => {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const setCanonical = (href) => {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
};

// Builds a breadcrumb trail from the current path. Labels can be overridden
// (e.g. dynamic /shoot/:slug pages passing the real shoot title).
const buildBreadcrumbList = (pathname, labelOverrides = {}) => {
  const segments = pathname.split('/').filter(Boolean);
  const itemListElement = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
  ];
  let accPath = '';
  segments.forEach((seg, i) => {
    accPath += `/${seg}`;
    const isLast = i === segments.length - 1;
    // "/shoot" alone isn't a real route (only "/shoot/:id" is) — point that
    // intermediate crumb at the actual listing page instead of a 404.
    const isShootSegment = !isLast && seg === 'shoot';
    const path = isShootSegment ? '/portfolio' : accPath;
    const label = labelOverrides[accPath] || (isShootSegment
      ? 'Portfolio'
      : seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
    itemListElement.push({
      '@type': 'ListItem',
      position: i + 2,
      name: label,
      item: `${SITE_URL}${path}`,
    });
  });
  if (itemListElement.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
};

/**
 * Sets per-route document head metadata (title, description, canonical, OG,
 * Twitter, JSON-LD, robots). Runs client-side via useEffect, so it only
 * takes effect for real browsers/crawlers that execute JS — the prerender
 * script (scripts/prerender.mjs) waits for this to run before it snapshots
 * each route to static HTML, which is what makes non-JS crawlers see it too.
 */
const useSEO = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  noindex = false,
  jsonLd = [],
  breadcrumbLabels,
  path,
} = {}) => {
  useEffect(() => {
    const pathname = path || window.location.pathname;
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;

    if (title) {
      const fullTitle = title.toLowerCase().includes('shoot at sight')
        ? title
        : `${title} | ${BRAND}`;
      document.title = fullTitle;
      setMetaByProperty('og:title', ogTitle || fullTitle);
      setMetaByName('twitter:title', ogTitle || fullTitle);
    }

    if (description) {
      setMetaByName('description', description);
      setMetaByProperty('og:description', ogDescription || description);
      setMetaByName('twitter:description', ogDescription || description);
    }

    setCanonical(canonicalUrl);
    setMetaByProperty('og:url', canonicalUrl);
    setMetaByProperty('og:type', ogType);

    const image = ogImage || DEFAULT_OG_IMAGE;
    setMetaByProperty('og:image', image);
    setMetaByName('twitter:image', image);
    setMetaByName('twitter:card', 'summary_large_image');

    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.name = 'robots';
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');

    // Clear JSON-LD left over from the previous route before adding this
    // page's blocks, so an SPA nav never leaks e.g. FAQPage schema onto /about.
    document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((el) => el.remove());

    const blocks = [...jsonLd];
    if (!noindex) {
      const breadcrumb = buildBreadcrumbList(pathname, breadcrumbLabels);
      if (breadcrumb) blocks.push(breadcrumb);
    }

    blocks.filter(Boolean).forEach((block) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((el) => el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, ogTitle, ogDescription, ogImage, ogType, noindex, path, JSON.stringify(jsonLd)]);
};

export default useSEO;
