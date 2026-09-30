import { academy, articles, computerCourses, socialLinks, globalPartner } from './content/siteContent.js';

export const siteUrl = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');
const pages = {
  '/': ['Icon Academy Lahore | Tuition & Computer Courses', 'Icon Academy in Rizwan Garden, Lahore offers Kids, Matric and Intermediate tuition, practical computer courses and online tutoring. Enquire about admissions.'],
  '/kids': ['Kids Tuition in Lahore | Icon Academy Rizwan Garden', 'Build your child’s concepts, confidence and study habits with Kids tuition at Icon Academy, Rizwan Garden, Lahore. Ask about classes and admissions.'],
  '/matric': ['Matric Tuition in Lahore | 9th & 10th Class | Icon Academy', 'Prepare for 9th and 10th class board exams with concept building, revision and guided practice at Icon Academy in Rizwan Garden, Lahore.'],
  '/intermediate': ['Intermediate Tuition Lahore | 1st & 2nd Year | Icon Academy', 'Get first-year and second-year academic support at Icon Academy, Rizwan Garden, Lahore. Explore concept building, subject practice and exam preparation.'],
  '/computer-courses': ['Computer Courses in Lahore | Icon Academy', 'Explore web development, Python, C++, digital marketing, video editing and spoken English courses at Icon Academy in Rizwan Garden, Lahore.'],
  '/online-tutoring': ['Online Tutoring & Skills Courses | Icon Academy Lahore', 'Learn from home with Icon Academy online tutoring and practical skills courses. Enquire about school subjects, programming, marketing and creative skills.'],
  '/our-team': ['Meet Our Teachers & Leadership | Icon Academy Lahore', 'Meet the leadership and faculty at Icon Academy, Rizwan Garden, Lahore, supporting academic learning, online tutoring and practical professional skills.'],
};
export const routes = [...Object.keys(pages), ...articles.map(article => `/blog/${article.slug}`)];
export const normalizePath = path => path.replace(/\/+$/, '') || '/';
export function getSeo(pathname, origin = siteUrl) {
  const path = normalizePath(pathname);
  const article = articles.find(item => `/blog/${item.slug}` === path);
  const known = Boolean(pages[path] || article);
  const [title, description] = pages[path] || (article ? [`${article.title} | Icon Academy Lahore`, article.excerpt] : ['Page Not Found | Icon Academy Lahore', 'This page could not be found. Explore Icon Academy programs and courses.']);
  const absolute = value => origin ? new URL(value, `${origin}/`).href : undefined;
  const url = absolute(path);
  const image = absolute(article?.image || '/images/pakistani-students-hero.jpg');
  const organization = {
    '@type': 'EducationalOrganization', '@id': absolute('/#academy'), name: academy.name,
    alternateName: 'The Icon Academy Lahore', url: absolute('/'), description: academy.description,
    logo: absolute('/images/icon-academy-logo.png'),
    address: { '@type': 'PostalAddress', streetAddress: academy.address, addressLocality: 'Lahore', addressCountry: 'PK' },
    sameAs: socialLinks.filter(link => link.href !== globalPartner.url).map(link => link.href),
    contactPoint: { '@type': 'ContactPoint', contactType: 'Admissions', url: `https://wa.me/${academy.whatsappNumber}` },
  };
  const graph = [organization, { '@type': 'WebSite', '@id': absolute('/#website'), url: absolute('/'), name: 'Icon Academy Lahore', publisher: { '@id': absolute('/#academy') } },
    { '@type': article ? 'BlogPosting' : 'WebPage', '@id': absolute(`${path}#page`), url, name: title, description, inLanguage: 'en', ...(article ? { headline: article.title, image, datePublished: new Date(`${article.date} UTC`).toISOString().slice(0, 10), articleBody: article.body.join('\n\n'), publisher: { '@id': absolute('/#academy') } } : {}) }];
  if (path !== '/' && known) graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: absolute('/') }, { '@type': 'ListItem', position: 2, name: article?.title || title.split(' | ')[0], item: url }] });
  if (path === '/computer-courses') graph.push({ '@type': 'ItemList', itemListElement: computerCourses.map((course, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'Course', name: course.title, description: course.description, provider: { '@id': absolute('/#academy') } } })) });
  return { title, description, url, image, article, known, structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}
export const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
export function seoHead(path, origin = siteUrl) {
  const seo = getSeo(path, origin);
  const meta = (key, value, property = false) => value ? `<meta ${property ? 'property' : 'name'}="${key}" content="${escapeHtml(value)}" data-seo />` : '';
  return [`<title>${escapeHtml(seo.title)}</title>`, meta('description', seo.description), meta('robots', seo.known ? 'index, follow, max-image-preview:large' : 'noindex, follow'), seo.url ? `<link rel="canonical" href="${escapeHtml(seo.url)}" data-seo />` : '', meta('og:type', seo.article ? 'article' : 'website', true), meta('og:site_name', 'Icon Academy Lahore', true), meta('og:locale', 'en_PK', true), meta('og:title', seo.title, true), meta('og:description', seo.description, true), meta('og:url', seo.url, true), meta('og:image', seo.image, true), meta('og:image:alt', seo.article ? seo.article.title : 'Illustrative scene of Pakistani students learning together', true), meta('twitter:card', 'summary_large_image'), meta('twitter:title', seo.title), meta('twitter:description', seo.description), meta('twitter:image', seo.image), `<script type="application/ld+json" data-seo>${JSON.stringify(seo.structuredData).replace(/</g, '\\u003c')}</script>`].join('\n');
}
