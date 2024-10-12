// PrivateKeyDecryption.jsx
import React, { useState } from 'react';
import { decryptPrivateKey } from '../rsacomponent/cryptoUtils'; // Import decryptPrivateKey from cryptoUtils

const PrivateKeyDecryption = ({ encryptedPrivateKey, onDecrypted }) => {
  const [password, setPassword] = useState('');
  const [decryptionError, setDecryptionError] = useState('');

  const handleDecrypt = async () => {
    try {
      const decryptedKey = await decryptPrivateKey(encryptedPrivateKey, password);
      onDecrypted(decryptedKey);
      setDecryptionError('');
    } catch (error) {
      //console.error('Error decrypting private key:', error);
      setDecryptionError('Failed to decrypt private key. Please check the password and try again.');
    }
  };

  return (
    <div className='filters'>
      <label>
        <b>Enter Password:</b>
        <input
          type='password'
          className='form-input'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button
       className={`form-input ${password ? 'active-border' : ''}`}
       onClick={handleDecrypt}
       disabled={!password} 
      >
       Decrypt Private Key
      </button>
      {decryptionError && <b className="error-message">{decryptionError}</b>}
    </div>
  );
};

export default PrivateKeyDecryption;
