import React, { useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ComputerCourses from './ComputerCourses';
import OurTeam from './OurTeam';
import SiteLayout from './SiteLayout';
import './styles.css';

function Website() {
  const [location, setLocation] = useState(() => window.location.pathname + window.location.hash);

  const navigate = (href) => {
    const url = new URL(href, window.location.href);
    const nextLocation = url.pathname + url.hash;
    if (nextLocation === window.location.pathname + window.location.hash) {
      if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    window.history.pushState({}, '', nextLocation);
    setLocation(url.pathname + url.hash);
    // Also notify the article modal when navigation leaves a blog URL.
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
  const page = /^\/computer-courses\/?$/.test(pathname) ? <ComputerCourses />
    : /^\/our-team\/?$/.test(pathname) ? <OurTeam /> : <App />;

  return <div onClick={(event) => {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== window.location.origin || !/^\/(computer-courses\/?|our-team\/?)?$/.test(url.pathname)) return;
    event.preventDefault();
    navigate(url.href);
  }}>
    <SiteLayout navigate={navigate}>{page}</SiteLayout>
  </div>;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><Website /></React.StrictMode>,
);
