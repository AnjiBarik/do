import React, { useContext, useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BooksContext } from '../../BooksContext';
import LazyImage from '../utils/LazyImage';
import getPublicUrl from '../functional/getPublicUrl';
import "../utils/SpecificBookSlider.css";
import "./Slider.css";

const Slider = () => {
  const { books, fieldState, setSpecificBook, theme } = useContext(BooksContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBannerBooks, setSelectedBannerBooks] = useState([]);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [banners, setBanners] = useState([]);
  const [isImageError, setIsImageError] = useState(false);
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  useEffect(() => {
    if (!fieldState) return;
    const loadedBanners = Object.entries(fieldState)
      .filter(([key]) => key.startsWith("baner"))
      .map(([key, value]) => ({ key, value }));
    setBanners(loadedBanners);
  }, [fieldState]);

  useEffect(() => {
    if (isAutoPlay && banners.length > 0) {
      const slideInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        setIsImageError(false);
      }, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [isAutoPlay, banners]); 

  const handleBannerClick = () => {
    if (banners.length === 0) return;
    setIsAutoPlay(false);
    const bannerKey = banners[currentIndex].key.replace("baner", "");

    const filteredBooks = books.filter(book =>
      book.Tip.split(',')
        .map(tip => tip.trim())
        .includes(`baner${bannerKey}`)
    );
    setSelectedBannerBooks(filteredBooks);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setIsImageError(false);
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
  }, [updateScrollButtonsVisibility, selectedBannerBooks]);

  return (
    <div className="banner-slider-container">
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
     
      {selectedBannerBooks.length > 0 && (
        <div className={`slider-wrapper ${theme}`}>
          <div className="slider-title">{`Banner ${banners[currentIndex]?.key}`}</div>
          {showLeftButton && (
            <button className="scroll-button-specific left" onClick={() => scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })}>
              {'<'}
            </button>
          )}
          <div className="slider-container-specific" ref={scrollRef}>
            {selectedBannerBooks.map(book => (
              <Link 
                className="book-card-specific" 
                to="/specificbook" 
                key={book.id} 
                onClick={() => handleBookClick(book.id)}
              >
                <LazyImage
                  src={getImageSource(book)}
                  alt={book.title}
                  className={'artmini-specific'}
                />
                {book.price && <b className='book-size'>{book.price}{fieldState.payment ? fieldState.payment : ""}</b>}
                <div>
                  {book.title && (book.title.length >= 12 ? book.title.slice(0, 9) + '...' : book.title)}
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