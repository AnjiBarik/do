import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateItemId } from "./functional/validateItemId";

const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const hasHash = window.location.hash;
      const segments = hasHash
        ? window.location.hash.replace('#/', '').split('/')
        : window.location.pathname.split('/');
      
      const cleanedSegments = segments.filter(seg => seg.trim() !== '');
      
      const id = cleanedSegments.length > 1
        ? cleanedSegments[cleanedSegments.length - 2]
        : cleanedSegments[cleanedSegments.length - 1];
      
      const itemid = cleanedSegments.length > 1
        ? cleanedSegments[cleanedSegments.length - 1]
        : null;

      if (id && id.trim() !== '') {
        const idNumber = parseInt(id, 10);
    // We check if there is an id and if so, if it is an integer and in the range from 1 to 20
        if (!isNaN(idNumber) && idNumber >= 1 && idNumber <= 20) {          
          const finalPath = 
          itemid && validateItemId(itemid)
            ? `/LandingPage/${idNumber}/${itemid}`
            : `/LandingPage/${idNumber}`;

          navigate(finalPath, { state: { id: idNumber, itemid  } });
        } else {
          navigate('/Page404');
        }
      } else {
        navigate('/LandingPage');
      }
    } catch (error) {
      navigate('/Page404');
    }
  }, [navigate]);

  return null;
};

export default RedirectHandler;