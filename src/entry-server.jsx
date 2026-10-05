import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import Website from './Website';
export { routes, seoHead } from './seo';
export function render(path) {
  return renderToString(<HelmetProvider><div id="ssr-app-root"><Website initialPath={path} /></div></HelmetProvider>);
}
