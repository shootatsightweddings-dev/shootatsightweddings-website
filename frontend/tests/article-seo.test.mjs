import {test} from 'node:test';
import assert from 'node:assert/strict';
import {articleSchema,isoDate} from '../src/utils/articleSeo.js';

test('article schema uses machine dates and real authored metadata',()=>{
  const schema=articleSchema({title:'A celebration',date:'January 2, 2025',createdAt:'2025-01-02T10:00:00Z',publishedAt:'2025-01-04T10:00:00Z',updatedAt:'2026-02-05T11:00:00Z',metaDescription:'Authored summary',img:'https://example.test/photo.webp',altText:'The couple in the garden',authorName:'Actual Author',authorType:'Person',authorUrl:'https://example.test/author'});
  assert.equal(schema.datePublished,'2025-01-04T10:00:00.000Z');assert.equal(schema.dateModified,'2026-02-05T11:00:00.000Z');
  assert.equal(schema.description,'Authored summary');assert.equal(schema.author['@type'],'Person');assert.equal(schema.image.caption,'The couple in the garden');
});
test('legacy article dates normalize and missing dates are not invented',()=>{
  assert.equal(isoDate('January 2, 2025'),'2025-01-02');assert.equal(isoDate('not a date'),undefined);
  const schema=articleSchema({title:'Article',excerpt:'Fallback description'});
  assert.equal(schema.author['@type'],'Organization');assert.equal(schema.dateModified,undefined);assert.equal(schema.datePublished,undefined);
});
