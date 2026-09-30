import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 10);
const titles = new Set();
for (const url of urls) {
  const path = new URL(url).pathname;
  const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}.html`, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: one visible main heading`);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert(html.includes(`rel="canonical" href="${url}"`));
  assert.equal((html.match(/name="description"/g) || []).length, 1);
  assert(!html.includes('noindex'));
  for (const property of ['og:title', 'og:description', 'og:image', 'og:url']) assert(html.includes(`property="${property}"`));
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1]);
  assert.equal(schema['@graph'][0]['@type'], 'EducationalOrganization');
  assert(schema['@graph'][0].sameAs.every(link => !link.includes('code-with-naqvi')));
  for (const [, href] of html.matchAll(/<a\b[^>]*href="(\/[^"#]*)/g)) {
    if (href) assert(urls.includes(new URL(href, url).href) || await stat(`dist${href}`).then(file => file.isFile()).catch(() => false), `${path}: broken internal link ${href}`);
  }
}
assert.equal(titles.size, urls.length, 'Unique page titles');
assert((await readFile('dist/404.html', 'utf8')).includes('noindex, follow'));
assert((await readFile('dist/robots.txt', 'utf8')).includes(new URL('/sitemap.xml', urls[0]).href));
console.log(`PASS: ${urls.length} static pages, unique titles, metadata, schema, internal links, sitemap, robots and 404.`);
