import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import RequireAuth from './components/RequireAuth';

const HomePage = lazy(() => import('./pages/HomePage'));
const GenericPage = lazy(() => import('./pages/GenericPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const AccountLayout = lazy(() => import('./pages/account/AccountLayout'));
const OverviewPage = lazy(() => import('./pages/account/OverviewPage'));
const ProfilePage = lazy(() => import('./pages/account/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/account/OrdersPage'));
const AddressesPage = lazy(() => import('./pages/account/AddressesPage'));
const WishlistPage = lazy(() => import('./pages/account/WishlistPage'));
const SettingsPage = lazy(() => import('./pages/account/SettingsPage'));
const LoginPage = lazy(() => import('./pages/account/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const genericCopy = {
  blog: {
    title: 'The Journal',
    eyebrow: 'Blog',
    description: 'Fresh finds, styling notes and little routines worth repeating.',
    cta: 'Back home',
  },
  sale: {
    title: 'Winter sale',
    eyebrow: 'Sale',
    description: 'A limited drop of thoughtful picks, from beauty to home and daily essentials.',
    cta: 'Browse deals',
  },
  new: {
    title: 'New arrivals',
    eyebrow: 'New',
    description: 'Freshly unpacked finds ready to replace the ordinary with something lovely.',
    cta: 'Shop new picks',
  },
  deals: {
    title: "Today's deals",
    eyebrow: 'Deals',
    description: 'Limited-time markdowns and quick wins selected for everyday upgrades.',
    cta: 'See offers',
  },
  help: {
    title: 'Help & support',
    eyebrow: 'Support',
    description: "Need a hand? We're here to help with orders, delivery and product questions.",
    cta: 'Contact us',
  },
  notFound: {
    title: 'Page not found',
    eyebrow: 'Oops',
    description: 'The page you were looking for is no longer here, but the shop is still open.',
    cta: 'Return home',
  },
};

function PageFallback() {
  return <div className="page-loader-wrap"><div className="page-loader">Loading…</div></div>;
}

function SuspendedPage({ children }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

function App() {
  return (
    <Routes>
      <Route path="admin" element={<SuspendedPage><AdminPage /></SuspendedPage>} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="blog" element={<GenericPage {...genericCopy.blog} />} />
        <Route path="login" element={<SuspendedPage><LoginPage /></SuspendedPage>} />
        <Route
          path="account"
          element={
            <RequireAuth>
              <SuspendedPage><AccountLayout /></SuspendedPage>
            </RequireAuth>
          }
        >
          <Route index element={<SuspendedPage><OverviewPage /></SuspendedPage>} />
          <Route path="profile" element={<SuspendedPage><ProfilePage /></SuspendedPage>} />
          <Route path="orders" element={<SuspendedPage><OrdersPage /></SuspendedPage>} />
          <Route path="addresses" element={<SuspendedPage><AddressesPage /></SuspendedPage>} />
          <Route path="wishlist" element={<SuspendedPage><WishlistPage /></SuspendedPage>} />
          <Route path="settings" element={<SuspendedPage><SettingsPage /></SuspendedPage>} />
        </Route>
        <Route path="cart" element={<CartPage />} />
        <Route path="sale" element={<GenericPage {...genericCopy.sale} />} />
        <Route path="new" element={<GenericPage {...genericCopy.new} />} />
        <Route path="deals" element={<GenericPage {...genericCopy.deals} />} />
        <Route path="help" element={<GenericPage {...genericCopy.help} />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="*" element={<GenericPage {...genericCopy.notFound} />} />
      </Route>
    </Routes>
  );
}

export default App;
