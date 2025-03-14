import React, { useContext, useState, useEffect, useCallback, useRef, useMemo, useLayoutEffect } from 'react';
import { BooksContext } from '../../BooksContext';
import { Link } from 'react-router-dom';
import LazyImage from '../utils/LazyImage';
import getPublicUrl from '../functional/getPublicUrl';
import '../utils/SpecificBookSlider.css';
import "./Slider.css";

const Slider = () => {
  const { books, fieldState, setSpecificBook, theme } = useContext(BooksContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const scrollRef = useRef(null);
  const prevIndexRef = useRef(currentIndex);

  const banners = useMemo(() => (
    fieldState
      ? Object.entries(fieldState)
          .filter(([key]) => key.startsWith("baner"))
          .map(([key, value]) => ({ key, value }))
      : []
  ), [fieldState]);
 
  const updateBannerBooks = useCallback((index) => {
    if (banners.length === 0) return;
    const bannerKey = banners[index]?.key.replace("baner", "");
    setFilteredResults(books.filter(book =>
      book.Tip.split(',').map(tip => tip.trim()).includes(`baner${bannerKey}`)
    ));
  }, [banners, books]);
  
  const setBannerIndex = useCallback((index) => {
    if (prevIndexRef.current !== index) {
      prevIndexRef.current = index;
      setCurrentIndex(index);
      updateBannerBooks(index);
    }
  }, [updateBannerBooks]);
  
  const nextSlide = useCallback(() => setBannerIndex((prev) => (prev + 1) % banners.length), [banners.length, setBannerIndex]);
  const prevSlide = useCallback(() => setBannerIndex((prev) => (prev - 1 + banners.length) % banners.length), [banners.length, setBannerIndex]);
  
  const handleBannerClick = () => {
    setAutoSlide(false);
    updateBannerBooks(currentIndex);
  };
  
  const handleBookClick = (bookId) => {
    setSpecificBook({ id: bookId });
  };

    const getImageSource = (book) => {
    const folder = 'img';
    const imagesPublic = book.imageblockpublic
      ? book.imageblockpublic.split(',').map(img => getPublicUrl({ folder, filename: img }))
      : book.imageblock.split(',');

    return book.imagepublic
      ? getPublicUrl({ folder, filename: book.imagepublic })
      : book.image || imagesPublic[0];
  };

  const handleDotClick = (index) => {
    setBannerIndex(index);
    setAutoSlide(false);
  };
  
  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(interval);
  }, [nextSlide, autoSlide]);
  
  useEffect(() => {
    updateBannerBooks(currentIndex);
  }, [currentIndex, updateBannerBooks]);
 
  const updateScrollButtonsVisibility = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  useLayoutEffect(() => {
    const currentScrollRef = scrollRef.current;
    updateScrollButtonsVisibility();
    window.addEventListener('resize', updateScrollButtonsVisibility);

    if (currentScrollRef) {
      currentScrollRef.addEventListener('scroll', updateScrollButtonsVisibility);
    }

    return () => {
      window.removeEventListener('resize', updateScrollButtonsVisibility);
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('scroll', updateScrollButtonsVisibility);
      }
    };
  }, [updateScrollButtonsVisibility]);

  
  return (
    <div className="banner-slider-container">
      {/* Кнопки переключения банеров */}
      <button className="banner-slider-button top-left" onClick={prevSlide}>{'<'}</button>
      <button className="banner-slider-button top-right" onClick={nextSlide}>{'>'}</button>

      {banners.length === 0 ? (
        <div>No banners available</div>
      ) : (
        <>
          <div className="banner-slider-content" onClick={handleBannerClick}>
            {isImageError ? (
              <div className="banner-placeholder">
                {`Banner ${banners[currentIndex]?.key}`}
              </div>
            ) : (
              <img 
                src={banners[currentIndex]?.value} 
                alt={`Banner ${banners[currentIndex]?.key}`} 
                className="banner-slider-image" 
                onError={() => setIsImageError(true)}
              />
            )}
          </div>

          <div className="dots-container">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </>
      )}

      {/* Блок с книгами по баннеру */}
      {filteredResults.length > 0 && (
        <div className={`slider-wrapper ${theme}`}>
          <div className="slider-title">Related Items</div>

          {showLeftButton && (
            <button className="scroll-button-specific left" onClick={() => scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })}>
              {'<'}
            </button>
          )}

          <div className="slider-container-specific" ref={scrollRef}>
            {filteredResults.map(book => (
              <Link 
                className="book-card-specific" 
                to="/specificbook" 
                key={book.id} 
                onClick={() => handleBookClick(book.id)}
              >
                <LazyImage
                  src={getImageSource(book)}
                  alt={book.title}
                  className="artmini-specific"
                />
                {book.price && <b className='book-size'>{book.price}{fieldState.payment ? fieldState.payment : ""}</b>}
                <div>
                  {book.title.length >= 12 ? book.title.slice(0, 9) + '...' : book.title}
                </div>
              </Link>
            ))}
          </div>

          {showRightButton && (
            <button className="scroll-button-specific right" onClick={() => scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })}>
              {'>'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Slider;