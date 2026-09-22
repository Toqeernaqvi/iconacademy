import {
  ArrowLeft,
  ArrowUpRight,
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  CirclePlay,
  Code2,
  FileDown,
  Laptop,
  MapPin,
  Megaphone,
  MessageCircleMore,
  MonitorPlay,
  Phone,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';
import { academy, computerCourses, courseContacts, globalPartner } from './content/siteContent';
import ThemeToggle from './ThemeToggle';

const courseIcons = {
  code: Code2,
  python: TerminalSquare,
  cpp: Laptop,
  marketing: Megaphone,
  spoken: MessageCircleMore,
  video: MonitorPlay,
};

function ComputerCourses() {
  return (
    <div className="courses-page">
      <header className="course-header">
        <a className="course-brand" href="/" aria-label="Icon Academy home">
          <img src="/images/icon-academy-logo.png" alt="" />
          <span>The Icon Academy<small>Lahore</small></span>
        </a>
        <nav aria-label="Computer courses navigation">
          <a href="#courses">Courses</a>
          <a href="#why-icon">Why Icon</a>
          <a href="#course-contact">Contact</a>
        </nav>
        <ThemeToggle />
        <a className="course-back" href="/"><ArrowLeft size={16} /> Main website</a>
      </header>

      <main>
        <section className="course-hero">
          <div className="course-angle course-angle-blue" />
          <div className="course-angle course-angle-red" />
          <div className="course-hero-inner section-wrap">
            <div className="course-hero-copy">
              <p className="course-eyebrow"><Sparkles size={15} /> Professional courses & fee structure</p>
              <h1>Learn skills.<br /><em>Build your future.</em></h1>
              <p>Practical, career-focused learning in web development, programming, marketing, communication and creative technology.</p>
              <div className="course-hero-actions">
                <a className="course-button course-button-primary" href="#courses">Explore courses <ArrowUpRight size={17} /></a>
                <a className="course-button course-button-secondary" href="/images/computer-courses-brochure.png" target="_blank" rel="noreferrer">View brochure <FileDown size={17} /></a>
                <a className="course-button course-button-youtube" href={globalPartner.youtube} target="_blank" rel="noreferrer"><CirclePlay size={17} /> Watch on YouTube</a>
              </div>
            </div>
            <div className="course-hero-seal">
              <div className="seal-rings"><img src="/images/icon-academy-logo.png" alt="The Icon Academy" /></div>
              <div className="hero-fee-note"><span>Special fee</span><strong>Rs. 5,000</strong><small>per month after discount</small></div>
            </div>
          </div>
        </section>

        <section className="course-catalog section-wrap" id="courses">
          <div className="course-section-heading">
            <div><p>Choose your path</p><h2>Professional courses</h2></div>
            <span>Six practical ways to start building skills that matter.</span>
          </div>
          <div className="course-grid">
            {computerCourses.map((course) => {
              const Icon = courseIcons[course.icon];
              return (
                <article className="course-detail-card" key={course.code}>
                  <span className="course-code">{course.code}</span>
                  <div className="course-icon"><Icon size={30} /></div>
                  <h3>{course.title}</h3>
                  <div className="course-facts">
                    <p><CalendarDays size={16} /><span>Duration</span><strong>{course.duration}</strong></p>
                    <p><BadgePercent size={16} /><span>Regular fee</span><strong>{course.regularFee}</strong></p>
                  </div>
                  <div className="discount-price"><small>After discount</small><strong>{course.discountedFee}</strong></div>
                  <div className="course-topics"><span>What you will learn</span><ul>{course.topics.map((topic) => <li key={topic}><CheckCircle2 size={13} /> {topic}</li>)}</ul></div>
                  <a href={`https://wa.me/${courseContacts[0].whatsapp}?text=${encodeURIComponent(`Assalam-o-Alaikum, I want details about the ${course.title} course.`)}`} target="_blank" rel="noreferrer">Ask about this course <ArrowUpRight size={15} /></a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="course-youtube-section">
          <a className="section-wrap course-youtube-card" href={globalPartner.youtube} target="_blank" rel="noreferrer">
            <div className="course-youtube-icon"><CirclePlay size={38} /></div>
            <div><p>Learn beyond the classroom</p><h2>Watch practical coding lessons on Code With Naqvi.</h2><span>Web development, programming concepts and career-focused technology content.</span></div>
            <strong>Visit YouTube <ArrowUpRight size={18} /></strong>
          </a>
        </section>

        <section className="tools-section" id="why-icon">
          <div className="section-wrap">
            <div className="tools-band">
              <div><span>Creative tools</span><h2>Design, edit and create with confidence.</h2></div>
              <div className="tool-pills"><span>Canva</span><span>Adobe XD</span><span>AI tools</span><span>Filmora</span></div>
            </div>
            <div className="why-course-grid">
              <div><p className="course-eyebrow"><Sparkles size={15} /> Why choose The Icon Academy?</p><h2>Training designed for the real world.</h2></div>
              <div className="why-list">
                {['Practical training', 'Real projects', 'AI-integrated learning', 'Freelancing guidance', 'Career-focused courses'].map((item) => <span key={item}><CheckCircle2 size={18} /> {item}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section className="course-contact-section" id="course-contact">
          <div className="section-wrap course-contact-layout">
            <div className="course-contact-copy"><p>Admissions & information</p><h2>Ready to start<br />your course?</h2><span>Contact our instructors for batch timings, admission details and guidance on choosing the right course.</span></div>
            <div className="course-contact-panel">
              {courseContacts.map((contact) => (
                <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" key={contact.phone}>
                  <div className="contact-avatar"><Phone size={20} /></div><span><strong>{contact.name}</strong><small>{contact.qualification}</small><b>{contact.phone}</b></span><ArrowUpRight size={18} />
                </a>
              ))}
              <a className="course-address" href={academy.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={22} /><span><strong>Campus address</strong><small>{academy.address}</small><b>Open directions in Google Maps</b></span><ArrowUpRight size={18} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="course-footer"><div className="section-wrap"><span>The Icon Academy</span><small>Learn skills. Build your future.</small><a href="/">Back to main website <ArrowUpRight size={15} /></a></div></footer>
    </div>
  );
}

export default ComputerCourses;
