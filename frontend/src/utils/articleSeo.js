export function isoDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  // Legacy editorial dates contain a calendar day, without a time zone.
  if (typeof value === 'string' && /^[A-Za-z]+\s+\d{1,2},\s+\d{4}$/.test(value)) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return date.toISOString();
}

export function articleSchema(post) {
  return {
    '@context':'https://schema.org', '@type':'BlogPosting',
    headline:post.title, description:post.metaDescription || post.excerpt,
    image:post.img ? {'@type':'ImageObject',contentUrl:post.img,caption:post.altText || post.title} : undefined,
    datePublished:isoDate(post.publishedAt || post.createdAt || post.date),
    dateModified:isoDate(post.updatedAt),
    author:{'@type':post.authorType || 'Organization',name:post.authorName || 'Shoot At Sight Weddings',url:post.authorUrl || undefined},
    publisher:{'@type':'Organization','@id':'https://www.shootatsightweddings.com/#business',name:'Shoot At Sight Weddings'},
  };
}
