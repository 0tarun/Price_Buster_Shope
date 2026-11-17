import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import shampooThumb from '../assets/images/shampoo.jpg';
import './ActivityBanner.css';

const ActivityBanner = () => {
  return (
    <section className="activity-banner">
      <img src={shampooThumb} alt="Customer favourite shampoo" className="activity-banner__thumb" loading="lazy" />
      <div className="activity-banner__text">
        <div className="activity-banner__label">A GOOD FIND, SHARED</div>
        <div className="activity-banner__message">Rahim from Dhaka just ordered Herbal Repair Shampoo</div>
      </div>
      <Link to="/product/botanic-herbal-repair-shampoo" className="activity-banner__link">
        <span>Discover a customer favourite</span>
        <ArrowRight size={12} strokeWidth={2} />
      </Link>
    </section>
  );
};

export default ActivityBanner;
