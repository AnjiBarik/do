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

    const { id } = useParams(); // Получаем id из URL
    //const location = useLocation(); // Получаем переданные данные через navigate


    const { theme, uiMain, fieldState, setUiState, setUiMain } = React.useContext(BooksContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const tuningUrl = getPublicUrl({ folder: 'data', filename: 'tuning.json' });
    const handleLoad = () => {
        setLoading(false);
    };

    // Get Browser language
    const [language, setLanguage] = useState('');
    const [autoSubmit, setAutoSubmit] = useState(false); // New state for auto-submit

    // const fullUrl = window.location.href;
    // const hasHash = window.location.hash;
    // const segments = hasHash ? window.location.hash.replace('#/', '').split('/') : window.location.pathname.split('/');
    // const idd = segments[segments.length - 1];
    
//console.log(fullUrl)
//console.log(hasHash)
//console.log(segments)
//console.log("id",id)

    useEffect(() => {
        const browserLanguage = navigator.language || navigator.languages[0];
        browserLanguage.startsWith('en') ? setLanguage('en') : setLanguage(browserLanguage);
    }, []);

    const initializeState = useCallback((data) => {
        setUiState(data.tuning);

        if (uiMain.length < 1) {
            let startItem = null;

            // Find item by ID if it exists
            // if (id && !isNaN(id)) {
            //     const foundItem = data.tuning.find(item => item.id == id);
            //     if (foundItem) {
            //         setUiMain(foundItem); 
            //         setAutoSubmit(true); 
            //         return; // Exit early if an item was found
            //     }
            // }

            // if (id && id.trim() !== "") {
            //     if (!isNaN(id)) {
            //       const foundItem = data.tuning.find(item => item.id === Number(id));
            //       if (foundItem) {
            //         setUiMain(foundItem);
            //         setAutoSubmit(true);
            //         //console.log(foundItem)
            //         return
            //       } else {
            //         console.error('Item with the given ID not found');
            //       }
            //     } else {
                  
            //       console.error('ID is not a number, redirecting to Page404');
            //       navigate("/Page404");
            //     }
            //   } else {
                
            //     console.log('No ID provided, nothing to do.');
            //   }

            if (id && id.trim() !== "") {
                if (!isNaN(id)) {
                  const foundItem = data.tuning.find(item => item.id === Number(id));
                  if (foundItem) {
                    setUiMain(foundItem);
                    setAutoSubmit(true);
                    console.log(foundItem)
                    return
                  } else {
                    console.error('Item with the given ID not found');
                  }
                } else {
                  
                  console.error('ID is not a number, redirecting to Page404');
                  navigate("/Page404");
                }
              } else {
                
                console.log('No ID provided, nothing to do.');
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
    }, [fieldState, uiMain, setUiMain, setUiState, language, id, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(tuningUrl);
                const tuningData = await response.json();
                initializeState(tuningData);
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
                            src={uiMain.UrFrame}
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

// import React, { useState, useEffect, useCallback } from 'react';
// import Slider from './Slider';
// import './LandingPage.css';
// import Submit from './LoadForm';
// import { BooksContext } from '../../BooksContext';
// import LangComponent from  './LangComponent';
// import getPublicUrl from '../functional/getPublicUrl';
// import tuning from '../assets/data/tuning.json';


// function LandingPage() {
//     const { theme,  uiMain, fieldState, setUiState, setUiMain } = React.useContext(BooksContext);

//     const currentUrl = window.location.pathname; // Получаем текущий URL
//     const id = currentUrl.split('/').pop(); // Извлекаем последний сегмент (ID)
//     console.log('ID from URL:', id);

//     const [loading, setLoading] = useState(true);     
//     const tuningUrl = getPublicUrl({ folder: 'data', filename: 'tuning.json' });
//     const handleLoad = () => {
//         setLoading(false);
//     };   
    
//     //get Browser language
//     const [language, setLanguage] = useState('');   

//     useEffect(() => {
//         const browserLanguage = navigator.language || navigator.languages[0];
//         browserLanguage.startsWith('en') ? setLanguage('en') : setLanguage(browserLanguage);
//       }, []);    
       
//       const initializeState = useCallback((data) => {
//         setUiState(data.tuning);       
        
//         if (uiMain.length < 1) {
//           let startItem = null;         
//           // If there is a "langstart" and it is "auto", find the item with type "start" and lang equal to browser language
//           startItem = data.tuning.find(item => item.type === "start" && item.langstart && item.langstart === 'auto' && item.lang === language);
                 
//           // If no suitable startItem is found, find the first item with type "start"
//           if (!startItem) {
//               startItem = data.tuning.find(item => item.type === "start");
//           }
  
//           // If still no suitable startItem is found, use the first item in the data
//           if (!startItem) {
//               startItem = data.tuning[0];
//           }
  
//           setUiMain(startItem);
//       }
    
//         if (uiMain.loadprice === "true" && fieldState.Urprice && Object.keys(fieldState.Urprice).length !== 0) {
//           setUiState(prevState => {
//             const maxId = prevState.reduce((max, item) => (item.id > max ? item.id : max), 0);
//             const updatedUiMain = { ...uiMain };
    
//             if (fieldState.titleprice) updatedUiMain.title = fieldState.titleprice;
//             if (fieldState.lang) updatedUiMain.lang = fieldState.lang;
//             if (fieldState.UrFrame) updatedUiMain.UrFrame = fieldState.UrFrame;
//             if (fieldState.fone && fieldState.fone!=="") updatedUiMain.fone = fieldState.fone;
//             if (fieldState.inst && fieldState.inst!=="") updatedUiMain.inst = fieldState.inst;
//             if (fieldState.face && fieldState.face!=="") updatedUiMain.face = fieldState.face;
//             if (fieldState.telegram && fieldState.telegram!=="") updatedUiMain.telegram = fieldState.telegram;
//             if (fieldState.email && fieldState.email!=="") updatedUiMain.email = fieldState.email;
//             if (fieldState.tik && fieldState.tik!=="") updatedUiMain.tik = fieldState.tik;
//             if (fieldState.you && fieldState.you!=="") updatedUiMain.you = fieldState.you;
//             if (fieldState.card && fieldState.card!=="") updatedUiMain.card = fieldState.card;
//             if (fieldState.location && fieldState.location!=="") updatedUiMain.location = fieldState.location;
//             if (fieldState.about && fieldState.about!=="") updatedUiMain.about = fieldState.about;
//             updatedUiMain.Urprice = fieldState.Urprice;
//             updatedUiMain.logo = fieldState.logo;            
//             updatedUiMain.author = fieldState.authorprice || (uiMain.author + (fieldState.idprice || "LOL"));
//             updatedUiMain.type = updatedUiMain.type === "start" ? "add" : updatedUiMain.type;
//             updatedUiMain.id = maxId + 1;

//             return [...prevState, updatedUiMain];
//           });
//         }    
      
//       }, [fieldState, uiMain, setUiMain, setUiState, language]);
    
//       useEffect(() => {
//         const fetchData = async () => {
//           try {      
//             const response = await fetch(tuningUrl);
//             const tuningData = await response.json();            
//             initializeState(tuningData);
//           } catch  {            
//             initializeState(tuning);
//           }
//         };
    
//         fetchData();
//       }, [fieldState, uiMain, initializeState, tuningUrl]); 
 
//     return (
//         <div className={theme} tabIndex={0}>         
//             <section className="intro">               
//                 <LangComponent/> 
//             </section>
//             <section className="slider-section">
//                 <Slider />             
//             </section>           
//             {loading && (uiMain.UrFrame || uiMain.UrFrame!=="") && <p>🌀Loading content...</p>}           
//             {uiMain.UrFrame && uiMain.UrFrame!==""&&(
//             <>  
//             <button className='selected-button' onClick={() => window.open(uiMain.UrFrame, '_blank')}>Open in new tab</button>
//             <section style={{ height: '100vh' }}>           
//                 <iframe style={{ border: 'none' }}               
//                     // sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
//                     sandbox="allow-scripts allow-popups allow-forms"
//                     src={uiMain.UrFrame}
//                     title="External Content"
//                     width="100%"
//                     height="100%"                                  
//                     onLoad={handleLoad}
//                 ></iframe>
//             </section>
//             </>
//             )}
//              {(!uiMain.UrFrame || uiMain.UrFrame==="")&&(
//                 <div className='main'></div>
//             )} 


//             <div className='loadPrice'>
//                 <Submit/>
//             </div>
           
//         </div>
//     );
// }

// export default LandingPage;