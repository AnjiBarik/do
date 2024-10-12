import React, { useEffect, useRef } from 'react';
import { useIcons } from '../../IconContext';

const LazyImage = ({ src, alt, className }) => {
  const {
    notFound, } = useIcons();
  const imgRef = useRef(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    const currentImgRef = imgRef.current;
    if (currentImgRef) {
      observer.observe(currentImgRef);
    }

    return () => {
      if (currentImgRef) {
        observer.unobserve(currentImgRef);
      }
    };
  }, []);

  return (
    <img
      ref={imgRef}
      data-src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.src = notFound;
      }}
    />
  );
};

export default LazyImage;
