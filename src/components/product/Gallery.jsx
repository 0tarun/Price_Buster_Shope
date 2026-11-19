import { useMemo, useState } from 'react';
import { Play, Search } from 'lucide-react';
import { Lightbox } from './Lightbox';

const productVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export function Gallery({ product }) {
  const images = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length) return product.images.filter(Boolean);
    return product?.image ? [product.image] : [];
  }, [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMode, setLightboxMode] = useState('image');

  const showImage = (index) => {
    setActiveIndex(Math.max(0, Math.min(index, images.length - 1)));
    setLightboxMode('image');
  };

  const openVideo = () => {
    setLightboxMode('video');
    setLightboxOpen(true);
  };

  const isVideoActive = lightboxMode === 'video';

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        {isVideoActive && lightboxOpen ? (
          <video className="product-gallery__video-preview" controls src={productVideoUrl} />
        ) : images.length ? (
          <img
            src={images[activeIndex]}
            alt={`${product?.name || 'Product'} view ${activeIndex + 1}`}
            loading="eager"
            fetchPriority="high"
            className="product-gallery__image"
          />
        ) : (
          <div className="product-gallery__placeholder">ছবি যোগ করা হয়নি</div>
        )}
        {images.length ? (
          <button type="button" className="product-gallery__zoom" aria-label="Open product image gallery" onClick={() => { setLightboxMode('image'); setLightboxOpen(true); }}>
            <Search size="1rem" strokeWidth={2} />
          </button>
        ) : null}
      </div>

      <div className="product-gallery__thumbs" role="tablist" aria-label="Product gallery thumbnails">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            role="tab"
            aria-selected={index === activeIndex && !isVideoActive}
            aria-label={`View image ${index + 1}`}
            className={index === activeIndex && !isVideoActive ? 'product-gallery__thumb product-gallery__thumb--active' : 'product-gallery__thumb'}
            onClick={() => showImage(index)}
            onMouseEnter={() => showImage(index)}
          >
            <img src={image} alt={`${product?.name || 'Product'} thumbnail ${index + 1}`} loading="lazy" />
          </button>
        ))}

        <button
          type="button"
          className={isVideoActive ? 'product-gallery__thumb product-gallery__thumb--video product-gallery__thumb--active' : 'product-gallery__thumb product-gallery__thumb--video'}
          onClick={openVideo}
          aria-label="Play product video"
        >
          <div className="product-gallery__video-overlay">
            <Play size="0.875rem" strokeWidth={2} fill="currentColor" />
            <span>Video</span>
          </div>
        </button>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        images={images}
        activeIndex={activeIndex}
        productName={product?.name || 'Product'}
        videoUrl={lightboxMode === 'video' ? productVideoUrl : null}
        onClose={() => setLightboxOpen(false)}
        onNext={() => showImage(activeIndex + 1)}
        onPrev={() => showImage(activeIndex - 1)}
        mode={lightboxMode}
      />
    </div>
  );
}

export default Gallery;
