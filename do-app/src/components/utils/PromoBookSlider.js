import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { BooksContext } from '../../BooksContext';
import { Link } from 'react-router-dom';
import './SpecificBookSlider.css';
import LazyImage from './LazyImage';
import getPublicUrl from '../functional/getPublicUrl';

const PromoBookSlider = () => {
  const { books, fieldState, setSpecificBook, promoBookSlider, theme } = useContext(BooksContext);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const scrollRef = useRef(null);

  const weights = useMemo(() => ({
    promo: 3,
    Filter: 3,
    Search: 3,
  }), []);
  
  const updateItemsPerPage = useCallback(() => {
    const width = window.innerWidth;
    setItemsPerPage(width < 600 ? 7 : width < 1200 ? 12 : 20);
  }, []);

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, [updateItemsPerPage]);

  const promoBooks = useMemo(() => 
    books.filter(book => book.Tip?.split(',').includes('promo') && book.Visibility !== '0'), 
  [books]);

  const bookMap = useMemo(() => new Map(books.map(book => [book.id, book])), [books]);

  const filterBooks = useMemo(() => 
    (promoBookSlider.Filter || []).map(id => bookMap.get(id)).filter(book => book && book.Visibility !== '0'),
  [bookMap, promoBookSlider.Filter]);

  const searchBooks = useMemo(() => 
    (promoBookSlider.Search || []).map(id => bookMap.get(id)).filter(book => book && book.Visibility !== '0'),
  [bookMap, promoBookSlider.Search]);

  const totalWeight = useMemo(() => Object.values(weights).reduce((sum, w) => sum + w, 0), [weights]);

  const promoCount = useMemo(() => Math.round((weights.promo / totalWeight) * itemsPerPage), [weights, totalWeight, itemsPerPage]);
  const filterCount = useMemo(() => Math.round((weights.Filter / totalWeight) * itemsPerPage), [weights, totalWeight, itemsPerPage]);
  const searchCount = useMemo(() => Math.round((weights.Search / totalWeight) * itemsPerPage), [weights, totalWeight, itemsPerPage]);

  const bookIdsToDisplay = useMemo(() => {
    const promoBookIds = promoBooks.slice(0, promoCount).map(book => book.id);
    const filterBookIds = filterBooks.slice(0, filterCount).map(book => book.id);
    const searchBookIds = searchBooks.slice(0, searchCount).map(book => book.id);
    
    return Array.from(new Set([...promoBookIds, ...filterBookIds, ...searchBookIds])).slice(0, itemsPerPage);
  }, [promoBooks, promoCount, filterBooks, filterCount, searchBooks, searchCount, itemsPerPage]);

  const handleBookClick = (bookId) => {
    if (bookId) setSpecificBook(prev => ({ ...prev, id: bookId }));
  };

  const getImageSource = (book) => {
    const folder = 'img';
    if (book.imagepublic) return getPublicUrl({ folder, filename: book.imagepublic });
    if (book.image) return book.image;
    const imagespublic = book.imageblockpublic?.split(',').map(element => getPublicUrl({ folder, filename: element })) ?? [];
    return imagespublic[0] || '';
  };

  const updateScrollButtonsVisibility = useCallback(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    
    setShowLeftButton(scrollElement.scrollLeft > 0);
    setShowRightButton(scrollElement.scrollLeft < scrollElement.scrollWidth - scrollElement.clientWidth);
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    updateScrollButtonsVisibility();
    window.addEventListener('resize', updateScrollButtonsVisibility);
    if (scrollElement) {
      scrollElement.addEventListener('scroll', updateScrollButtonsVisibility);
    }
    return () => {
      window.removeEventListener('resize', updateScrollButtonsVisibility);
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', updateScrollButtonsVisibility);
      }
    };
  }, [updateScrollButtonsVisibility, bookIdsToDisplay]);
  
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };
  
  return (
    <div className={`slider-wrapper ${theme}`}>
      <div className="slider-title">Top Products</div>
      {showLeftButton && (
        <button className="scroll-button-specific left" onClick={() => handleScroll('left')}>
          {'<'}
        </button>
      )}
      <div className="slider-container-specific" ref={scrollRef}>
        {bookIdsToDisplay.map(bookId => {
          const book = bookMap.get(bookId);
          if (!book) return null;
          return (
            <Link className="book-card-specific" to="/specificbook" key={book.id} onClick={() => handleBookClick(book.id)}>
              <LazyImage src={getImageSource(book)} alt={book.title} className={'artmini-specific'} />
              {book.price && <b className='book-size'>{book.price}{fieldState.payment ?? ''}</b>}
              <div>{book.title?.length >= 12 ? book.title.slice(0, 9) + '...' : book.title}</div>
            </Link>
          );
        })}
      </div>
      {showRightButton && (
        <button className="scroll-button-specific right" onClick={() => handleScroll('right')}>
          {'>'}
        </button>
      )}
    </div>
  );
  
};

export default PromoBookSlider;