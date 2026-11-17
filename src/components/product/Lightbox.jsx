import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function Lightbox({ isOpen, images, activeIndex, onClose, onNext, onPrev, productName, videoUrl, mode = 'image' }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (mode !== 'video' && event.key === 'ArrowRight') {
        onNext();
      }
      if (mode !== 'video' && event.key === 'ArrowLeft') {
        onPrev();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, mode, onClose, onNext, onPrev]);

  if (!isOpen) {
    return null;
  }

  if (mode === 'video') {
    return (
      <div className="product-lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Product video preview">
        <div className="product-lightbox__inner product-lightbox__inner--video" onClick={(event) => event.stopPropagation()}>
          <button type="button" className="product-lightbox__close" onClick={onClose} aria-label="Close video viewer">
            <X size={18} strokeWidth={2} />
          </button>

          <video className="product-lightbox__video" controls playsInline preload="metadata" src={videoUrl} />
        </div>
      </div>
    );
  }

  if (!images.length) {
    return null;
  }

  const image = images[activeIndex] || images[0];

  return (
    <div className="product-lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Product image gallery">
      <div className="product-lightbox__inner" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="product-lightbox__close" onClick={onClose} aria-label="Close image viewer">
          <X size={18} strokeWidth={2} />
        </button>

        <button type="button" className="product-lightbox__nav product-lightbox__nav--prev" onClick={onPrev} aria-label="Previous image">
          <ChevronLeft size={24} strokeWidth={2} />
        </button>

        <img src={image} alt={`${productName} view ${activeIndex + 1}`} className="product-lightbox__image" />

        <button type="button" className="product-lightbox__nav product-lightbox__nav--next" onClick={onNext} aria-label="Next image">
          <ChevronRight size={24} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default Lightbox;
