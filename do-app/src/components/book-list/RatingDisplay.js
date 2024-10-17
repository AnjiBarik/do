import React from 'react';
import './RatingDisplay.css'; 

export default function RatingDisplay({ idPrice, idProduct, ratingData }) {
  
  //console.log(idProduct, ratingData);
  const productRating = ratingData.find(    
    (item) => `${item.ID_Price}` === `${idPrice}` && `${item.ID_Product}` === `${idProduct}`
  );

  if (!productRating) {
    return null;
  }

  const { Average_Rating, Review_Count } = productRating;

  const renderStars = (averageRating) => {
    const fullStars = Math.floor(averageRating); // Full stars
    const halfStar = averageRating % 1 >= 0.5 ? 1 : 0; // Half star
    const emptyStars = 5 - fullStars - halfStar; // Empty stars

    return (
      <span >
        {Array(fullStars).fill().map((_, i) => (
          <span key={`full-${i}`} className="star filled">★</span>
        ))}
        {halfStar === 1 && <span className="star half-filled">★</span>}
        {Array(emptyStars).fill().map((_, i) => (
          <span key={`empty-${i}`} className="star">★</span>
        ))}
      </span>
    );
  };
 
  return (
   <>
        {renderStars(Average_Rating)} {/* Star display */}
        <span className="review-count">
           {Review_Count} {/* Number of reviews with icon */}
        </span>
        </> 
  );
}
