import { useCallback, useState, useContext } from "react";
import { BooksContext } from "../../BooksContext";
import { useNavigate } from "react-router-dom";
import { useAlertModal } from "../hooks/useAlertModal";
import { hasAuthData, getAuthData, loginRequest } from "../functional/authFunctions";
import ClearAll from "../functional/ClearAll";

export function useSubmit() {
    const {
        setBooks, setFieldState, setIdLoudPrice,  
        setMessage, setPromo, setOrder, setVerificationCode, verificationCode, savedLogin,
        setSavedLogin, setLoggedIn, loggedIn, uiMain, selectUiState
    } = useContext(BooksContext);    
    
    const { showAlert } = useAlertModal();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    
    const clearAll = ClearAll({
        clearLogin: loggedIn && uiMain.Urregform && selectUiState.Urregform && uiMain.Urregform !== selectUiState.Urregform
    });

    const attemptAutoLogin = useCallback(async () => {   
        const hasAutologinData = await hasAuthData(uiMain.Urregform); 

        if (hasAutologinData) {
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
                }
            } catch (error) {
                console.error("Error during auto-login:", error);
            }
        } else {
            clearAll.resetStates();
        }
    }, [uiMain.Urregform, clearAll, setMessage, setPromo, setOrder, setVerificationCode, setSavedLogin, setLoggedIn]);

    const Submit = useCallback(async (param) => {
        if (param?.preventDefault) param.preventDefault();
        setLoading(true);
        
        let formDatab;
        let URLAPI;

        if (param && typeof param === 'object' && !param.preventDefault) {
            URLAPI = param.Urprice;
            formDatab = new FormData();
            formDatab.append('isReviews', 10);
        } else {
            const formEle = document.querySelector("form");
            if (!formEle) {
                setLoading(false);
                return;
            }
            formDatab = new FormData(formEle);
            formDatab.append('isReviews', 10);
            URLAPI = uiMain.Urprice;
        }

        try {
            const response = await fetch(URLAPI, { method: "POST", body: formDatab });
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Error fetching combined data');
            }

            const { sheet1Data, sheet2Data } = data.data;
            setBooks(sheet1Data);
            setFieldState(sheet2Data[0]);
            setIdLoudPrice(param?.id || uiMain.id);            

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
                    if (data.includes('Logout successful.')) {              
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
            navigate('/BookList', { state: { firstSubmit: true } });
        }
    }, [uiMain, loggedIn, selectUiState, attemptAutoLogin, clearAll, setBooks, setFieldState, setIdLoudPrice, showAlert, navigate, savedLogin, verificationCode]);

    return { Submit, loading };
}
