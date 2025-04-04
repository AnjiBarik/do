import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
          const finalPath = itemid 
            ? `/LandingPage/${idNumber}/${itemid}`
            : `/LandingPage/${idNumber}`;

          navigate(finalPath, { state: { id: idNumber } });
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

// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const RedirectHandler = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         try {            
//             const fullUrl = window.location.href;
//             const hasHash = window.location.hash;
//             const segments = hasHash ? window.location.hash.replace('#/', '').split('/') : window.location.pathname.split('/');
//             const id = segments[segments.length - 1];            

//             // We check if there is an id and if so, if it is an integer and in the range from 1 to 20
//             if (id && id.trim() !== '') {
//                 const idNumber = parseInt(id, 10);

//                 if (!isNaN(idNumber) && idNumber >= 1 && idNumber <= 20) {                    
//                     navigate(`/LandingPage/${idNumber}`, { state: { id: idNumber } });
//                 } else {                    
//                     navigate('/Page404');
//                 }
//             } else {
//                 // If there is no id, go to LandingPage without parameters
//                 navigate('/LandingPage');
//             }
//         } catch (error) {               
//             navigate('/Page404');
//         }
//     }, [navigate]);

//     return null; 
// };

// export default RedirectHandler;
