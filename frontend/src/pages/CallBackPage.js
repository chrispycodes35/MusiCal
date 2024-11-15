// CallBackPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CallBackPage({ onAuthenticate }) {
    const navigate = useNavigate();

    useEffect(() => {
        // Extract the token from the URL hash
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1)); // Remove the # at the beginning
        const accessToken = params.get('access_token');

        if (accessToken) {
            // Save the token in localStorage
            localStorage.setItem('spotifyAccessToken', accessToken);

            // Call the authenticate function to set isAuthenticated to true
            onAuthenticate();

            // Redirect to home page
            navigate('/home');
        } else {
            // Redirect back to login if there's no token
            navigate('/');
        }
    }, [navigate, onAuthenticate]);

    return (
        <div>
            <p>Processing login...</p>
        </div>
    );
}

export default CallBackPage;
