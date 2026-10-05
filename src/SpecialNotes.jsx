import { useEffect, useState } from 'react';
import { ArrowDownToLine, BookOpen, FileText, GraduationCap } from 'lucide-react';
import { academy } from './content/siteContent';
import { readNotes } from './notesStore';

const classes = [
  { id: '9', label: 'Class 9', year: 'Matric · Part I', notes: [] },
  { id: '10', label: 'Class 10', year: 'Matric · Part II', notes: [] },
  { id: '11', label: 'Class 11', year: 'Intermediate · Part I' },
  { id: '12', label: 'Class 12', year: 'Intermediate · Part II' },
];

export default function SpecialNotes() {
  const [notes, setNotes] = useState(readNotes);
  useEffect(() => {
    const refresh = () => setNotes(readNotes());
    window.addEventListener('icon-academy-notes-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('icon-academy-notes-updated', refresh); window.removeEventListener('storage', refresh); };
  }, []);
  return <main className="notes-page">
    <section className="notes-hero">
      <div className="section-wrap notes-hero-inner">
        <a className="academic-back" href="/">← Back to home</a>
        <div className="notes-hero-grid">
          <div><p className="course-eyebrow"><BookOpen size={15} /> ICON ACADEMY STUDY LIBRARY</p><h1>Special notes for<br /><em>stronger learning.</em></h1><p className="academic-intro">Download class-wise study material and guess papers prepared by The Icon Academy to support your learning and exam preparation.</p><a className="course-button course-button-primary" href="#notes-library">Browse class notes <ArrowDownToLine size={17} /></a></div>
          <div className="notes-hero-card"><div className="notes-card-icon"><GraduationCap size={31} /></div><span>YOUR LEARNING, ORGANIZED</span><strong>One library.<br />Four classes.</strong><p>Choose your class to explore available subject notes.</p><div className="notes-class-chips">{classes.map(item => <span key={item.id}>{item.id}<sup>th</sup></span>)}</div></div>
        </div>
      </div>
    </section>
    <section className="section-wrap notes-library" id="notes-library">
      <div className="notes-heading"><div><p className="course-eyebrow">STUDY MATERIAL / 01</p><h2>Available class notes.</h2></div><p>All uploaded resources are listed below. Choose a PDF to download it.</p></div>
      {classes.map(item => {
        const classNotes = notes.filter(note => note.classId === item.id);
        if (!classNotes.length) return null;
        return <section className="notes-class-section" key={item.id} aria-labelledby={`notes-class-${item.id}`}>
          <div className="notes-results-heading"><div><span className="notes-class-number">{item.id}</span><div><p className="course-eyebrow">{item.year}</p><h3 id={`notes-class-${item.id}`}>{item.label} notes</h3></div></div><span>{classNotes.length} {classNotes.length === 1 ? 'resource' : 'resources'}</span></div>
          <div className="notes-subject-grid">{classNotes.map((note, index) => <article className="notes-subject" key={note.id}><div className="notes-subject-top"><span>{String(index + 1).padStart(2, '0')}</span><FileText size={20} /></div><h4>{note.subject}</h4><p>{note.title}</p><a href={note.fileData || note.url} download={note.fileName || true}>Download PDF <ArrowDownToLine size={15} /></a></article>)}</div>
        </section>;
      })}
      <p className="notes-help">Looking for notes for another class or subject? <a href={`https://wa.me/${academy.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum, I am looking for Icon Academy study notes.')}`} target="_blank" rel="noreferrer">Ask the academy</a>.</p>
    </section>
    <section className="notes-how"><div className="section-wrap notes-how-inner"><div><p className="course-eyebrow">HOW IT WORKS</p><h2>Pick a class.<br /><em>Find your subject.</em></h2></div><p>Browse the class-wise resources above and download the subject PDF you need. We’ll keep adding useful material as it becomes available.</p></div></section>
  </main>;
}
