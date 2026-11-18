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
import { categories } from '../data/products';
import { getHomepageSettings } from '../services/api';
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
  const [slides, setSlides] = useState([]);
  const [sideBanner, setSideBanner] = useState(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [bannerError, setBannerError] = useState('');
  const [now, setNow] = useState(null);

  useEffect(() => {
    let active = true;
    getHomepageSettings()
      .then(({ heroSlides: savedSlides = [], sideBanner: savedSideBanner = null }) => {
        if (!active) return;
        setSlides(savedSlides.filter((item) => item?.image));
        setSideBanner(savedSideBanner?.image ? savedSideBanner : null);
      })
      .catch((error) => {
        if (active) setBannerError(error.message);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const expiresAt = Date.parse(sideBanner?.endTime || '');
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return undefined;

    const timer = window.setInterval(() => {
      const timestamp = Date.now();
      setNow(timestamp);
      if (timestamp >= expiresAt) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [sideBanner?.endTime]);

  useEffect(() => {
    if (paused || slides.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const activeIndex = slides.length ? current % slides.length : 0;
  const slide = slides[activeIndex];
  const goToSlide = (nextIndex) => setCurrent(nextIndex);
  const heroClass = `hero-grid${slide ? ' hero-grid--main' : ''}${sideBanner ? ' hero-grid--side' : ''}`;
  const offerEnd = Date.parse(sideBanner?.endTime || '');
  const offerSeconds = now === null ? 0 : Math.max(0, Math.floor((offerEnd - now) / 1000));
  const showOfferTimer = now !== null && Number.isFinite(offerEnd) && offerSeconds > 0;
  const offerTime = [
    Math.floor(offerSeconds / 3600),
    Math.floor((offerSeconds % 3600) / 60),
    offerSeconds % 60,
  ].map((value) => String(value).padStart(2, '0')).join(' : ');

  return (
    <section className={heroClass}>
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

      {slide ? (
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
            {slide.productId ? (
              <Link to={`/product/${slide.productId}`} className="primary-button hero__cta">
                <span>{slide.buttonLabel || 'Shop now'}</span>
                <ChevronRight size={14} strokeWidth={2} />
              </Link>
            ) : null}
            {slides.length > 1 ? (
              <>
                <div className="hero__slider-controls" aria-label="Hero slider controls">
                  <div className="hero__counter">{String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</div>
                  <button type="button" className="hero__slider-button" onClick={() => goToSlide((activeIndex - 1 + slides.length) % slides.length)} aria-label="Previous slide">
                    <ArrowLeft size={14} strokeWidth={2} />
                  </button>
                  <div className="hero__slider-dots">
                    {slides.map((item, index) => (
                      <button key={item.id || index} type="button" className={index === activeIndex ? 'hero__dot hero__dot--active' : 'hero__dot'} onClick={() => goToSlide(index)} aria-label={`Show slide ${index + 1}`} />
                    ))}
                  </div>
                  <button type="button" className="hero__slider-button" onClick={() => goToSlide((activeIndex + 1) % slides.length)} aria-label="Next slide">
                    <ArrowRight size={14} strokeWidth={2} />
                  </button>
                </div>
              </>
            ) : null}
          </div>
          <div className="hero__banner-image-wrap">
            <img src={slide.image} alt={slide.eyebrow || slide.title} className="hero__banner-image" loading="eager" fetchPriority="high" />
          </div>
        </div>
      ) : null}

      {sideBanner ? (
        <aside className="hero__deal-card">
          <img src={sideBanner.image} alt={sideBanner.title} className="hero__deal-image" loading="lazy" />
          <div className="hero__deal-content">
            <div className="hero__deal-label">{sideBanner.eyebrow}</div>
            <div className="hero__deal-info">
              <h3>{sideBanner.title}</h3>
              <p>{sideBanner.description}</p>
              <div className="hero__deal-price-row">
                <span className="hero__deal-price">৳ {Number(sideBanner.price).toLocaleString('en-BD')}</span>
                {Number(sideBanner.oldPrice) > 0 ? <span className="hero__deal-old-price">৳ {Number(sideBanner.oldPrice).toLocaleString('en-BD')}</span> : null}
              </div>
              {showOfferTimer ? (
                <div className="hero__deal-timer" aria-label="Special offer ends in">
                  <span className="hero__deal-timer-label">ENDS IN</span>
                  <span className="hero__deal-timer-value">{offerTime}</span>
                </div>
              ) : null}
              {sideBanner.productId ? (
                <Link to={`/product/${sideBanner.productId}`} className="primary-button hero__deal-button">
                  <span>{sideBanner.buttonLabel || 'Shop now'}</span>
                  <ChevronRight size={14} strokeWidth={2} />
                </Link>
              ) : null}
            </div>
          </div>
        </aside>
      ) : null}
      {bannerError && !slide && !sideBanner ? (
        <p className="hero__load-error" role="status">ব্যানার লোড করা যায়নি: {bannerError}</p>
      ) : null}
    </section>
  );
};

export default Hero;
