import React, { useEffect, useState } from 'react';
import './Slider.css';
import { BooksContext } from '../../BooksContext';
import getPublicUrl from '../functional/getPublicUrl';

function Slider() {
    const { uiState, setUiMain, uiMain } = React.useContext(BooksContext);
    const [imageError, setImageError] = useState(false);  
    
    const [language, setLanguage] = useState('');

    useEffect(() => {
        const browserLanguage = navigator.language || navigator.languages[0];
        browserLanguage.startsWith('en') ? setLanguage('en') : setLanguage(browserLanguage);
    }, []);

    const handleImageError = () => {
        setImageError(true);
    };

    const handleSlideClick = (slideIndex) => {       
        setUiMain(uiState[slideIndex]);
    };

    const getImageSrc = (slide) => {
        if (slide.logopablic) {            
            return getPublicUrl({ folder:'logoimg', filename: slide.logopablic });
        }
        return slide.logo || '';
    };

    const getSlideClasses = (index) => {
        return `slide-container ${uiMain.id === index + 1 ? 'active' : ''}`;
    };

    const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))];

    return (
        <div className="slider-container">
            {uniqueAuthors.map(author => {
                const slidesByAuthor = uiState.filter(slide => slide.author === author);
                const slide = slidesByAuthor.find(slide => slide.lang === language || slide.lang === uiMain.lang) || slidesByAuthor[0];
                const slideIndex = uiState.indexOf(slide);

                return (
                    <div key={author} className={getSlideClasses(slideIndex)} onClick={() => handleSlideClick(slideIndex)}>                     
                       <div className="slide">
                            {(!imageError && (slide.logo || slide.logopablic)) ? (
                              <div className='border-img'> 
                                <img
                                    src={getImageSrc(slide)}
                                    alt={slide.title || `Slide ${slideIndex + 1}`}
                                    onError={handleImageError}
                                />
                               </div> 
                            ) : (
                                <div>
                                    <span className="slide-text">{slide.title}</span>
                                </div>
                            )}
                            <div className="slide-info">
                                <span>{slide.title}</span>
                            </div>
                            <div className="slide back">
                                <div>
                                    <h3>{slide.title}</h3>
                                    <p>{slide.author}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Slider;