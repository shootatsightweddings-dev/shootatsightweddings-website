const fields = {
  metaTitle: { type: String, trim: true, default: '', maxlength: 160 },
  metaDescription: { type: String, trim: true, default: '', maxlength: 500 },
  canonicalUrl: { type: String, trim: true, default: '' },
};

function validateSeo(data) {
  if (data.authorType === 'Person' && !data.authorName?.trim()) {
    const error = new Error('Enter the actual author name when choosing Person.'); error.statusCode = 400; throw error;
  }
  if (data.canonicalUrl) {
    try { if (new URL(data.canonicalUrl).protocol !== 'https:') throw new Error(); }
    catch { const error = new Error('Canonical URL must be a complete HTTPS URL.'); error.statusCode = 400; throw error; }
  }
  return data;
}

module.exports = { fields, validateSeo };
