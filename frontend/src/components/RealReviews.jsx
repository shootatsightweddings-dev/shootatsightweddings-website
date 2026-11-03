import { realReviews, SOURCE_URL } from '../data/realReviews';
import './RealReviews.css';

const Star = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const RatingStars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  return (
    <div className="rr-stars" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} filled={i < full || (i === full && half)} />
      ))}
    </div>
  );
};

const RealReviews = () => (
  <section className="real-reviews-section section-padding">
    <div className="container">
      <div className="rr-header">
        <span className="subtitle-accent">VERIFIED CLIENT REVIEWS</span>
        <h2 className="section-title-large">5.0 from 83 reviews</h2>
        <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="rr-source-link">
          See all reviews on WedMeGood &rarr;
        </a>
      </div>

      <div className="rr-grid">
        {realReviews.map((r) => (
          <div className="rr-card" key={r.name}>
            <RatingStars rating={r.rating} />
            <p className="rr-quote">&ldquo;{r.quote}&rdquo;</p>
            <div className="rr-meta">
              <span className="rr-name">{r.name}</span>
              <span className="rr-dot">&middot;</span>
              <span className="rr-date">{r.relativeDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default RealReviews;
