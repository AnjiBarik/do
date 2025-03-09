import React, { useState, useRef } from 'react';
import { useIcons } from '../../IconContext';
import './InfoModal.css';
import { useAlertModal } from '../hooks/useAlertModal';

const InfoModal = ({ infotext, iconName, showCopyButton = false, copyTemplate = '' }) => {
    const icons = useIcons();
    let icon;
    const { showAlert, AlertModalComponent } = useAlertModal();

    try {
        icon = icons[iconName] || icons['info']; // Default to 'info' if iconName is not provided or not found
    } catch (error) {
        icon = icons['info'];
        console.error('Icon name not found in context, defaulting to info icon:', error);
    }

    const [showModal, setShowModal] = useState(false);
    const [modalStyle, setModalStyle] = useState({});
    const buttonRef = useRef(null);
    const fixedHeaderHeight = 85; //fixed header height

    const toggleModal = () => {
        if (showModal) {
            setShowModal(false);
        } else {
            if (buttonRef.current) {
                const buttonRect = buttonRef.current.getBoundingClientRect();
                const modalWidth = 360; 
                const modalHeight = 200; 
                const padding = 20; 

                // Calculating positions for a modal window
                const top = buttonRect.top + window.scrollY;
                const left = buttonRect.left + window.scrollX;

                let calculatedTop = top - modalHeight - padding;
                let calculatedLeft = left + buttonRect.width / 2 - modalWidth / 2;

                // Checking that the modal window does not extend beyond the screen
                if (calculatedTop < padding + fixedHeaderHeight) {
                    calculatedTop = top + buttonRect.height + padding;
                }
                if (calculatedLeft < padding) {
                    calculatedLeft = padding;
                } else if (calculatedLeft + modalWidth + padding > window.innerWidth) {
                    calculatedLeft = window.innerWidth - modalWidth - padding;
                }

                setModalStyle({
                    top: `${calculatedTop}px`,
                    left: `${calculatedLeft}px`,
                    width: `${modalWidth}px`,
                });
            }

            setShowModal(true);
        }
    };

    const copyToClipboard = () => {
        const textToCopy = copyTemplate
            ? copyTemplate.replace('{infotext}', infotext)
            : infotext;

        try {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showAlert('Successfully copied to clipboard!');
                })
                .catch((err) => {
                    console.error('Failed to copy: ', err);
                });
        } catch (error) {
            console.error('Clipboard operation failed:', error);
        }
    };

    return (
        <div>
            {AlertModalComponent()}
            <div ref={buttonRef} onClick={toggleModal}>
                <img src={icon} className="back-button select" alt={iconName || "info"} />
            </div>

            {showModal && (
                <div className="modal" style={modalStyle}>
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>
                            <img className="cancel-button select" src={icons['cancel']} alt="cancel" />
                        </span>
                        <p>{infotext}</p>
                        {showCopyButton && (
                            <div className="sort-button form-input" onClick={copyToClipboard}>
                                Copy to Clipboard
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default InfoModal;