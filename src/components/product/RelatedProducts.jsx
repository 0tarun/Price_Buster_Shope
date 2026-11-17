import { Link } from 'react-router-dom';

const formatPrice = (value) => `৳ ${Number(value || 0).toLocaleString('en-BD')}`;

export function RelatedProducts({ products = [] }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="product-related">
      <div className="product-related__header">
        <h2>A little more to love.</h2>
      </div>

      <div className="product-related__grid">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="product-related__card" aria-label={`View ${product.name}`}>
            <img src={product.image} alt={product.name} loading="lazy" className="product-related__image" />
            <div className="product-related__content">
              <span className="product-related__name">{product.name}</span>
              <span className="product-related__price">{formatPrice(product.price || product.current || 0)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
