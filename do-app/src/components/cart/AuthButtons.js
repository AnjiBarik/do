import React, { useEffect, useCallback } from 'react';
import './AuthButtons.css';

const AuthButtons = ({ googleClientId, facebookAppId, onSuccess, onError }) => {
  // Successful login handler via Google
  const handleGoogleResponse = useCallback((response) => {
    try {
      const token = response.credential;
      const payload = parseJwt(token);
      const email = payload.email;
      const name = payload.name || payload.given_name || 'User';

      const imageUrl = payload.picture
      const googleId = payload.sub
      // Passing email and name to parent component
      onSuccess({ email, name, token, imageUrl,googleId });

      // Unlink your Google account and initiate a new login
      window.google.accounts.id.revoke(email);
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleResponse,
      });

    } catch (error) {
      onError('Error processing Google authentication: ' + error.message);
    }
  }, [onSuccess, onError, googleClientId]);

  // Successful login handler via Facebook
  const handleFacebookResponse = useCallback((response) => {
    if (response.status === 'connected') {
      fetch(`https://graph.facebook.com/me?fields=email,name&access_token=${response.authResponse.accessToken}`)
        .then(res => res.json())
        .then(data => {
          // Passing email and name to parent component
          onSuccess({ email: data.email, name: data.name });
        })
        .catch(error => {
          onError('Error retrieving Facebook data: ' + error.message);
        });
    } else {
      onError('Facebook authorization error.');
    }
  }, [onSuccess, onError]);

  // Function for decoding JWT token from Google
  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
    return JSON.parse(base64);
  }; 

  useEffect(() => {
    // Session clearing operations on first render
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect(); // Disabling Google auto-login
    }

    window.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        if (window.FB) {
          window.FB.logout(); // Выход из Facebook
        }
      }
    });

    // Initializing Google Sign-In
    if (googleClientId) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large' }
      );
    }

    // Initializing Facebook SDK
    if (facebookAppId) {
      window.fbAsyncInit = function () {
        try {
          window.FB.init({
            appId: facebookAppId,
            cookie: true,
            xfbml: true,
            version: 'v17.0' // Make sure the version is up to date
          });
          window.FB.AppEvents.logPageView();

          // Checking the current authorization status
          window.FB.getLoginStatus(response => {
            if (response.status === 'connected') {
              handleFacebookResponse(response);
            }
          });
        } catch (error) {
          console.error('Error initializing Facebook SDK:', error);
        }
      };

      // Download the Facebook SDK
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
        js.onload = () => console.log('Facebook SDK loaded'); 
      }(document, 'script', 'facebook-jssdk'));
    }
  }, [googleClientId, facebookAppId, handleGoogleResponse, handleFacebookResponse]);

  return (
    <div className="auth-buttons">
      {googleClientId && <div id="googleSignInButton" className="google-signin-button"></div>}
      {facebookAppId && (
        <div
          className="facebook-signin-button"
          onClick={() => {
            window.FB.login(handleFacebookResponse, { scope: 'email' });
          }}
        >
          Log in with Facebook
        </div>
      )}
    </div>
  );
};

export default AuthButtons;