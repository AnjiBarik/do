import React, { useContext, useRef, useState, useEffect } from 'react';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import './sliderSection.css';

const SliderSection = () => {
  const { books, setSelectedSection, setSelectedSubsection } = useContext(BooksContext);
  const { burger } = useIcons();
  const scrollRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const updateScrollButtonsVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    const currentScrollRef = scrollRef.current;
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
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Filter books based on Visibility and extract unique sections and subsections
  const visibleBooks = books.filter(book => book.Visibility !== '0');
  const uniqueSections = Array.from(new Set(visibleBooks.map(book => book.section).filter(Boolean)));
  const uniqueSubsections = Array.from(new Set(visibleBooks.flatMap(book => book.partition || []).filter(Boolean)));

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setSelectedSubsection(null); // Reset subsection when a section is selected
  };

  const handleSubsectionClick = (subsection) => {
    const section = visibleBooks.find(book => (book.partition || []).includes(subsection))?.section;
    setSelectedSection(section);
    setSelectedSubsection(subsection);
  };

  return ( 
    <div className="slider-container-section">         
      {showLeftScroll && <button className="scroll-button" onClick={scrollLeft}>{'<'}</button>}
      <div className="slider-section-subsection" ref={scrollRef}>
        {uniqueSections.map((section, index) => (        
            <div key={index} className="slider-item" onClick={() => handleSectionClick(section)}>
              <img className="cancel-button select" src={burger} alt="Cancel Product sections" />
              <div className='slider-text'>{section}+</div>
            </div>        
        ))}
        {uniqueSubsections.map((subsection, index) => (         
            <div key={index} className="slider-item" onClick={() => handleSubsectionClick(subsection)}>
              <div className='slider-text'>{subsection}</div>
            </div>         
        ))}
      </div>
      {showRightScroll && <button className="scroll-button" onClick={scrollRight}>{'>'}</button>}
    </div>
  );
};

export default SliderSection;