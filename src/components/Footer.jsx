import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const customerService = [
  { label: 'Help center', to: '/help' },
  { label: 'Track order', to: '/account' },
  { label: 'Shipping information', to: '/help' },
  { label: 'Returns & refunds', to: '/help' },
  { label: 'Contact us', to: '/help' },
];

const shopLinks = [
  { label: 'Beauty & personal care', to: '/category/beauty-personal-care' },
  { label: 'Home & living', to: '/category/home-living' },
  { label: 'Electronics', to: '/category/electronics' },
  { label: 'Current sales', to: '/sale' },
];

const goodToKnow = [
  { label: 'About us', to: '/account' },
  { label: 'Privacy policy', to: '/account' },
  { label: 'Terms & conditions', to: '/account' },
  { label: 'Cookie policy', to: '/account' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setMessage('Thanks! You are subscribed to sweet little deals.');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__brand-name">prize buster</div>
          <p>Everyday finds. Exceptional value.</p>
          <p>A little discovery. A better everyday.</p>
          <div className="footer__contact">hello@prizebustershop.com</div>
          <div className="footer__contact footer__contact--muted">+880 1700 000 000 · Dhaka, Bangladesh</div>
        </div>

        <div className="footer__column">
          <div className="footer__heading">Customer service</div>
          {customerService.map(({ label, to }) => (
            <Link key={label} to={to} className="footer__link">{label}</Link>
          ))}
        </div>

        <div className="footer__column">
          <div className="footer__heading">Shop</div>
          {shopLinks.map(({ label, to }) => (
            <Link key={label} to={to} className="footer__link">{label}</Link>
          ))}
        </div>

        <div className="footer__column">
          <div className="footer__heading">Good to know</div>
          {goodToKnow.map(({ label, to }) => (
            <Link key={label} to={to} className="footer__link">{label}</Link>
          ))}
        </div>

        <div className="footer__newsletter">
          <div className="footer__heading footer__heading--newsletter">Good finds, in your inbox.</div>
          <div className="footer__newsletter-note">First access to offers and new arrivals.</div>
          <form className="footer__input-wrap" onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" aria-label="Email address" />
            <button type="submit" className="footer__newsletter-button" aria-label="Subscribe">
              <ArrowRight size="1.125rem" strokeWidth={2} />
            </button>
          </form>
          {message ? <div className="footer__newsletter-message">{message}</div> : null}
          <div className="footer__socials">
            <a href="https://instagram.com" className="footer__social-link" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://facebook.com" className="footer__social-link" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://youtube.com" className="footer__social-link" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>
      </div>

      <div className="footer__divider" />

      <div className="footer__bottom">
        <div className="footer__bottom-copy">© 2026 Prize Buster Shop. All rights reserved.</div>
        <div className="footer__payments">
          <span>Secure payments</span>
          <span className="footer__payment-card footer__payment-card--italic">VISA</span>
          <span className="footer__payment-card">Mastercard</span>
          <span className="footer__payment-card">bKash</span>
          <span className="footer__payment-card">Nagad</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
