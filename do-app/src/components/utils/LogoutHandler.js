import { useEffect, useCallback, useContext } from "react";
import { hashPasswordAndUsername } from '../rsacomponent/HashUtils';
import { BooksContext } from '../../BooksContext';

// Output Processing Component
const LogoutHandler = () => {
 
  const {
    loggedIn,     
    savedLogin,
    savedPassword,
    verificationCode,    
    uiMain
  } = useContext(BooksContext); 
  
  const handleLogout = useCallback(async () => {
    const formDataToLogout = new FormData();
    formDataToLogout.append("isVerification", 5);
    formDataToLogout.append("registrationCode", verificationCode);
    formDataToLogout.append("Name", savedLogin);
    formDataToLogout.append("Password", await hashPasswordAndUsername(savedLogin, savedPassword));

    try {
      const response = await fetch(uiMain.Urregform, {
        method: "POST",
        body: formDataToLogout,
      });
      const data = await response.text();

      if (data.includes("Logout successful.")) {
        console.log("logout")
      }    
    } catch (error) {
        console.log("Error: " + error.message)      
    }
  }, [savedLogin, savedPassword, verificationCode, uiMain.Urregform]);

  // Add an event handler when a tab is closed
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      if (loggedIn) {
        await handleLogout(); 
      }
    };

    // Adding a beforeunload event when mounting a component
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove the event when a component is unmounted
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleLogout, loggedIn]);

  return null; 
};

export default LogoutHandler;
