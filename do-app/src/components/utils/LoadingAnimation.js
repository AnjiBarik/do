import React, { useState, useEffect } from "react";
import { useIcons } from '../../IconContext';

const LoadingAnimation = () => {
  const {
    loading3,
    loading2,
    loading1, } = useIcons();
  const [loadingImage, setLoadingImage] = useState(loading1);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingImage((prevImage) => {
        if (prevImage === loading1) {
          return loading2;
        } else if (prevImage === loading2) {
          return loading3;
        } else {
          return loading1;
        }
      });
    }, 200);

    // Cleanup interval on component unmount
    return () => clearInterval(interval); 
  }, [loading1, loading2, loading3]);

  return <img src={loadingImage} className='loading' alt="Loading" />;
};

export default LoadingAnimation;