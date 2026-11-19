import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/useCart';

function CartPage() {
  const { cartItems, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.current * item.quantity, 0);

  if (!cartItems.length) {
    return (
      <section className="content-page">
        <div className="content-page__hero content-page__hero--center">
          <span className="eyebrow">Your bag</span>
          <h1>Your bag is empty</h1>
          <p>Start filling it with fresh favourites from the shop.</p>
          <Link to="/" className="primary-button">
            Keep shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-page__header">
        <div>
          <span className="eyebrow">Your bag</span>
          <h1>{itemCount} item{itemCount > 1 ? 's' : ''}</h1>
        </div>
        <button type="button" className="text-button" onClick={clearCart}>
          Clear bag
        </button>
      </div>

      <div className="cart-page__layout">
        <div className="cart-page__list">
          {cartItems.map((item) => (
            <article key={item.id} className="cart-item">
              <div className="cart-item__media">
                <img src={item.image} alt={item.name} loading="lazy" />
              </div>

              <div className="cart-item__info">
                <Link to={`/product/${item.id}`} className="cart-item__name">
                  {item.name}
                </Link>
                <p className="cart-item__price">৳ {item.current.toLocaleString('en-BD')}</p>
              </div>

              <div className="cart-item__qty">
                <button type="button" aria-label={`Decrease ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus size="0.875rem" strokeWidth={2} />
                </button>
                <span>{item.quantity}</span>
                <button type="button" aria-label={`Increase ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus size="0.875rem" strokeWidth={2} />
                </button>
              </div>

              <button type="button" className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
                <Trash2 size="1rem" strokeWidth={2} />
              </button>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <strong>৳ {subtotal.toLocaleString('en-BD')}</strong>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <strong>Free</strong>
          </div>
          <div className="cart-summary__divider" />
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <strong>৳ {subtotal.toLocaleString('en-BD')}</strong>
          </div>
          <Link to="/" className="primary-button cart-summary__button">
            Checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;
