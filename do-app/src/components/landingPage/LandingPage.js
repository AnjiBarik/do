import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from './Slider';
import './LandingPage.css';
import Submit from './LoadForm';
import { BooksContext } from '../../BooksContext';
import LangComponent from './LangComponent';
import getPublicUrl from '../functional/getPublicUrl';
import tuning from '../assets/data/tuning.json';

function LandingPage() {    

    const { id, itemid } = useParams(); // Getting ID from URL
    const { theme, setTheme, uiMain, fieldState, setUiState, setUiMain, setItemId } = React.useContext(BooksContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const tuningUrl = getPublicUrl({ folder: 'data', filename: 'tuning.json' });
    const handleLoad = () => {
        setLoading(false);
    };

    // Get Browser language
    const [language, setLanguage] = useState('');
    const [autoSubmit, setAutoSubmit] = useState(false); // New state for auto-submit  

    const initialBrowserTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    useEffect(() => {
        const browserLanguage = navigator.language || navigator.languages[0];
        browserLanguage.startsWith('en') ? setLanguage('en') : setLanguage(browserLanguage);
        if (!theme || theme === "") {
            setTheme(initialBrowserTheme);
        }
    }, [initialBrowserTheme, theme, setTheme]);

    const initializeState = useCallback((data) => {       

       if (!data || !data.tuning) {
        console.error("Error: tuning data not received.");
        return;
    }
        setUiState(data.tuning);

        if (uiMain.length < 1) {
            let startItem = null;            

            if (id && id.trim() !== "" && id.length < 10) {
                if (!isNaN(id)) {
                  const foundItem = data.tuning.find(item => item.id === Number(id));
                  if (foundItem) {
                    setUiMain(foundItem);
                    setAutoSubmit(true);  
                    
                    if (itemid) {                        
                        if (/^[a-zA-Z0-9_-]+$/.test(itemid) && itemid.length < 50) {
                            setItemId(itemid)
                            console.log(itemid)
                        }
                    }
                    return
                  } else {
                    console.error('Item with the given ID not found');
                  }
                } else {                  
                  console.error('ID is not a number, redirecting to Page404');
                  navigate("/Page404");
                }
            } 

            // If no suitable startItem is found, find the first item with type "start"
            startItem = data.tuning.find(item => item.type === "start" && item.langstart && item.langstart === 'auto' && item.lang === language);
            if (!startItem) {
                startItem = data.tuning.find(item => item.type === "start");
            }

            // If still no suitable startItem is found, use the first item in the data
            if (!startItem) {
                startItem = data.tuning[0];
            }

            setUiMain(startItem);
        }

        if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
            setUiState(prevState => {
                const maxId = prevState.reduce((max, item) => (item.id > max ? item.id : max), 0);
                const updatedUiMain = { ...uiMain };

                // Update fields if available in fieldState
                if (fieldState.titleprice) updatedUiMain.title = fieldState.titleprice;
                if (fieldState.lang) updatedUiMain.lang = fieldState.lang;
                if (fieldState.UrFrame) updatedUiMain.UrFrame = fieldState.UrFrame;
                if (fieldState.fone && fieldState.fone !== "") updatedUiMain.fone = fieldState.fone;
                if (fieldState.inst && fieldState.inst !== "") updatedUiMain.inst = fieldState.inst;
                if (fieldState.face && fieldState.face !== "") updatedUiMain.face = fieldState.face;
                if (fieldState.telegram && fieldState.telegram !== "") updatedUiMain.telegram = fieldState.telegram;
                if (fieldState.email && fieldState.email !== "") updatedUiMain.email = fieldState.email;
                if (fieldState.tik && fieldState.tik !== "") updatedUiMain.tik = fieldState.tik;
                if (fieldState.you && fieldState.you !== "") updatedUiMain.you = fieldState.you;
                if (fieldState.card && fieldState.card !== "") updatedUiMain.card = fieldState.card;
                if (fieldState.location && fieldState.location !== "") updatedUiMain.location = fieldState.location;
                if (fieldState.about && fieldState.about !== "") updatedUiMain.about = fieldState.about;

                updatedUiMain.Urprice = fieldState.Urprice;
                updatedUiMain.logo = fieldState.logo;
                updatedUiMain.author = fieldState.authorprice || (uiMain.author + (fieldState.idprice || "LOL"));
                updatedUiMain.type = updatedUiMain.type === "start" ? "add" : updatedUiMain.type;
                updatedUiMain.id = maxId + 1;

                return [...prevState, updatedUiMain];
            });
        }
    }, [fieldState, uiMain, setUiMain, setUiState, language, id, itemid, setItemId, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(tuningUrl);
                const tuningData = await response.json();
                if (tuningData && tuningData.tuning) {
                    initializeState(tuningData);
                }
                //initializeState(tuningData);
            } catch {
                initializeState(tuning);
            }
        };

        fetchData();
    
  }, [ initializeState, tuningUrl]);

    return (
        <div className={theme} tabIndex={0}>
            <section className="intro">
                <LangComponent />
            </section>
            <section className="slider-section">
                <Slider />
            </section>
            {loading && (uiMain.UrFrame || uiMain.UrFrame !== "") && <p>🌀Loading content...</p>}
            {uiMain.UrFrame && uiMain.UrFrame !== "" && (
                <>
                    <button className='selected-button' onClick={() => window.open(uiMain.UrFrame, '_blank')}>Open in new tab</button>
                    <section style={{ height: '100vh' }}>
                        <iframe style={{ border: 'none' }}
                            sandbox="allow-scripts allow-popups allow-forms"
                            // src={uiMain.UrFrame}
                            src={`${uiMain.UrFrame}?theme=${theme || initialBrowserTheme}`}
                            title="External Content"
                            width="100%"
                            height="100%"
                            onLoad={handleLoad}
                        ></iframe>
                    </section>
                </>
            )}
            {(!uiMain.UrFrame || uiMain.UrFrame === "") && (
                <div className='main'></div>
            )}

            <div className='loadPrice'>
                <Submit autoSubmit={autoSubmit} /> 
            </div>
        </div>
    );
}

export default LandingPage;