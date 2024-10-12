import React, { useState, useEffect } from 'react';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import { hashPasswordAndUsername } from '../rsacomponent/HashUtils';
import { useAlertModal } from '../hooks/useAlertModal';
import { useConfirmModal } from '../hooks/useConfirmModal';

const CartMemo = () => {
  const {
    setCartItems,
    cartItems,
    books,
    order,
    setOrder,
    loggedIn,
    fieldState,
    uiMain,
    savedLogin,
    savedPassword,
    verificationCode
  } = React.useContext(BooksContext);

  const { favorite, addfavorite, cancel } = useIcons();
  const { showAlert, AlertModalComponent } = useAlertModal();
  const { showConfirm, ConfirmModalComponent } = useConfirmModal();

  const [selectedItems, setSelectedItems] = useState([]);
  const [hasCurrentPriceInOrder, setHasCurrentPriceInOrder] = useState(false);

  useEffect(() => {
    if (loggedIn && order && order.trim() !== "" && fieldState.idprice) {
      const orderItems = order.split(';');
      const items = [];
      orderItems.forEach(orderItem => {
        const orderParts = orderItem.split(':');
        const idpraceorder = orderParts[0];
        for (let i = 1; i < orderParts.length; i += 2) {
          const id = orderParts[i];
          const count = orderParts[i + 1];
          items.push({ idpraceorder, id, count });
        }
      });
      setSelectedItems(items);
      setHasCurrentPriceInOrder(order.includes(fieldState.idprice));
    }
  }, [loggedIn, order, fieldState.idprice]);

  const handleAdd = async () => {
    const confirmed = await showConfirm("Are you sure you want to add favorites items to the cart?");
    if (confirmed) {
      const itemsToAdd = selectedItems.filter(item => item.idpraceorder === fieldState.idprice);
      const updatedCartItems = [...cartItems];
      itemsToAdd.forEach(item => {
        const book = books.find(book => book.id === item.id);
        if (book && book.Visibility !== 0) {
          const existingItemIndex = updatedCartItems.findIndex(cartItem => cartItem.id === item.id);
          const maxCount = book.maxcount && book.maxcount !== "" ? parseInt(book.maxcount) : 1;
          if (existingItemIndex !== -1) {
            updatedCartItems[existingItemIndex].count = Math.min(updatedCartItems[existingItemIndex].count + parseInt(item.count), maxCount);
          } else {
            updatedCartItems.push({ ...book, count: Math.min(parseInt(item.count), maxCount) });
          }
        }
      });
      setCartItems(updatedCartItems);
    }
  };

  const updateOrderOnServer = async (newOrder) => {
    const formData = new FormData();
    formData.append('isVerification', 3);
    formData.append('Name', savedLogin);
    formData.append("Password", await hashPasswordAndUsername(savedLogin, savedPassword));
    formData.append('Favorder', newOrder);
    formData.append('registrationCode', verificationCode);

     const apiUrl = uiMain.Urregform;   

    fetch(apiUrl, {
      method: 'POST',
      body: formData
    })
      .then(response => response.text())
      .then(data => {
        if (data === 'Incorrect username or password.') {
          showAlert('⚠️Incorrect username or password.');
        } else {
          showAlert('Updated successfully!');
        }
      })
      .catch(error => {
        showAlert('⚠️Error: ' + error.message);
      });
  };

  const handleAddToFavorites = async () => {
    const confirmed = await showConfirm("Are you sure you want to add these items to your favorites?");
    if (confirmed) {
      const favoritesString = cartItems.map(item => `${item.id}:${item.count}`).join(':');
      const newOrderItem = `${fieldState.idprice}:${favoritesString};`;

      const regex = new RegExp(`${fieldState.idprice}:[^;]*;`);
      const match = order.match(regex);
      let newOrder;

      if (match) {
        newOrder = order.replace(match[0], newOrderItem);
      } else {
        newOrder = order + newOrderItem;
      }

      setOrder(newOrder);
      await updateOrderOnServer(newOrder);
      setHasCurrentPriceInOrder(true);
    }
  };

  const handleClearFavorites = async () => {
    const confirmed = await showConfirm("Are you sure you want to clear your favorites for the current price?");
    if (confirmed) {
      const newOrder = order.replace(new RegExp(`${fieldState.idprice}:[^;]*;`), '');
      setOrder(newOrder);
      await updateOrderOnServer(newOrder);
      setHasCurrentPriceInOrder(false);
    }
  };

  return (
    <>
      {AlertModalComponent()}
      {ConfirmModalComponent()}
      {loggedIn && hasCurrentPriceInOrder && (
        <img src={favorite} onClick={handleAdd} className="back-button select" alt="favorite cart" />
      )}
      {loggedIn && cartItems && cartItems.length > 0 && fieldState.idprice && (
        <img src={addfavorite} onClick={handleAddToFavorites} className="back-button select" alt="add favorite cart" />
      )}
      {loggedIn && hasCurrentPriceInOrder && (
        <div onClick={handleClearFavorites}>
          <img className="cancel-button select" src={cancel} alt="cancel" />
        </div>
      )}
    </>
  );
};

export default CartMemo;