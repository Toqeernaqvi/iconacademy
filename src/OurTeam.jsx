import SocialIcon from './SocialIcon';
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { academy, facultyMembers, socialLinks, teamMembers } from './content/siteContent';

function OurTeam() {
  const facebook = socialLinks.find((social) => social.label === 'Facebook');

  return (
    <div className="team-page">
      <main>
        <section className="team-hero">
          <div className="course-angle course-angle-blue" />
          <div className="course-angle course-angle-red" />
          <div className="section-wrap team-hero-grid">
            <div className="team-hero-copy">
              <p className="course-eyebrow"><Sparkles size={15} /> The people behind our purpose</p>
              <h1>Our team.<br /><em>One purpose.</em></h1>
              <p>Meet the people guiding The Icon Academy with a shared commitment to quality education, practical skills and stronger opportunities for every student.</p>
              <a className="course-button course-button-primary" href="#leadership">Meet our team <ArrowUpRight size={17} /></a>
            </div>
            <div className="team-hero-panel">
              <div className="team-hero-logo"><img src="/images/icon-academy-logo.png" alt="The Icon Academy crest" /></div>
              <div><strong>{String(teamMembers.length + facultyMembers.length).padStart(2, '0')}</strong><span>Leaders & teachers</span></div>
              <p>One vision: helping learners build confidence, capability and a better future.</p>
            </div>
          </div>
        </section>

        <section className="team-roster team-leadership" id="leadership">
          <div className="section-wrap">
            <div className="team-page-heading"><div><p>Our leadership</p><h2>Guiding the<br /><em>Icon community.</em></h2></div><span>Experienced leadership, a student-first mindset and a clear focus on academic and professional growth.</span></div>
            <div className="home-team-grid">
              {teamMembers.map((member) => (
                <article className="home-team-card" key={member.name}>
                  <div className="home-team-photo"><img src={member.image} alt={`${member.name}, ${member.designation}`} style={{ objectPosition: member.imagePosition, scale: member.imageScale, transformOrigin: member.imageOrigin }} /></div>
                  <div className="home-team-copy"><span>Academy leadership</span><h3>{member.name}</h3><strong>{member.designation}</strong><p>{member.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="team-roster team-faculty" id="faculty" aria-labelledby="faculty-heading">
          <div className="section-wrap">
            <div className="team-page-heading"><div><p>Our teachers</p><h2 id="faculty-heading">Meet our<br /><em>faculty.</em></h2></div><span>The teachers behind your learning journey at The Icon Academy.</span></div>
            <div className="faculty-grid">
              {facultyMembers.map((member) => (
                <article className="faculty-card" key={member.name}>
                  <div className="faculty-avatar"><img src={member.image} alt={member.image.endsWith('teacher-placeholder.svg') ? `Placeholder avatar for ${member.name}` : member.name} loading="lazy" /></div>
                  <div className="faculty-info"><p>{member.designation}</p><h3>{member.name}</h3></div>
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
              <a href={facebook.href} target="_blank" rel="noreferrer"><SocialIcon platform="Facebook" size={22} /><span><small>Admissions & enquiries</small><strong>Message us on Facebook</strong></span><ArrowUpRight size={18} /></a>
              <a href={academy.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={22} /><span><small>Rizwan Garden Campus</small><strong>Open Google Maps directions</strong></span><ArrowUpRight size={18} /></a>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}

export default OurTeam;
