import React, { useContext, useState, useCallback, useMemo, useLayoutEffect, useRef } from 'react';
import { BooksContext } from '../../BooksContext';
import './SpecificBookSlider.css';
import LazyImage from './LazyImage'; 
import getPublicUrl from '../functional/getPublicUrl';

const SpecificBookSlider = () => {
  const { books, fieldState, specificBook, setSpecificBook, theme } = useContext(BooksContext);
  const { id } = specificBook;
  const currentBook = books.find(book => book.id === id);
  const tip = currentBook ? currentBook.Tip : '';

  const scrollRef = useRef(null); // Ref for the scroll container

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const tipValues = useMemo(() => (
    tip.split(',').map(t => t.trim()).filter(t => t.toLowerCase() !== 'promo')
  ), [tip]);

  const sortedBooks = useMemo(() => {
    const uniqueBooks = new Map();

    books.forEach(book => {
      if (book.Visibility === '0' || book.id === id) return;

      const bookTips = book.Tip.split(',').map(t => t.trim());
      if (bookTips.includes('promo')) return;

      const isExactMatch = tipValues.every(t => bookTips.includes(t));
      const isPartialMatch = tipValues.some(t => bookTips.includes(t));

      if (isExactMatch || isPartialMatch) {
        uniqueBooks.set(book.id, book);
      }
    });

    return Array.from(uniqueBooks.values()).slice(0, 10);
  }, [books, id, tipValues]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      const newScrollLeft = direction === 'left'
        ? Math.max(scrollRef.current.scrollLeft - scrollAmount, 0)
        : Math.min(scrollRef.current.scrollLeft + scrollAmount, scrollRef.current.scrollWidth - scrollRef.current.clientWidth);

      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleBookClick = (bookId) => {
    setSpecificBook({ id: bookId });
  };

    const getImageSource = (book) => {
    const currentImageIndex = 0;
    const folder = 'img';

    // Generate the array of public images
    const imagespublic = book.imageblockpublic && book.imageblockpublic !== ""
        ? book.imageblockpublic.split(',').map(element => 
            getPublicUrl({ folder, filename: element })
        )
        : book.imageblock.split(',');

    // Determine the appropriate image source
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
      setShowRightButton(scrollLeft < (scrollWidth - clientWidth));
    }
  }, []);

  useLayoutEffect(() => {
    const currentScrollRef = scrollRef.current;
    updateScrollButtonsVisibility(); // Initial button visibility check
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
  }, [updateScrollButtonsVisibility, sortedBooks]);

  return (
    <div className={`slider-wrapper ${theme}`}>
      <div className="slider-title">Also of Interest</div>
      {showLeftButton && <button className="scroll-button-specific left" onClick={() => handleScroll('left')}>{'<'}</button>}
      <div className="slider-container-specific" ref={scrollRef}>
        {sortedBooks.map(book => (
          <div
            key={book.id}
            className="book-card-specific"
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
          </div>
        ))}
      </div>
      {showRightButton && <button className="scroll-button-specific right" onClick={() => handleScroll('right')}>{'>'}</button>}
    </div>
  );
};

export default SpecificBookSlider;