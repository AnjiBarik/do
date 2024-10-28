import { useState, useCallback } from 'react';

export const useGoogleScriptAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const getAggregatedData = useCallback(async (googleScriptUrl, idPrice) => {
    const formData = new FormData();
    formData.append('isReviews', 1); 
    formData.append('idPrice', idPrice);

    try {
      setLoading(true);
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json(); 
      if (!data.success) { 
        throw new Error(data.message || 'Failed to fetch aggregated data');
      }

     // console.log('Aggregated Data:', data.data); 
      return data.data || [];       
    } catch (err) {
      setError(err.message);
      console.error('Error fetching aggregated data:', err);
      return  [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function for receiving product reviews
  const getProductReviews = useCallback(async (googleScriptUrl, idPrice, idProduct) => {
    const formData = new FormData();
    formData.append('isReviews', 2); 
    formData.append('idPrice', idPrice);
    formData.append('idProduct', idProduct);

    try {
      setLoading(true);
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!data.success) { 
        throw new Error(data.message || 'Failed to fetch product reviews');
      }

      //console.log('Product Reviews:', data.data); 
      return data.data || [];
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product reviews:', err);
      return  [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to handle adding/removing a review
  const handleReview = useCallback(async (googleScriptUrl, { idPrice, idProduct, userName, rating, review,verificationCode, Url, status = 'Active', id = null }) => {
    const formData = new FormData();
    formData.append('isReviews', 3); 
    formData.append('idPrice', idPrice);
    formData.append('idProduct', idProduct);
    formData.append('Name', userName);
    formData.append('rating', rating);
    formData.append('review', review);
    formData.append('status', status);
    formData.append("VerificationCode", verificationCode);
    formData.append("Url", Url);
    if (id) formData.append('id', id); // pass ID if we delete

    try {
      setLoading(true);
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!data.success) { 
        throw new Error(data.message || 'Failed to handle review');
      }

      //console.log('Review handled:', data.data); 
      return data.data;      
    } catch (err) {
      setError(err.message);
      console.error('Error handling review:', err);
      return null; 
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getAggregatedData,
    getProductReviews,
    handleReview,
    loading,
    error,
  };
};
