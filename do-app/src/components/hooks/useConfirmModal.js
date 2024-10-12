import { useState } from 'react';
import AlertModal from '../utils/AlertModal'; 

export const useConfirmModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [resolvePromise, setResolvePromise] = useState(null);

    const showConfirm = (msg) => {
        setMessage(msg);
        setShowModal(true);
        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const handleClose = (result) => {
        setShowModal(false);
        setMessage('');
        if (resolvePromise) {
            resolvePromise(result);
        }
    };

    const ConfirmModalComponent = () => (
        <AlertModal
            infotext={message}
            showInput={false}
            showModal={showModal}
            toggleModal={handleClose}
            showConfirm={true} // Show both OK and Cancel buttons
        />
    );

    return { showConfirm, ConfirmModalComponent };
};
