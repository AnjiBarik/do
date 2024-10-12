import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import './header.css';
import InfoModal from '../utils/InfoModal';
import getPublicUrl from '../functional/getPublicUrl';

export default function Header() {
  const { theme, setTheme, uiState, idLoudPrice, setUiMain, uiMain, setSelectUiState } = React.useContext(BooksContext);

  const {    
    email,    
    dark,
    light,
    inst,
    face,
    telegram,
    fone,
    tik,
    you,    
    location,
  } = useIcons();
      
  const [logo, setLogo] = useState('');
  const [title, setTitle] = useState('');  

  useEffect(() => {
    const selectedUiState = uiState[idLoudPrice - 1] || uiState.find(item => item.type === "start") || uiState[0];
    if (selectedUiState) {      
      const folder = 'logoimg';
      const logoUrl = selectedUiState.logopablic
          ? getPublicUrl({ folder, filename: selectedUiState.logopablic })
          : selectedUiState.logo;
  
      setLogo(logoUrl);
      setTitle(selectedUiState.title);
      setSelectUiState(selectedUiState)
    }
  }, [idLoudPrice, uiState, setSelectUiState]);

  const toggleTheme = () => {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
  };

  const HandleLoad = () => {    
    setUiMain(uiState[idLoudPrice - 1] || uiState.find(item => item.type === "start") || uiState[0]);
  };

  const [currentLink, setCurrentLink] = useState(null);
  const [currentButtonIndex, setCurrentButtonIndex] = useState(null);

  const handleButtonClick = (link, index) => {
    if (currentButtonIndex === index && currentLink === link) {      
      setCurrentLink(null);
      setCurrentButtonIndex(null);
    } else {      
      setCurrentLink(link);
      setCurrentButtonIndex(index);
    }
  }; 

  return (
    <section className={theme}>
      <section className='header'>       
        <section className="header-left">
           <Link to="/" className='sort-button highlighted '>
             <div onClick={HandleLoad}>
               {logo ? (
                 <img className='artmini' src={logo} alt={title} />
               ) : (
                 <h1>{title}</h1>
               )}
             </div>
           </Link>
           <div  onClick={toggleTheme}>
             {theme === 'light' && (
               <img className="back-button select" src={dark} alt="dark theme"/>
             )}
             {theme !== 'light' && (
               <img className="back-button select" src={light} alt="light theme"/>
             )}
           </div>
         </section>          
        <section className="header-right">
          {((uiMain.fone && uiMain.fone !== "") || 
            (uiMain.inst && uiMain.inst !== "") || 
            (uiMain.face && uiMain.face !== "") || 
            (uiMain.telegram && uiMain.telegram !== "") ||
            (uiMain.email && uiMain.email !== "") ||
            (uiMain.tik && uiMain.tik !== "") ||
            (uiMain.you && uiMain.you !== "") ||
            (uiMain.card && uiMain.card !== "") ||
            (uiMain.location && uiMain.location !== "") ||
            (uiMain.about && uiMain.about !== "")) && (
              <>
                {uiMain.fone && uiMain.fone !== "" && (
                  <div>                    
                      <img src={fone} className="back-button select" onClick={() => handleButtonClick(uiMain.fone, 0)} alt={uiMain.fone}/>                   
                    {currentButtonIndex === 0 && (
                      <a href={`tel:${currentLink}`} target="_blank" rel="noopener noreferrer">
                      <b> {currentLink} </b> 
                      </a>
                    )}
                  </div>
                )}
                {uiMain.inst && uiMain.inst !== "" && (
                  <div>                    
                      <img src={inst} className="back-button select" onClick={() => handleButtonClick(uiMain.inst, 1)} alt={uiMain.inst}/>                   
                    {currentButtonIndex === 1 && (
                      <a href={`https://www.instagram.com/${currentLink}`} target="_blank" rel="noopener noreferrer" className="link-container">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.face && uiMain.face !== "" && (
                  <div>                    
                      <img src={face} className="back-button select" onClick={() => handleButtonClick(uiMain.face, 2)} alt={uiMain.face}/>                   
                    {currentButtonIndex === 2 && (
                      <a href={`https://www.facebook.com/${currentLink}`} target="_blank" rel="noopener noreferrer" className="link-container">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.telegram && uiMain.telegram !== "" && (
                  <div>                   
                      <img src={telegram} className="back-button select" onClick={() => handleButtonClick(uiMain.telegram, 3)} alt={uiMain.telegram}/>                  
                    {currentButtonIndex === 3 && (
                      <a href={`https://t.me/${currentLink}`} target="_blank" rel="noopener noreferrer" className="link-container">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.email && uiMain.email !== "" && (
                  <div>                    
                      <img src={email} className="back-button select" onClick={() => handleButtonClick(uiMain.email, 4)} alt={uiMain.email}/>                  
                    {currentButtonIndex === 4 && (
                      <a href={`mailto:${currentLink}`} target="_blank" rel="noopener noreferrer">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.tik && uiMain.tik !== "" && (
                  <div>                    
                      <img src={tik} className="back-button select" onClick={() => handleButtonClick(uiMain.tik, 5)} alt={uiMain.tik}/>                  
                    {currentButtonIndex === 5 && (
                      <a href={`https://www.tiktok.com/${currentLink}`} target="_blank" rel="noopener noreferrer" className="link-container">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.you && uiMain.you !== "" && (
                  <div>                   
                      <img src={you} className="back-button select" onClick={() => handleButtonClick(uiMain.you, 6)} alt={uiMain.you}/>                  
                    {currentButtonIndex === 6 && (
                      <a href={`https://www.youtube.com/${currentLink}`} target="_blank" rel="noopener noreferrer" className="link-container">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.card && uiMain.card !== "" && (
                  <div>    
                    <InfoModal infotext = {uiMain.card} iconName="card" showCopyButton={true} />                    
                  </div>
                )}
                {uiMain.location && uiMain.location !== "" && (
                  <div>                   
                      <img src={location} className="back-button select" onClick={() => handleButtonClick(uiMain.location, 8)} alt={uiMain.location}/>                  
                    {currentButtonIndex === 8 && (
                      <a href={`https://maps.google.com/?q=${currentLink}`} target="_blank" rel="noopener noreferrer" className="link-container">
                        {currentLink}
                      </a>
                    )}
                  </div>
                )}
                {uiMain.about && uiMain.about !== "" && (
                  <div>    
                    <InfoModal infotext = {uiMain.about} iconName="about" showCopyButton={true} />                 
                  </div>
                )}
              </>
            )}
        </section>
      </section>
    </section>
  );
}