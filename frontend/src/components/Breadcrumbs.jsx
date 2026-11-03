import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

const LABELS = {
  about: 'About',
  services: 'Services',
  locations: 'Locations',
  portfolio: 'Portfolio',
  wedding: 'Wedding',
  'pre-wedding': 'Pre-Wedding',
  films: 'Films',
  faq: 'FAQ',
  contact: 'Contact',
  blog: 'Blog',
  shoot: 'Portfolio',
};

// Renders a real, crawlable breadcrumb trail (not just the JSON-LD copy in
// useSEO) so search engines see the page hierarchy and internal links
// connect category pages to the case studies under them either way.
// `currentLabel` overrides the last segment's label for dynamic routes
// (e.g. /shoot/:slug, where the slug itself isn't a readable title).
const Breadcrumbs = ({ currentLabel }) => {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const accPath = '/' + segments.slice(0, i + 1).join('/');
    const isLast = i === segments.length - 1;
    const label = isLast && currentLabel ? currentLabel : (LABELS[seg] || seg.replace(/-/g, ' '));
    // "/shoot" alone isn't a real route (only "/shoot/:id" is) — point that
    // intermediate crumb at the actual listing page instead of a 404.
    const path = (!isLast && seg === 'shoot') ? '/portfolio' : accPath;
    return { path, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.path}>
            {c.isLast ? (
              <span aria-current="page">{c.label}</span>
            ) : (
              <Link to={c.path}>{c.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
