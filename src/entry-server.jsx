import React from 'react';
import { renderToString } from 'react-dom/server';
import Website from './Website';
export { routes, seoHead } from './seo';
export function render(path) {
  return renderToString(<Website initialPath={path} />);
}
