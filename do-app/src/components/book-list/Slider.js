import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { BooksContext } from '../../BooksContext';
import SortCart from './SortCart';
import "./Slider.css";
import LazyImage from '../utils/LazyImage';

const Slider = () => {
  const { books, fieldState } = useContext(BooksContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isAutoPlay, setIsAutoPlay] = useState(true); 
  
  const bannerSlides = useMemo(() => {
    return fieldState
      ? Object.entries(fieldState)
          .filter(([key]) => key.startsWith("baner"))
          .map(([key, value]) => ({ key, value }))
      : [];
  }, [fieldState]);
  
  const nextSlide = useCallback(() => {
    if (bannerSlides.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerSlides.length);
    }
  }, [bannerSlides.length]);
  
  const handleBannerClick = () => {
    if (bannerSlides.length === 0) return;
    setIsAutoPlay(false); 

    const bannerKey = bannerSlides[currentIndex].key.replace("baner", "");
    const filtered = books.filter(book =>
      book.Tip.split(',')
        .map(tip => tip.trim())
        .includes(`baner${bannerKey}`)
    );
    setFilteredResults(filtered);
  };
  
  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false); 
  };

  // Automatically switch slides every 5 seconds if isAutoPlay = true
  useEffect(() => {
    if (!isAutoPlay) return;

    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [nextSlide, isAutoPlay]);

  return (
    <div className="banner-slider-container">
      {bannerSlides.length === 0 ? (
        <div>No banners available</div>
      ) : (
        <>
          <div className="banner-slider-content" onClick={handleBannerClick}>
            <LazyImage 
              src={bannerSlides[currentIndex].value} 
              alt={`Banner ${bannerSlides[currentIndex].key}`} 
              className="banner-slider-image" 
            />
          </div>

          <div className="dots-container">
            {bannerSlides.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </>
      )}

      {filteredResults.length > 0 && (
        <div className="search-results-content">
          <SortCart props={filteredResults} componentName="Search" />
        </div>
      )}
    </div>
  );
};

export default Slider;