import SocialIcon from './SocialIcon';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MapPin, Menu, X } from 'lucide-react';
import { academy, socialLinks } from './content/siteContent';
import ThemeToggle from './ThemeToggle';
import useSiteMotion from './useSiteMotion';


export default function SiteLayout({ children, navigate }) {
  const siteRef = useRef(null);
  useSiteMotion(siteRef);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [menuOpen]);
  const navigateToSection = (id) => {
    setMenuOpen(false);
    if (id === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate(`/#${id}`);
  };
  return <div ref={siteRef} className="home-page-v2" onClick={(event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  }}>
      <div className="home-announcement"><span>Admissions & new batches</span><strong>Kids · Matric · Intermediate · Computer Courses</strong><button onClick={() => navigateToSection('contact')}>Enquire now <ArrowUpRight size={14} /></button></div>

      <header className="home-header">
        <a className="course-brand" href="/" aria-label="Icon Academy home"><img src="/images/icon-academy-logo.png" alt="" /><span>The Icon Academy<small>Lahore</small></span></a>
        <nav className="home-nav" aria-label="Main navigation">
          <button onClick={() => navigateToSection('programs')}>Programs</button>
          <a href="/our-team">Our team</a>
          <button onClick={() => navigateToSection('partner')}>Career partner</button>
          <button onClick={() => navigateToSection('updates')}>Updates</button>
          <button onClick={() => navigateToSection('journal')}>Journal</button>
          <button onClick={() => navigateToSection('contact')}>Contact</button>
        </nav>
        <ThemeToggle />
        <a className="home-header-cta" href="/computer-courses">Computer courses <ArrowUpRight size={16} /></a>
        <button className="home-menu-toggle" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      {menuOpen && <div className="home-mobile-menu"><nav><button onClick={() => navigateToSection('programs')}>Programs</button><a href="/our-team">Our team <ArrowUpRight size={17} /></a><button onClick={() => navigateToSection('partner')}>Career partner</button><button onClick={() => navigateToSection('updates')}>Latest updates</button><button onClick={() => navigateToSection('journal')}>Journal</button><button onClick={() => navigateToSection('contact')}>Contact & location</button><a href="/computer-courses">Computer courses <ArrowUpRight size={17} /></a></nav></div>}

      {children}
      <footer className="academy-footer">
        <div className="section-wrap">
          <section className="footer-invitation" id="contact" aria-labelledby="footer-contact-title">
            <div className="footer-invitation-copy">
              <p className="footer-eyebrow">Your next chapter starts here</p>
              <h2 id="footer-contact-title">Take your <em>next step.</em></h2>
              <p>Find the right program, explore batch timings and start your journey with The Icon Academy.</p>
            </div>
            <div className="footer-contact-actions">
              <a className="footer-whatsapp" href={`https://wa.me/${academy.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum, I would like information about admissions, programs and batch timings at The Icon Academy.')}`} target="_blank" rel="noreferrer">
                <SocialIcon platform="WhatsApp" size={23} /><span><small>Let’s talk about your future</small><strong>Chat on WhatsApp</strong></span><ArrowUpRight size={21} />
              </a>
              <a className="footer-facebook" href={academy.facebook} target="_blank" rel="noreferrer"><SocialIcon platform="Facebook" size={20} /><span>Message us on Facebook</span><ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
          </section>

          <div className="footer-directory">
            <div className="footer-about">
              <a className="course-brand" href="/" aria-label="The Icon Academy home"><img src="/images/icon-academy-logo.png" alt="" /><span>The Icon Academy<small>Lahore</small></span></a>
              <p>Strong foundations. Practical skills.<br />A brighter future, built together.</p>
              <div className="footer-social-links" aria-label="Follow The Icon Academy">
                {socialLinks.map(({ label, href }) => { return <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} key={label}><SocialIcon platform={label} size={18} /></a>; })}
              </div>
            </div>
            <nav className="footer-navigation" aria-label="Footer navigation">
              <h3>Explore</h3>
              <a href="/#programs">Our programs</a>
              <a href="/computer-courses">Computer courses</a>
              <a href="/our-team">Our team</a>
              <a href="/#partner">Career partner</a>
              <a href="/#journal">Learning journal</a>
            </nav>
            <div className="footer-campus">
              <h3>Visit our campus</h3>
              <p className="footer-campus-label"><MapPin size={17} /> Rizwan Garden · Lahore</p>
              <address>{academy.address}</address>
              <a className="footer-directions" href={academy.mapsUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16} /></a>
            </div>
          </div>
          <div className="footer-legal"><span>© {new Date().getFullYear()} The Icon Academy. All rights reserved.</span><span>Learn today. Lead tomorrow.</span></div>
        </div>
      </footer>
    </div>;
}
