import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/Products';
import { useCart } from '../../context/useCart';
import { getProducts, getWishlist, saveWishlist } from '../../services/api';

function WishlistPage() {
  const [savedIds, setSavedIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useCart();

  useEffect(() => {
    let active = true;
    Promise.all([getWishlist(), getProducts()])
      .then(([result, catalog]) => {
        if (active) {
          setSavedIds(result);
          setProducts(catalog);
        }
      })
      .catch((loadError) => { if (active) setError(loadError.message || 'We could not load your wishlist.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const removeProduct = async (productId) => {
    const updated = savedIds.filter((id) => id !== productId);
    setError('');
    try {
      await saveWishlist(updated);
      setSavedIds(updated);
      showToast('Removed from your wishlist');
    } catch (saveError) {
      setError(saveError.message || 'This item could not be removed.');
    }
  };

  const savedProducts = products.filter((product) => savedIds.includes(product.id));

  return (
    <section className="account-section account-wishlist">
      {error ? <p className="account-alert account-alert--error" role="alert">{error}</p> : null}
      {loading ? <p className="account-loading">Gathering your saved finds…</p> : null}
      {!loading && savedProducts.length ? (
        <div className="account-wishlist-grid">
          {savedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="wishlist"
              onRemoveFromWishlist={() => removeProduct(product.id)}
            />
          ))}
        </div>
      ) : null}
      {!loading && !savedProducts.length ? (
        <div className="account-empty account-empty--panel">
          <Heart size={22} />
          <p>Your wishlist is waiting for its first lovely find.</p>
          <Link className="account-button" to="/">Explore the shop</Link>
        </div>
      ) : null}
    </section>
  );
}

export default WishlistPage;
