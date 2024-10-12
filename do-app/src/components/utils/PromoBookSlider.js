import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { BooksContext } from '../../BooksContext';
import { Link } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';
import './SpecificBookSlider.css';
import LazyImage from './LazyImage';
import getPublicUrl from '../functional/getPublicUrl';

const PromoBookSlider = ({ prompt }) => {
  const { books, fieldState, setSpecificBook, promoBookSlider, theme } = useContext(BooksContext);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const scrollRef = useRef(null);

  const weights = useMemo(() => ({
    promo: 3,
    BookList: 2,
    Search: 2,
    Filter: 2,
  }), []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width < 600) {
      setItemsPerPage(7);
    } else if (width < 1200) {
      setItemsPerPage(12);
    } else {
      setItemsPerPage(20);
    }
  };

  const debouncedUpdateItemsPerPage = useDebounce(updateItemsPerPage, 300);

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', debouncedUpdateItemsPerPage);

    return () => {
      window.removeEventListener('resize', debouncedUpdateItemsPerPage);
    };
  }, [debouncedUpdateItemsPerPage]);

  const promoBooks = useMemo(() => 
    books.filter(book => book.Tip.split(',').includes('promo') && book.Visibility !== '0')
  , [books]);

  const otherBooks = useMemo(() => 
    Object.keys(promoBookSlider)
      .filter(key => key !== prompt)
      .flatMap(key => promoBookSlider[key])
      .map(id => books.find(book => book.id === id))
      .filter(book => book && book.Visibility !== '0' && !book.Tip.split(',').includes('promo') && !promoBooks.includes(book))
  , [books, promoBookSlider, prompt, promoBooks]);

  const totalWeight = useMemo(() => 
    weights.promo + Object.keys(weights).filter(key => key !== prompt).reduce((sum, key) => sum + weights[key], 0)
  , [weights, prompt]);

  const promoCount = useMemo(() => Math.round((weights.promo / totalWeight) * itemsPerPage), [weights, totalWeight, itemsPerPage]);
  const otherCounts = useMemo(() => Object.keys(weights)
    .filter(key => key !== 'promo' && key !== prompt)
    .reduce((acc, key) => ({ ...acc, [key]: Math.round((weights[key] / totalWeight) * itemsPerPage) }), {}), [weights, itemsPerPage, prompt, totalWeight]);

  const bookIdsToDisplay = useMemo(() => {
    const promoBookIds = promoBooks.slice(0, promoCount).map(book => book.id);
    const otherBookIds = Object.keys(otherCounts).flatMap(key => {
      const validBooks = otherBooks.filter(book => promoBookSlider[key].includes(book.id));
      return validBooks.slice(0, otherCounts[key]).map(book => book.id);
    });

    const allIds = [...promoBookIds, ...otherBookIds];
    const uniqueIds = Array.from(new Set(allIds));

    return uniqueIds.slice(0, itemsPerPage);
  }, [promoBooks, promoCount, otherCounts, otherBooks, itemsPerPage, promoBookSlider]);

  const handleBookClick = (bookId) => {
    setSpecificBook({ id: bookId });
  };

  const getImageSource = (book) => {
    const currentImageIndex = 0;
    const folder = 'img';
  
    const imagespublic = book.imageblockpublic && book.imageblockpublic !== ""
        ? book.imageblockpublic.split(',').map(element => 
            getPublicUrl({ folder, filename: element })
        )
        : book.imageblock.split(',');
   
    return book.imagepublic && book.imagepublic !== ""
        ? getPublicUrl({ folder, filename: book.imagepublic })
        : book.image && book.image !== ''
            ? book.image
            : imagespublic[currentImageIndex];
};  

  const updateScrollButtonsVisibility = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  useEffect(() => {
    const currentScrollRef = scrollRef.current; // Copy current ref
    updateScrollButtonsVisibility(); // Initial check
    window.addEventListener('resize', updateScrollButtonsVisibility); // Add resize event listener

    if (currentScrollRef) {
      currentScrollRef.addEventListener('scroll', updateScrollButtonsVisibility); // Add scroll event listener
    }

    return () => {
      window.removeEventListener('resize', updateScrollButtonsVisibility); // Cleanup resize event listener
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('scroll', updateScrollButtonsVisibility); // Cleanup scroll event listener
      }
    };
  }, [updateScrollButtonsVisibility, bookIdsToDisplay]);

  return (
    <div className={`slider-wrapper ${theme}`}>
      {showLeftButton && <button className="scroll-button-specific left" onClick={() => handleScroll('left')}>{'<'}</button>}
      <div className="slider-container-specific" ref={scrollRef}>
        {bookIdsToDisplay.map(bookId => {
          const book = books.find(b => b.id === bookId);
          return book && (
            <Link className="book-card-specific" to="/specificbook" key={book.id} onClick={() => handleBookClick(book.id)}>
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
          );
        })}
      </div>
      {showRightButton && <button className="scroll-button-specific right" onClick={() => handleScroll('right')}>{'>'}</button>}
    </div>
  );
};

export default PromoBookSlider;