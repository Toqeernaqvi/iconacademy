import { useState } from 'react';
import { flushSync } from 'react-dom';
import Testimonials from './Testimonials';
import { ArrowUpRight, ArrowRight, BookOpen, CheckCircle2, MonitorPlay, GraduationCap, MessageCircleMore, Sparkles, Code2 } from 'lucide-react';
import { academy, computerCourses, onlineTutoring } from './content/siteContent';

const enquiryLink = (subject) => `https://wa.me/${academy.whatsappNumber}?text=${encodeURIComponent(`Assalam-o-Alaikum, I would like details about online ${subject} at The Icon Academy. Please share availability, timings and fees.`)}`;
const categories = ['All courses', ...new Set(computerCourses.map((course) => course.category).filter(Boolean))];

function CourseMark({ course, size = 40 }) {
  return course.technologies?.length
    ? <img src={course.technologies[0].image} alt={course.technologies[0].name} width={size} height={size} />
    : <MessageCircleMore size={size} aria-hidden="true" />;
}

export default function OnlineTutoring() {
  const [category, setCategory] = useState('All courses');
  const visibleCourses = computerCourses.filter((course) => category === 'All courses' || course.category === category);
  return <main className="online-page">
    <section className="online-hero">
      <div className="section-wrap online-hero-grid">
        <div className="online-hero-copy">
          <p className="online-eyebrow"><span />{onlineTutoring.eyebrow}</p>
          <h1>{onlineTutoring.title}<br /><em>{onlineTutoring.titleAccent}</em></h1>
          <p className="online-intro">{onlineTutoring.description}</p>
          <div className="course-hero-actions">
            <a className="course-button course-button-primary" href="#online-courses">Find your course <ArrowUpRight size={18} /></a>
            <a className="online-text-link" href={enquiryLink('courses')} target="_blank" rel="noreferrer">Talk to our team <ArrowRight size={17} /></a>
          </div>
          <div className="online-hero-notes"><span><MonitorPlay size={17} /> Learn from home</span><span><Code2 size={17} /> Build practical skills</span></div>
        </div>
        <div className="online-showcase" onClick={(event) => {
          if (event.target.closest('a[href^="#online-course-"]')) flushSync(() => setCategory('All courses'));
        }}>
          <div className="online-window-bar"><span><i /><i /><i /></span><small>YOUR NEXT SKILL STARTS HERE</small><MonitorPlay size={16} /></div>
          <div className="online-featured">
            <span className="online-featured-label"><Sparkles size={14} /> Explore a learning path</span>
            <div className="online-featured-symbol"><img src="/images/technologies/react.svg" alt="React" width="72" height="72" /><span>&lt;/&gt;</span></div>
            <p>BUILD · CREATE · GROW</p><h2>From your first line<br />to your next big idea.</h2>
            <div className="online-stack">{computerCourses[0].technologies.map((tech) => <span key={tech.name}><img src={tech.image} alt="" width="19" height="19" />{tech.name}</span>)}</div>
            <a href="#online-course-08">Explore web development <ArrowUpRight size={18} /></a>
          </div>
          <div className="online-mini-paths">{computerCourses.filter((course) => ['python', 'video'].includes(course.icon)).map((course) => <a key={course.code} href={`#online-course-${course.code}`}><CourseMark course={course} size={27} /><span><small>{course.category}</small><strong>{course.icon === 'python' ? 'Start coding' : 'Create something'}</strong></span><ArrowUpRight size={17} /></a>)}</div>
        </div>
      </div>
    </section>

    <div className="online-path-band"><div className="section-wrap"><span><strong>{String(computerCourses.length).padStart(2, '0')}</strong> online courses</span><p>Development <i /> Marketing <i /> Creative skills <i /> Communication</p><a href="#online-courses">Choose your direction <ArrowRight size={17} /></a></div></div>

    <section className="section-wrap online-catalog" id="online-courses">
      <div className="online-section-heading"><div><p className="online-eyebrow">A skill today. More possibilities tomorrow.</p><h2>What will you<br /><em>learn next?</em></h2></div><p>Explore a path that interests you. Ask our team about online batches, timings and fees before you get started.</p></div>
      <div className="online-filters" role="group" aria-label="Filter courses by category">{categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <p className="online-course-count" aria-live="polite">{visibleCourses.length} {visibleCourses.length === 1 ? 'course' : 'courses'} to explore</p>
      <div className="online-course-grid">
        {visibleCourses.map((course) => <article className={`online-course-card online-tone-${course.icon}`} id={`online-course-${course.code}`} key={course.code}>
          <div className="online-card-art"><span className="online-category">{course.category}</span><div className="online-logo-tile"><CourseMark course={course} size={54} /></div><span className="online-art-word" aria-hidden="true">{({ code: '</>', python: 'Py', cpp: 'C++', marketing: 'Reach.', spoken: 'Hello!', video: 'Create.' })[course.icon]}</span><span className="online-format"><MonitorPlay size={13} /> Online learning</span></div>
          <div className="online-card-copy"><h3>{course.title}</h3><p>{course.description}</p>
            <ul>{course.topics.slice(0, 3).map((topic) => <li key={topic}><CheckCircle2 size={15} />{topic}</li>)}</ul>
            <details><summary>View full course topics</summary><ul>{course.topics.slice(3).map((topic) => <li key={topic}><CheckCircle2 size={15} />{topic}</li>)}</ul></details>
            <a href={enquiryLink(`${course.title} classes`)} target="_blank" rel="noreferrer">Enquire about this course <ArrowUpRight size={17} /></a>
          </div>
        </article>)}
      </div>
    </section>

    <section className="section-wrap online-guidance"><div className="online-guidance-icon"><MessageCircleMore size={38} /></div><div><p className="online-eyebrow">A little guidance goes a long way</p><h2>Not sure where to start?</h2><p>Tell us your interests and experience. Let’s find a course that fits your next step.</p></div><a className="course-button" href={enquiryLink('course guidance')} target="_blank" rel="noreferrer">Help me choose <ArrowUpRight size={18} /></a></section>

    <Testimonials />

    <section className="section-wrap online-school" id="online-classes">
      <div><p className="online-eyebrow"><GraduationCap size={18} /> School support, too</p><h2>Every class.<br />A stronger foundation.</h2><p>Looking for academic support? We also offer online tutoring. Share your class, board and subjects with our team.</p></div>
      <div className="online-school-list">{onlineTutoring.classes.map((item) => <a key={item.title} href={enquiryLink(`tutoring for ${item.title}`)} target="_blank" rel="noreferrer"><BookOpen size={20} /><span><strong>{item.title}</strong><small>{item.detail}</small></span><ArrowUpRight size={18} /></a>)}</div>
    </section>

    <section className="section-wrap online-start"><p className="online-eyebrow">Your next step is simple</p><h2>Let’s get you learning.</h2><ol>{onlineTutoring.steps.map((step, index) => <li key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></section>
  </main>;
}
