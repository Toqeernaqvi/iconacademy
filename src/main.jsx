import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import Website from './Website';
import './styles.css';
import './motion.css';

const root = document.getElementById('root');
const app = <React.StrictMode><Website /></React.StrictMode>;
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
