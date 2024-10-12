import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BooksContext } from '../../BooksContext';
import FilteredDataDisplay from './FilteredDataDisplay';
import PrivateKeyDecryption from '../rsacomponent/PrivateKeyDecryption';
import DataDecryption from '../rsacomponent/DataDecryption';
import LoadingAnimation from '../utils/LoadingAnimation';
import { useAlertModal } from '../hooks/useAlertModal';

const OrderFormAndDecryption = () => {
  const { uiMain, fieldState, loggedIn, verificationCode, savedLogin } = useContext(BooksContext);
  const [userid, setUserid] = useState('');
  const [idprice, setIdprice] = useState(fieldState.idprice || '');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [decryptedData, setDecryptedData] = useState([]);
  const [privateKey, setPrivateKey] = useState(''); 
  const [submitting, setSubmitting] = useState(false);
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState('');
  const [decryptEnabled, setDecryptEnabled] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keySource, setKeySource] = useState('');
  const { showAlert, AlertModalComponent } = useAlertModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (uiMain.length === 0) {
      navigate('/');
    }
  }, [uiMain, navigate]);
  

  useEffect(() => {
    if (decryptedPrivateKey) {
      setPrivateKey(decryptedPrivateKey);
      setKeySource('decrypted');
    }
  }, [decryptedPrivateKey]);

  const convertToUTC = (date) => {
    const utcDate = new Date(date);
    return utcDate.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('userid', userid);
    formData.append("Idprice", idprice);

    formData.append("Name", savedLogin);
    formData.append("VerificationCode", verificationCode);
    formData.append("Url", uiMain.Urregform);

    if (startDate) {
      formData.append('startdate', convertToUTC(startDate));
    }
    if (endDate) {
      formData.append('enddate', convertToUTC(endDate));
    }

    const apiUrl = uiMain.Urorder;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        if (data !== "Incorrect username or password." || !data.includes("Access denied.")) {
          setVerificationStatus('verified');
          setResponseData(data);          
        } else {
          setVerificationStatus('error');
          showAlert("⚠️Incorrect username or password!");
          setResponseData([]);          
        }
      } else {
        console.error('Error:', data.message);
        setVerificationStatus('error');        
      }
    } catch (error) {
      console.error('Error:', error);
      setVerificationStatus('error');      
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportFromClipboard = () => {
    navigator.clipboard.readText()
      .then(text => {
        setPrivateKey(text);
        setKeySource('clipboard');
      })
      .catch(err => alert('⚠️Failed to read clipboard contents: ', err));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      showAlert('⚠️No file selected!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPrivateKey(event.target.result);
      setKeySource('file');     
    };
    reader.onerror = (error) => {
      alert('⚠️Failed to read file: ', error);
    };
    reader.readAsText(file);
  };

  const handleResetPrivateKey = () => {
    setPrivateKey('');
    setDecryptedPrivateKey('');
    setDecryptEnabled(false);
    setKeySource('');    
    setEndDate('');
    setStartDate('');
    setUserid('');    
  };

  const outputData = responseData.map((item, index) => {
    const outputItem = {};
    for (const field in item) {
      if (!field.endsWith('1') && !field.endsWith('2')) {
        if (decryptedData[index] && decryptedData[index][field + '1']) {
          outputItem[field] = decryptedData[index][field + '1'] !== '' ? decryptedData[index][field + '1'] : item[field];
        } else {
          outputItem[field] = item[field];
        }
      }
    }
    return outputItem;
  });
  return (
    <>
      {submitting && <LoadingAnimation />}
      {AlertModalComponent()}
      { responseData.length>0 && ( 
        <div className='filters'>
          <label>
            <b>
              {privateKey ? 
                `Private Key ${keySource === 'clipboard' ? 'imported from clipboard' : keySource === 'file' ? 'loaded' : keySource === 'decrypted' ? 'decrypted' : '🌀'}` 
                : 'Private Key:'}
            </b>
          </label>
          <button className='form-input' onClick={handleImportFromClipboard} disabled={privateKey !== ''}>Import from Clipboard</button>
          <input className='form-input' type="file" onChange={handleFileUpload} disabled={privateKey !== ''} />
          {privateKey && privateKey !== '' && (
            <>
              <label className='sort-button'>
                <input
                  type="checkbox"   
                  className='form-input'               
                  checked={decryptEnabled}              
                  onChange={(e) => setDecryptEnabled(e.target.checked)}
                />
                Decrypt Private Key
              </label>              
            </>
          )}
          {decryptEnabled && privateKey && 
            <PrivateKeyDecryption
              encryptedPrivateKey={privateKey}
              onDecrypted={(key) => setDecryptedPrivateKey(key)}
            />
          }
        </div>
      )}
      
      {verificationStatus === 'verified' && responseData.length>0 && (
        <>
        
          { privateKey && (
           <>
            <DataDecryption
              privateKey={privateKey}
              responseData={responseData}
              setDecryptedData={setDecryptedData}
            />           
            <button className='form-input' onClick={handleResetPrivateKey}>Reset Private Key</button>
            </>
          )}        
          <FilteredDataDisplay outputData={outputData} />
        </>
      )}
      
      {verificationStatus !== 'verified' && (
        <form onSubmit={handleSubmit} className='filters'>
          <b>Set access and price ID:</b>
          {!loggedIn && <b>Please log in to your account</b>}
          <div className='filters'>
            <label>
              <b>User ID:</b>
              <input
                type='text'
                className='form-input'
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                required
              />
            </label>
            <label>
              <b>Price ID:</b>
              <input
                type='text'
                className='form-input'
                value={idprice}
                onChange={(e) => setIdprice(e.target.value)}
              />
            </label>
          </div>
          <b>Set the order date range:</b>
          <div className='filters'>
            <label>
              <b>Start Date:</b>
              <input
                type='date'
                className='form-input'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              <b>End Date:</b>
              <input
                type='date'
                className='form-input'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          <div className='filters'>
            <button
              type='submit'
              className='form-input active-border'
              disabled={submitting || userid === '' || !loggedIn}
            >
              Loading orders
            </button>
          </div>
        </form>
      )}
      {verificationStatus === 'error' && <p>⚠️Incorrect username or password!</p>}
    </>
  );
};

export default OrderFormAndDecryption;