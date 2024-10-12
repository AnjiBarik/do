import React from 'react';
import './alertModal.css';
import { useIcons } from '../../IconContext';

const AlertModal = ({ infotext, showModal, toggleModal, showConfirm }) => {
    const { cancel } = useIcons();

    const handleOk = () => {
        toggleModal(true); 
    };

    const handleCancel = () => {
        toggleModal(false); 
    };
   
    let isWarning = false;
    if (typeof infotext === 'string' && infotext.trim() !== '') {
      isWarning = infotext.startsWith('⚠️');
    }
    
    const modalClassName = `modal-content ${isWarning ? 'badalert' : ''}`;

    return (
        showModal && (
        <>
            <div className="modal-overlay"></div>
            <div className="modal-position">
                <div className={modalClassName}>
                    <span className="close" onClick={handleCancel}>
                        <img className="cancel-button select" src={cancel} alt="cancel" />
                    </span>
                    <p className='message'>{infotext}</p>
                    <div className="modal-actions">
                        <div className="sort-button" onClick={handleOk}>
                            OK
                        </div>
                        {showConfirm && (
                            <div className="sort-button" onClick={handleCancel}>
                                Cancel
                            </div>
                        )}
                    </div>
                </div>
            </div>        
        </>
        )
    );
};

export default AlertModal;