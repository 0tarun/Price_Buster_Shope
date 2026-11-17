import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { getAddresses, getOrders, getProfile, getWishlist } from '../../services/api';

const formatPrice = (value) => `৳ ${Number(value).toLocaleString('en-BD')}`;

function OverviewPage() {
  const [overview, setOverview] = useState({
    orders: [],
    addresses: [],
    wishlist: [],
    profile: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getOrders(), getAddresses(), getWishlist(), getProfile()])
      .then(([orders, addresses, wishlist, profile]) => {
        if (active) setOverview({ orders, addresses, wishlist, profile });
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'We could not load your account summary.');
      });
    return () => { active = false; };
  }, []);

  const latestOrder = overview.orders[0];
  const featuredProduct = latestOrder?.productIds
    ?.map((id) => products.find((product) => product.id === id))
    .find(Boolean);
  const defaultAddress = overview.addresses.find((address) => address.isDefault) || overview.addresses[0];
  const onTheWayCount = overview.orders.filter((order) => order.status.toLowerCase() === 'on its way').length;

  return (
    <div className="account-page-content account-overview">
      {error ? <p className="account-alert account-alert--error" role="alert">{error}</p> : null}
      <div className="account-overview__stats">
        <Link to="/account/orders" className="account-overview-stat">
          <strong>{overview.orders.length}</strong>
          <span>Orders placed</span>
        </Link>
        <Link to="/account/orders" className="account-overview-stat">
          <strong>{onTheWayCount}</strong>
          <span>On its way</span>
        </Link>
        <Link to="/account/wishlist" className="account-overview-stat">
          <strong>{overview.wishlist.length}</strong>
          <span>Saved favourites</span>
        </Link>
      </div>

      <section className="account-section account-overview__latest">
        <div className="account-section__header">
          <div>
            <span className="account-eyebrow">A little update</span>
            <h2>Your latest order</h2>
          </div>
          <Link className="account-text-link" to="/account/orders">
            All orders <ArrowRight size={14} />
          </Link>
        </div>
        {latestOrder ? (
          <article className="account-overview-order">
            <div className="account-overview-order__top">
              <div>
                <span className="account-eyebrow">Order {latestOrder.id}</span>
                <span className="account-overview-order__date">{latestOrder.date}</span>
              </div>
              <span className={`account-status ${latestOrder.status.toLowerCase() === 'delivered' ? 'account-status--delivered' : 'account-status--shipped'}`}>
                {latestOrder.status}
              </span>
            </div>
            <div className="account-overview-order__main">
              {featuredProduct ? <img src={featuredProduct.image} alt={featuredProduct.name} /> : null}
              <div className="account-overview-order__details">
                <strong>{latestOrder.items?.join(' · ') || 'Your latest order'}</strong>
                <span>{formatPrice(latestOrder.total)}</span>
              </div>
              <div className="account-overview-order__delivery">
                <span>{latestOrder.status === 'Delivered' ? 'Delivered' : 'Estimated arrival'}</span>
                <strong>{latestOrder.status === 'Delivered' ? latestOrder.date : latestOrder.estimatedArrival || 'On its way'}</strong>
              </div>
            </div>
            <Link to="/account/orders" className="account-overview-order__link">
              Track your order <ArrowRight size={14} />
            </Link>
          </article>
        ) : (
          <p className="account-empty">Your orders will show up here.</p>
        )}
      </section>

      <div className="account-overview__bottom">
        <section className="account-overview-detail">
          <div className="account-overview-detail__heading">
            <h2>Your details</h2>
            <Link to="/account/profile" aria-label="Edit your details"><ArrowRight size={15} /></Link>
          </div>
          <strong>{overview.profile?.name || 'Add your name'}</strong>
          <span>{overview.profile?.email || 'Add your email address'}</span>
          <span>{overview.profile?.phone || 'Add your phone number'}</span>
        </section>
        <section className="account-overview-detail">
          <div className="account-overview-detail__heading">
            <h2>Your go-to address</h2>
            <Link to="/account/addresses" aria-label="Manage your addresses"><ArrowRight size={15} /></Link>
          </div>
          {defaultAddress ? (
            <>
              <strong>{defaultAddress.label}</strong>
              <span>{defaultAddress.recipient}</span>
              <span>{defaultAddress.street}, {defaultAddress.city} {defaultAddress.postalCode}</span>
            </>
          ) : (
            <span>No saved address yet.</span>
          )}
        </section>
      </div>
    </div>
  );
}

export default OverviewPage;
