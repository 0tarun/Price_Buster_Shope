import {
  ArrowUpRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Undo2,
} from 'lucide-react';
import './TrustStrip.css';

const trustItems = [
  { icon: ArrowUpRight, title: 'Fast delivery', subtitle: 'To your door, with care' },
  { icon: ShieldCheck, title: 'Secure payments', subtitle: 'Safe from start to finish' },
  { icon: Undo2, title: 'Easy returns', subtitle: 'A little extra reassurance' },
  { icon: Sparkles, title: 'Genuine products', subtitle: 'Only the real thing' },
  { icon: HeartHandshake, title: 'Here to help', subtitle: 'Real people, real support' },
];

const TrustStrip = () => {
  return (
    <section className="trust-strip">
      <h2>A little peace of mind, with every order.</h2>
      <div className="trust-strip__grid">
        {trustItems.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="trust-strip__item">
            <Icon size={24} strokeWidth={1.6} />
            <div>
              <div className="trust-strip__title">{title}</div>
              <div className="trust-strip__subtitle">{subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustStrip;
