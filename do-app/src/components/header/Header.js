import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from "react-router-dom";
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import useDebounce from '../hooks/useDebounce';
import './header.css';
import InfoModal from '../utils/InfoModal';
import getPublicUrl from '../functional/getPublicUrl';
import RegistrationForm from '../cart/RegistrationForm';

export default function Header() {
  const { theme, setTheme, uiState, idLoudPrice, setUiMain, uiMain, setSelectUiState, cartItems, totalCount, setTotalCount, savedLogin, showRegistrationForm, setShowRegistrationForm, fieldState, message, promo, userName, userImg } = React.useContext(BooksContext);
  const { email, dark, light, inst, face, telegram, viber, fone, tik, you, location, ava, carticon, home, category, buynow } = useIcons();
  
  const [logo, setLogo] = useState('');
  const [title, setTitle] = useState('');  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentLink, setCurrentLink] = useState(null);
  const [currentButtonIndex, setCurrentButtonIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgError, setImgError] = useState(false);

  const carentLocation = useLocation();  
    const routeToIconMap = useRef({
      '/': 'home',
      '/BookList': 'category',
      '/cart': 'cart',
      '/Filter': 'filter',
      '/Search': 'search',
      '/Form': 'lol',
    });
  
    useEffect(() => {
      if (cartItems && cartItems.length > 0) {
        setTotalCount(cartItems.reduce((acc, item) => acc + item.count, 0));
      } else {
        setTotalCount(0);
      }
    }, [cartItems, setTotalCount]);
  
    useEffect(() => {
      const iconName = routeToIconMap.current[carentLocation.pathname];
      if (iconName) {
        setSelectedImage(iconName);
      }
    }, [carentLocation]);

const debouncedWidth = useDebounce(windowWidth, 300);

useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

useEffect(() => {
  setWindowWidth(debouncedWidth);
}, [debouncedWidth]);


  useEffect(() => {
    const selectedUiState = uiState[idLoudPrice - 1] || uiState.find(item => item.type === "start") || uiState[0];
    if (selectedUiState) {      
      const folder = 'logoimg';
      const logoUrl = selectedUiState.logopablic
          ? getPublicUrl({ folder, filename: selectedUiState.logopablic })
          : selectedUiState.logo;
      
      setLogo(logoUrl);
      setTitle(selectedUiState.title);
      setSelectUiState(selectedUiState);
    }
  }, [idLoudPrice, uiState, setSelectUiState]);

  const toggleTheme = () => {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
  };

  const handleImageClick = (imageName) => {
    if (imageName === 'avatar') {
      setShowRegistrationForm((prevState) => !prevState);
    } else {
      setShowRegistrationForm(false);
      setSelectedImage(imageName);
    }
  };

    const HandleLoad = () => {    
    setUiMain(uiState[idLoudPrice - 1] || uiState.find(item => item.type === "start") || uiState[0]);
  };

  const handleButtonClick = (link, index) => {
    if (currentButtonIndex === index && currentLink === link) {      
      setCurrentLink(null);
      setCurrentButtonIndex(null);
    } else {      
      setCurrentLink(link);
      setCurrentButtonIndex(index);
    }
  }; 

  return (
    <section className={theme}>
      <section className='header'>
        <section className="header-left">
          {(idLoudPrice === uiMain.id && windowWidth >= 1200) && (
            <>
             <section className={`cart ${selectedImage === 'home' ? 'sel' : ''}`}>
                             <Link  to="/">                
                               <img
                                 className="back-button-footer select"
                                 onClick={() => handleImageClick('home')}
                                 src={home}
                                 alt="home"
                               />              
                             </Link>
                             {fieldState.home && <span className="button-label">{fieldState.home}</span>}
             </section>             
            </>
          )}
          {(uiMain && 
          <>
          <Link to="/" className='sort-button highlighted'>
            <div onClick={HandleLoad}>
              {logo ? (
                <img className='artmini' src={logo} alt={title} />
              ) : (
                <h1>{title}</h1>
              )}
            </div>
          </Link>
          
          <div onClick={toggleTheme}>
            {theme === 'light' ? (
              <img className="back-button select" src={dark} alt="dark theme" />
            ) : (
              <img className="back-button select" src={light} alt="light theme" />
            )}
          </div>
          </>
          )}
          {(idLoudPrice === uiMain.id && windowWidth >= 1200) && (
             <div className='header-category-container'>
          <section  onClick={() => handleImageClick('category')} className={`cart ${selectedImage === 'category' ? 'sel' : ''}`}>
                             <Link  to="/BookList">
                               <img
                                 className="back-button-footer select"                                
                                 src={category}
                                 alt="category"
                               />    
                             
                             {fieldState.category && <span className="button-label">{fieldState.category}</span>}
                             </Link>
          </section>
          </div>
           )}
        </section>

        <section className="header-right">
        {((uiMain.fone && uiMain.fone !== "") || 
            (uiMain.inst && uiMain.inst !== "") || 
            (uiMain.face && uiMain.face !== "") || 
            (uiMain.telegram && uiMain.telegram !== "") ||
            (uiMain.email && uiMain.email !== "") ||
            (uiMain.tik && uiMain.tik !== "") ||
            (uiMain.you && uiMain.you !== "") ||
            (uiMain.card && uiMain.card !== "") ||
            (uiMain.location && uiMain.location !== "") ||
            (uiMain.about && uiMain.about !== "") ||
            (uiMain.viber && uiMain.viber !== "")) && (
              <>
                {uiMain.fone && uiMain.fone !== "" && (
                  <div>                    
                      <img src={fone} className="back-button select" onClick={() => handleButtonClick(uiMain.fone, 0)} alt={uiMain.fone} title="Fone" />                   
                    {currentButtonIndex === 0 && (
                      <a href={`tel:${currentLink}`} target="_blank" rel="noopener noreferrer">
                      <b> {currentLink} </b> 
                      </a>
                    )}
                  </div>
                )}
                {uiMain.inst && uiMain.inst !== "" && (
                  <div>
                   <a href={`https://www.instagram.com/${uiMain.inst}`} target="_blank" rel="noopener noreferrer">
                    <img src={inst} className="back-button select" alt={uiMain.inst} title="Instagram" />
                   </a>
                  </div>                  
                )}

{uiMain.face && uiMain.face !== "" && (
  <div>
    <a href={`https://www.facebook.com/${uiMain.face}`} target="_blank" rel="noopener noreferrer">
      <img src={face} className="back-button select" alt={uiMain.face} title="Facebook" />
    </a>
  </div>
)}
{uiMain.telegram && uiMain.telegram !== "" && (
  <div>
    <a href={`https://t.me/${uiMain.telegram}`} target="_blank" rel="noopener noreferrer">
      <img src={telegram} className="back-button select" alt={uiMain.telegram} title="Telegram"/>
    </a>
  </div>
)}
{uiMain.viber && uiMain.viber !== "" && (
  <div>
    <a href={`viber://chat?number=${uiMain.viber}`} target="_blank" rel="noopener noreferrer">
      <img src={viber} className="back-button select" alt={uiMain.viber} title="Viber" />
    </a>
  </div>
)}
{uiMain.tik && uiMain.tik !== "" && (
  <div>
    <a href={`https://www.tiktok.com/${uiMain.tik}`} target="_blank" rel="noopener noreferrer">
      <img src={tik} className="back-button select" alt={uiMain.tik} title="Tiktok" />
    </a>
  </div>
)}
{uiMain.you && uiMain.you !== "" && (
  <div>
    <a href={`https://www.youtube.com/${uiMain.you}`} target="_blank" rel="noopener noreferrer">
      <img src={you} className="back-button select" alt={uiMain.you} title="youtube" />
    </a>
  </div>
)}               
                
                {uiMain.email && uiMain.email !== "" && (
                  <div>                    
                      <img src={email} className="back-button select" onClick={() => handleButtonClick(uiMain.email, 4)} alt={uiMain.email} title="Email" />                  
                    {currentButtonIndex === 4 && (
                      <a href={`mailto:${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}                
                {uiMain.card && uiMain.card !== "" && (
                  <div>    
                    <InfoModal infotext = {uiMain.card} iconName="card" showCopyButton={true} />                    
                  </div>
                )}
                {uiMain.location && uiMain.location !== "" && (
                  <div>                   
                      <img src={location} className="back-button select" onClick={() => handleButtonClick(uiMain.location, 8)} alt={uiMain.location} title="Location" />                  
                    {currentButtonIndex === 8 && (
                      <a href={`https://maps.google.com/?q=${currentLink}`} target="_blank" rel="noopener noreferrer" className="link-container">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.about && uiMain.about !== "" && (
                  <div>    
                    <InfoModal infotext = {uiMain.about} iconName="about" showCopyButton={true} />                 
                  </div>
                )}
              </>
            )}
          {uiMain && idLoudPrice === uiMain.id && windowWidth >= 1200 && (
              <div className='header-container'>
            
              <section id="heder-cart" className= 'cart' >
                             {selectedImage === 'cart' && totalCount > 0 &&(
                               <>
                                <Link to="/OrderForm"  >
                               <div className='bay'>
                                 <img src={buynow} className=" back-button-footer  bay-button" alt="Proceed to checkout" />                                                   
                               </div> 
                               </Link> 
                               <span className="button-label">Checkout</span>               
                               </>
                             )}
                             
                             {(selectedImage !== 'cart'||  !totalCount > 0) && (
                               <section className={`cart ${selectedImage === 'cart' ? 'sel' : ''}`}>
                             <Link to="/cart">
                               <img
                                 className="back-button-footer select"
                                 onClick={() => handleImageClick('cart')}
                                 src={carticon}
                                 alt="cart"
                               />
                               {totalCount > 0 && (
                                 <span className="cartcount rotate"><b>{totalCount}</b></span>
                               )}                  
                             </Link>
                             {fieldState.carticon && <span className="button-label">{fieldState.carticon}</span>}
                             </section>
                              )}
                           </section>
                           <section onClick={() => handleImageClick('avatar')} 
                             className={`cart ${showRegistrationForm ? 'sel' : ''}`}>
                             <img
                               className="back-button-footer select"                  
                               src={userImg && !imgError ? userImg : ava} 
                               alt="avatar"
                               onError={() => setImgError(true)} 
                               style={{ cursor: 'pointer' }}
                             />
                             {savedLogin && (
                               <span className="cartcount" translate="no">
                                 <strong>{userName.slice(0, 2)||savedLogin.slice(0, 2) + (((message && message !== "")
                                  || (promo && promo !== "")) ? '💬' : '...')}</strong>
                               </span>
                             )}                
                             {fieldState.ava && <span className="button-label">{fieldState.ava}</span>}
                           </section>
             </div>
           
          )}         
        </section>
      </section>
      {showRegistrationForm && windowWidth >= 1200 && <RegistrationForm />}
    </section>
  );
}