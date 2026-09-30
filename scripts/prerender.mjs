import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { render, routes, seoHead } from '../.prerender/entry-server.js';
const { loadEnv } = await import('vite');
const env = loadEnv('production', process.cwd(), 'VITE_');
const origin = process.env.VITE_SITE_URL || env.VITE_SITE_URL;
if (!origin || new URL(origin).protocol !== 'https:' || new URL(origin).pathname !== '/') throw new Error('Set VITE_SITE_URL to the public HTTPS origin before building.');
const template = await readFile('dist/index.html', 'utf8');
for (const path of [...routes, '/404']) {
  const head = seoHead(path, origin);
  const html = template.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta name="description"[^>]*>/, '').replace('</head>', `${head}\n</head>`).replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`);
  const target = path === '/' ? 'dist/index.html' : path === '/404' ? 'dist/404.html' : `dist${path}.html`;
  await mkdir(target.slice(0, target.lastIndexOf('/')), { recursive: true });
  await writeFile(target, html.replace(/^[ \t]+$/gm, ''));
}
const xmlEscape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(path => `  <url><loc>${xmlEscape(new URL(path, origin).href)}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', origin).href}\n`);
await rm('.prerender', { recursive: true, force: true });
console.log(`Prerendered ${routes.length} pages, a 404 page, sitemap.xml and robots.txt for ${origin}`);
