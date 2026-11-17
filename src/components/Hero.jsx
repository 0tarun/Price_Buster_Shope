import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CircleDot,
  Gem,
  HeartPulse,
  Home,
  LayoutGrid,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, heroSlides } from '../data/products';
import dealShampoo from '../assets/images/deal-shampoo.jpg';
import './Hero.css';

const departmentIcons = {
  'beauty-personal-care': Sparkles,
  'home-living': Home,
  electronics: CircleDot,
  'fashion-accessories': Gem,
  'health-wellness': HeartPulse,
  'baby-kids': Star,
  'sports-outdoors': Target,
  'grocery-essentials': LayoutGrid,
};

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = heroSlides[current];
  const goToSlide = (nextIndex) => setCurrent(nextIndex);

  return (
    <section className="hero-grid">
      <aside className="hero__sidebar">
        <div className="hero__sidebar-title">SHOP BY DEPARTMENT</div>
        <div className="hero__sidebar-list">
          {categories.map(({ slug, name }) => {
            const Icon = departmentIcons[slug] || Sparkles;
            const isActive = slug === 'beauty-personal-care';

            return (
              <Link key={slug} to={`/category/${slug}`} className={isActive ? 'hero__department hero__department--active' : 'hero__department'}>
                <div className="hero__department-main">
                  <Icon size={18} strokeWidth={1.7} />
                  <span>{name}</span>
                </div>
                <ChevronRight size={14} strokeWidth={1.8} />
              </Link>
            );
          })}
        </div>
        <Link to="/new" className="hero__sidebar-link">
          <span>Explore all categories</span>
          <ChevronRight size={12} strokeWidth={2} />
        </Link>
      </aside>

      <div className="hero__banner" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="hero__banner-copy">
          <div className="hero__eyebrow">{slide.eyebrow}</div>
          <h1>
            {slide.title.split('\n').map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < slide.title.split('\n').length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
          <p>{slide.subtitle}</p>
          <Link to="/sale" className="primary-button hero__cta">
            <span>Explore the sale</span>
            <ChevronRight size={14} strokeWidth={2} />
          </Link>
          <div className="hero__sale-tag">
            <span className="hero__sale-label">UP TO</span>
            <span className="hero__sale-value">40% off</span>
          </div>
          <div className="hero__slider-controls" aria-label="Hero slider controls">
            <button type="button" className="hero__slider-button" onClick={() => goToSlide((current - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous slide">
              <ArrowLeft size={14} strokeWidth={2} />
            </button>
            <div className="hero__slider-dots">
              {heroSlides.map((_, index) => (
                <button key={`${index}-dot`} type="button" className={index === current ? 'hero__dot hero__dot--active' : 'hero__dot'} onClick={() => goToSlide(index)} aria-label={`Show slide ${index + 1}`} />
              ))}
            </div>
            <button type="button" className="hero__slider-button" onClick={() => goToSlide((current + 1) % heroSlides.length)} aria-label="Next slide">
              <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>
          <div className="hero__counter">{String(current + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</div>
        </div>
        <div className="hero__banner-image-wrap">
          <img src={slide.image} alt={slide.eyebrow} className="hero__banner-image" loading="eager" fetchPriority="high" />
        </div>
      </div>

      <aside className="hero__deal-card">
        <div className="hero__deal-label">TODAY'S LITTLE WIN</div>
        <img src={dealShampoo} alt="Botanic herbal repair" className="hero__deal-image" loading="lazy" />
        <h3>Botanic herbal repair</h3>
        <p>Nourishment from root to tip.</p>
        <div className="hero__deal-price-row">
          <span className="hero__deal-price">৳ 690</span>
          <span className="hero__deal-old-price">৳ 990</span>
        </div>
        <div className="hero__deal-timer">
          <span className="hero__deal-timer-label">ENDS IN</span>
          <span className="hero__deal-timer-value">02 : 14 : 30</span>
        </div>
        <Link to="/product/botanic-herbal-repair-shampoo" className="primary-button hero__deal-button">
          <span>Shop the deal</span>
          <ChevronRight size={14} strokeWidth={2} />
        </Link>
      </aside>
    </section>
  );
};

export default Hero;
