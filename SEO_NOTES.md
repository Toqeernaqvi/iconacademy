# SEO setup

Production origin: https://theiconacademy.vercel.app (configured in `.env.production`). Set `VITE_SITE_URL` to the preferred HTTPS origin and rebuild if the domain changes. Never set it to a preview deployment URL.

`npm run build` generates complete HTML for all ten public routes and a custom 404 page, then generates `/robots.txt` and `/sitemap.xml`. Vercel serves these files directly; the previous catch-all homepage rewrite was removed so missing URLs return 404. Vercel clean URLs map paths such as `/kids` to `kids.html`. Other hosts must support the same mapping and return the custom 404 with HTTP status 404.

Page titles, descriptions, canonical URLs, Open Graph/Twitter previews and JSON-LD live in `src/seo.js`. Content stays in `src/content/siteContent.js`. The build renders current content automatically; article links open full article pages. Structured data describes the academy, website, breadcrumbs, articles and the computer course list. No fabricated ratings, opening hours or credentials are included. Partner LinkedIn is excluded from academy `sameAs`.

## Social review

Facebook, Instagram, YouTube, TikTok and partner LinkedIn URLs were attempted on September 30, 2026. Public content could not be retrieved through the browsing tool; search results did not provide reliable matching evidence. Do not treat social bios, followers, reviews or new course claims as verified. Academy data comes from the supplied repository. Instagram was normalized to HTTPS and tracking parameters removed.

## After deployment

1. Add and verify the production site in Google Search Console using the owner's Google account.
2. Submit `https://theiconacademy.vercel.app/sitemap.xml`; inspect the homepage, one course/program page and one article with URL Inspection.
3. Confirm live deep links return 200 and a made-up URL returns 404. Check social previews and structured data with Google's Rich Results Test (valid schema does not guarantee a rich result).
4. Claim/update the Google Business Profile with accurate campus address, contact details, categories, opening hours and real campus photos. Keep website and social profile details consistent.
5. Publish useful original subject/course guides, teacher credentials, actual student work and permission-cleared feedback. Review Search Console impressions, queries and indexing after launch.

Search Console and Business Profile actions require account access and have not been performed. Changes are local until deployed. Rankings cannot be guaranteed.

Google references: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics and https://developers.google.com/search/docs/crawling-indexing/special-tags. Google ignores meta keywords; relevant phrases are used in page titles, descriptions and visible content instead.

## Verification

Run `npm run build && npm run check:seo`. A Chrome browser smoke test also passed across all ten routes, internal navigation/back, article links, mobile article width and saved theme with no React hydration errors. Live Vercel status codes and Search Console indexing still need checking after deployment.
