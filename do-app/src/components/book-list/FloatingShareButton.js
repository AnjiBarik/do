import React, { useState, useContext, useEffect } from 'react';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext'; 
import { useAlertModal } from '../hooks/useAlertModal';
import './FloatingShareButton.css';
import { useLocation } from 'react-router-dom';

const FloatingShareButton = ({ itemId }) => {
  const { uiMain } = useContext(BooksContext);
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const { telegram, face, viber, tik, share } = useIcons();
  const { showAlert, AlertModalComponent } = useAlertModal();
  const location = useLocation();

  useEffect(() => {
    const getShareLink = () => {
      let baseUrl = window.location.href.split('#')[0]; // Extract base URL before hash
      let updatedShareLink = uiMain && uiMain.share ? uiMain.share : `${baseUrl}#/LandingPage`;

      if (!uiMain.share && uiMain && uiMain.id) {
        updatedShareLink += updatedShareLink.endsWith('/') ? `${uiMain.id}` : `/${uiMain.id}`;
      }

      if (itemId && itemId.trim() !== "") {
        updatedShareLink += `/${itemId}`;
      }
      setShareLink(updatedShareLink);
    };

    getShareLink();
  }, [uiMain, itemId, location.pathname]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => showAlert('Link copied to clipboard!'))
      .catch(err => showAlert('⚠️ The link could not be copied.'));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Share this content', url: shareLink })
        .catch(err => showAlert('⚠️ Sharing failed.'));
    } else {
      showAlert('⚠️ Your browser does not support Sharing.');
    }
  };

  const toggleOptions = () => setIsOpen(!isOpen);

  const renderShareOptions = () => (
    <div className="share-options">
      <a
        target="_blank"
        href={`https://telegram.me/share/url?url=${shareLink}&text=Check this out!`}
        rel="noreferrer"
        className="option-button"
      >
        <img className="cancel-button select" src={telegram} alt="Telegram" />
      </a>
      <a
        target="_blank"
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}&quote=Check this out!`}
        rel="noreferrer"
        className="option-button"
      >
        <img className="cancel-button select" src={face} alt="Facebook" />
      </a>
      <a
        target="_blank"
        href={`viber://forward?text=${shareLink}`}
        rel="noreferrer"
        className="option-button"
      >
        <img className="cancel-button select" src={viber} alt="Viber" />
      </a>
      <a
        target="_blank"
        href={shareLink}
        rel="noreferrer"
        className="option-button"
      >
        <img className="cancel-button select" src={tik} alt="TikTok" />
      </a>
      <button onClick={handleShare} className="slider-item">
        <img className="cancel-button select" src={share} alt="Share" />
        Share
      </button>
      <button onClick={copyToClipboard} className="slider-item">
      🔗 Copy Link
      </button>
    </div>
  );

  return (
    <div className="floating-share-button">
      <button onClick={toggleOptions} className="share-main-button">
        <img className="cancel-button select" src={share} alt="Share" />       
      </button>
      {isOpen && renderShareOptions()}
      <AlertModalComponent />
    </div>
  );
};

export default FloatingShareButton;