import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        try {            
            const fullUrl = window.location.href;
            const hasHash = window.location.hash;
            const segments = hasHash ? window.location.hash.replace('#/', '').split('/') : window.location.pathname.split('/');
            const id = segments[segments.length - 1];            

            // We check if there is an id and if so, if it is an integer and in the range from 1 to 20
            if (id && id.trim() !== '') {
                const idNumber = parseInt(id, 10);

                if (!isNaN(idNumber) && idNumber >= 1 && idNumber <= 20) {                    
                    navigate(`/LandingPage/${idNumber}`, { state: { id: idNumber } });
                } else {                    
                    navigate('/Page404');
                }
            } else {
                // If there is no id, go to LandingPage without parameters
                navigate('/LandingPage');
            }
        } catch (error) {               
            navigate('/Page404');
        }
    }, [navigate]);

    return null; 
};

export default RedirectHandler;
