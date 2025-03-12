import React, { useContext, useState, useEffect, useCallback } from "react";
import { BooksContext } from '../../BooksContext';
import SortCart from './SortCart';
import "./Slider.css";

const Slider = () => {
  const { books, fieldState } = useContext(BooksContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [banners, setBanners] = useState([]);
  const [isImageError, setIsImageError] = useState(false); 

  useEffect(() => {
    if (!fieldState) return;
    const loadedBanners = Object.entries(fieldState)
      .filter(([key]) => key.startsWith("baner"))
      .map(([key, value]) => ({ key, value }));
    setBanners(loadedBanners);
  }, [fieldState]);

  const nextSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      setIsImageError(false); 
    }
  }, [banners]);

  const handleBannerClick = () => {
    if (banners.length === 0) return;
    setIsAutoPlay(false);
    const bannerKey = banners[currentIndex].key.replace("baner", "");
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
    setIsImageError(false); 
  };

  useEffect(() => {
    if (!isAutoPlay) return;
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide, isAutoPlay]);

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

      {filteredResults.length > 0 && (
        <div className="search-results-content">
          <SortCart props={filteredResults} componentName="Search" />
        </div>
      )}
    </div>
  );
};

export default Slider;



// import React, { useContext, useState, useEffect, useCallback } from "react";
// import { BooksContext } from '../../BooksContext';
// import { useIcons } from '../../IconContext';
// import SortCart from './SortCart';
// import "./Slider.css";

// const Slider = () => {
//   const { books, fieldState } = useContext(BooksContext);
//   const { notFound } = useIcons(); 
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [filteredResults, setFilteredResults] = useState([]);
//   const [isAutoPlay, setIsAutoPlay] = useState(true);
//   const [banners, setBanners] = useState([]); 

 
//   useEffect(() => {
//     if (!fieldState) return;

//     const loadedBanners = Object.entries(fieldState)
//       .filter(([key]) => key.startsWith("baner"))
//       .map(([key, value]) => ({ key, value }));

//     setBanners(loadedBanners);
//   }, [fieldState]); 
 
//   const nextSlide = useCallback(() => {
//     if (banners.length > 0) {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
//     }
//   }, [banners]);
  
//   const handleBannerClick = () => {
//     if (banners.length === 0) return;
//     setIsAutoPlay(false);

//     const bannerKey = banners[currentIndex].key.replace("baner", "");
//     const filtered = books.filter(book =>
//       book.Tip.split(',')
//         .map(tip => tip.trim())
//         .includes(`baner${bannerKey}`)
//     );
//     setFilteredResults(filtered);
//   };
  
//   const handleDotClick = (index) => {
//     setCurrentIndex(index);
//     setIsAutoPlay(false);
//   };
  
//   useEffect(() => {
//     if (!isAutoPlay) return;
//     const slideInterval = setInterval(nextSlide, 5000);
//     return () => clearInterval(slideInterval);
//   }, [nextSlide, isAutoPlay]);

//   return (
//     <div className="banner-slider-container">
//       {banners.length === 0 ? (
//         <div>No banners available</div>
//       ) : (
//         <>
//           <div className="banner-slider-content" onClick={handleBannerClick}>
//             <img 
//               src={banners[currentIndex]?.value} 
//               alt={`Banner ${banners[currentIndex]?.key}`} 
//               className="banner-slider-image" 
//               onError={(e) => e.target.src = notFound} 
//             />
//           </div>

//           <div className="dots-container">
//             {banners.map((_, index) => (
//               <div
//                 key={index}
//                 className={`dot ${index === currentIndex ? 'active' : ''}`}
//                 onClick={() => handleDotClick(index)}
//               />
//             ))}
//           </div>
//         </>
//       )}

//       {filteredResults.length > 0 && (
//         <div className="search-results-content">
//           <SortCart props={filteredResults} componentName="Search" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Slider;