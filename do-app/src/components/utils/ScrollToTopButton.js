import React, { useState, useEffect } from 'react';
import { useIcons } from '../../IconContext';
import './scrollToTopButton.css';

export default function ScrollToTopButton() {
    const { up } = useIcons();
    const [showButton, setShowButton] = useState(false);

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

	return (
		<>
			{showButton && (
				<img src={up} alt='button-up'  className="button-up  select" onClick={scrollUp}/>
                // <button className="button-up" onClick={scrollUp}>
				// ▲
				// </button>
			)}
		</>
	);
}