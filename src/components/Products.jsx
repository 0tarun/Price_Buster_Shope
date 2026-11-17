import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Heart, Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products as catalog } from '../data/products';
import { useCart } from '../context/useCart';
import './Products.css';

const formatPrice = (value) => `৳ ${value.toLocaleString('en-BD')}`;

export function ProductCard({ product, variant = 'default', onRemoveFromWishlist }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const isWishlist = variant === 'wishlist';

  const handleAdd = (event) => {
    event?.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className={`product-card${isWishlist ? ' product-card--wishlist' : ''}`}>
      {isWishlist ? (
        <div className="product-card__wishlist-media">
          <Link to={`/product/${product.id}`} className="product-card__image-box" aria-label={`View ${product.name}`}>
            <img src={product.image} alt={product.name} loading="lazy" />
          </Link>
          <button
            type="button"
            className="product-card__wishlist-remove"
            onClick={onRemoveFromWishlist}
            aria-label={`Remove ${product.name} from wishlist`}
          >
            <Heart size={18} strokeWidth={1.7} />
          </button>
        </div>
      ) : (
        <Link to={`/product/${product.id}`} className="product-card__image-box" aria-label={`View ${product.name}`}>
          <span className="product-card__badge">−{product.badge}%</span>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
      )}

      {!isWishlist ? (
        <div className="product-card__rating">
          <Star size={10} strokeWidth={1.8} fill="currentColor" />
          <span>{product.rating} ({product.reviewCount ?? product.reviews?.length ?? 0})</span>
        </div>
      ) : null}

      <Link to={`/product/${product.id}`} className="product-card__name">
        {product.name}
      </Link>

      <div className="product-card__price-row">
        <span className="product-card__price">{formatPrice(product.current)}</span>
        {!isWishlist ? <span className="product-card__old-price">{formatPrice(product.old)}</span> : null}
      </div>

      <button type="button" className={added ? 'product-card__button product-card__button--added' : 'product-card__button'} onClick={handleAdd}>
        <Plus size={12} strokeWidth={2} />
        <span>{added ? 'Added ✓' : 'Add to bag'}</span>
      </button>
    </article>
  );
}

const Products = ({ category, query = '', resultsPromise, isSearch = false }) => {
  const [searchResult, setSearchResult] = useState(null);
  const loading = Boolean(resultsPromise) && searchResult?.promise !== resultsPromise;

  const visibleProducts = useMemo(() => {
    if (resultsPromise) {
      return searchResult?.promise === resultsPromise ? searchResult.items : [];
    }

    if (category) {
      return catalog.filter((product) => product.category === category);
    }

    return catalog;
  }, [category, resultsPromise, searchResult]);

  useEffect(() => {
    let cancelled = false;

    if (!resultsPromise) return undefined;

    resultsPromise
      .then((list) => {
        if (!cancelled) setSearchResult({ promise: resultsPromise, items: list });
      })
      .catch(() => {
        if (!cancelled) setSearchResult({ promise: resultsPromise, items: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [resultsPromise]);

  return (
    <section className="products">
      <div className="products__header">
        <h2>{isSearch ? (query ? `Results for “${query}”` : 'Shop the collection') : 'Your next favourite is here.'}</h2>
        <Link to="/sale" className="products__link">
          <span>Shop all finds</span>
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </div>

      {loading ? (
        <div className="page-loader-wrap"><div className="page-loader">Loading products…</div></div>
      ) : (
        <div className="products__grid">
          {visibleProducts.length ? visibleProducts.map((product) => <ProductCard key={product.id} product={product} />) : <div className="products__empty">No products match your search yet.</div>}
        </div>
      )}
    </section>
  );
};

export default Products;
