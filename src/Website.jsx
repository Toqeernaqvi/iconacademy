import React, { useLayoutEffect, useState } from 'react';
import { articles } from './content/siteContent';
import ArticlePage from './ArticlePage';
import { seoHead } from './seo';
import App from './App';
import ProgramPage from './ProgramPage';
import { academicProgramDetails } from './content/siteContent';
import ComputerCourses from './ComputerCourses';
import OurTeam from './OurTeam';
import OnlineTutoring from './OnlineTutoring';
import SiteLayout from './SiteLayout';



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
  useLayoutEffect(() => {
    document.head.querySelectorAll('[data-seo], title, meta[name="description"]').forEach(node => node.remove());
    document.head.insertAdjacentHTML('beforeend', seoHead(pathname));
  }, [pathname]);

  const article = articles.find(item => `/blog/${item.slug}` === pathname.replace(/\/$/, ''));
  const programSlug = pathname.replace(/^\/|\/$/g, '');
  const page = article ? <ArticlePage article={article} /> : Object.hasOwn(academicProgramDetails, programSlug) ? <ProgramPage key={programSlug} slug={programSlug} /> : /^\/computer-courses\/?$/.test(pathname) ? <ComputerCourses />
    : /^\/online-tutoring\/?$/.test(pathname) ? <OnlineTutoring />
    : /^\/our-team\/?$/.test(pathname) ? <OurTeam /> : pathname === "/" ? <App /> : <main className="section-wrap academic-hero"><h1>Page not found</h1><p>The page you requested does not exist.</p><a href="/">Return to Icon Academy home</a></main>;

  return <div onClick={(event) => {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== window.location.origin || !/^\/(kids\/?|matric\/?|intermediate\/?|computer-courses\/?|our-team\/?|online-tutoring\/?)?$/.test(url.pathname)) return;
    event.preventDefault();
    navigate(url.href);
  }}>
    <SiteLayout navigate={navigate}><div className="site-route-entry" key={pathname.startsWith('/blog/') ? '/' : pathname.replace(/\/$/, '') || '/'}>{page}</div></SiteLayout>
  </div>;
}

