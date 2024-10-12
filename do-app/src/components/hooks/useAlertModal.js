import { useState } from 'react';
import AlertModal from '../utils/AlertModal'; 

export const useAlertModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

    const showAlert = (msg) => {
        setMessage(msg);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setMessage('');
    };

    const AlertModalComponent = () => (
        <AlertModal
            infotext={message}
            showInput={false}
            showModal={showModal}
            toggleModal={handleClose}
        />
    );

    return { showAlert, AlertModalComponent };
};
