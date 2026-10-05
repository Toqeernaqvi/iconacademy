import React, { useLayoutEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { articles } from './content/siteContent';
import ArticlePage from './ArticlePage';
import { getSeo } from './seo';
import App from './App';
import ProgramPage from './ProgramPage';
import { academicProgramDetails } from './content/siteContent';
import ComputerCourses from './ComputerCourses';
import OurTeam from './OurTeam';
import OnlineTutoring from './OnlineTutoring';
import SiteLayout from './SiteLayout';
import SpecialNotes from './SpecialNotes';
import NotesAdmin from './NotesAdmin';
import EventsPage from './EventsPage';
import EventsAdmin from './EventsAdmin';
import AdminDashboard from './AdminDashboard';
import AdminGate from './AdminGate';



export default function Website({ initialPath = '/' }) {
  const [location, setLocation] = useState(() => typeof window === 'undefined' ? initialPath : window.location.pathname + window.location.hash);

  const navigate = (href) => {
    const url = new URL(href, window.location.href);
    const nextLocation = url.pathname + url.hash;
    if (nextLocation === window.location.pathname + window.location.hash) {
      if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    window.history.pushState({}, '', nextLocation);
    setLocation(url.pathname + url.hash);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useLayoutEffect(() => {
    const syncLocation = () => setLocation(window.location.pathname + window.location.hash);
    window.addEventListener('popstate', syncLocation);
    return () => window.removeEventListener('popstate', syncLocation);
  }, []);

  useLayoutEffect(() => {
    if (window.location.pathname.startsWith('/blog/')) return;
    if (window.location.hash) {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location]);

  const pathname = location.split('#')[0];
  const seo = getSeo(pathname);

  const article = articles.find(item => `/blog/${item.slug}` === pathname.replace(/\/$/, ''));
  const programSlug = pathname.replace(/^\/|\/$/g, '');
  const page = article ? <ArticlePage article={article} /> : Object.hasOwn(academicProgramDetails, programSlug) ? <ProgramPage key={programSlug} slug={programSlug} /> : /^\/computer-courses\/?$/.test(pathname) ? <ComputerCourses />
    : /^\/online-tutoring\/?$/.test(pathname) ? <OnlineTutoring />
    : /^\/events\/?$/.test(pathname) ? <EventsPage />
    : /^\/admin\/events\/?$/.test(pathname) ? <EventsAdmin />
    : /^\/admin\/?$/.test(pathname) ? <AdminDashboard />
    : /^\/our-team\/?$/.test(pathname) ? <OurTeam /> : /^\/special-notes\/?$/.test(pathname) ? <SpecialNotes /> : /^\/admin\/notes\/?$/.test(pathname) ? <NotesAdmin /> : pathname === "/" ? <App /> : <main className="section-wrap academic-hero"><h1>Page not found</h1><p>The page you requested does not exist.</p><a href="/">Return to Icon Academy home</a></main>;
  const protectedPage = pathname.startsWith('/admin') ? <AdminGate>{page}</AdminGate> : page;

  return <>
    <Helmet prioritizeSeoTags>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content={seo.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'} />
      {seo.url && <link rel="canonical" href={seo.url} />}
      <meta property="og:type" content={seo.article ? 'article' : 'website'} />
      <meta property="og:site_name" content="Icon Academy Lahore" />
      <meta property="og:locale" content="en_PK" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      {seo.url && <meta property="og:url" content={seo.url} />}
      {seo.image && <meta property="og:image" content={seo.image} />}
      <meta property="og:image:alt" content={seo.article ? seo.article.title : 'Students learning at The Icon Academy Lahore'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.image && <meta name="twitter:image" content={seo.image} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.structuredData).replace(/</g, '\\u003c') }} />
    </Helmet>
    <div onClick={(event) => {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== window.location.origin || !/^\/(kids\/?|matric\/?|intermediate\/?|computer-courses\/?|our-team\/?|online-tutoring\/?|events\/?)?$/.test(url.pathname)) return;
    event.preventDefault();
    navigate(url.href);
  }}>
    <SiteLayout navigate={navigate}><div className="site-route-entry" key={pathname.startsWith('/blog/') ? '/' : pathname.replace(/\/$/, '') || '/'}>{protectedPage}</div></SiteLayout>
    </div>
  </>;
}
