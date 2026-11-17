import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './account.css';

const accountPages = {
  '/account': {
    label: 'My account',
    title: 'Overview · Prize Buster Shop',
    heading: 'A little space, just for you.',
  },
  '/account/profile': {
    label: 'My profile',
    title: 'My profile · Prize Buster Shop',
    subtitle: 'Keep your personal details up to date.',
  },
  '/account/orders': {
    label: 'Orders & tracking',
    title: 'Orders & tracking · Prize Buster Shop',
    heading: 'Every good find, in one place.',
    subtitle: 'Your orders, from first click to doorstep.',
  },
  '/account/addresses': {
    label: 'Saved addresses',
    title: 'Saved addresses · Prize Buster Shop',
    subtitle: 'Make your next delivery a little easier.',
  },
  '/account/wishlist': {
    label: 'Wishlist',
    title: 'Wishlist · Prize Buster Shop',
    heading: 'A few favourites, saved for later.',
    subtitle: 'Your next little win is waiting here.',
  },
  '/account/settings': {
    label: 'Settings',
    title: 'Settings · Prize Buster Shop',
    subtitle: 'Manage your sign-in and communication preferences.',
  },
};

const accountLinks = [
  { label: 'Overview', to: '/account', end: true },
  { label: 'My profile', to: '/account/profile' },
  { label: 'Orders & tracking', to: '/account/orders' },
  { label: 'Saved addresses', to: '/account/addresses' },
  { label: 'Wishlist', to: '/account/wishlist' },
  { label: 'Settings', to: '/account/settings' },
];

function AccountLayout() {
  const [logoutError, setLogoutError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const page = accountPages[location.pathname] || accountPages['/account'];
  const isFeaturePage = ['/account', '/account/orders', '/account/wishlist'].includes(location.pathname);
  const subtitle = location.pathname === '/account'
    ? `Welcome back, ${user?.name?.split(' ')[0] || 'there'}. Make yourself at home.`
    : page.subtitle;

  useEffect(() => {
    document.title = page.title;
    return () => {
      document.title = 'Prize Buster Shop';
    };
  }, [page.title]);

  const handleLogout = async () => {
    setLogoutError('');
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      setLogoutError(error.message || 'We could not sign you out. Please try again.');
    }
  };

  return (
    <section className={`account-page${isFeaturePage ? ' account-page--feature' : ''}`}>
      <nav className="account-breadcrumb" aria-label="Breadcrumb">
        <NavLink to="/">Home</NavLink>
        <span aria-hidden="true">/</span>
        {location.pathname === '/account' ? (
          <span aria-current="page">My account</span>
        ) : (
          <>
            <NavLink to="/account">My account</NavLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.label}</span>
          </>
        )}
      </nav>

      <header className="account-page__heading">
        <h1>{page.heading || 'Make yourself at home.'}</h1>
        <p>{subtitle}</p>
      </header>

      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-sidebar__welcome">
            <span className="account-avatar" aria-hidden="true">{(user?.name || 'A').charAt(0).toUpperCase()}</span>
            <div>
              <span className="account-sidebar__eyebrow">Hello there,</span>
              <strong>{user?.name || 'Shopper'}</strong>
            </div>
          </div>
          <nav className="account-sidebar__nav" aria-label="Account pages">
            {accountLinks.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `account-sidebar__link${isActive ? ' is-active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <button type="button" className="account-sidebar__logout" onClick={handleLogout}>Log out</button>
          {logoutError ? <p className="account-alert account-alert--error" role="alert">{logoutError}</p> : null}
        </aside>

        <div className="account-content">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default AccountLayout;
