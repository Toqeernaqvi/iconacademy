import SocialIcon from './SocialIcon';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Sparkles,
} from 'lucide-react';
import { articles, globalPartner, programs, socialLinks } from './content/siteContent';

const categories = ['All stories', ...new Set(articles.map((article) => article.category))];

function App() {
  const [activeCategory, setActiveCategory] = useState('All stories');
  const partnerRef = useRef(null);

  useEffect(() => {
    const section = partnerRef.current;
    if (!section || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      section.classList.toggle('is-in-view', entry.isIntersecting);
      if (entry.isIntersecting) section.classList.add('has-entered');
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const filteredArticles = useMemo(
    () => activeCategory === 'All stories' ? articles : articles.filter((article) => article.category === activeCategory),
    [activeCategory],
  );

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  const facebookSocial = socialLinks.find((social) => social.label === 'Facebook');

  return (
    <div className="home-page-v2">
      <main>
        <section className="home-hero">
          <div className="course-angle course-angle-blue" /><div className="course-angle course-angle-red" />
          <div className="section-wrap home-hero-grid">
            <div className="home-hero-copy">
              <p className="course-eyebrow"><Sparkles size={15} /> Icon Academy · Rizwan Garden, Lahore</p>
              <h1>Learn today.<br /><em>Lead tomorrow.</em></h1>
              <p>Tuition for Kids, Matric and Intermediate students in Rizwan Garden, Lahore, plus practical computer courses and online tutoring to build academic confidence and career-ready skills.</p>
              <div className="course-hero-actions"><button className="course-button course-button-primary" onClick={() => scrollTo('programs')}>Explore programs <ArrowUpRight size={17} /></button><a className="course-button course-button-secondary" href="/computer-courses">View computer courses <Code2 size={17} /></a><a className="course-button course-button-secondary" href="/online-tutoring">Online tutoring <ArrowUpRight size={17} /></a></div>
              <div className="home-hero-points"><span><CheckCircle2 size={15} /> Guided learning</span><span><CheckCircle2 size={15} /> Practical skills</span><span><CheckCircle2 size={15} /> Career pathways</span></div>
            </div>
            <div className="home-hero-visual">
              <div className="home-photo-frame"><img src="/images/pakistani-students-hero.jpg" alt="Illustrative scene of Pakistani students learning together at a laptop" width="1254" height="1254" fetchPriority="high" /><div className="home-photo-label"><strong>Learn skills.</strong><span>Build your future.</span></div></div>
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
                  <a href={program.href}>{program.title === 'Computer Courses' ? 'View all courses' : 'Explore program'} <ArrowUpRight size={17} /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-course-banner"><div className="section-wrap home-course-banner-grid"><div><p>Professional computer training</p><h2>Six courses. Practical projects. Skills you can use.</h2></div><div className="home-course-list"><span>Full Stack Web Development</span><span>Python Programming</span><span>C++ Programming</span><span>Digital Marketing</span><span>Spoken English</span><span>Video Editing</span></div><a href="/computer-courses">Explore fees & course details <ArrowUpRight size={18} /></a></div></section>

        <section className="home-section home-partner" id="partner" ref={partnerRef}>
          <div className="section-wrap home-partner-grid">
            <div className="home-partner-brand"><div className="home-partner-logo"><img src={globalPartner.logo} alt="CWN Solutions" /></div><span>Global career partner</span></div>
            <div className="home-partner-copy"><p>02 / {globalPartner.eyebrow}</p><h2>From classroom<br />to <em>career.</em></h2><p>{globalPartner.description}</p><p>Through our connection with <strong>{globalPartner.name}</strong>, job-ready web development students can access professional project exposure and career opportunities. Icon Academy students have gone on to land roles with the team.</p><div className="home-partner-points">{globalPartner.highlights.map((item) => <span key={item}><CheckCircle2 size={15} /> {item}</span>)}</div><a href={globalPartner.url} target="_blank" rel="noreferrer">Meet CWN Solutions <ArrowUpRight size={16} /></a></div>
          </div>
        </section>

        <section className="home-section home-connect" id="updates">
          <div className="section-wrap">
            <div className="home-section-heading compact"><div><p>03 / Stay connected</p><h2>Follow the<br /><em>academy.</em></h2></div><span>Lessons, admissions, student work and academy news—wherever you already scroll.</span></div>
            <div className="home-social-grid">{socialLinks.map(({ label, href }) => { return <a href={href} target="_blank" rel="noreferrer" key={label}><SocialIcon platform={label} size={24} /><strong>{label}</strong><ArrowUpRight size={16} /></a>; })}</div>
            <div className="home-facebook-grid">
              <div><p className="course-eyebrow"><SocialIcon platform="Facebook" size={15} /> Live Facebook timeline</p><h3>Latest updates,<br />direct from our page.</h3><p>See current course announcements, admissions information and public posts from Icon Academy Lahore.</p><a className="course-button course-button-primary" href={facebookSocial.href} target="_blank" rel="noreferrer">Open Facebook <ArrowUpRight size={16} /></a></div>
              <div className="facebook-feed"><iframe title="Icon Academy Lahore Facebook updates" src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ficonacademylahore&tabs=timeline&width=500&height=620&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true" width="500" height="620" scrolling="no" frameBorder="0" allowFullScreen loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" /></div>
            </div>
          </div>
        </section>

        <section className="home-section home-journal" id="journal">
          <div className="section-wrap">
            <div className="home-section-heading"><div><p>04 / Learning journal</p><h2>Useful ideas.<br /><em>Academy news.</em></h2></div><span>Guides and updates designed to help students make better learning decisions.</span></div>
            <div className="category-tabs" role="tablist" aria-label="Story categories">{categories.map((category) => <button role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)} key={category}>{category}</button>)}</div>
            <div className="home-article-grid">{filteredArticles.map((article) => <article key={article.slug}><a className="home-article-image" href={`/blog/${article.slug}`} aria-label={article.title}><img src={article.image} alt="" loading="lazy" width="1200" height="630" /><span>{article.category}</span></a><div className="article-meta"><span>{article.category}</span><time dateTime={new Date(`${article.date} UTC`).toISOString().slice(0, 10)}>{article.date}</time></div><h3>{article.title}</h3><p>{article.excerpt}</p><a className="home-read-more" href={`/blog/${article.slug}`}>Read article <ArrowUpRight size={15} /></a></article>)}</div>
          </div>
        </section>


      </main>




    </div>
  );
}

export default App;
