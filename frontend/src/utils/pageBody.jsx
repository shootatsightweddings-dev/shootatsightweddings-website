import { Link } from 'react-router-dom';

// Minimal, safe formatting for admin-edited service/location page bodies:
//   "## Heading" -> h2, "- item" lines -> ul, [text](/path) -> link.
// Only site-relative paths and https URLs become links; everything else stays text.
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function inline(text, keyPrefix = 'l') {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    if (match.index > last) parts.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${match.index}`;
    if (href.startsWith('/') && !href.startsWith('//')) parts.push(<Link key={key} to={href}>{label}</Link>);
    else if (href.startsWith('https://')) parts.push(<a key={key} href={href} target="_blank" rel="noopener noreferrer">{label}</a>);
    else parts.push(whole);
    last = match.index + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function renderPageBody(body = '') {
  return body.split(/\n\s*\n/).map(block => block.trim()).filter(Boolean).map((block, i) => {
    if (block.startsWith('## ')) return <h2 key={i}>{inline(block.slice(3).trim(), i)}</h2>;
    const lines = block.split('\n').map(line => line.trim());
    if (lines.every(line => line.startsWith('- '))) {
      return <ul key={i}>{lines.map((line, j) => <li key={j}>{inline(line.slice(2), `${i}-${j}`)}</li>)}</ul>;
    }
    return <p key={i}>{inline(block, i)}</p>;
  });
}

// Plain-text first paragraph, used for fallback descriptions and listing cards.
export function firstParagraph(body = '') {
  const first = body.split(/\n\s*\n/).map(b => b.trim()).find(b => b && !b.startsWith('## ') && !b.startsWith('- ')) || '';
  return first.replace(LINK, '$1');
}
