import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    const handleLogin = () => {
        const clientId = 'ec1895b9fcb542cdab38b014c050f097';
        const home_page = 'http://localhost:3000/home';
        const scope = [
            'user-library-read',
            'playlist-read-private',
            'user-read-recently-played',
            'user-top-read',
            'user-read-email',
        ].join(' ');

        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
            home_page
        )}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    };

    return (
        <div className="landingpage">
            <div className="content">
                <h1 className="title">MusiCal</h1>
                <p className="description">
                    Login to explore your harmonic music recommendations based on a color recommendation system.
                </p>
                <button className="login-button" onClick={handleLogin}>Log In with Spotify</button>
            </div>
        </div>
    );
}

export default LandingPage;

