import { useEffect, useRef } from 'react';
import { FileText, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import './TopBar.css';

const TopBar = ({ hidden, onHiddenChange }) => {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const topbarRef = useRef(null);
  const lastTouchY = useRef(0);

  useEffect(() => {
    const handleScrollIntent = (direction) => {
      if (direction < 0) {
        onHiddenChange(false);
      } else if (window.scrollY > 120) {
        onHiddenChange(true);
      }
    };

    const handleScroll = () => {
      if (window.scrollY <= 80) onHiddenChange(false);
    };

    const handleWheel = (event) => {
      if (event.deltaY !== 0) handleScrollIntent(Math.sign(event.deltaY));
    };

    const handleTouchStart = (event) => {
      lastTouchY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      const currentY = event.touches[0].clientY;
      const delta = lastTouchY.current - currentY;
      if (Math.abs(delta) >= 8) handleScrollIntent(Math.sign(delta));
      lastTouchY.current = currentY;
    };

    const handleKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof HTMLElement && event.target.matches('a, button, input, select, textarea, [contenteditable="true"]')) return;

      if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) {
        handleScrollIntent(1);
      } else if (['ArrowUp', 'PageUp', 'Home'].includes(event.key)) {
        handleScrollIntent(-1);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onHiddenChange]);

  useEffect(() => {
    const topbar = topbarRef.current;
    if (!topbar) return undefined;

    const updateHeight = () => {
      const height = `${topbar.getBoundingClientRect().height}px`;
      document.documentElement.style.setProperty('--topbar-height', height);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(topbar);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={topbarRef}
      className={`topbar${hidden ? ' topbar--hidden' : ''}`}
      aria-hidden={hidden}
      inert={hidden}
    >
      <div className="topbar__inner">
        <Link to="/sale" className="topbar__promo" aria-label="Shop winter sale">
          <span className="topbar__promo-label">✦ WINTER SALE</span>
          <div className="topbar__promo-line">
            <span>Up to 40% off</span>
            <span className="topbar__promo-arrow">→</span>
          </div>
        </Link>

        <div className="topbar__center" aria-label="Prize Buster Shop">
          <svg viewBox="0 0 44 20" className="topbar__mark" aria-hidden="true">
            <path
              d="M3 10c2.5-2.9 4.8-4.4 7.1-4.4 3 0 5.2 1.8 5.9 5.4.7-3.6 3-5.4 5.9-5.4 2.3 0 4.6 1.5 7.1 4.4-2.3 2.4-4.2 3.6-5.8 3.6-1.9 0-2.9-1.2-3.4-3.3-.5 2.1-1.5 3.3-3.4 3.3C7.2 13.6 5.3 12.4 3 10Z"
              fill="currentColor"
            />
            <path d="M15 10c.5-1.5 1.5-2.2 3-2.2 1.4 0 2.7 1 3.7 2.8 1.1 1.9 2.6 2.8 4.5 2.8 1.8 0 3.1-.8 4-2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          </svg>
          <Link to="/" className="topbar__brand">PRICE_BUSTER_SHOP</Link>
          <div className="topbar__tagline">BARGAIN HUNTERS HEAVEN</div>
        </div>

        <div className="topbar__actions">
          <Link to="/blog" className="topbar__action" aria-label="Read the blog">
            <FileText size="1.5rem" strokeWidth={1.8} />
            <span>Blog</span>
          </Link>
          <Link to={isAuthenticated ? '/account' : '/login'} className="topbar__action" aria-label="Your account">
            <User size="1.5rem" strokeWidth={1.8} />
            <span>Account</span>
          </Link>
          <Link to="/cart" className="topbar__action topbar__action--cart" aria-label="View cart">
            <ShoppingBag size="1.5rem" strokeWidth={1.8} />
            <span>Cart</span>
            {itemCount > 0 ? <span className="topbar__badge">{itemCount}</span> : null}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
