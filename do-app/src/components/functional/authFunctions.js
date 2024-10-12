// authFunctions.js
const hashUrl = async (url) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(url);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };  
  
  const isLocalStorageAvailable = () => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  };
  
const isSessionStorageAvailable = () => {
  try {
      const test = '__session_storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
  } catch (e) {
      return false;
  }
};

// Function for saving authCode in sessionStorage
const saveAuthDataSession = async (scriptUrl, authCode) => {
  if (!isSessionStorageAvailable()) {
      throw new Error('SessionStorage is not available');
  }

  if (!scriptUrl || !authCode) {
      throw new Error('Missing parameters');
  }

  const hashedUrl = await hashUrl(scriptUrl); 
  sessionStorage.setItem(hashedUrl, authCode); 
};

// Function to get authCode from hashed URL from sessionStorage
const getAuthDataSession = async (scriptUrl) => {
  if (!isSessionStorageAvailable()) {
      throw new Error('SessionStorage is not available');
  }

  const hashedUrl = await hashUrl(scriptUrl); 
  const authCode = sessionStorage.getItem(hashedUrl);

  // Return null if data is not found
  return authCode || null;
};
  
  // Function for saving authorization data
  const saveAuthData = async (scriptUrl, login, authCode) => {
    if (!isLocalStorageAvailable()) {
      throw new Error('LocalStorage is not available');
    }
    
    if (!scriptUrl || !login || !authCode) {
      throw new Error('Missing parameters');
    }
  
    const hashedUrl = await hashUrl(scriptUrl); 
    const authData = { login, authCode };
    localStorage.setItem(hashedUrl, JSON.stringify(authData)); 
  };
  
  // Function for obtaining authorization data from a hashed URL
  const getAuthData = async (scriptUrl) => {
    if (!isLocalStorageAvailable()) {
      throw new Error('LocalStorage is not available');
    }
  
    const hashedUrl = await hashUrl(scriptUrl); 
    const data = localStorage.getItem(hashedUrl);
  
    if (!data) {
      throw new Error('No data found for the given URL');
    }
  
    return JSON.parse(data);
  };
  
  // Function to remove data by hashed URL
  const removeAuthData = async (scriptUrl) => {
    if (!isLocalStorageAvailable()) {
      throw new Error('LocalStorage is not available');
    }
  
    const hashedUrl = await hashUrl(scriptUrl); 
    localStorage.removeItem(hashedUrl);
  };
  
  // Function to check if data by URL is in local storage
  const hasAuthData = async (scriptUrl) => {
    if (!isLocalStorageAvailable()) {
      throw new Error('LocalStorage is not available');
    }
  
    const hashedUrl = await hashUrl(scriptUrl); 
    const data = localStorage.getItem(hashedUrl);
    return !!data; // Return true if data is found, false otherwise
  };
  
  // Function to perform a POST login request with Verification Code update
  const loginRequest = async (scriptUrl, login, authCode) => {
    if (!scriptUrl || !login || !authCode) {
      throw new Error('Missing parameters for login request');
    }
  
    const formData = new FormData();
    formData.append('isVerification', 14);
    formData.append('registrationCode', authCode);
    formData.append('Name', login);
  
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
  
      const textResponse = await response.text();
  
      if (textResponse.includes('Successful login!')) {
        try {         
          const messageMatch = textResponse.match(/Message:\s(.+?),\sPromo/);
          const promoMatch = textResponse.match(/Promo:\s(.+?),\sOrder/);
          const orderMatch = textResponse.match(/Order:\s(.+?),\sVerification Code/);
          const verificationCodeMatch = textResponse.match(/Verification Code:\s(.+?),\sName/);
          const nameMatch = textResponse.match(/Name:\s(.+)/);
  
          const message = messageMatch ? messageMatch[1] : '';
          const promo = promoMatch ? promoMatch[1] : '';
          const order = orderMatch ? orderMatch[1] : '';
          const newVerificationCode = verificationCodeMatch ? verificationCodeMatch[1] : '';
          const name = nameMatch ? nameMatch[1] : '';
  
          // Update the verification code in the local storage, if available
          if (newVerificationCode) {
            await saveAuthData(scriptUrl, login, newVerificationCode);
          }
  
          return {
            success: true,
            message,
            promo,
            order,
            verificationCode: newVerificationCode,
            name
          };
  
        } catch (parsingError) {
          throw new Error('Failed to parse the server response');
        }
      } else {
        throw new Error('Login failed: Unexpected response format');
      }
  
    } catch (error) {
      throw new Error(`Login error: ${error.message}`);
    }
  };  
 
  export {
    saveAuthData,
    getAuthData,
    removeAuthData,
    hasAuthData,
    saveAuthDataSession,
    getAuthDataSession,
    loginRequest
  };
  