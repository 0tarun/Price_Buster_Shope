import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import { useCart } from '../../context/useCart';
import { getOrders } from '../../services/api';

const formatPrice = (value) => `৳ ${Number(value).toLocaleString('en-BD')}`;

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [error, setError] = useState('');
  const { showToast } = useCart();

  useEffect(() => {
    let active = true;
    getOrders()
      .then((result) => { if (active) setOrders(result); })
      .catch((loadError) => { if (active) setError(loadError.message || 'We could not load your orders.'); });
    return () => { active = false; };
  }, []);

  const toggleTracking = (order) => {
    const isClosing = trackingOrder === order.id;
    setTrackingOrder(isClosing ? null : order.id);
    if (!isClosing && order.status.toLowerCase() !== 'delivered') showToast(`Tracking ${order.id}`);
  };

  return (
    <section className="account-section account-orders">
      {error ? <p className="account-alert account-alert--error" role="alert">{error}</p> : null}
      <div className="account-orders__list">
        {orders.map((order) => {
          const firstProduct = order.productIds
            ?.map((id) => products.find((product) => product.id === id))
            .find(Boolean);
          const isDelivered = order.status.toLowerCase() === 'delivered';

          return (
            <article key={order.id} className="account-orders-card">
              <div className="account-orders-card__header">
                <div>
                  <span className="account-eyebrow">{order.id}</span>
                  <span className="account-orders-card__date">{order.date}</span>
                </div>
                <span className={`account-status ${isDelivered ? 'account-status--delivered' : 'account-status--shipped'}`}>
                  {order.status}
                </span>
              </div>
              <div className="account-orders-card__main">
                {firstProduct ? <img src={firstProduct.image} alt={firstProduct.name} /> : <div className="account-orders-card__image-placeholder" aria-hidden="true" />}
                <div className="account-orders-card__details">
                  <strong>{order.items?.join(' · ') || 'Order items'}</strong>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <button
                  type="button"
                  className="account-orders-card__action"
                  onClick={() => toggleTracking(order)}
                >
                  {trackingOrder === order.id ? 'Hide details' : isDelivered ? 'View order' : 'Track order'}
                  <ArrowRight size={14} />
                </button>
              </div>
              {trackingOrder === order.id ? (
                <div className="account-tracking" role="status">
                  <span className="account-tracking__dot" />
                  <p>{order.tracking}</p>
                </div>
              ) : null}
            </article>
          );
        })}
        {!orders.length && !error ? <p className="account-empty">No orders just yet. Your next lovely find is waiting.</p> : null}
      </div>
    </section>
  );
}

export default OrdersPage;
