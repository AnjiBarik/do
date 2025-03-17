import React, { useState, useContext, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';

const LangComponent = () => {
  const { uiState, uiMain, setUiMain, idLoudPrice } = useContext(BooksContext);
  const { lang } = useIcons();
  const { author } = uiMain;
  const [activeLangId, setActiveLangId] = useState(null);
  const [visibilityKeyGen, setVisibilityKeyGen] = useState(false);
  

  const renderLangButtons = () => {
    return uiState
      .filter(item => item.author === author)
      .map(item => (
        <button
          key={item.id}
          onClick={() => handleLangClick(item.id)}
          className={activeLangId === item.id ? 'selected-button active' : 'selected-button'}          
        >
          {item.lang}
        </button>
      ));
  };

  const handleLangClick = langId => {
    setActiveLangId(langId);
  
    const selectedLang = uiState.find(item => item.id === langId);    
    
    if (selectedLang) {     
      setUiMain(selectedLang)      
    }
  };

  useEffect(() => {
    setActiveLangId(uiMain.id);
  }, [uiMain]);
  
  const handleDoubleClick = () => {
    idLoudPrice && idLoudPrice > 0 ? 
    setVisibilityKeyGen(prevValue => !prevValue) :
    setVisibilityKeyGen(false);   
  };

  return (
    <div className='filters'  >
      <img className="back-button select" src={lang} onDoubleClick={handleDoubleClick} alt='Language Selection' />      
      {visibilityKeyGen   &&  
               <Link to="/AdminPanel" >
                 <button className='sort-button active'>
                 AdminPanel
                 </button>
               </Link>
              }
      {renderLangButtons()}
     
    </div>
  );
};

export default LangComponent;