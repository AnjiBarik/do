import { useCallback, useState, useContext } from "react";
import { BooksContext } from "../../BooksContext";
import { useNavigate } from "react-router-dom";
import { useGoogleScriptAPI } from "../hooks/useGoogleScriptAPI";
import { useAlertModal } from "../hooks/useAlertModal";
import { hasAuthData, getAuthData, loginRequest } from "../functional/authFunctions";

export function useSubmit() {
    const {
        setBooks, setFieldState, setIdLoudPrice, setRatingData, 
        setMessage, setPromo, setOrder, setVerificationCode, 
        setSavedLogin, setLoggedIn, loggedIn, uiMain
    } = useContext(BooksContext);
    
    const { getAggregatedData } = useGoogleScriptAPI();
    const { showAlert } = useAlertModal();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);

    const attemptAutoLogin = useCallback(async () => {   
        const hasAutologinData = await hasAuthData(uiMain.Urregform); 

        if (hasAutologinData) {
            try {        
                const authData = await getAuthData(uiMain.Urregform);
                const { login, authCode } = authData;
                const response = await loginRequest(uiMain.Urregform, login, authCode);

                if (response.success) {
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
        }
    }, [uiMain.Urregform, setMessage, setPromo, setOrder, setVerificationCode, setSavedLogin, setLoggedIn]);

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

            if (uiMain.Review) {
                const aggregatedData = await getAggregatedData(URLAPI, sheet2Data[0].idprice);
                setRatingData(aggregatedData || []);
            }

            if (!loggedIn) {
                await attemptAutoLogin();
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            showAlert('⚠️ Price did not load, try another one or later');
        } finally {
            setLoading(false);
            navigate('/BookList');
        }
    }, [uiMain, loggedIn, attemptAutoLogin, getAggregatedData, setBooks, setFieldState, setIdLoudPrice, setRatingData, showAlert, navigate]);

    return { Submit, loading };
}
