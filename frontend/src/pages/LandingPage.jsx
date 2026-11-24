import { Link } from 'react-router-dom';
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
      <header className="lp-header container">
        <Breadcrumbs currentLabel={page.navLabel} />
        <p className="lp-eyebrow">{page.eyebrow}</p>
        <h1 className="section-title-large">{page.h1}</h1>
        <div className="lp-intro">{page.intro.map((text, i) => <p key={i}>{inline(text, `intro${i}`)}</p>)}</div>
        <Link className="btn-premium" to="/contact">Check your date</Link>
      </header>

      {page.hero && (
        <div className="lp-hero container">
          <img src={page.hero.src} alt={page.hero.alt} fetchPriority="high" width="1600" height="1067" />
        </div>
      )}

      <div className="lp-body container">
        {page.video && (
          <figure className="lp-video">
            <video controls preload="none" playsInline poster={page.video.poster} src={page.video.src} aria-label={page.video.title} />
            <figcaption>{page.video.title}</figcaption>
          </figure>
        )}

        {page.sections.map((section, i) => <Section key={section.heading} section={section} index={i} />)}

        {page.gallery?.length > 0 && (
          <section className="lp-section">
            <h2>From the portfolio</h2>
            <div className="lp-gallery">
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
