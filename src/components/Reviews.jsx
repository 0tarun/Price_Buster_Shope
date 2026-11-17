import { useEffect, useState } from 'react';
import { ArrowUpRight, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productReviews } from '../data/products';
import './Reviews.css';

const Reviews = () => {
  const [activeReview, setActiveReview] = useState(null);

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

  return (
    <section className="reviews">
      <div className="reviews__header">
        <div>
          <h2>Real finds. Real people.</h2>
          <p>A few favourites, in their own words.</p>
        </div>
        <Link to="/blog" className="reviews__link">
          <span>Explore the journal</span>
          <ArrowUpRight size={10} strokeWidth={2} />
        </Link>
      </div>

      <div className="reviews__grid">
        {productReviews.map(({ image, quote, author, product }) => (
          <article key={product} className="review-card">
            <div className="review-card__media">
              <img src={image} alt={product} loading="lazy" />
              <button type="button" className="review-card__play" aria-label={`Play ${quote}`} onClick={() => setActiveReview({ image, quote, author, product })}>
                <Play size={18} fill="currentColor" strokeWidth={0} />
              </button>
            </div>
            <div className="review-card__caption">
              <p className="review-card__quote">“{quote}”</p>
              <div className="review-card__meta">{author} · {product}</div>
            </div>
          </article>
        ))}
      </div>

      {activeReview ? (
        <div className="video-modal" onClick={() => setActiveReview(null)} role="dialog" aria-modal="true" aria-label="Video preview">
          <div className="video-modal__panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="video-modal__close" onClick={() => setActiveReview(null)} aria-label="Close video preview">
              <X size={18} strokeWidth={2} />
            </button>
            <div className="video-modal__placeholder">
              <Play size={28} fill="currentColor" strokeWidth={0} />
            </div>
            <h3>{activeReview.quote}</h3>
            <p>{activeReview.author} · {activeReview.product}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Reviews;
