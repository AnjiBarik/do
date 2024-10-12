import React, { useState, useEffect } from 'react';

const PaymentSimulator = ({ clientId, totalPrice, orderNumber, paymentCurrency }) => {
  const [error, setError] = useState(null);
  const [formattedData, setFormattedData] = useState({});
  const [showTable, setShowTable] = useState(false);

  if (typeof orderNumber !== 'string') {
    try {
      orderNumber = String(orderNumber); 
    } catch (error) {
      throw new Error('Invalid orderNumber: must be a non-empty string or convertible to a string.');
    }
  }

  useEffect(() => {
    try {
      //  clientId
      if (typeof clientId !== 'string' || clientId.trim() === '') {
        throw new Error('Invalid clientId: must be a non-empty string.');
      }

      //  totalPrice 
      const parsedPrice = parseFloat(totalPrice);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        throw new Error('Invalid totalPrice: must be a positive number.');
      }

      //  orderNumber 
      if (typeof orderNumber !== 'string' || orderNumber.trim() === '') {
        throw new Error('Invalid orderNumber: must be a non-empty string.');
      }

      // ['USD', 'EUR', 'UAH']
      const validCurrencies = ['USD', 'EUR', 'UAH'];
      const currency = paymentCurrency.toUpperCase();
      if (!validCurrencies.includes(currency)) {
        throw new Error(`Invalid paymentCurrency: must be one of ${validCurrencies.join(', ')}.`);
      }
      
      setFormattedData({
        clientId: clientId.trim(),
        totalPrice: parsedPrice.toFixed(2),
        orderNumber: orderNumber.trim(),
        paymentCurrency: currency
      });

      setError(null); 
    } catch (e) {
      setError(e.message); 
    }
  }, [clientId, totalPrice, orderNumber, paymentCurrency]);

  const handlePaymentClick = () => {
    setShowTable(true); 
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>; 
  }

  return (
    <div className='filters'>
      <button className="simulate-payment-button" onClick={handlePaymentClick}>Simulate <b>Pay</b>Pal</button>
      {showTable && (      
        <table border="1" style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Client ID</td>
              <td>{formattedData.clientId}</td>
            </tr>
            <tr>
              <td>Total Price</td>
              <td>{formattedData.totalPrice}</td>
            </tr>
            <tr>
              <td>Order Number</td>
              <td>{formattedData.orderNumber}</td>
            </tr>
            <tr>
              <td>Payment Currency</td>
              <td>{formattedData.paymentCurrency}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentSimulator;
