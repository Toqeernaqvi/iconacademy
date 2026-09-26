import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { testimonials } from './content/siteContent';

function Rating({ value }) {
  return <div className="review-rating" aria-label={`${value} out of 5 stars`}>
    <span className="review-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <span className="review-star" key={index}>
      <Star size={16} /><span style={{ width: `${Math.min(1, Math.max(0, value - index)) * 100}%` }}><Star size={16} /></span>
    </span>)}</span><strong aria-hidden="true">{value.toFixed(1)}</strong>
  </div>;
}

export default function Testimonials() {
  const trackRef = useRef(null);
  const [position, setPosition] = useState(0);
  const reviews = testimonials.filter((review) => review.isSample === false);
  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children);
    const next = Math.max(0, Math.min(cards.length - 1, position + direction));
    track.scrollTo({ left: cards[next].offsetLeft - cards[0].offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const syncPosition = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children);
    let nearest = 0;
    cards.forEach((card, index) => {
      if (Math.abs(card.offsetLeft - cards[0].offsetLeft - track.scrollLeft) < Math.abs(cards[nearest].offsetLeft - cards[0].offsetLeft - track.scrollLeft)) nearest = index;
    });
    setPosition(nearest);
  };
  if (!reviews.length) return null;
  return <section className="online-testimonials" aria-labelledby="testimonials-heading">
    <div className="section-wrap">
      <div className="online-section-heading"><div><p className="online-eyebrow">Learner feedback</p><h2 id="testimonials-heading">Learning journeys.<br /><em>In their words.</em></h2></div><p>Feedback from learners, with the original source where available.</p></div>
      <div className="review-slider" id="testimonial-cards" ref={trackRef} onScroll={syncPosition} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Student reviews" onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
      }}>
        {reviews.map((review, index) => <article className="review-card" key={review.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${reviews.length}`}>
          <div className="review-top">{Number.isFinite(review.rating) ? <Rating value={review.rating} /> : <span>{review.sourceLabel || 'Learner feedback'}</span>}<Quote size={24} aria-hidden="true" /></div>
          <blockquote>{review.quote}</blockquote>
          <div className="review-author"><span className="review-avatar" aria-hidden="true">{review.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><strong>{review.name}</strong><small>{review.course}</small></div></div>
          {review.sourceUrl && <a className="review-source" href={review.sourceUrl} target="_blank" rel="noreferrer">{review.sourceLabel || 'View original feedback'} <ArrowRight size={14} /></a>}
        </article>)}
      </div>
      {reviews.length > 1 && <div className="review-controls"><span aria-live="polite">{position + 1} / {reviews.length}</span><div><button type="button" onClick={() => move(-1)} disabled={position === 0} aria-label="Previous review" aria-controls="testimonial-cards"><ArrowLeft size={20} /></button><button type="button" onClick={() => move(1)} disabled={position === reviews.length - 1} aria-label="Next review" aria-controls="testimonial-cards"><ArrowRight size={20} /></button></div></div>}
    </div>
  </section>;
}
