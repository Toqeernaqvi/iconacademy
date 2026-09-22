import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  CirclePlay,
  Code2,
  Globe2,
  Link as LinkIcon,
  MapPin,
  Menu,
  Music2,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { academy, articles, globalPartner, programs, socialLinks } from './content/siteContent';
import ThemeToggle from './ThemeToggle';

const socialIcons = { YouTube: CirclePlay, Instagram: Camera, Facebook: Users, TikTok: Music2, LinkedIn: BriefcaseBusiness };
const categories = ['All stories', ...new Set(articles.map((article) => article.category))];

const getArticleFromPath = () => {
  const match = window.location.pathname.match(/^\/blog\/([^/]+)\/?$/);
  return match ? articles.find((article) => article.slug === decodeURIComponent(match[1])) ?? null : null;
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All stories');
  const [selectedArticle, setSelectedArticle] = useState(getArticleFromPath);
  const [copied, setCopied] = useState(false);

  const filteredArticles = useMemo(
    () => activeCategory === 'All stories' ? articles : articles.filter((article) => article.category === activeCategory),
    [activeCategory],
  );

  useEffect(() => {
    const handlePopState = () => setSelectedArticle(getArticleFromPath());
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        if (selectedArticle) closeArticle();
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedArticle]);

  useEffect(() => {
    document.body.style.overflow = selectedArticle || menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedArticle, menuOpen]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openArticle = (article) => {
    setSelectedArticle(article);
    setCopied(false);
    window.history.pushState({ articleModal: true }, '', `/blog/${article.slug}`);
  };

  const closeArticle = () => {
    if (!selectedArticle) return;
    setSelectedArticle(null);
    setCopied(false);
    if (window.history.state?.articleModal) window.history.back();
    else window.history.replaceState({}, '', '/');
  };

  const shareArticle = async () => {
    const shareData = { title: selectedArticle.title, text: selectedArticle.excerpt, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const facebookSocial = socialLinks.find((social) => social.label === 'Facebook');

  return (
    <div className="home-page-v2">
      <div className="home-announcement"><span>Admissions & new batches</span><strong>Kids · Matric · Intermediate · Computer Courses</strong><button onClick={() => scrollTo('contact')}>Enquire now <ArrowUpRight size={14} /></button></div>

      <header className="home-header">
        <a className="course-brand" href="/" aria-label="Icon Academy home"><img src="/images/icon-academy-logo.png" alt="" /><span>The Icon Academy<small>Lahore</small></span></a>
        <nav className="home-nav" aria-label="Main navigation">
          <button onClick={() => scrollTo('programs')}>Programs</button>
          <a href="/our-team">Our team</a>
          <button onClick={() => scrollTo('partner')}>Career partner</button>
          <button onClick={() => scrollTo('updates')}>Updates</button>
          <button onClick={() => scrollTo('journal')}>Journal</button>
          <button onClick={() => scrollTo('contact')}>Contact</button>
        </nav>
        <ThemeToggle />
        <a className="home-header-cta" href="/computer-courses">Computer courses <ArrowUpRight size={16} /></a>
        <button className="home-menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      {menuOpen && <div className="home-mobile-menu"><nav><button onClick={() => scrollTo('programs')}>Programs</button><a href="/our-team">Our team <ArrowUpRight size={17} /></a><button onClick={() => scrollTo('partner')}>Career partner</button><button onClick={() => scrollTo('updates')}>Latest updates</button><button onClick={() => scrollTo('journal')}>Journal</button><button onClick={() => scrollTo('contact')}>Contact & location</button><a href="/computer-courses">Computer courses <ArrowUpRight size={17} /></a></nav></div>}

      <main>
        <section className="home-hero">
          <div className="course-angle course-angle-blue" /><div className="course-angle course-angle-red" />
          <div className="section-wrap home-hero-grid">
            <div className="home-hero-copy">
              <p className="course-eyebrow"><Sparkles size={15} /> Academic & professional learning</p>
              <h1>Learn today.<br /><em>Lead tomorrow.</em></h1>
              <p>Strong academic foundations for Kids, Matric and Intermediate students—plus practical computer courses for career-ready skills.</p>
              <div className="course-hero-actions"><button className="course-button course-button-primary" onClick={() => scrollTo('programs')}>Explore programs <ArrowUpRight size={17} /></button><a className="course-button course-button-secondary" href="/computer-courses">View computer courses <Code2 size={17} /></a></div>
              <div className="home-hero-points"><span><CheckCircle2 size={15} /> Guided learning</span><span><CheckCircle2 size={15} /> Practical skills</span><span><CheckCircle2 size={15} /> Career pathways</span></div>
            </div>
            <div className="home-hero-visual">
              <div className="home-photo-frame"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=88" alt="Students learning together" /><div className="home-photo-label"><strong>Learn skills.</strong><span>Build your future.</span></div></div>
              <div className="home-logo-medallion"><img src="/images/icon-academy-logo.png" alt="The Icon Academy crest" /></div>
            </div>
          </div>
        </section>

        <section className="home-proof"><div className="section-wrap home-proof-grid"><div><strong>01</strong><span>Concept-based<br />academic learning</span></div><div><strong>02</strong><span>Board examination<br />preparation</span></div><div><strong>03</strong><span>Professional computer<br />training</span></div><div><strong>04</strong><span>Career connections<br />and guidance</span></div></div></section>

        <section className="home-section home-programs" id="programs">
          <div className="section-wrap">
            <div className="home-section-heading"><div><p>01 / Programs we offer</p><h2>One academy.<br /><em>Every next step.</em></h2></div><span>Choose the learning path that matches your stage and goals.</span></div>
            <div className="home-program-grid">
              {programs.map((program) => (
                <article className={`home-program-card ${program.accent}`} key={program.number}>
                  <span className="home-program-number">{program.number}</span><h3>{program.title}</h3><p>{program.description}</p><div className="tag-list">{program.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  {program.title === 'Computer Courses' ? <a href="/computer-courses">View all courses <ArrowUpRight size={17} /></a> : <button onClick={() => scrollTo('contact')}>Ask about this program <ArrowUpRight size={17} /></button>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-course-banner"><div className="section-wrap home-course-banner-grid"><div><p>Professional computer training</p><h2>Six courses. Practical projects. Skills you can use.</h2></div><div className="home-course-list"><span>Full Stack Web Development</span><span>Python Programming</span><span>C++ Programming</span><span>Digital Marketing</span><span>Spoken English</span><span>Video Editing</span></div><a href="/computer-courses">Explore fees & course details <ArrowUpRight size={18} /></a></div></section>

        <section className="home-section home-partner" id="partner">
          <div className="section-wrap home-partner-grid">
            <div className="home-partner-brand"><Globe2 size={28} /><div className="home-partner-logo"><img src={globalPartner.logo} alt="CWN Solutions" /></div><span>Global career partner</span></div>
            <div className="home-partner-copy"><p>02 / {globalPartner.eyebrow}</p><h2>From classroom<br />to <em>career.</em></h2><p>{globalPartner.description}</p><p>Through our connection with <strong>{globalPartner.name}</strong>, job-ready web development students can access professional project exposure and career opportunities. Icon Academy students have gone on to land roles with the team.</p><div className="home-partner-points">{globalPartner.highlights.map((item) => <span key={item}><CheckCircle2 size={15} /> {item}</span>)}</div><a href={globalPartner.url} target="_blank" rel="noreferrer">Meet CWN Solutions <ArrowUpRight size={16} /></a></div>
          </div>
        </section>

        <section className="home-section home-connect" id="updates">
          <div className="section-wrap">
            <div className="home-section-heading compact"><div><p>03 / Stay connected</p><h2>Follow the<br /><em>academy.</em></h2></div><span>Lessons, admissions, student work and academy news—wherever you already scroll.</span></div>
            <div className="home-social-grid">{socialLinks.map(({ label, href }) => { const Icon = socialIcons[label]; return <a href={href} target="_blank" rel="noreferrer" key={label}><Icon size={24} /><strong>{label}</strong><ArrowUpRight size={16} /></a>; })}</div>
            <div className="home-facebook-grid">
              <div><p className="course-eyebrow"><Users size={15} /> Live Facebook timeline</p><h3>Latest updates,<br />direct from our page.</h3><p>See current course announcements, admissions information and public posts from Icon Academy Lahore.</p><a className="course-button course-button-primary" href={facebookSocial.href} target="_blank" rel="noreferrer">Open Facebook <ArrowUpRight size={16} /></a></div>
              <div className="facebook-feed"><iframe title="Icon Academy Lahore Facebook updates" src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ficonacademylahore&tabs=timeline&width=500&height=620&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true" width="500" height="620" scrolling="no" frameBorder="0" allowFullScreen loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" /></div>
            </div>
          </div>
        </section>

        <section className="home-section home-journal" id="journal">
          <div className="section-wrap">
            <div className="home-section-heading"><div><p>04 / Learning journal</p><h2>Useful ideas.<br /><em>Academy news.</em></h2></div><span>Guides and updates designed to help students make better learning decisions.</span></div>
            <div className="category-tabs" role="tablist" aria-label="Story categories">{categories.map((category) => <button role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)} key={category}>{category}</button>)}</div>
            <div className="home-article-grid">{filteredArticles.map((article) => <article key={article.slug}><button className="home-article-image" onClick={() => openArticle(article)}><img src={article.image} alt="" /><span>{article.category}</span></button><div className="article-meta"><span>{article.category}</span><time>{article.date}</time></div><h3>{article.title}</h3><p>{article.excerpt}</p><button className="home-read-more" onClick={() => openArticle(article)}>Read article <ArrowUpRight size={15} /></button></article>)}</div>
          </div>
        </section>

        <section className="home-contact" id="contact">
          <div className="section-wrap"><div className="home-contact-heading"><p>05 / Admissions & location</p><h2>Take your<br /><em>next step.</em></h2><span>Ask about programs, batch timings and admissions—or get directions to our Lahore campus.</span></div><div className="home-contact-grid"><a href={facebookSocial.href} target="_blank" rel="noreferrer"><Users size={28} /><span><small>Admissions enquiries</small><strong>Message us on Facebook</strong></span><ArrowUpRight size={20} /></a><a href={academy.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={28} /><span><small>Visit the academy</small><strong>{academy.address}</strong></span><ArrowUpRight size={20} /></a></div></div>
        </section>
      </main>

      <footer className="home-footer"><div className="section-wrap home-footer-top"><a className="course-brand" href="/"><img src="/images/icon-academy-logo.png" alt="" /><span>The Icon Academy<small>Lahore</small></span></a><p>Academic learning and practical computer training in Lahore.</p><div>{socialLinks.map(({ label, href }) => { const Icon = socialIcons[label]; return <a href={href} target="_blank" rel="noreferrer" aria-label={label} key={label}><Icon size={17} /></a>; })}</div></div><div className="section-wrap home-footer-bottom"><span>© {new Date().getFullYear()} The Icon Academy</span><span>Learn skills. Build your future.</span><a href={academy.mapsUrl} target="_blank" rel="noreferrer">Google Maps <ArrowUpRight size={13} /></a></div></footer>

      {selectedArticle && <div className="modal-backdrop" role="presentation" onMouseDown={closeArticle}><article className="article-modal" role="dialog" aria-modal="true" aria-label={selectedArticle.title} onMouseDown={(event) => event.stopPropagation()}><div className="modal-actions"><button aria-label="Share story" onClick={shareArticle}><LinkIcon size={18} /><span>{copied ? 'Copied' : 'Share'}</span></button><button aria-label="Close story" onClick={closeArticle}><X size={20} /></button></div><img src={selectedArticle.image} alt="" /><div className="modal-content"><div className="article-meta"><span>{selectedArticle.category}</span><span>{selectedArticle.date} · {selectedArticle.readTime}</span></div><h2>{selectedArticle.title}</h2><p className="article-lead">{selectedArticle.excerpt}</p>{selectedArticle.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article></div>}
    </div>
  );
}

export default App;
