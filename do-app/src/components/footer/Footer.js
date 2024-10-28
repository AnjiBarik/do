import React, { useState, useEffect, useRef } from 'react';
import './footer.css';
import { Link, useLocation } from "react-router-dom";
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import RegistrationForm from '../cart/RegistrationForm';

export default function Footer() {
  const { theme, cartItems, totalCount, setTotalCount, savedLogin, uiMain, idLoudPrice, showRegistrationForm, setShowRegistrationForm, fieldState,  message, promo,userName, userImg } = React.useContext(BooksContext);

  const {     
    ava,
    carticon,
    home,
    category,
    buynow
  } = useIcons();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imgError, setImgError] = useState(false);

  const location = useLocation();

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
    const iconName = routeToIconMap.current[location.pathname];
    if (iconName) {
      setSelectedImage(iconName);
    }
  }, [location]);

  const handleImageClick = (imageName) => {
    if (imageName === 'avatar') {
      setShowRegistrationForm((prevState) => !prevState);
    } else {
      setShowRegistrationForm(false);
      setSelectedImage(imageName);
    }
  };

  return (
    <>
      {idLoudPrice === uiMain.id && (
        <section className={theme}>
          <section className="foot">
            <section className="footer">
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

              <section className={`cart ${selectedImage === 'category' ? 'sel' : ''}`}>
                <Link  to="/BookList">
                  <img
                    className="back-button-footer select"
                    onClick={() => handleImageClick('category')}
                    src={category}
                    alt="category"
                  />                 
                </Link>
                {fieldState.category && <span className="button-label">{fieldState.category}</span>}
              </section>
              
              <section className= 'cart' >
                {selectedImage === 'cart' && totalCount > 0 &&(
                  <>
                   <Link to="/OrderForm"  >
                  <div className='bay'>
                    <img src={buynow} className=" back-button-footer  bay-button" alt="Proceed to checkout" />                   
                    </div> 
                  </Link>                 
                  </>
                )}
                
                {(selectedImage !== 'cart'||  !totalCount > 0) && (
                  <>
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
                </>
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
            </section>
            {showRegistrationForm && <RegistrationForm />}
          </section>
        </section>
      )} 
    </> 
  );
}