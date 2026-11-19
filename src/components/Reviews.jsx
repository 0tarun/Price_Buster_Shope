import { useEffect, useState } from 'react';
import { ArrowUpRight, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHomepageSettings } from '../services/api';
import './Reviews.css';

const Reviews = () => {
  const [videos, setVideos] = useState([]);
  const [activeReview, setActiveReview] = useState(null);

  useEffect(() => {
    let active = true;
    getHomepageSettings()
      .then(({ customerVideos = [] }) => {
        if (active) setVideos(customerVideos);
      })
      .catch(() => {
        if (active) setVideos([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeReview) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveReview(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeReview]);

  if (!videos.length) return null;

  return (
    <section className="reviews">
      <div className="reviews__header">
        <div>
          <h2>Real finds. Real people.</h2>
          <p>A few favourites, in their own words.</p>
        </div>
        <Link to="/blog" className="reviews__link">
          <span>Explore the journal</span>
          <ArrowUpRight size="0.625rem" strokeWidth={2} />
        </Link>
      </div>

      <div className="reviews__grid">
        {videos.map((review) => (
          <article key={review.id} className="review-card">
            <div className="review-card__media">
              <video src={review.videoUrl} aria-label={`${review.product} review by ${review.author}`} preload="metadata" playsInline />
              <button type="button" className="review-card__play" aria-label={`Play ${review.quote}`} onClick={() => setActiveReview(review)}>
                <Play size="1.125rem" fill="currentColor" strokeWidth={0} />
              </button>
            </div>
            <div className="review-card__caption">
              <p className="review-card__quote">“{review.quote}”</p>
              <div className="review-card__meta">{review.author} · {review.product}</div>
            </div>
          </article>
        ))}
      </div>

      {activeReview ? (
        <div className="video-modal" onClick={() => setActiveReview(null)} role="dialog" aria-modal="true" aria-label="Video preview">
          <div className="video-modal__panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="video-modal__close" onClick={() => setActiveReview(null)} aria-label="Close video preview">
              <X size="1.125rem" strokeWidth={2} />
            </button>
            <video className="video-modal__video" controls autoPlay playsInline src={activeReview.videoUrl} />
            <h3>{activeReview.quote}</h3>
            <p>{activeReview.author} · {activeReview.product}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Reviews;
