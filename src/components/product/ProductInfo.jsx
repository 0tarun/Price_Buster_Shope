import { useState } from 'react';
import { Heart, ShoppingBag, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuantityStepper } from './QuantityStepper';

const formatPrice = (value) => `৳ ${Number(value || 0).toLocaleString('en-BD')}`;

export function ProductInfo({
  product,
  quantity,
  selectedSize,
  onQuantityChange,
  onSizeChange,
  onAddToBag,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  onSaveForLater,
}) {
  const [added, setAdded] = useState(false);
  const reviewCount = product?.reviewCount || product?.reviews?.length || 0;
  const maxQty = Math.min(product?.stockLeft || 10, 10);
  const isLowStock = Boolean(product?.inStock) && Number(product?.stockLeft || 0) <= 3;

  const handleAddToBag = () => {
    onAddToBag();
    setAdded(true);
    window.clearTimeout(handleAddToBag.timeout);
    handleAddToBag.timeout = window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="product-info">
      <span className="product-info__eyebrow">{product.brand ? `${product.brand} · ${product.categoryLabel || 'Beauty'}` : product.categoryLabel || 'Beauty'}</span>
      <h1>{product.tagline || product.name}</h1>
      <p className="product-info__subtitle">{product.subtitle || product.name}</p>

      <div className="product-info__rating" aria-label={`Rating ${product.rating} out of 5`}>
        <div className="product-info__stars">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={`${product.id}-star-${index}`} className={index < Math.round(product.rating || 0) ? 'is-filled' : ''}>★</span>
          ))}
        </div>
        <span className="product-info__score">{Number(product.rating || 0).toFixed(1)}</span>
        <Link to="#reviews">({reviewCount} reviews)</Link>
      </div>

      <div className="product-info__price-row">
        <span className="product-info__price">{formatPrice(product.price || product.current || 0)}</span>
        <span className="product-info__old-price">{formatPrice(product.oldPrice || product.old || 0)}</span>
        <span className="product-info__discount">Save {product.discountPercent || product.badge || 0}%</span>
      </div>

      <p className="product-info__description">{product.shortDescription || product.description}</p>

      <div className="product-info__stock">
        <span className={`product-info__stock-dot ${product.inStock ? 'is-in-stock' : 'is-out-of-stock'}`} />
        {product.inStock ? (
          <>
            <span>{product.stockNote || 'In stock, ready to ship'}</span>
            {isLowStock ? <strong className="product-info__stock-low">Only {product.stockLeft} left</strong> : null}
          </>
        ) : (
          <span>Out of stock</span>
        )}
      </div>

      {product.sizes?.length ? (
        <div className="product-info__size-group">
          <span className="product-info__label">Size</span>
          <div className="product-info__sizes">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={selectedSize === size ? 'product-info__size is-selected' : 'product-info__size'}
                onClick={() => onSizeChange(size)}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="product-info__purchase-row">
        <QuantityStepper value={quantity} min={1} max={maxQty} onChange={onQuantityChange} />

        <button type="button" className="product-info__cta product-info__cta--primary" onClick={handleAddToBag}>
          <ShoppingBag size={16} strokeWidth={2} />
          {added ? 'Added ✓' : 'Add to bag'}
        </button>

        <button type="button" className="product-info__cta product-info__cta--secondary" onClick={onBuyNow}>
          Buy now
        </button>

        <button
          type="button"
          className={isWishlisted ? 'product-info__wishlist is-active' : 'product-info__wishlist'}
          onClick={onToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={isWishlisted}
        >
          <Heart size={18} strokeWidth={1.8} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <button type="button" className="product-info__save-later" onClick={onSaveForLater}>
        <Heart size={14} strokeWidth={1.8} />
        Save for later
      </button>

      <div className="product-info__delivery">
        <div className="product-info__delivery-header">
          <Truck size={16} strokeWidth={2} />
          <span>{product.delivery?.eta || '2–4 working days'}</span>
        </div>
        <p>{product.delivery?.note || 'Free delivery on orders over ৳ 2,000. Easy 7-day returns.'}</p>
      </div>
    </div>
  );
}

export default ProductInfo;
