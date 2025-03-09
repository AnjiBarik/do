import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import './form.css';
import { hashPasswordAndUsername } from '../rsacomponent/HashUtils';
import LoadingAnimation from '../utils/LoadingAnimation';
import { useAlertModal } from '../hooks/useAlertModal';
import { useConfirmModal } from '../hooks/useConfirmModal';
import AuthButtons from './AuthButtons'; 
import { saveAuthData, removeAuthData, hasAuthData, saveAuthDataSession, getAuthDataSession } from '../functional/authFunctions';

export default function RegistrationForm() {
  const { 
    showRegistrationForm, 
    setShowRegistrationForm, 
    message, 
    setMessage, 
    promo, 
    setPromo, 
    setOrder,     
    loggedIn, 
    setLoggedIn, 
    savedLogin, 
    setSavedLogin, 
    setSavedPassword, 
    savedPassword,
    setVerificationCode,
    verificationCode,
    userName, setUserName, setUserImg,
    uiMain 
  } = useContext(BooksContext);

  const {
    cancel,
    enter,
    useradd,
    logout,
    userok,
    nickname,
    password,
    email,
    chat
  } = useIcons();

  const { showAlert, AlertModalComponent } = useAlertModal();
  const { showConfirm, ConfirmModalComponent } = useConfirmModal();  

  const [formData, setFormData] = useState({
    Name: '',
    Password1: '',
    Email: '',
    VerificationCode: ''
  });
 
  const [isVerification, setIsVerification] = useState(1);
  const [isVerificationBase, setIsVerificationBase] = useState(0);
  const [showEmail, setShowEmail] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegistrationFormLokal, setShowRegistrationFormLokal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false); 
 
  
  const [googleClientId, setGoogleClientId] = useState('');
  const [facebookAppId, setFacebookAppId] = useState('');
  const [emailFromAuth, setEmailFromAuth] = useState('');  
  const [nameFromAuth, setNameFromAuth] = useState('');

  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);

  useEffect(() => {
    if (uiMain.regformGoogleClientID) {
      setGoogleClientId(uiMain.regformGoogleClientID);
    }
    if (uiMain.regformFacebookAppID) {
      setFacebookAppId(uiMain.regformFacebookAppID);
    }
  }, [uiMain.regformGoogleClientID, uiMain.regformFacebookAppID]);  

  // Calling AuthButtons and processing the authorization result
  const handleAuthSuccess = ({ email, name }) => { 
   setEmailFromAuth(email);
   setNameFromAuth(name);
   setFormData(prevData => ({ ...prevData, Email: email, Name: name }));
  };   

    const handleAuthLoginSuccess = async ({ email, name, token, imageUrl, googleId }) => {
      // Enable loading animation
      setLoading(true);
    
      try {
        // Prepare form data for server submission
        const formDataToSend = new FormData();
        formDataToSend.append("isVerification", 13);  // Google login verification flag
        formDataToSend.append('GoogleToken', token);  // Google authentication token
        formDataToSend.append('googleClientId', googleClientId);  // Google client ID from UI
    
        let Urreg = uiMain.Urregform;  // Server URL for form submission
    
        // Send form data to the server
        const response = await fetch(Urreg, {
          method: "POST",
          body: formDataToSend,
        });
    
        // Parse the server response
        const data = await response.text();
    
        // Handle different server responses
        if (data.includes('Successful login!')) {
          setUserName(name);      // Set user name
          setUserImg(imageUrl);   // Set user image
          setLoggedIn(true);      // Set logged-in status
          handleLoginSuccess(data);  // Call success handler          
        } else if (data.includes('User not found. Please register first.')) {
          showAlert('⚠️ User not found. Please register first.');
        } else if (data.includes('Account is locked due to too many failed attempts.')) {
          showAlert('⚠️ Account is locked due to too many failed attempts.');
        } else if (data.includes('User already logged.')) {
          showAlert('⚠️ User already logged.');
        } else {
          showAlert('⚠️ Error: ' + data);
        }
      } catch (error) {
        // Handle any errors during the process
        showAlert('⚠️ Error: ' + error.message);
      } finally {
        // Disable loading animation after response or error
        setLoading(false);
      }
    }; 

useEffect(() => {
  let newIsVerification;
  let newShowEmail = showRegistrationFormLokal;

  if (uiMain.regform === "test") {
    // This is typically used for testing purposes without two-factor authentication
    newIsVerification = showRegistrationFormLokal ? 1 : 2;
    newShowEmail = false;
  } else if (uiMain.regform === "twofactor") {
    // This is used for both registration and login with two-factor authentication
    newIsVerification = showRegistrationFormLokal ? 11 : 12;
    newShowEmail = showRegistrationFormLokal;
  } else {
    // This is typically used for registration with two-factor authentication and login without it
    newIsVerification = showRegistrationFormLokal ? 11 : 2;
    newShowEmail = showRegistrationFormLokal;
  }

  if (![16, 12, 4].includes(isVerification)) {
    setIsVerification(newIsVerification);
    setShowEmail(newShowEmail);
  } else if (isVerification === 12 && showVerificationCode) {
    setIsVerification(4);
    setShowEmail(newShowEmail);
  }

 // console.log(isVerification);
}, [showRegistrationFormLokal, uiMain.regform, showVerificationCode]);


  let logoutTimerRef = useRef(null); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoading(true);

    if (showRegistrationFormLokal && formData.Password1 !== confirmPassword) {
      showAlert('⚠️ Passwords do not match.');
      setSubmitting(false);
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("isVerification", isVerification);
    formDataToSend.append('Name', formData.Name);    
    formDataToSend.append("Password", await hashPasswordAndUsername(formData.Name, formData.Password1));

    showEmail && formDataToSend.append('Email', formData.Email);
    showVerificationCode && formDataToSend.append('VerificationCode', formData.VerificationCode);

    // Logic for adding VerificationCode
let verificationCodeToSend = verificationCode; //Getting verificationCode from context
//console.log(verificationCodeToSend )

if (!showVerificationCode) {
    if (verificationCode && verificationCode !== "") {
        verificationCodeToSend = verificationCode; // We use the value from the state
    } else {
        // If the verificationCode from the state is empty, check the session storage
        try {
            const sessionVerificationCode = await getAuthDataSession(uiMain.Urregform);
            if (sessionVerificationCode) {
                verificationCodeToSend = sessionVerificationCode; 
                //console.log(sessionVerificationCode )
            }
        } catch (error) {
            console.error('Failed to get verificationCode from session storage:', error);
        }
        if (verificationCode === "" && (isVerification === 1 || isVerification === 2)) {
          verificationCodeToSend = null;
      }
    }
}

if (verificationCodeToSend) {
    formDataToSend.append('registrationCode', verificationCodeToSend);
    //console.log(verificationCodeToSend )
}


    let Urreg = uiMain.Urregform;    
    try {
      const response = await fetch(Urreg, { method: "POST", body: formDataToSend });
      const data = await response.text();

      if (data.includes('Verification code sent to your email.')) {
        showAlert('Verification code sent to your email.');
        setShowVerificationCode(true);
        setIsVerification(4);
      }  else if (data.includes('Verification code is incorrect.')) {
        showAlert('Verification code is incorrect.');
        resetForm();
      } else if (data.includes('Password has been successfully reset.')) {
        showAlert('Password Successfully Updated!');
        //resetForm();
        setIsVerification(isVerificationBase);
        setShowVerificationCode(false)
        setShowRegistrationFormLokal(false); 
      } else if (data.includes('Account is locked due to too many failed attempts.')) {
        showAlert('Account is locked due to too many failed attempts.');
        resetForm();
      } else if (data.includes('Invalid isVerification value.')) {
        showAlert('Something went wrong');
        resetForm();
      } else if (data.includes('Failed to send verification code. Please try again.')) {
        showAlert('Failed to send verification code. Please try again.');
      } else if (data.includes('Email sending quota is near its limit. Please try again later.')) {
        showAlert('Something went wrong. Please try again later.');
      } else if (data.includes('Invalid email address.')) {
        showAlert('Invalid email address.');
      }
      
      else {
        if (showRegistrationFormLokal) {
          handleRegistrationResponse(data);
        } else {
          handleLoginResponse(data);
        }
      }
      
    } catch (error) {
      showAlert('⚠️Error: ' + error.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleRegistrationResponse = (data) => {
    if (data.includes('This username already exists. Please choose another one.')) {
      showAlert('This username already exists. Please choose another one');
      resetForm();
    } else if (data.includes('Verification code is incorrect.')) {
      showAlert('Verification code is incorrect.');
      resetForm();
    }
    else if (data.includes('Successful login!')) {
      handleLoginSuccess(data);
    }
    else {
      showAlert("⚠️Registration failed. Please try again.");
    }
  };

  const handleLoginResponse = (data) => {
    if (data === 'Incorrect username or password.') {
      showAlert('⚠️ Incorrect username or password.');
    } else if (data.includes('Verification code is incorrect.')) {
      showAlert('Verification code is incorrect.');
      resetForm();
    } else if (data.includes('User already logged.')) {
      showAlert('User already logged.');
      resetForm();
    }
    else if (data.includes('Successful login!')) {
      handleLoginSuccess(data);
    }
  };

  
  const handleLoginSuccess = async (data) => {
    const datamessage = data.replace("Successful login!", "").trim();
    const [receivedMessage, receivedPromo, receivedOrder, verificationCode, name] = datamessage.split(', ').map(item => item.split(': ')[1]);
    setMessage(receivedMessage || "");
    setPromo(receivedPromo || "");
    setOrder(receivedOrder || "");
    setVerificationCode (verificationCode || "" );
    resetForm();//!
    setLoggedIn(true);
    saveLoginData(name);

    if (verificationCode && verificationCode!=="" && /^\d{6}$/.test(verificationCode)) {
      try {
          await saveAuthDataSession(uiMain.Urregform, verificationCode); 
      } catch (error) {
          console.error('Failed to save verificationCode to session storage:', error);
      }
  }

    if (isRememberMe) {
      const confirmed = await showConfirm("Are you sure you want to add autologin data to the browser?");
      if (confirmed) {        
        if (uiMain.Urregform && name && verificationCode && /^\d{6}$/.test(verificationCode)) {
          try {
            await saveAuthData(uiMain.Urregform, name, verificationCode); 
            showAlert('Data added successfully!'); 
          } catch (error) {
            console.error('Failed to save login data:', error);
          }
        } else {
          console.warn('Empty data cannot be saved.');
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({ Name: '', Password1: '', Email: '', VerificationCode: '' });
    setConfirmPassword('');
    setSubmitting(false);
  };

  const saveLoginData = (name) => {
    //setSavedLogin(formData.Name);
    setSavedLogin(name && name !== "" ? name : formData.Name);
    setSavedPassword(formData.Password1);
  };

  const handleToggleForm = () => {
    setShowRegistrationFormLokal(!showRegistrationFormLokal);
    setLoggedIn(false);    
  };

  const handleLogout = useCallback(async () => {
  const formDataToLogout = new FormData();
    formDataToLogout.append("isVerification", 5);
    formDataToLogout.append('registrationCode', verificationCode);
    formDataToLogout.append('Name', savedLogin);
    formDataToLogout.append("Password", await hashPasswordAndUsername(savedLogin, savedPassword)); // Await here as well
    let Urreg = uiMain.Urregform;
    setLoading(true);
    try {
      const response = await fetch(Urreg, { method: "POST", body: formDataToLogout });
      const data = await response.text(); // Await here to get the response text properly
      
      if (data === 'Incorrect username or password.') {
        showAlert('⚠️ Incorrect username or password.');
      } else if (data.includes('Logout successful.')) {
        setLoggedIn(false);
        setSavedLogin('');
        setSavedPassword('');
        setPromo('');
        setOrder('');
        setMessage('');
        setVerificationCode('');
        setShowRegistrationForm(true);
        setUserName('');
        setUserImg('');
      }
    } catch (error) {
      showAlert('⚠️Error: ' + error.message);
    } finally {
      // Disable loading animation after response or error
      setLoading(false);
    }
  }, [setLoggedIn, setMessage, setOrder, setPromo, setSavedLogin, setSavedPassword, setShowRegistrationForm, showAlert, savedLogin, savedPassword, uiMain.Urregform,verificationCode,setVerificationCode,setUserImg,setUserName]);

  useEffect(() => {
    if (loggedIn) {
      logoutTimerRef.current = setTimeout(() => {
        handleLogout(); //Auto-logout after 20 minutes
      }, 1200000); // 20 * 60 * 1000 20 minutes in milliseconds 1200000
  
      return () => clearTimeout(logoutTimerRef.current); // Clean up the timer when logged out or component unmounts
    }
  }, [loggedIn, handleLogout]);

  const toggleSections = () => setShowRegistrationForm(false);

  const handleForgotPassword = async () => {
    // Your forgot password logic here
    setLoading(true);
    
    try {
      // Prepare form data for server submission
      const formDataToSend = new FormData();
      formDataToSend.append("isVerification", 15);  
      formDataToSend.append('Name', formData.Name);        
  
      let Urreg = uiMain.Urregform;  // Server URL for form submission
  
      // Send form data to the server
      const response = await fetch(Urreg, {
        method: "POST",
        body: formDataToSend,
      });
  
      // Parse the server response
      const data = await response.text();
  
      // Handle different server responses
      if (data.includes('Password reset code has been sent to your email.')) {
        showAlert('Password reset  code sent to your email.');
        
        setShowVerificationCode(true);
        setIsVerificationBase(isVerification)
        setIsVerification(16);  
        setShowRegistrationFormLokal(true);      
      } else {
        showAlert("⚠️Registration failed. Please try again.");
      }
    } catch (error) {
      // Handle any errors during the process
      showAlert('⚠️ Error: ' + error.message);
    } finally {
      // Disable loading animation after response or error
      setLoading(false);
    }
  }; 

  const handleRememberMe = (event) => {
    const isChecked = event.target.checked;
    setIsRememberMe(isChecked); 
    //console.log('Remember Me:', isChecked);
  };

  // Checking whether autologin data is in the storage when rendering the component
  useEffect(() => {
    const checkRememberMe = async () => {
      const hasData = await hasAuthData(uiMain.Urregform); 
      setIsRememberMeChecked(hasData); 
    };
    checkRememberMe();
  }, [uiMain.Urregform]);

  // Handler for changing the "Remember me" state
  const handleRememberMeChange = async (event) => {
    const isChecked = event.target.checked;
   
    if (isChecked && !isRememberMeChecked) {
      const confirmed = await showConfirm("Are you sure you want to add autologin data to the browser?");
      if (confirmed) {
        setIsRememberMeChecked(true); 
        if (savedLogin && verificationCode) {
          await saveAuthData(uiMain.Urregform, savedLogin, verificationCode); 
          console.log('Data added successfully!');
        }
      } else {
        event.preventDefault(); // Cancel the action if not confirmed
      }
    }
    
    // If the user tries to uncheck "Remember me"
    if (!isChecked && isRememberMeChecked) {
      const confirmed = await showConfirm("Are you sure you want to remove autologin data?");
      if (confirmed) {
        setIsRememberMeChecked(false); 
        await removeAuthData(uiMain.Urregform); // Removing data from storage
        console.log('Data removed successfully!');
      } else {
        event.preventDefault(); // Cancel the action if not confirmed
      }
    }
  };

  return (
    <>
      {AlertModalComponent()}
      {ConfirmModalComponent()}
      {showRegistrationForm && (
        <section className='section-form'>
          {loading && <LoadingAnimation />}
          <div className="registration-form">
          
            {loggedIn ? (
              <div>
                <p><img className="back-button select" src={userok} alt="userok" /> Welcome back: {userName && userName.trim() !== '' ? userName : savedLogin}</p>
                <p>{promo !== '#' && promo !== '' && `Your promo code: ${promo}`}</p>
                <p>{message !== '#' && message !== '' && `Your message: ${message}`}</p>
                <hr />
                <div className='filter'>
                  <button onClick={handleLogout} className='sort-button' tabIndex={-1} title="Logout">
                    <img className="back-button select" src={logout} alt="logout" />
                    <b>Log Out</b>
                  </button>
                 
  <label className='sort-button'>
    <input
      type="checkbox"      
      checked={isRememberMeChecked}
      onChange={handleRememberMeChange} 
    />
    Remember Me
  </label>


  <button 
      onClick={toggleSections} 
      className='sort-button'       
      tabIndex={1}
      autoFocus
      onKeyDown={(e) => { if (e.key === 'Enter') toggleSections(); }}
    >
                    <img src={cancel} alt='cancel' className="back-button select" />
                  </button>
                </div>
              </div>
            ) : (
              <>               
                <div className="tab-container">
    <div
        className={`tab-item ${showRegistrationFormLokal ? 'active-tab' : ''}`}
        onClick={handleToggleForm}
    >
        Log In
    </div>
    <div
        className={`tab-item ${!showRegistrationFormLokal ? 'active-tab' : ''}`}
        onClick={handleToggleForm}
    >
        {isVerification === 16 ? 'New Password' : 'Create Account'}
    </div>
</div>    

                <form onSubmit={handleSubmit}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <img className="form-icon select" src={nickname} alt="nickname" />
                        </td>
                        <td>
                          <input
                            className='form-input' autoFocus
                            type="text"
                            name="Name"
                            minLength={4}
                            maxLength={42}
                            placeholder='Your nickname'
                            value={formData.Name || nameFromAuth}                              
                            onChange={handleInputChange}
                            autoComplete="username"
                            required
                          />
                        </td>
                      </tr>
                      {showEmail && (
                        <>
                        <tr>
                          <td>
                            <img className="form-icon select" src={email} alt="email" />
                          </td>
                          <td>
                            <input
                              className='form-input'
                              type="email"
                              name="Email"
                              maxLength={42}
                              placeholder='Your Mail'                              
                              value={ formData.Email || emailFromAuth } 
                              onChange={handleInputChange}
                              autoComplete="username"
                              required
                            />
                          </td>
                        </tr> 
                        <tr>                      
                          <td colSpan="2">
                      {/* Inserting AuthButtons */}
            {(googleClientId || facebookAppId) && isVerification !== 16 && (
              <AuthButtons
                googleClientId={googleClientId}
                facebookAppId={facebookAppId}
                onSuccess={handleAuthSuccess}
                onError={(error) => showAlert('Error: ' + error.message)}
              />
            )}
                          </td>                       
                        </tr>
                       </>
                      )}
                      <tr>
                        <td>
                          <img className="form-icon select" src={password} alt="password" />
                        </td>
                        <td>
                          <input
                            className='form-input'
                            type="password"
                            minLength={3}
                            maxLength={42}
                            name="Password1"
                            placeholder='Password'
                            value={formData.Password1}
                            onChange={handleInputChange}
                            autoComplete="current-password"
                            required
                          />
                        </td>
                      </tr>
                      {!showRegistrationFormLokal && (
                      <tr>                      
                          <td colSpan="2">
                      {/* Inserting AuthButtons */}
            {(googleClientId || facebookAppId) && (
              <AuthButtons
                googleClientId={googleClientId}
                facebookAppId={facebookAppId}
                onSuccess={handleAuthLoginSuccess}
                onError={(error) => showAlert('Error: ' + error.message)}
              />
            )}
                          </td>                       
                        </tr>
                      )}
                      {showRegistrationFormLokal && (
                        <tr>
                          <td>
                            <img className="form-icon select" src={password} alt="confirm password" />
                          </td>
                          <td>
                            <input
                              className='form-input'
                              type="password"
                              minLength={3}
                              maxLength={42}
                              placeholder='Confirm Password'
                              value={confirmPassword}
                              onChange={handlePasswordChange}
                              autoComplete="new-password"
                              required
                            />
                          </td>
                        </tr>
                      )}
                      {showVerificationCode && (
                        <tr>                         
                          <td>                            
                            <img className="form-icon select" src={chat} alt="verification code" />
                          </td>
                          <td>
                            <input
                              className='form-input'
                              type="text"
                              maxLength={6}
                              name="VerificationCode"
                              placeholder='Confirm Verification Code'
                              value={formData.VerificationCode}
                              onChange={handleInputChange}
                              required
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>                
                  <div className='filter'>
<button 
  type='submit' 
  className='sort-button' 
  disabled={submitting} 
  tabIndex={-1}
  title={showRegistrationFormLokal ? "Add User" : "Enter"} // Title attribute for tooltip
>
  <img 
    className="back-button select" 
    src={showRegistrationFormLokal ? useradd : enter} 
    alt={showRegistrationFormLokal ? "useradd" : "enter"} 
  />
 {showRegistrationFormLokal ? <b>Create Account</b> : <b>Log in</b>}

</button>

{!showRegistrationFormLokal  ? (
  <button 
    className='sort-button' 
    disabled={!formData.Name} 
    onClick={handleForgotPassword}
  >
    Forgot Password?
  </button>
) : (
  
    <div className='sort-button'>
      <input 
        type="checkbox" 
        id="rememberMe" 
        onChange={handleRememberMe} 
      />
      <label htmlFor="rememberMe" className='sort-button'>Remember Me</label>
    </div>
 
)}

                    <button onClick={toggleSections} className='sort-button' disabled={submitting} tabIndex={0}>
                      <img src={cancel} alt='cancel' className="back-button select" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
          <hr />
        </section>
      )}
    </>
  );
}