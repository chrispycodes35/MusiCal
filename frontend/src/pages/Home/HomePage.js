import React, { useEffect, useState } from 'react';
import './HomePage.css';

function HomePage() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const hash = window.location.hash;
        const token = new URLSearchParams(hash.substring(1)).get('access_token');

        if (token) {
            console.log('Access Token:', token);
            localStorage.setItem('spotifyAccessToken', token);
            window.history.replaceState(null, null, window.location.pathname);
            fetchUserData(token);
        } else {
            console.error('No access token found in the URL.');
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <div className="home">
            <div className="content">
                <h1 className="title">Welcome!</h1>
                <p className="description">
                    Discover music based on colors and explore the relationship between sound and color.
                </p>

            </div>
        </div>
    );
}

export default HomePage;
