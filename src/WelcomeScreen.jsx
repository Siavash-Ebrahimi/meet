import React from "react";
import './WelcomeScreen.css';
function WelcomeScreen(props) {
  return props.showWelcomeScreen ?
    (
      <div className="WelcomeScreen">
        <h1>Welcome to the Meet App</h1>
        <h3>A Progressive Web App - PWA</h3>
        <h4>
          Please Log in to see upcoming events around the world for full-stackdevelopers!!
        </h4>
        <div className="button_cont" align="center">
          <div className="google-btn">
            <div className="google-icon-wrapper">
              <img
                className="google-icon"
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google sign-in" />
            </div>
            <button onClick={() => { props.getAccessToken() }}
              rel="nofollow noopener"
              className="btn-text">
              <b>Sign in with google</b>
            </button>
          </div>
        </div>
        No data is being gathered or shared by this app. For more details, please see our
        <a href="https://github.com/Siavash-Ebrahimi/meet/blob/main/public/privecy.html" rel="nofollow noopener">
          Privacy Policy
        </a>
      </div>
    )
    : null
}

export default WelcomeScreen;