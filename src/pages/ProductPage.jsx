import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Gallery } from '../components/product/Gallery';
import { ProductDetailsTable } from '../components/product/ProductDetailsTable';
import { ProductInfo } from '../components/product/ProductInfo';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { useCart } from '../context/useCart';
import { getProduct, getRelatedProducts, getReviews, submitReview } from '../services/api';
import '../product.css';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, showToast } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        const productItem = await getProduct(id);
        if (!active) return;

        setProduct(productItem);
        setSelectedSize(productItem.sizes?.[0] || '');
        setQuantity(1);

        const [related, nextReviews] = await Promise.all([
          getRelatedProducts(productItem.id),
          getReviews(productItem.id),
        ]);

        if (!active) return;
        setRelatedProducts(related);
        setReviews(nextReviews);
      } catch (error) {
        if (active) {
          setProduct(null);
        }
      } finally {
        if (active) {
          setPageLoading(false);
        }
      }
    }

    setPageLoading(true);
    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const storageKey = 'price-buster-wishlist';
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      setIsWishlisted(saved.includes(product.id));
    } catch {
      setIsWishlisted(false);
    }

    document.title = `${product.name} · Prize Buster Shop`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', product.shortDescription || product.description || product.name);
    } else {
      const tag = document.createElement('meta');
      tag.name = 'description';
      tag.content = product.shortDescription || product.description || product.name;
      document.head.appendChild(tag);
    }
  }, [product]);

  const schema = useMemo(() => {
    if (!product) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images || [product.image],
      description: product.shortDescription || product.description,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: product.brand || 'Botanic',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BDT',
        price: Number(product.price || product.current || 0),
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      aggregateRating: product.reviewCount ? {
        '@type': 'AggregateRating',
        ratingValue: Number(product.rating || 0),
        reviewCount: Number(product.reviewCount || reviews.length || 0),
      } : undefined,
    };
  }, [product, reviews.length]);

  const handleAddToBag = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    const storageKey = 'price-buster-wishlist';
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    const next = isWishlisted ? saved.filter((id) => id !== product.id) : [...saved, product.id];

    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setIsWishlisted(!isWishlisted);
  };

  const handleReviewSubmit = async (payload) => {
    if (!product) return;

    const nextReviews = await submitReview(product.id, payload);
    setReviews(nextReviews);
    showToast('Review added', 1600);
  };

  if (pageLoading) {
    return (
      <section className="product-page product-page--loading" aria-live="polite">
        <div className="product-page__skeleton product-page__skeleton--breadcrumb" />
        <div className="product-page__skeleton-layout">
          <div className="product-page__skeleton product-page__skeleton--gallery" />
          <div className="product-page__skeleton product-page__skeleton--details" />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-page product-page--not-found">
        <div className="product-not-found">
          <span className="eyebrow">Product</span>
          <h1>We couldn’t find that item.</h1>
          <p>The product you’re looking for may have moved, sold out or never existed.</p>
          <Link to="/" className="primary-button">Back to shop</Link>
        </div>
      </section>
    );
  }

  const highlightA = product.highlights?.[0] || {
    title: 'A fresh start for your hair',
    text: 'A nourishing cleanse that supports softer, more manageable strands from the very first wash.',
  };
  const highlightB = product.highlights?.[1] || {
    title: 'How to use',
    text: 'Apply to wet hair, massage gently through the scalp and lengths, then rinse thoroughly for a clean finish.',
  };

  return (
    <div className="product-page">
      {schema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ) : null}

      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/category/${product.category}`}>{product.categoryLabel || 'Beauty & personal care'}</Link>
        <span>/</span>
        <Link to={`/category/${product.category}`}>{product.subCategory || 'Haircare'}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <section className="product-layout">
        <Gallery product={product} />

        <ProductInfo
          product={product}
          quantity={quantity}
          selectedSize={selectedSize}
          onQuantityChange={setQuantity}
          onSizeChange={setSelectedSize}
          onAddToBag={handleAddToBag}
          onBuyNow={handleBuyNow}
          isWishlisted={isWishlisted}
          onToggleWishlist={handleToggleWishlist}
          onSaveForLater={handleToggleWishlist}
        />
      </section>

      <section className="product-ritual">
        <div className="product-ritual__content">
          <div className="product-ritual__intro">
            <h2>A better wash-day ritual.</h2>
            <p>
              Thoughtful care for softer strands, calmer routines and a little more ease in the everyday. This formula is designed to feel gentle, fresh and beautifully effective.
            </p>
          </div>

          <div className="product-ritual__blocks">
            <div className="product-ritual__block">
              <h3>{highlightA.title}</h3>
              <p>{highlightA.text}</p>
            </div>

            <div className="product-ritual__block">
              <h3>{highlightB.title}</h3>
              <ul>
                {Array.isArray(product.howToUse) && product.howToUse.length ? (
                  product.howToUse.map((step) => <li key={step}>{step}</li>)
                ) : (
                  <li>Apply to wet hair and massage through the scalp and lengths.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="product-ritual__aside">
          <h3>The details</h3>
          <ProductDetailsTable details={product.details} />
          <Link to="/blog" className="product-ritual__story-link">
            Read the full product story
            <ArrowRight size="0.875rem" strokeWidth={2} />
          </Link>
        </div>
      </section>

      <ReviewsSection reviews={reviews} productName={product.name} onSubmitReview={handleReviewSubmit} />

      <RelatedProducts products={relatedProducts} />

      <div className="product-page__floating-bar">
        <div className="product-page__floating-price">
          <span>From</span>
          <strong>{Number(product.price || product.current || 0).toLocaleString('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })}</strong>
        </div>
        <button type="button" className="product-page__floating-button" onClick={handleAddToBag}>
          <Sparkles size="0.875rem" strokeWidth={2} />
          Add to bag
        </button>
      </div>
    </div>
  );
}

export default ProductPage;
