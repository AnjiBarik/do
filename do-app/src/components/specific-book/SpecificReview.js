import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { useGoogleScriptAPI } from '../hooks/useGoogleScriptAPI';
import { useAlertModal } from '../hooks/useAlertModal'; 
import { useConfirmModal } from '../hooks/useConfirmModal'; 
import { BooksContext } from '../../BooksContext';
import './SpecificReview.css'; 
import RatingDisplay from '../book-list/RatingDisplay';

export default function SpecificReview({ productId }) {
  const { getProductReviews, handleReview, getAggregatedData, loading: apiLoading } = useGoogleScriptAPI();
  const { savedLogin, fieldState, setRatingData, ratingData, verificationCode, loggedIn, uiMain, setShowRegistrationForm } = useContext(BooksContext);
  const { showAlert, AlertModalComponent } = useAlertModal(); 
  const { showConfirm, ConfirmModalComponent } = useConfirmModal(); 
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [addingReview, setAddingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showOnlyMyReviews, setShowOnlyMyReviews] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [activeSort, setActiveSort] = useState('first'); // Track active button for sorting
  const idPrice = fieldState.idprice;
  const URLAPI = uiMain.Urprice;

  // Validation pattern for textarea input
  const validationPatterns = useMemo(() => /^[^=+"'<>]{2,256}$/, []); 
  
  const updateData = useCallback(async () => {
    const fetchedReviews = await getProductReviews(URLAPI, idPrice, productId);
    if (fetchedReviews.length > 0) {
      setReviews(fetchedReviews);
    } else {
      setReviews([]);
    }
    setLoading(false);
  }, [idPrice, productId, getProductReviews, URLAPI]);

  const updateAggregatedData = useCallback(async () => {
    const aggregated = await getAggregatedData(URLAPI, idPrice);
    if (aggregated.length > 0) {
      setRatingData(aggregated); 
    }
  }, [URLAPI, idPrice, getAggregatedData, setRatingData]);

  useEffect(() => {
    const productRatingData = ratingData?.find((item) => `${item.ID_Product}` === `${productId}`);
    if (productRatingData) {
      updateData();
    } else {
      setLoading(false);
    }
  }, [productId, ratingData, updateData]);

  const handleAddReview = async () => {
    if (!newReview.trim() || !validationPatterns.test(newReview)) {
      showAlert("⚠️ Please ensure your review is between 2-256 characters and does not contain forbidden symbols.");
      return;
    }

    if (newReview.trim()) {
      setSubmitDisabled(true); 
      const reviewData = {
        idPrice,
        idProduct: productId,
        userName: savedLogin,
        rating,
        review: newReview,
        status: 'Active',
        verificationCode: verificationCode,
        Url: uiMain.Urregform
      };
      await handleReview(URLAPI, reviewData);
      setNewReview('');
      setRating(5);
      setAddingReview(false);
      await updateData();
      await updateAggregatedData();
      setSubmitDisabled(false); 
    }
  };

  const handleRemoveReview = async (reviewId) => {
    // Show confirmation modal
    const confirmed = await showConfirm("Are you sure you want to delete this review?");
    if (confirmed) {
      const reviewToRemove = reviews.find((review) => review.ID === reviewId);
      if (reviewToRemove) {
        const reviewData = {
          idPrice,
          idProduct: productId,
          userName: savedLogin,
          rating: reviewToRemove.Rating,
          review: reviewToRemove.Review,
          id: reviewId,
          status: 'Deleted',
          verificationCode: verificationCode,
          Url: uiMain.Urregform
        };

        const success = await handleReview(URLAPI, reviewData);
        if (success) {
          showAlert("✅ Review deleted successfully!");
          await updateData();
          await updateAggregatedData();
        } else {
          showAlert("❌ Failed to delete the review. Please try again.");
        }
      }
    }
  };

  const handleCancelReview = () => {
    setAddingReview(false);  
    setNewReview('');        
  };
  

  const renderStars = (currentRating, onHover, onClick) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= (hoverRating || currentRating) ? 'star filled' : 'star'}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={() => onHover(0)}
          onClick={() => onClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );

  const handleSortByDate = (order) => {
    const sortedReviews = [...reviews].sort((a, b) =>
      order === 'first' ? new Date(a.DateTime) - new Date(b.DateTime) : new Date(b.DateTime) - new Date(a.DateTime)
    );
    setReviews(sortedReviews);
    setActiveSort(order); 
  };

  const myReviews = reviews.filter((review) => review.Name === savedLogin);

  return (
    <section className="reviews-section">
      <span>
        <b>Product Reviews</b>
        <RatingDisplay idPrice={fieldState.idprice} idProduct={productId} ratingData={ratingData} />
      </span>      
      <div className="review-text">
        {reviews.length > 0 && (
          <>
            <button
              className={`selected-button ${activeSort === 'first' ? 'active-border' : ''}`}
              onClick={() => handleSortByDate('first')}
            >
              First/top
            </button>
            <button
              className={`selected-button ${activeSort === 'last' ? 'active-border' : ''}`}
              onClick={() => handleSortByDate('last')}
            >
              Last/top
            </button>
          </>
        )}
        {myReviews.length > 0 && (
          <button 
            className={`selected-button ${showOnlyMyReviews ? 'active-border' : ''}`} 
            onClick={() => setShowOnlyMyReviews(!showOnlyMyReviews)}
          >
            {showOnlyMyReviews ? 'Show all' : 'Only mine'}
          </button>
        )}
      </div>
      <div className="reviews-list-container">
        <div>
          {reviews.length > 0 ? (
            (showOnlyMyReviews ? myReviews : reviews).map((review) => (
              <div key={review.ID} className={`review-card ${review.Name === savedLogin ? 'my-review' : ''}`}>
                <div className="review-header">
                  <div className="review-text">{new Date(review.DateTime).toLocaleDateString()}</div>
                  <div className="review-text">{review.Name}</div>
                  <div>{renderStars(review.Rating, () => {}, () => {})}</div>
                  {loggedIn && review.Name === savedLogin && (
                    <button className="form-input active-border" onClick={() => handleRemoveReview(review.ID)}>🗑</button>
                  )}
                </div>
                <div className="review-content">
                  <p>{review.Review}</p>
                </div>
              </div>
            ))
          ) : (
            <>
              {loading || apiLoading ? (
                <div
                  style={{
                    display: 'inline-block',
                    animation: 'spin 1s linear infinite',
                    fontSize: '2rem',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <span className='star filled'>★★★★★</span>
                  <style>
                    {`
                      @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                </div>
              ) : (
                <p>No reviews available. Be the first to add a review!</p>
              )}
            </>
          )}
        </div>
      </div>
      {!loggedIn && (
        <button className="form-input active-border" onClick={() => setShowRegistrationForm(true)}>
          Please login to add a review
        </button>
      )}
      {!addingReview && loggedIn && (
        <button className="form-input active-border" onClick={() => setAddingReview(true)}>
          +Add Review
        </button>
      )}
      {addingReview && (
        <div className="add-review">
          <h4>Add a Review</h4>
          {renderStars(rating, setHoverRating, setRating)}
          <textarea className='form-input'
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Add a review...Must be 2-256 characters, without forbidden symbols."
            minLength={2}
            maxLength={256} 
          />
          <div className="button-group">
            <button
              className={`form-input ${submitDisabled ? '' : 'active-border'}`} 
              onClick={handleAddReview}
              disabled={submitDisabled} // Disable button during submission
            >
              {submitDisabled ? 'Submitting...' : 'Submit'}
            </button>
            <button
              className={`form-input ${submitDisabled ? '' : 'active-border'}`} 
              onClick={handleCancelReview}
              disabled={submitDisabled}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <AlertModalComponent /> 
      <ConfirmModalComponent /> 
    </section>
  );
}