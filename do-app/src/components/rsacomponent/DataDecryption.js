import React, { useState } from 'react';
import { decryptTextWithPrivateKey } from '../rsacomponent/cryptoUtils';


const DataDecryption = ({ privateKey, responseData, setDecryptedData }) => {
  const [showPrivateKeyError, setShowPrivateKeyError] = useState(false);

  const handleDecryptField = async (fieldValue1, fieldValue2) => {
    try {
      const encryptedMessage = fieldValue1 + fieldValue2;      
      const decryptedText = await  decryptTextWithPrivateKey(encryptedMessage, privateKey);
      if (decryptedText.includes('Error decrypting')) {
        setShowPrivateKeyError(true);
        return '';
      }
      setShowPrivateKeyError(false);
      return decryptedText;
    } catch (error) {
      console.error('Error decrypting:', error);
      setShowPrivateKeyError(true);
      return '';
    }
  };

  const handleDecryptAll = async () => {
    const decrypted = await Promise.all(responseData.map(async (item) => {
      const decryptedItem = {};
      for (const field in item) {
        if (field.endsWith('1')) {
          const counterpart = field.slice(0, -1) + '2';
          const value1 = item[field];
          const value2 = item[counterpart];
          if (value1 && value2) {
            const decryptedValue = await handleDecryptField(value1, value2);
            decryptedItem[field] = decryptedValue;
          }
        }
      }
      return decryptedItem;
    }));
    setDecryptedData(decrypted);
  };

  return (
    <>
      <button className='form-input active-border' onClick={handleDecryptAll}>Decrypt All Fields</button>
      {showPrivateKeyError && (
        <b className="error-message">⚠️Check key decryption error</b>
      )}
    </>
  );
};

export default DataDecryption;
