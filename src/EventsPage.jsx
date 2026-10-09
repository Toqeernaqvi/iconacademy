import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, CalendarDays, Camera, Heart, MapPin, Play, Sparkles } from 'lucide-react';
import { academy } from './content/siteContent';
import { readEvents, subscribeEvents } from './eventsStore';

function eventDate(value) {
  if (!value) return 'Campus celebration';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export default function EventsPage() {
  const [events, setEvents] = useState(readEvents);
  useEffect(() => subscribeEvents(setEvents), []);
  return <main className="events-page">
    <section className="events-hero"><div className="section-wrap">
      <a className="events-back" href="/"><ArrowLeft size={16} /> Back to home</a>
      <div className="events-hero-grid"><div className="events-hero-copy"><p className="course-eyebrow"><Sparkles size={15} /> LIFE AT THE ICON ACADEMY</p><h1>Good days.<br /><em>Great memories.</em></h1><p>Celebrating the people and moments that bring our academy community together.</p><a className="course-button course-button-primary" href="#event-gallery">Explore our events <ArrowUpRight size={17} /></a></div><div className="events-hero-mark"><span>LEARN</span><span>GROW</span><span>CELEBRATE</span><div><Heart size={29} /></div></div></div>
    </div></section>
    <section className="section-wrap events-featured" id="event-gallery">
      <div className="events-section-heading"><div><p className="course-eyebrow">CAMPUS LIFE</p><h2>Our recent<br /><em>celebrations.</em></h2></div><div className="events-heading-side"><p>Little snapshots of the moments, people and celebrations that make life at The Icon Academy special.</p><a href="/admin/events">Manage events <ArrowUpRight size={14} /></a></div></div>
      {events.length ? <div className="events-gallery">{events.map((item, index) => <article className={`event-story-card${index === 0 ? ' event-story-card-featured' : ''}`} key={item.id}>
        <div className="event-story-photo"><img src={item.image} alt={`${item.title} at The Icon Academy`} loading={index < 2 ? 'eager' : 'lazy'} /><span className="event-photo-label"><Camera size={15} /> A moment from our campus</span><span className="event-photo-index">{String(index + 1).padStart(2, '0')}</span></div>
        <div className="event-story-copy"><span className="event-tag"><Sparkles size={14} /> {(item.category || 'ACADEMY EVENT').toUpperCase()}</span><h3>{item.title}</h3><p>{item.description}</p><div className="event-details"><span><CalendarDays size={16} /> {eventDate(item.date)}</span>{item.location && <span><MapPin size={16} /> {item.location}</span>}</div>{item.videoUrl && <a className="event-video-link" href={item.videoUrl} target="_blank" rel="noreferrer"><span className="event-video-link-icon"><Play size={17} fill="currentColor" /></span><span><small>WATCH THE MOMENT</small><strong>View event video</strong></span><ArrowUpRight size={17} /></a>}</div>
      </article>)}</div> : <div className="events-empty"><CalendarDays size={25} /><h3>New memories are on the way.</h3><p>Check back soon for celebrations and snapshots from our campus.</p></div>}
    </section>
    <section className="events-note"><div className="section-wrap"><p className="course-eyebrow">MORE MOMENTS, MORE MEMORIES</p><h2>Every celebration is<br /><em>better together.</em></h2><p>Keep an eye here for more events and snapshots from campus life.</p><a className="course-button course-button-primary" href={`https://wa.me/${academy.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum, I would like to know about upcoming events at The Icon Academy.')}`} target="_blank" rel="noreferrer">Ask about upcoming events <ArrowUpRight size={16} /></a></div></section>
  </main>;
}
