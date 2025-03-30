import React, { useEffect, useState } from 'react';
import './Slider.css';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import getPublicUrl from '../functional/getPublicUrl';
import { useSubmit } from '../hooks/useSubmit';
import LoadingAnimation from "../utils/LoadingAnimation";

function Slider() {
    const { uiState, setUiMain, uiMain, idLoudPrice } = React.useContext(BooksContext);
     const { buynow } = useIcons();
    const [imageError, setImageError] = useState(false); 
    const { Submit, loading } = useSubmit();  
    
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

    const handleSlideInfoClick = (e, slideIndex) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (uiMain.id === slideIndex + 1) {  
            Submit();
        }
    };

    const loadedPrice = uiState[idLoudPrice - 1]; 

    const visibleSlides = uiState.filter(slide =>  
      (!slide.parentId) || 
        (    
      loadedPrice &&
        (      
      uiMain.id === loadedPrice.id ||      
      uiMain.parentId === loadedPrice.id ||      
      slide.id === uiMain.id
        )
       )
    );
    

    const uniqueAuthors = [...new Set(uiState.map(slide => slide.author))];

    return (
        <div className="slider-container">
            {loading ? ( 
                <LoadingAnimation />
            ) : (
                uniqueAuthors.map(author => {
                    const slidesByAuthor = visibleSlides.filter(slide => slide.author === author);
                    if (slidesByAuthor.length === 0) return null;
                    const slide = slidesByAuthor.find(slide => slide.lang === language || slide.lang === uiMain.lang) || slidesByAuthor[0];
                    if (!slide) return null;
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
                                <div 
                                  onClick={(e) => handleSlideInfoClick(e, slideIndex)}
                                  className="slide-info"
                                >
                                    <img src={buynow} className="back-button-slider" alt="Proceed to checkout" /> 
                                    {loading ? "🌀..." : <span>{slide.title}</span> }                      
                                    
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
                })
            )}
        </div>
    );
}

export default Slider;