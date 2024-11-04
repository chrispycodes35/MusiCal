// LandingPage.js
import React from 'react';
import './LandingPage.css';


function LandingPage() {

    const handleLogin = () => {
        const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const redirectUri = 'http://localhost:3000/callback';
        const scope = 'user-read-private user-read-email';
        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
        };
  

  return (
    <div className="landingpage">
      <div className="content">
        <h1 className="title">MusiCal</h1>
        <p className="description">
          Login to explore your harmonic music recommendations based on a color recommendation system.
        </p>
        <button className="login-button" onClick={handleLogin}>Log In</button>
      </div>
      <footer className="footer">
        <a href="/about">About</a>
        <a href="/privacy">Privacy</a>
        <a href="/logout">Logout</a>
      </footer>
    </div>
  );
}

export default LandingPage;
