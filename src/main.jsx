import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ComputerCourses from './ComputerCourses';
import OurTeam from './OurTeam';
import './styles.css';

const isComputerCoursesPage = /^\/computer-courses\/?$/.test(window.location.pathname);
const isOurTeamPage = /^\/our-team\/?$/.test(window.location.pathname);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isComputerCoursesPage ? <ComputerCourses /> : isOurTeamPage ? <OurTeam /> : <App />}
  </React.StrictMode>,
);
