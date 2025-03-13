import React, { useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './priceBlock.css';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';


export default function PriceBlock({ id, showPrice }) {
  const { setCartItems, books, cartItems, theme, fieldState } = useContext(BooksContext);

  const {   
    cartadd,
    cartupl,
    buynow,
    carticon} = useIcons();

  const booksInCart = useMemo(() => cartItems || [], [cartItems]);
  const specificBookIndex = useMemo(() => booksInCart.findIndex((el) => el.id === id), [booksInCart, id]);
  const specificCount = useMemo(() => (specificBookIndex !== -1 ? booksInCart[specificBookIndex].count : 0), [specificBookIndex, booksInCart]);
  const selectedBook = useMemo(() => books.find((book) => book.id === id), [books, id]);
  const [count, setCount] = useState(specificCount || 1);

  const createUpdatedBook = useCallback((newCount) => {
    const calculatedPrice = parseFloat(selectedBook.price || 0) * newCount;
    const totalBookPrice = calculatedPrice >= 0 ? calculatedPrice.toFixed(2) : '0.00';
    return { ...selectedBook, count: newCount, totalBookPrice };
  }, [selectedBook]);

  useEffect(() => {
    if (specificBookIndex !== -1 && count!==specificCount) {
      const updatedBook = createUpdatedBook(count);
      const updatedBooksInCart = [...booksInCart];
      updatedBooksInCart[specificBookIndex] = updatedBook;
      setCartItems(updatedBooksInCart);
    }
  }, [count, specificBookIndex, booksInCart, setCartItems, createUpdatedBook, specificCount]);

  const incrementCount = () => {
    setCount((prevCount) => Math.min(42, prevCount + 1));
  };

  const decrementCount = () => {
    setCount((prevCount) => Math.max(1, prevCount - 1));
  };

  const addToCart = () => {
    if (specificBookIndex === -1) {
      const updatedBook = createUpdatedBook(count);
      const updatedBooksInCart = [...booksInCart, updatedBook];
      setCartItems(updatedBooksInCart);
    }
  };

  const removeBookFromCart = (bookId) => {
    const updatedCartItems = booksInCart.filter((item) => item.id !== bookId);
    setCartItems(updatedCartItems);
    setCount(1);
  };

  return (
    <section className={theme}>
      <section className="contener"> 
          <section className="price-block Price">
          {specificBookIndex !== -1 && (
            <img src={cartupl} alt='remove from Cart' className="price-mini-button select" 
            onClick={() => removeBookFromCart(id)} tabIndex={-1} />
          )}
          {specificBookIndex !== -1 && (
                    <Link to="/cart">
                     <img src={carticon} alt='Cart' className="ccart-icon rotate"  />
                    </Link>
                  )}
            {showPrice && (
              <div className="price-block-row">
                <span>{fieldState.price && fieldState.price !== "" ? fieldState.price : "Price:"}{fieldState.payment ? fieldState.payment : ""}</span>
                <span id="price">
                {selectedBook.saleprice && (<del className="Linkcart rotate">{selectedBook.saleprice}</del>)} 
                {'\u00A0'}{selectedBook.price || 0}
                </span>
              </div>
            )}

            {selectedBook.maxcount && selectedBook.maxcount > 1 && (
              <div className="price-block-row">
                <div className="price-block-row-input">
                  <button
                    className="decrement"
                    type="button"
                    disabled={count < 2}
                    onClick={decrementCount}
                  >
                  <b>-</b>
                  </button>
                  <output>{count}</output>
                  
                  <button
                    className="increment"
                    type="button"
                    disabled={count === selectedBook.maxcount}
                    onClick={incrementCount}
                  >
                   <b>+</b>
                  </button>
                </div>
              </div>
            )}
            {count>1&&(
            <div className="price-block-row totalPrice">
              <span>{fieldState.totalPrice && fieldState.totalPrice !== "" ? fieldState.totalPrice : "Total:"}{fieldState.payment ? fieldState.payment : ""}</span>
              <span id="totalPrice">
                {(count * (selectedBook.price || 0)).toFixed(2)}
              </span>
            </div>
            )}           
          </section>
       
          <section  className="price-block Price">
        {specificBookIndex === -1 && (
          <>
              <button onClick={addToCart} className='selected-button active-border'>
                Add To Cart
              <img
                className="cancel-button select rotate"
                src={cartadd}
                alt='addToCart'
               
              />
              </button>

              <Link  to={`/OrderForm?id=${id}&title=${selectedBook.title}&count=${count}&price=${selectedBook.price}`}>
                <button className='selected-button active-border'>               
                <img
                  className="cancel-button select"
                  src={buynow}
                  alt="Buy Now"
                />
                </button>
              </Link>             
             
              </>
        )}
        </section>

      </section>
    </section>
  );
}