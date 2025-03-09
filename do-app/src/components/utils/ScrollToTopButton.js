import React, { useState, useEffect, useContext } from 'react';
import { useIcons } from '../../IconContext';
import { BooksContext } from '../../BooksContext';
import './scrollToTopButton.css';

export default function ScrollToTopButton({ componentName }) {
    const [showButton, setShowButton] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const { setShowSections } = useContext(BooksContext);
    const { category,     
            filter,        
            search
          } = useIcons();

    const scrollUp = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToElement = (id, sectionKey = null) => {
        if (sectionKey) {
            setShowSections({ [sectionKey]: true });
        }
        
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                if (id === "search-input") {
                    element.focus();
                }
            }
        }, 0);
    };    

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 100);
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;            
            setScrollProgress(scrollPercent);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {showButton && (
                 <div id="scroll-to-top-btn" className="scroll-to-top-btn" onClick={scrollUp}>
                     <div className="scroll-progress" style={{ background: `conic-gradient(#4caf50 ${scrollProgress}%, var(--modal-bg) ${scrollProgress}% 100%)` }}></div>
                     <div className="scroll-arrow">   
                         <svg width="24" height="24" viewBox="0 0 24 24">
                             <path d="M7.41 16.16L12 11.58l4.59 4.58L18 13.72l-6-6-6 6z" stroke="var(--text)" fill="var(--text)"/>
                         </svg>   
                     </div>
                 </div>
            )}
            {componentName === "Filter" && (
                <div id="floating-buttons" className="floating-buttons">
                    <img id="scroll-catalog-btn" className="cancel-button select" src={category} alt="catalog" onClick={() => scrollToElement('section-list', 'BookList')} />
                    <img id="scroll-search-btn" className="cancel-button select" src={search} alt="Search" onClick={() => scrollToElement('search-input')} />
                    <img id="scroll-filter-btn" className="cancel-button select" src={filter} alt="filter" onClick={() => scrollToElement('sectionFilter', 'Filter')} />
                </div>
            )}
        </>
    );
}