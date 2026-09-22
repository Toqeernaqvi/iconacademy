import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { academy, socialLinks, teamMembers } from './content/siteContent';
import ThemeToggle from './ThemeToggle';

function OurTeam() {
  const facebook = socialLinks.find((social) => social.label === 'Facebook');

  return (
    <div className="team-page">
      <header className="course-header team-header">
        <a className="course-brand" href="/" aria-label="Icon Academy home">
          <img src="/images/icon-academy-logo.png" alt="" />
          <span>The Icon Academy<small>Lahore</small></span>
        </a>
        <nav aria-label="Our team navigation">
          <a href="#leadership">Leadership</a>
          <a href="#values">Our values</a>
          <a href="#team-contact">Contact</a>
        </nav>
        <ThemeToggle />
        <a className="course-back" href="/"><ArrowLeft size={16} /> Main website</a>
      </header>

      <main>
        <section className="team-hero">
          <div className="course-angle course-angle-blue" />
          <div className="course-angle course-angle-red" />
          <div className="section-wrap team-hero-grid">
            <div className="team-hero-copy">
              <p className="course-eyebrow"><Sparkles size={15} /> The people behind our purpose</p>
              <h1>Leadership<br />with <em>purpose.</em></h1>
              <p>Meet the people guiding The Icon Academy with a shared commitment to quality education, practical skills and stronger opportunities for every student.</p>
              <a className="course-button course-button-primary" href="#leadership">Meet our leadership <ArrowUpRight size={17} /></a>
            </div>
            <div className="team-hero-panel">
              <div className="team-hero-logo"><img src="/images/icon-academy-logo.png" alt="The Icon Academy crest" /></div>
              <div><strong>{String(teamMembers.length).padStart(2, '0')}</strong><span>Leadership team members</span></div>
              <p>One vision: helping learners build confidence, capability and a better future.</p>
            </div>
          </div>
        </section>

        <section className="team-roster" id="leadership">
          <div className="section-wrap">
            <div className="team-page-heading"><div><p>Our leadership</p><h2>Guiding the<br /><em>Icon community.</em></h2></div><span>Experienced leadership, a student-first mindset and a clear focus on academic and professional growth.</span></div>
            <div className="home-team-grid">
              {teamMembers.map((member, index) => (
                <article className="home-team-card" key={member.name}>
                  <div className="home-team-photo"><img src={member.image} alt={`${member.name}, ${member.designation}`} style={{ objectPosition: member.imagePosition }} /></div>
                  <div className="home-team-copy"><span>0{index + 1}</span><h3>{member.name}</h3><strong>{member.designation}</strong><p>{member.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="team-values" id="values">
          <div className="section-wrap team-values-grid">
            <div><p className="course-eyebrow"><Sparkles size={15} /> What guides our work</p><h2>Standards that shape<br />every learning experience.</h2></div>
            <div className="team-value-list">
              <span><CheckCircle2 size={19} /><strong>Student-first leadership</strong><small>Decisions centred on student progress, confidence and wellbeing.</small></span>
              <span><CheckCircle2 size={19} /><strong>Practical education</strong><small>Learning connected with useful skills and real opportunities.</small></span>
              <span><CheckCircle2 size={19} /><strong>Consistent quality</strong><small>Clear academic standards across programs and classrooms.</small></span>
            </div>
          </div>
        </section>

        <section className="team-contact" id="team-contact">
          <div className="section-wrap team-contact-grid">
            <div><p>Connect with The Icon Academy</p><h2>Let’s help you find<br />your next step.</h2></div>
            <div>
              <a href={facebook.href} target="_blank" rel="noreferrer"><UsersRound size={22} /><span><small>Admissions & enquiries</small><strong>Message us on Facebook</strong></span><ArrowUpRight size={18} /></a>
              <a href={academy.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={22} /><span><small>Rizwan Garden Campus</small><strong>Open Google Maps directions</strong></span><ArrowUpRight size={18} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="course-footer"><div className="section-wrap"><span>The Icon Academy</span><small>Learn today. Lead tomorrow.</small><a href="/">Back to main website <ArrowUpRight size={15} /></a></div></footer>
    </div>
  );
}

export default OurTeam;
