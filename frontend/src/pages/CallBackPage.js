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


/*
Now that the access_token is saved in localStorage, you can use it to make authorized requests to 
the Spotify API. For example, in any component that needs to make Spotify API calls, you can retrieve 
the token as follows:
const accessToken = localStorage.getItem('spotifyAccessToken');
When making API requests, set the authorization header with this token:
fetch('https://api.spotify.com/v1/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
*/