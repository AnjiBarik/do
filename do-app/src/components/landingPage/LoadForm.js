import { BooksContext } from '../../BooksContext';
import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../utils/LoadingAnimation';
import ClearAll from '../functional/ClearAll'; 
import { useAlertModal } from '../hooks/useAlertModal';
import { hasAuthData, getAuthData, loginRequest } from '../functional/authFunctions'; 
import { useGoogleScriptAPI } from '../hooks/useGoogleScriptAPI'; // Importing the hook

export default function Form({ autoSubmit = false }) {
  const { 
    setBooks, 
    setFieldState, 
    uiMain, 
    idLoudPrice, 
    setIdLoudPrice, 
    loggedIn, 
    selectUiState,   
    setMessage,    
    setPromo, 
    setOrder, 
    setLoggedIn, 
    setVerificationCode, 
    setSavedLogin, 
    verificationCode,
    savedLogin,
    setRatingData     
  } = useContext(BooksContext);

  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const { showAlert, AlertModalComponent } = useAlertModal();  
  const { getAggregatedData } = useGoogleScriptAPI();
  
  const clearAll = ClearAll({ 
     clearLogin: loggedIn && uiMain.Urregform && selectUiState.Urregform && uiMain.Urregform === selectUiState.Urregform    
  });
  
  const attemptAutoLogin = useCallback(async () => {   
    const hasAutologinData = await hasAuthData(uiMain.Urregform); 

    if (hasAutologinData) {
      console.log('Auto-login data found, attempting login...');

      try {        
        const authData = await getAuthData(uiMain.Urregform);
        const { login, authCode } = authData;
        
        const response = await loginRequest(uiMain.Urregform, login, authCode);

        if (response.success) {
          clearAll.resetStates();
          const { message, promo, order, verificationCode, name } = response;
         
          setMessage(message || "");
          setPromo(promo || "");
          setOrder(order || "");
          setVerificationCode(verificationCode || "");
          setSavedLogin(name || "");
          setLoggedIn(true);                 
          console.log('🎉 Auto-login successful!')         
        } else {          
          console.log('⚠️ Auto-login failed. Please login manually.')
        }
      } catch (error) {
        console.error("Error during auto-login:", error);        
      }
    } else {
      console.log("No auto-login data found.");     
      clearAll.resetStates();
    }
  }, [uiMain.Urregform, clearAll, setMessage, setPromo, setOrder, setVerificationCode, setSavedLogin, setLoggedIn]);

  const Submit = useCallback(async (e) => {
    if (e) e.preventDefault(); // Prevent default form submission
    setLoading(true);

    const formEle = document.querySelector("form");
    
    // Check if the form element exists before creating FormData
    if (!formEle) {
      console.error('Form element not found');
      setLoading(false);
      return; // Exit early if formEle is null
    }

    const formDatab = new FormData(formEle);
    formDatab.append('isReviews', 10);

    const URLAPI = uiMain.Urprice;

    try {
      const response = await fetch(URLAPI, { method: "POST", body: formDatab });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error fetching combined data');
      }
      
      const { sheet1Data, sheet2Data } = data.data;
      setBooks(sheet1Data);
      setFieldState(sheet2Data[0]);
      setIdLoudPrice(uiMain.id);    

      if (uiMain.Review) {  
        const aggregatedData = await getAggregatedData(URLAPI, sheet2Data[0].idprice);
        
        if (aggregatedData && aggregatedData.length > 0) {
          setRatingData(aggregatedData);
        } else {
          console.log('⚠️ No reviews found.');
        }
      }

      if (!loggedIn) {
        await attemptAutoLogin();
      } else if (loggedIn && uiMain.Urregform && selectUiState.Urregform && uiMain.Urregform !== selectUiState.Urregform) {
        const formDataToLogout = new FormData();
        formDataToLogout.append("isVerification", 5);
        formDataToLogout.append('registrationCode', verificationCode);
        formDataToLogout.append('Name', savedLogin);
        
        try {
          const response = await fetch(selectUiState.Urregform, { method: "POST", body: formDataToLogout });
          const data = await response.text();
          
          if (data === 'Incorrect username or password.') {
            console.log('⚠️ Incorrect username or password.');
          } else if (data.includes('Logout successful.')) {              
            clearAll.resetStates();
          }
        } catch (error) {
          showAlert('⚠️Error: ' + error.message);
        }           
      } else if (loggedIn && uiMain.Urregform && selectUiState.Urregform && uiMain.Urregform === selectUiState.Urregform) {          
        clearAll.resetStates();
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      showAlert('⚠️ Price did not load, try another one or later');
    } finally {
      setLoading(false);
      navigate('/BookList');
    }
  }, [uiMain, loggedIn, selectUiState, attemptAutoLogin, getAggregatedData, clearAll, setBooks, setFieldState, setIdLoudPrice, setRatingData, showAlert, navigate, savedLogin, verificationCode]);

  useEffect(() => {
    if (autoSubmit && document.querySelector("form")) {
      Submit();
    }
  }, [autoSubmit, Submit]);

  return (
    <>
      {AlertModalComponent()}
      {idLoudPrice !== uiMain.id && (
        <div className='container-submit'>
          {loading ? (
            <LoadingAnimation />
          ) : (
            <form className="form" onSubmit={Submit}>
              <input
                name="submit"
                type="submit"
                className='loading-submit color-transition'
                value={uiMain.shopping || "Start shopping"}
              />
            </form>
          )}
        </div>
      )}
    </>
  );
}