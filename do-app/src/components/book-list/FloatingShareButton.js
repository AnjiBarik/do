import React, { useState, useContext, useEffect } from 'react';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext'; 
import { useAlertModal } from '../hooks/useAlertModal';
import './FloatingShareButton.css';

const FloatingShareButton = () => {
  const { uiMain } = useContext(BooksContext);
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const { telegram, face, viber, tik, share } = useIcons();
  const { showAlert, AlertModalComponent } = useAlertModal();

  useEffect(() => {
    const getShareLink = () => {
      let updatedShareLink = uiMain && uiMain.share ? uiMain.share : `${window.location.href}`;
      if (!uiMain.share && uiMain && uiMain.id) {
        updatedShareLink += updatedShareLink.endsWith('/') ? `${uiMain.id}` : `/${uiMain.id}`;
      }
      setShareLink(updatedShareLink);
    };

    getShareLink();
  }, [uiMain]);

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
      🔗 Copy link
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