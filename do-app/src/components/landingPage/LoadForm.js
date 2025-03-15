import { BooksContext } from '../../BooksContext';
import React, { useContext, useEffect } from "react";
import { useSubmit } from "../hooks/useSubmit";
import LoadingAnimation from '../utils/LoadingAnimation'; 
import { useAlertModal } from '../hooks/useAlertModal';

export default function Form({ autoSubmit = false }) {
  const {     
    uiMain, 
    idLoudPrice        
  } = useContext(BooksContext);
 
  const { showAlert, AlertModalComponent } = useAlertModal();  
  const { Submit, loading } = useSubmit();   
  
  

  useEffect(() => {
    if (autoSubmit && document.querySelector("form")) {
      Submit();
    }
  }, [autoSubmit, Submit]);

  return (
    <>
      {AlertModalComponent()}
      {idLoudPrice !== uiMain.id && (
        <div className='container-submit'>
          {loading ? (
            <LoadingAnimation />
          ) : (
            <form className="form" onSubmit={Submit}>
              <input
                name="submit"
                type="submit"
                className='loading-submit color-transition'
                value={uiMain.shopping || "Start shopping"}
              />
            </form>
          )}
        </div>
      )}
    </>
  );
}