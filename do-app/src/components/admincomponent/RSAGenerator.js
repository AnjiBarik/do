import React, { useState } from 'react';
import ScrollToTopButton from '../utils/ScrollToTopButton';
import { useAlertModal } from '../hooks/useAlertModal';
import { useConfirmModal } from '../hooks/useConfirmModal';
import { useIcons } from '../../IconContext';
import {
  logChunks,
  encryptPrivateKey,
  decryptPrivateKey,
  encryptTextWithPublicKey,
  decryptTextWithPrivateKey,
  generateKeys
} from '../rsacomponent/cryptoUtils';

const RSAGenerator = () => {
  const { upmenu, cancel } = useIcons();
  const [publicKeyChunks, setPublicKeyChunks] = useState([]);
  const [privateKey, setPrivateKey] = useState('');
  const [publicKeyBase64, setPublicKeyBase64] = useState('');
  const [editablePublicKey, setEditablePublicKey] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptedData, setDecryptedData] = useState('');
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState('');
  const [editableDecryptedKey, setEditableDecryptedKey] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [useDecryptedPrivateKey, setUseDecryptedPrivateKey] = useState(false);
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState('');
  const [decryptedEncryptedPrivateKey, setDecryptedEncryptedPrivateKey] = useState('');
  const [editablePrivateKey, setEditablePrivateKey] = useState('');
  const [encryptPrivateKeyChecked, setEncryptPrivateKeyChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSection, setShowSection] = useState(true);

  const { showAlert, AlertModalComponent } = useAlertModal();
  const { showConfirm, ConfirmModalComponent } = useConfirmModal();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => showAlert('Copied to clipboard successfully!'),
      (err) => showAlert('⚠️ Failed to copy to clipboard: ', err)
    );
  };

  const saveToFile = (filename, content) => {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      showAlert('⚠️ Error saving file: ', error);
    }
  };

  const handleGenerateKeys = async () => {
    try {
      const { publicKeyBase64, privateKeyBase64 } = await generateKeys();
      setPublicKeyChunks(logChunks('Public Key:', publicKeyBase64));
      setPublicKeyBase64(publicKeyBase64);
      setEditablePublicKey(publicKeyBase64)
      setPrivateKey(privateKeyBase64);
      setEditablePrivateKey(privateKeyBase64);
     
      setIsGenerated(true);
    } catch (error) {
      showAlert('⚠️ Error generating keys: ', error.message);
    }
  };

  const handleEncryptPrivateKey = async () => {
    try {
      if (password === confirmPassword) {
        const encryptedKey = await encryptPrivateKey(privateKey, password);
        setEncryptedPrivateKey(encryptedKey);
        setEditableDecryptedKey(encryptedKey)        
        showAlert('Private key encrypted successfully!');
      } else {
        showAlert('⚠️ Passwords do not match!');
      }
    } catch (error) {
      showAlert('⚠️ Error encrypting private key: ', error.message);
    }
  };

  const handleDecryptPrivateKey = async () => {
    try {
      if (decryptPassword && editableDecryptedKey) {
        const decryptedKey = await decryptPrivateKey(editableDecryptedKey, decryptPassword);        
        setDecryptedEncryptedPrivateKey(decryptedKey)
        showAlert('Private key decrypted successfully!');
      } else {
        showAlert('⚠️ Please provide a valid password and encrypted key');
      }
    } catch (error) {
      showAlert('⚠️ Error decrypting private key: ', error.message);
    }
  };

  const handleEncryptText = async () => {
    try {
      const encrypted = await encryptTextWithPublicKey(plaintext, editablePublicKey);      
      setEncryptedData(encrypted);
    } catch (error) {
      showAlert('⚠️ Error encrypting text: ', error.message);
    }
  };

  const handleDecryptText = async () => {
    try {
      const keyToUse = useDecryptedPrivateKey ? decryptedEncryptedPrivateKey : editablePrivateKey;
      const decrypted = await decryptTextWithPrivateKey(encryptedData, keyToUse);
      if (decrypted.includes('Error decrypting')) {
        setDecryptedData("");
        showAlert('⚠️ Error decrypting text ');
      }
      setDecryptedData(decrypted);
    } catch (error) {
      showAlert('⚠️ Error decrypting text: ', error.message);
    }
  };

  const handleTextareaChange = (event) => {
    setPlaintext(event.target.value);
  };

  const handleReset = async () => {
    const confirmed = await showConfirm('Are you sure you want to clear the generated keys?');
    if (confirmed) {
      setPublicKeyChunks([]);
      setPrivateKey('');
      setPublicKeyBase64('');
      setPlaintext('');
      setEncryptedData('');
      setDecryptedData('');
      setEncryptedPrivateKey('');
      setEditableDecryptedKey('');
      setDecryptedPrivateKey('');
      setEditablePrivateKey('');
      setIsGenerated(false);
      setUseDecryptedPrivateKey(false);
      setDecryptPassword('');
      setEncryptPrivateKeyChecked(false);
      setPassword('');
      setConfirmPassword('');
    }
  };

  const toggleSection = () => {
    setShowSection(!showSection);
  };

  const imageStyle = {
    transform: showSection ? 'none' : 'rotate(180deg)',
  };


  return (
    <div>
      {AlertModalComponent()}
      {ConfirmModalComponent()}
      <h1>RSA Key Generator</h1>

      <div className="filters">
        <button className="form-input active-border" onClick={handleGenerateKeys} disabled={isGenerated}>
          Generate Keys
        </button>
       
        {isGenerated && ( 
          <>
          <img
            className="cancel-button select"
            onClick={handleReset}
            src={cancel}
            alt="cancel"
          />        
          <img 
           className="cancel-button select"
           onClick={toggleSection}
           src={upmenu} alt="upmenu" 
           style={imageStyle}
          />  
          </>  
        )}
      </div>

      {isGenerated && showSection && (
        <div>
          <h3>Public Key:</h3>
          {publicKeyChunks.map((chunk, index) => (
            <div key={index}>
               <div className="filters">
                <button className="form-input active-border" onClick={() => copyToClipboard(chunk)}>
                  <span translate="no">Copy Public Key Chunk {index + 1}</span>
                </button>
              </div>
              <div className="filters">
                <textarea className="form-input" value={chunk} readOnly rows={7} cols={40} />
              </div>             
            </div>
          ))}

          <h3>Private Key:</h3>
          <div className="filters">
            <button className="form-input active-border" onClick={() => copyToClipboard(privateKey)}>
              <span translate="no">Copy Private Key</span>
            </button>
            <button className="form-input active-border" onClick={() => saveToFile('privateKey.txt', privateKey)}>
              Save Private Key to File
            </button>
          </div>
          <div className="filters">
            <textarea
              className="form-input"
              value={privateKey}
              // onChange={(e) => setEditablePrivateKey(e.target.value)}
              rows={8}
              cols={40}
              readOnly
            />
          </div>
        </div>
      )}  

      {isGenerated && showSection && ( 
        <div>
          <h3>Encrypt Private Key:</h3>
          <div className="filters">
            <label>
              <input
                type="checkbox"
                checked={encryptPrivateKeyChecked}
                onChange={() => setEncryptPrivateKeyChecked(!encryptPrivateKeyChecked)}
              />{' '}
              Encrypt Private Key
            </label>
          </div>
          {encryptPrivateKeyChecked && (
            <div>
              <div className="filters">
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="filters">  
                <input
                  className="form-input"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="filters">
                <button
                  className="form-input active-border"
                  onClick={handleEncryptPrivateKey}
                  disabled={!password || password !== confirmPassword}
                >
                  Encrypt Private Key
                </button>
              </div>
            </div>
          )}
          {encryptedPrivateKey && (
            <div>
              <h3>Encrypted Private Key:</h3>
              <div className="filters">
                <button className="form-input active-border" onClick={() => copyToClipboard(encryptedPrivateKey)}>
                  <span translate="no">Copy Encrypted Private Key</span>
                </button>
              </div>
              <div className="filters">
                <textarea className="form-input" value={encryptedPrivateKey} readOnly rows={7} cols={40} />
              </div>
            </div>
          )}
        </div>
      )}

      {isGenerated && showSection && (
        <div><h3>Test Key:</h3>
           <h3>Pablic Key:</h3>
          <div className="filters">
            <textarea
              className="form-input"
              placeholder="Enter Pablic Key"
              value={editablePublicKey}     
              onChange={(e) => setEditablePublicKey(e.target.value)}        
              rows={7}
              cols={40}
            />
            </div>
          <h3>Text Encryption:</h3>
          <div className="filters">
            <textarea
              className="form-input"
              placeholder="Enter text to encrypt"
              value={plaintext}
              onChange={handleTextareaChange}
              rows={7}
              cols={40}
            />
            </div>
            <div className="filters">  
            <button className="form-input active-border" onClick={handleEncryptText} disabled={!plaintext || !publicKeyBase64}>
              Encrypt Text
            </button>
          </div>
          {encryptedData && (
            <div>
              <h3>Encrypted Data:</h3>
              <div className="filters">
                <button className="form-input active-border" onClick={() => copyToClipboard(encryptedData)}>
                  <span translate="no">Copy Encrypted Data</span>
                </button>
              </div>
              <div className="filters">
                <textarea className="form-input" value={encryptedData} readOnly rows={7} cols={40} />
              </div>

              <h3>Decrypt Encrypted Data:</h3>
              <div className="filters">
                <label>
                  <input
                    type="radio"
                    name="decryptKey"
                    checked={!useDecryptedPrivateKey}
                    onChange={() => setUseDecryptedPrivateKey(false)}
                  />{' '}
                  Use Private Key
                </label>
                <label>
                  <input
                    type="radio"
                    name="decryptKey"
                    checked={useDecryptedPrivateKey}
                    onChange={() => setUseDecryptedPrivateKey(true)}
                  />{' '}
                  Use Decrypted Private Key
                </label>
              </div>
              {!useDecryptedPrivateKey && (
                <div>
                  <div className="filters">
                    <textarea
                      className="form-input"
                      placeholder="Enter Private Key"
                      value={editablePrivateKey}
                      onChange={(e) => setEditablePrivateKey(e.target.value)}
                      rows={8}
                      cols={40}
                    />
                  </div>
                </div>
              )}
              {useDecryptedPrivateKey && (
                <div>
                  <div className="filters">
                    <textarea
                      className="form-input"
                      placeholder="Enter Private encrypted key here"
                      value={editableDecryptedKey}
                      onChange={(e) => setEditableDecryptedKey(e.target.value)}
                      rows={8}
                      cols={40}
                    />
                  </div>
                  <div className="filters">
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Enter password to decrypt"
                      value={decryptPassword}
                      onChange={(e) => setDecryptPassword(e.target.value)}
                    />
                  </div>
                  <div className="filters">
                    <button
                      className="form-input active-border"
                      onClick={handleDecryptPrivateKey}
                      disabled={!decryptPassword || !editablePrivateKey}
                    >
                      Decrypt Private Key
                    </button>
                  </div>
                  {decryptedPrivateKey && (
                    <div className="filters">
                      <textarea className="form-input" value={decryptedPrivateKey} readOnly rows={8} cols={40} />
                    </div>
                  )}
                </div>
              )}
              <div className="filters">
                <button className="form-input active-border" onClick={handleDecryptText} disabled={!encryptedData || (!privateKey && !decryptedPrivateKey)}>
                  Decrypt
                </button>
              </div>
              {decryptedData && (
                <div>
                  <h3>Decrypted Data:</h3>
                  <div className="filters">
                    <textarea className="form-input" value={decryptedData} readOnly rows={7} cols={40} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default RSAGenerator;