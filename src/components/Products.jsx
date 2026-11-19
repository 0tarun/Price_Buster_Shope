import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Heart, Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts, getWishlist, saveWishlist } from '../services/api';
import { useCart } from '../context/useCart';
import './Products.css';

const formatPrice = (value) => `৳ ${value.toLocaleString('en-BD')}`;

export function ProductCard({
  product,
  variant = 'default',
  onRemoveFromWishlist,
  isWishlisted = false,
  onToggleWishlist,
  wishlistBusy = false,
}) {
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
            {product.image ? <img src={product.image} alt={product.name} loading="lazy" /> : <div className="product-card__image-placeholder">ছবি যোগ করা হয়নি</div>}
          </Link>
          <button
            type="button"
            className="product-card__wishlist-remove"
            onClick={onRemoveFromWishlist}
            aria-label={`Remove ${product.name} from wishlist`}
          >
            <Heart size="1.125rem" strokeWidth={1.7} />
          </button>
        </div>
      ) : (
        <div className="product-card__media">
          <Link to={`/product/${product.id}`} className="product-card__image-box" aria-label={`View ${product.name}`}>
            {Number(product.badge) > 0 ? <span className="product-card__badge">−{product.badge}%</span> : null}
            {product.image ? <img src={product.image} alt={product.name} loading="lazy" /> : <div className="product-card__image-placeholder">ছবি যোগ করা হয়নি</div>}
          </Link>
          <button
            type="button"
            className={isWishlisted ? 'product-card__save product-card__save--active' : 'product-card__save'}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onToggleWishlist?.(product);
            }}
            disabled={wishlistBusy}
            aria-label={isWishlisted ? `Remove ${product.name} from saved items` : `Save ${product.name} for later`}
            aria-pressed={isWishlisted}
          >
            <Heart size="1.125rem" strokeWidth={1.8} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      )}

      {!isWishlist ? (
        <div className="product-card__rating">
          <Star size="0.625rem" strokeWidth={1.8} fill="currentColor" />
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
        <Plus size="0.75rem" strokeWidth={2} />
        <span>{added ? 'Added ✓' : 'Add to bag'}</span>
      </button>
    </article>
  );
}

const Products = ({ category, query = '', resultsPromise, isSearch = false }) => {
  const [searchResult, setSearchResult] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [savedIds, setSavedIds] = useState([]);
  const [wishlistBusyId, setWishlistBusyId] = useState('');
  const { showToast } = useCart();
  const loading = Boolean(resultsPromise) && searchResult?.promise !== resultsPromise;

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((items) => {
        if (!cancelled) setAllProducts(items);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message);
      });
    getWishlist()
      .then((ids) => {
        if (!cancelled) setSavedIds(ids);
      })
      .catch(() => {
        if (!cancelled) setSavedIds([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleWishlist = async (product) => {
    if (wishlistBusyId) return;
    setWishlistBusyId(product.id);
    const alreadySaved = savedIds.includes(product.id);
    const nextIds = alreadySaved
      ? savedIds.filter((id) => id !== product.id)
      : [...savedIds, product.id];
    try {
      await saveWishlist(nextIds);
      setSavedIds(nextIds);
      showToast(alreadySaved ? 'Removed from saved items' : 'Saved for later');
    } catch (error) {
      showToast(error.message || 'This item could not be saved.');
    } finally {
      setWishlistBusyId('');
    }
  };

  const visibleProducts = useMemo(() => {
    if (resultsPromise) {
      return searchResult?.promise === resultsPromise ? searchResult.items : [];
    }

    if (category) {
      return allProducts.filter((product) => product.category === category);
    }

    return allProducts;
  }, [allProducts, category, resultsPromise, searchResult]);

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
          <ArrowRight size="0.75rem" strokeWidth={2} />
        </Link>
      </div>

      {loading ? (
        <div className="page-loader-wrap"><div className="page-loader">Loading products…</div></div>
      ) : (
        loadError ? <div className="products__empty" role="alert">{loadError}</div> : (
          <div className="products__grid">
            {visibleProducts.length ? visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={savedIds.includes(product.id)}
                wishlistBusy={wishlistBusyId === product.id}
                onToggleWishlist={toggleWishlist}
              />
            )) : <div className="products__empty">No products have been added yet.</div>}
          </div>
        )
      )}
    </section>
  );
};

export default Products;
