import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DiscoverStrip.css';

const DiscoverStrip = () => {
  return (
    <section className="discover-strip">
      <div className="discover-strip__text">Good things are worth discovering.</div>
      <Link to="/sale" className="discover-strip__link">
        <span>Find your next little win</span>
        <ArrowRight size={12} strokeWidth={2} />
      </Link>
    </section>
  );
};

export default DiscoverStrip;
