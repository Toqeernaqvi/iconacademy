import { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, CheckCircle2, MapPin } from 'lucide-react';
import { academy, programs, academicProgramDetails } from './content/siteContent';

export default function ProgramPage({ slug }) {
  const program = programs.find((item) => item.href === `/${slug}`);
  const details = academicProgramDetails[slug];
  const enquiryHref = `https://wa.me/${academy.whatsappNumber}?text=${encodeURIComponent(`Assalam-o-Alaikum, I would like details about the ${program.title} program. Please share subjects, admission details, timings and fees.`)}`;
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.content;
    document.title = `${program.title} Program | Icon Academy Lahore`;
    if (meta) meta.content = program.description;
    return () => { document.title = previousTitle; if (meta) meta.content = previousDescription; };
  }, [program]);

  return <main className="academic-page">
    <section className="academic-hero section-wrap">
      <a className="academic-back" href="/#programs"><ArrowLeft size={16} /> All programs</a>
      <div className="academic-hero-grid">
        <div><p className="course-eyebrow">{program.number} / {program.title} at The Icon Academy</p><h1>{details.headline}<br /><em>{details.accent}</em></h1><p className="academic-intro">{details.introduction}</p><div className="course-hero-actions"><a className="course-button course-button-primary" href={enquiryHref} target="_blank" rel="noreferrer">Enquire about admissions <ArrowUpRight size={17} /></a><a className="academic-back" href="#learning-focus">Explore learning focus <ArrowUpRight size={17} /></a></div></div>
        <aside className="academic-overview"><BookOpen size={36} aria-hidden="true" /><p className="course-eyebrow">Your learning path</p><h2>{program.title}</h2><p>{details.audience}</p><ul>{program.tags.map((tag) => <li key={tag}><CheckCircle2 size={18} />{tag}</li>)}</ul><a className="academic-back" href={academy.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={18} /> Rizwan Garden, Lahore <ArrowUpRight size={16} /></a></aside>
      </div>
    </section>
    <section className="section-wrap academic-focus" id="learning-focus"><p className="course-eyebrow">A stronger foundation, step by step</p><h2>Learning with a clear focus.</h2><div className="academic-focus-grid">{details.focus.map((item, index) => <article key={item.title}><span className="home-program-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>
    <section className="section-wrap academic-admissions"><div><p className="course-eyebrow">Let’s plan your next step</p><h2>Talk to our admissions team.</h2><p>{details.enquiry}</p><p>Confirm current subjects, availability, class timings and fees before enrolling.</p></div><a className="course-button course-button-primary" href={enquiryHref} target="_blank" rel="noreferrer">Ask on WhatsApp <ArrowUpRight size={18} /></a></section>
    <nav className="section-wrap academic-related" aria-label="Other programs"><p className="course-eyebrow">Explore other programs</p><div>{programs.filter((item) => item !== program).map((item) => <a key={item.href} href={item.href}>{item.title}<ArrowUpRight size={18} /></a>)}</div></nav>
  </main>;
}
