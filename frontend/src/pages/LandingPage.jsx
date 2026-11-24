import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { inline } from '../utils/pageBody';
import { landingPages, LANDING_PAGES_PUBLIC } from '../data/landingPages';
import './LandingPage.css';

const origin = 'https://www.shootatsightweddings.com';
const GUIDE_DATE = '2026-11-18';

const absolute = url => (url && !/^https?:\/\//.test(url) ? `${origin}${url}` : url);

const plain = text => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

function buildSchema(page) {
  const url = `${origin}${page.path}`;
  if (page.schema.type === 'Article') {
    return [{
      '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`,
      headline: page.h1, description: page.metaDescription, url, mainEntityOfPage: url,
      image: page.hero ? [absolute(page.hero.src)] : undefined,
      datePublished: GUIDE_DATE, dateModified: GUIDE_DATE,
      author: { '@id': `${origin}/#business` }, publisher: { '@id': `${origin}/#business` },
    }];
  }
  const { serviceType, areaServed, price } = page.schema;
  return [{
    '@context': 'https://schema.org', '@type': 'Service', '@id': `${url}#service`,
    name: page.h1, serviceType, description: page.metaDescription, url,
    provider: { '@id': `${origin}/#business` },
    // A string is a city ('India' is a country); an array lists places as
    // 'Country' names or { type, name } objects.
    areaServed: Array.isArray(areaServed)
      ? areaServed.map((a) => (typeof a === 'string' ? { '@type': 'Country', name: a } : { '@type': a.type, name: a.name }))
      : areaServed ? { '@type': areaServed === 'India' ? 'Country' : 'City', name: areaServed } : undefined,
    image: absolute(page.hero?.src),
    offers: price ? {
      '@type': 'Offer', priceCurrency: 'INR', url,
      priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'INR', minPrice: Number(price) },
    } : undefined,
  }];
}

// On desktop the film grows from its box to fill the screen as you scroll,
// playing silently with a sound button. Phones (portrait screens would crop
// most of a widescreen film, and data matters) and visitors who prefer
// reduced motion get the normal player.
const IMMERSIVE_QUERY = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

function FilmVideo({ video }) {
  const immersive = useMediaQuery(IMMERSIVE_QUERY);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!immersive) return undefined;
    const stage = stageRef.current;
    const film = videoRef.current;
    film.muted = true;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = stage.getBoundingClientRect();
        const travel = box.height - window.innerHeight;
        // Full screen after 55% of the scroll, then held there for the rest.
        const progress = Math.min(1, Math.max(0, -box.top / (travel * 0.55)));
        stage.style.setProperty('--p', progress.toFixed(4));
        // Pin the frame to the screen while the stage scrolls past. (CSS
        // sticky can't be used: the site's body overflow rule disables it.)
        stage.dataset.pin = box.top > 0 ? 'before' : box.bottom < window.innerHeight ? 'after' : 'fixed';
      });
    };
    // Only load and play while the film is on screen.
    const watcher = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) film.play().catch(() => {});
      else film.pause();
    }, { threshold: 0.2 });
    watcher.observe(stage);
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      watcher.disconnect();
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [immersive]);

  if (!immersive) {
    return (
      <figure className="lp-video">
        <video controls preload="none" playsInline poster={video.poster} src={video.src} aria-label={video.title} />
        <figcaption>{video.title}</figcaption>
      </figure>
    );
  }

  const toggleSound = () => {
    const film = videoRef.current;
    film.muted = !film.muted;
    setMuted(film.muted);
    if (!film.muted) film.play().catch(() => {});
  };

  return (
    <figure className="lp-stage" ref={stageRef}>
      <div className="lp-stage-frame">
        <video
          ref={videoRef} muted loop playsInline preload="none"
          poster={video.poster} src={video.src} aria-label={video.title}
        />
        <figcaption className="lp-stage-ui">
          <span>{video.title}</span>
          <button type="button" onClick={toggleSound} aria-pressed={!muted}>
            {muted ? 'Sound on' : 'Sound off'}
          </button>
        </figcaption>
      </div>
    </figure>
  );
}

function Section({ section, index }) {
  return (
    <section className="lp-section">
      <h2>{section.heading}</h2>
      {section.paragraphs?.map((text, i) => <p key={i}>{inline(text, `${index}-p${i}`)}</p>)}
      {section.bullets && <ul>{section.bullets.map((text, i) => <li key={i}>{inline(text, `${index}-b${i}`)}</li>)}</ul>}
      {section.table && (
        <div className="lp-table-wrap">
          <table>
            <thead><tr>{section.table.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>{section.table.rows.map((row, r) => (
              <tr key={r}>{row.map((cell, c) => c === 0 ? <th key={c} scope="row">{cell}</th> : <td key={c}>{cell}</td>)}</tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function LandingPage({ page }) {
  useSEO({
    title: page.metaTitle,
    description: page.metaDescription,
    ogImage: page.hero?.src,
    ogType: page.schema.type === 'Article' ? 'article' : 'website',
    jsonLd: buildSchema(page),
    breadcrumbLabels: { [page.path]: page.navLabel },
    path: page.path,
    noindex: !LANDING_PAGES_PUBLIC,
  });

  const related = landingPages.filter(p => p.path !== page.path);

  return (
    <article className="landing-page">
      {/* Opening: text beside the photo on desktop, stacked on phones. */}
      <div className={`lp-top container${page.hero ? ' lp-top--split' : ''}`}>
        <Breadcrumbs currentLabel={page.navLabel} />
        <div className="lp-top-grid">
          <header className="lp-header">
            <p className="lp-eyebrow">{page.eyebrow}</p>
            <h1 className="section-title-large">{page.h1}</h1>
            <div className="lp-intro">{page.intro.map((text, i) => <p key={i}>{inline(text, `intro${i}`)}</p>)}</div>
            <Link className="btn-premium" to="/contact">Check your date</Link>
          </header>
          {page.hero && (
            <div className="lp-hero">
              <img
                src={page.hero.src} alt={page.hero.alt} fetchPriority="high" width="1200" height="1500"
                style={page.hero.focus ? { objectPosition: page.hero.focus } : undefined}
              />
            </div>
          )}
        </div>
      </div>

      <div className="lp-body container">
        {page.video && <FilmVideo video={page.video} />}

        {page.sections.map((section, i) => <Section key={section.heading} section={section} index={i} />)}

        {page.gallery?.length > 0 && (
          <section className="lp-section">
            <h2>From the portfolio</h2>
            <div className="lp-gallery" style={{ '--cols': Math.min(page.gallery.length, 3) }}>
              {page.gallery.map(item => <img key={item.src} src={item.src} alt={item.alt} loading="lazy" decoding="async" />)}
            </div>
            <p><Link to="/portfolio">See the full portfolio</Link></p>
          </section>
        )}

        {page.faqs?.length > 0 && (
          <section className="lp-section lp-faqs">
            <h2>Frequently asked questions</h2>
            {page.faqs.map(faq => (
              <details key={faq.q}>
                <summary><h3>{faq.q}</h3></summary>
                <p>{plain(faq.a)}</p>
              </details>
            ))}
          </section>
        )}

        <section className="lp-cta">
          <h2>Tell us about your celebration</h2>
          <p>Share your dates, venues and the events you would like covered, and we will reply with availability and a quote.</p>
          <Link className="btn-premium" to="/contact">Enquire about your date</Link>
        </section>

        <nav className="lp-related" aria-label="More wedding photography services">
          <h2>Explore more</h2>
          <ul>{related.map(p => <li key={p.path}><Link to={p.path}>{p.navLabel}</Link></li>)}</ul>
        </nav>
      </div>
    </article>
  );
}
