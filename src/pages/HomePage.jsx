import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import Brands from '../components/Brands';
import Reviews from '../components/Reviews';
import ActivityBanner from '../components/ActivityBanner';
import Products from '../components/Products';
import DiscoverStrip from '../components/DiscoverStrip';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <TrustStrip />
      <Brands />
      <Reviews />
      <ActivityBanner />
      <Products />
      <DiscoverStrip />
    </div>
  );
}

export default HomePage;
