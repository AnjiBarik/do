import React, { useState, useContext } from 'react';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext'; 
import { useAlertModal } from '../hooks/useAlertModal'; 
import './FloatingShareButton.css'; 

const FloatingShareButton = () => {
  const { uiMain } = useContext(BooksContext);
  const [isOpen, setIsOpen] = useState(false);
 
  const { telegram, face, viber, tik, share } = useIcons();  
  const { showAlert, AlertModalComponent } = useAlertModal();

  // Generate the share link
  const getShareLink = () => {
    let shareLink = `${window.location.origin}${window.location.pathname}`;
    if (uiMain && uiMain.id) {
      shareLink += shareLink.endsWith('/') ? `${uiMain.id}` : `/${uiMain.id}`;
    }
    return shareLink;
  };

  // Copy the link to clipboard
  const copyToClipboard = () => {
    const shareLink = getShareLink();
    navigator.clipboard.writeText(shareLink)
      .then(() => showAlert('Link copied to clipboard!')) 
      .catch(err => showAlert('⚠️The link could not be copied.')); 
  };

  // Toggle share options
  const toggleOptions = () => setIsOpen(!isOpen);

  const shareUrl = getShareLink(); // Link to share

  return (
    <div className="floating-share-button">
      <button onClick={toggleOptions} className="slider-item">
      <img className="cancel-button select" src={share} alt="Share" />
       Share
      </button>
      {isOpen && (
        <div className="share-options">
          {/* Telegram */}
          <a
            target="_blank"
            href={`https://telegram.me/share/url?url=${shareUrl}&text=Check this out!`}
            rel="noreferrer"
            className="option-button"
          >
            <img className="cancel-button select" src={telegram} alt="Telegram" />
          </a>

          {/* Facebook */}
          <a
            target="_blank"
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            rel="noreferrer"
            className="option-button"
          >
            <img className="cancel-button select" src={face} alt="Facebook" />
          </a>

          {/* Viber */}
          <a
            target="_blank"
            href={`viber://forward?text=${shareUrl}`}
            rel="noreferrer"
            className="option-button"
          >
            <img className="cancel-button select" src={viber} alt="Viber" />
          </a>

          {/* TikTok (Placeholder, as TikTok doesn't have a share URL) */}
          <a
            target="_blank"
            href={shareUrl}
            rel="noreferrer"
            className="option-button"
          >
            <img className="cancel-button select" src={tik} alt="TikTok" />
          </a>

          {/* Generic share button */}
          <button
            onClick={() => navigator.share({ title: 'Share this content', url: shareUrl })}
            className="slider-item"
          >
            <img className="cancel-button select" src={share} alt="Share" />
            Share
          </button>

          {/* Copy link button */}
          <button onClick={copyToClipboard} className="slider-item">
          🔗Copy link
          </button>
        </div>
      )}     
      <AlertModalComponent />
    </div>
  );
};

export default FloatingShareButton;