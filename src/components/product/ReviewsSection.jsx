import { useMemo, useState } from 'react';
import { Check, Star, X } from 'lucide-react';

const ratingOptions = [5, 4, 3, 2, 1];

function StarRating({ rating, size = 12, className = '' }) {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div className={`star-rating ${className}`.trim()} aria-label={`Rated ${rating} out of 5`}>
      {stars.map((value) => {
        const filled = value <= Math.round(rating);
        return (
          <Star
            key={`${rating}-${value}`}
            size={size}
            className={filled ? 'star-rating__star star-rating__star--filled' : 'star-rating__star'}
            fill={filled ? 'currentColor' : 'none'}
            strokeWidth={1.8}
          />
        );
      })}
    </div>
  );
}

export function ReviewsSection({ reviews = [], productName, onSubmitReview }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', rating: 5, comment: '' });
  const [errors, setErrors] = useState({});

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;
  }, [reviews]);

  const distribution = useMemo(() => {
    return ratingOptions.map((star) => ({
      star,
      count: reviews.filter((review) => Math.round(Number(review.rating || 0)) === star).length,
    }));
  }, [reviews]);

  const visibleReviews = reviews.slice(0, visibleCount);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Please add your name.';
    if (!form.comment.trim()) nextErrors.comment = 'Your review is missing a comment.';
    if (!form.title.trim()) nextErrors.title = 'Please enter a short review title.';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    await onSubmitReview({
      name: form.name.trim(),
      title: form.title.trim(),
      rating: form.rating,
      text: form.comment.trim(),
    });

    setIsModalOpen(false);
    setForm({ name: '', title: '', rating: 5, comment: '' });
    setErrors({});
  };

  return (
    <section className="product-reviews" id="reviews">
      <div className="product-reviews__header">
        <h2>Kind words from real customers.</h2>
      </div>

      <div className="product-reviews__content">
        <aside className="product-reviews__summary">
          <div className="product-reviews__score-row">
            <span className="product-reviews__score">{averageRating.toFixed(1)}</span>
            <span className="product-reviews__score-label">/ 5</span>
          </div>
          <StarRating rating={averageRating} size={14} className="product-reviews__stars" />
          <p className="product-reviews__count">{reviews.length} reviews</p>

          <div className="product-reviews__distribution">
            {distribution.map(({ star, count }) => (
              <div key={star} className="product-reviews__distribution-row">
                <span>{star}</span>
                <div className="product-reviews__distribution-bar">
                  <span style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="product-reviews__list">
          {visibleReviews.map((review, index) => (
            <article key={`${review.name}-${review.date}-${index}`} className="product-review-card">
              <StarRating rating={review.rating || 5} size={11} />
              <h3>{review.title || 'Loved it'}</h3>
              <p>{review.text}</p>
              <div className="product-review-card__meta">
                <span>{review.name}</span>
                <time>{review.date}</time>
              </div>
              <span className="product-review-card__verified">Verified buyer</span>
            </article>
          ))}

          <div className="product-reviews__actions">
            {visibleCount < reviews.length ? (
              <button type="button" className="product-reviews__more" onClick={() => setVisibleCount((count) => count + 4)}>
                Show more reviews
              </button>
            ) : null}

            <button type="button" className="product-reviews__write" onClick={() => setModalOpen(true)}>
              Write a review
            </button>
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div className="product-review-modal" onClick={() => setModalOpen(false)} role="dialog" aria-modal="true" aria-label="Write a review">
          <div className="product-review-modal__panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="product-review-modal__close" onClick={() => setModalOpen(false)} aria-label="Close review form">
              <X size={18} strokeWidth={2} />
            </button>

            <h3>Write a review for {productName}</h3>

            <form onSubmit={handleSubmit} className="product-review-modal__form">
              <label>
                <span>Name</span>
                <input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                {errors.name ? <small>{errors.name}</small> : null}
              </label>

              <label>
                <span>Review title</span>
                <input type="text" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                {errors.title ? <small>{errors.title}</small> : null}
              </label>

              <div className="product-review-modal__stars">
                <span>Your rating</span>
                <div>
                  {ratingOptions.map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={star <= form.rating ? 'product-review-modal__star product-review-modal__star--active' : 'product-review-modal__star'}
                      onClick={() => setForm({ ...form, rating: star })}
                      aria-label={`Rate ${star} out of 5`}
                    >
                      <Star size={18} strokeWidth={1.8} fill={star <= form.rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <label>
                <span>Comment</span>
                <textarea rows={5} value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} />
                {errors.comment ? <small>{errors.comment}</small> : null}
              </label>

              <button type="submit" className="product-review-modal__submit">
                <Check size={16} strokeWidth={2} />
                Submit review
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ReviewsSection;
