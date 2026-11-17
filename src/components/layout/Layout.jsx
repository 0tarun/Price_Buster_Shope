import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import ScrollToTop from '../ScrollToTop';
import { useCart } from '../../context/useCart';

function Layout() {
  const { pathname } = useLocation();
  const { toast } = useCart();
  const isAccountArea = pathname.startsWith('/account') || pathname === '/login';

  useEffect(() => {
    if (isAccountArea) return;

    const titles = {
      '/': 'Prize Buster Shop',
      '/blog': 'The Journal · Prize Buster Shop',
      '/cart': 'Your bag · Prize Buster Shop',
      '/sale': 'Winter sale · Prize Buster Shop',
      '/new': 'New arrivals · Prize Buster Shop',
      '/deals': "Today's deals · Prize Buster Shop",
      '/help': 'Help & support · Prize Buster Shop',
      '/search': 'Search · Prize Buster Shop',
    };
    const title = titles[pathname]
      || (pathname.startsWith('/product/') ? 'Product details · Prize Buster Shop' : null)
      || (pathname.startsWith('/category/') ? 'Shop by category · Prize Buster Shop' : null)
      || 'Prize Buster Shop';
    document.title = title;
  }, [isAccountArea, pathname]);

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header />
      <main id="main" className={isAccountArea ? 'layout__main layout__main--fluid' : 'page-shell'}>
        <Suspense fallback={<div className="page-loader-wrap"><div className="page-loader">Loading…</div></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      {toast ? <div className="toast" role="status" aria-live="polite">{toast}</div> : null}
    </div>
  );
}

export default Layout;
