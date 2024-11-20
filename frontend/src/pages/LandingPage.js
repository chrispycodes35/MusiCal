import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    const handleLogin = () => {
        const clientId = 'ec1895b9fcb542cdab38b014c050f097';
        const redirectUri = 'http://localhost:3000/home';
        const scope = [
            'user-library-read',
            'playlist-read-private',
            'user-read-recently-played',
            'user-top-read',
        ].join(' ');

        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&scope=${encodeURIComponent(scope)}`;

        window.location.href = authUrl;
    };

    return (
        <div className="landingpage">
            <div className="background"></div>
            <div className="content">
                <h1 className="title">MusiCal</h1>
                <p className="description">
                    Login to explore your harmonic music recommendations based on a color recommendation system.
                </p>
                <button className="login-button" onClick={handleLogin}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-2 !fill-black fill-[#1DB954]"><g><path fill-rule="nonzero" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.55 2 12 2zm3.75 14.65c-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.35.15.4.55.25.85-.2.3-.55.4-.85.2zm1-2.7c-2.7-1.65-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.2 1s-.7.5-1.05.25zM6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.55-1.05 9.4-.85 13.1 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25C14.7 9 9.35 8.8 6.3 9.75z"></path></g></svg>
                Log In with Spotify</button>
            </div>
        </div>
    );
}

export default LandingPage;

