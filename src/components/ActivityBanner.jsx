import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import './ActivityBanner.css';

const ActivityBanner = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let active = true;
    getProducts()
      .then((products) => {
        if (active) setProduct(products[0] || null);
      })
      .catch(() => {
        if (active) setProduct(null);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!product) return null;

  return (
    <section className="activity-banner">
      {product.image ? <img src={product.image} alt={product.name} className="activity-banner__thumb" loading="lazy" /> : <div className="activity-banner__thumb activity-banner__thumb--placeholder" aria-hidden="true" />}
      <div className="activity-banner__text">
        <div className="activity-banner__label">JUST ADDED TO THE SHOP</div>
        <div className="activity-banner__message">{product.name}</div>
      </div>
      <Link to={`/product/${product.id}`} className="activity-banner__link">
        <span>Discover this product</span>
        <ArrowRight size={12} strokeWidth={2} />
      </Link>
    </section>
  );
};

export default ActivityBanner;
