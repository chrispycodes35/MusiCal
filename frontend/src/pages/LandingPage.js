import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import './LandingPage.css';

const firebaseConfig = {
    apiKey: "AIzaSyBKjT-2ulnsONxd81VHe9Rh50I1kU4iq94",
    authDomain: "musical-4eabd.firebaseapp.com",
    databaseURL: "https://musical-4eabd-default-rtdb.firebaseio.com",
    projectId: "musical-4eabd",
    storageBucket: "musical-4eabd.firebaseapp.com",
    messagingSenderId: "566662839891",
    appId: "1:566662839891:web:1d2443efb466ae270790a6",
    measurementId: "G-TD79LE01X9"
};

const db = getFirestore(initializeApp(firebaseConfig));

function LandingPage({ setIsAuthenticated }) {
    const navigate = useNavigate();

    useEffect(() => {
        const processTokenFromURL = async () => {
            const hash = window.location.hash;
            const token = new URLSearchParams(hash.substring(1)).get('access_token');
            
            if (token) {
                window.history.replaceState(null, null, window.location.pathname); // Clear the token from the URL
                await handleUserLogin(token);
            } else {
                const email = localStorage.getItem('userEmail');
                if (email) {
                    await checkFirebaseForToken(email);
                }
            }
        };

        processTokenFromURL();
    }, []);

    const handleInitialLogin = () => {
        const clientId = 'bf672d78468c4fa6b8389d815d211583';
        const redirectUri = 'http://localhost:3000/callback';
        const scope = [
            'user-library-read',
            'playlist-read-private',
            'user-read-recently-played',
            'user-top-read',
            'user-read-email',
        ].join(' ');

        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    };

    const handleUserLogin = async (token) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Spotify API Error: ${errorText}`);
                throw new Error(`Spotify API Error: ${response.statusText}`);
            }
    
            const data = await response.json();
    
            if (!data.email) {
                throw new Error('Email missing in Spotify API response.');
            }
    
            await storeInFirebase(data.email, token);
            localStorage.setItem('userEmail', data.email);
            setIsAuthenticated(true);
            navigate('/home');
        } catch (error) {
            console.error('Error during login:', error);
        }
    };    
    

    const storeInFirebase = async (email, token) => {
        try {
            await setDoc(doc(db, 'user tokens', email), { email, accessToken: token });
        } catch (error) {
            console.error('Error storing token in Firebase:', error);
        }
    };

    const checkFirebaseForToken = async (email) => {
        try {
            const userDoc = doc(db, 'user tokens', email);
            const snapshot = await getDoc(userDoc);

            if (snapshot.exists()) {
                const data = snapshot.data();
                if (data.accessToken) {
                    setIsAuthenticated(true);
                    navigate('/home'); // Redirect after setting state
                } else {
                    console.warn('No valid token found for email:', email);
                    localStorage.removeItem('userEmail'); // Clear invalid data
                    setIsAuthenticated(false);
                }
            }
        } catch (error) {
            console.error('Error checking Firebase for token:', error);
        }
    };

    return (
        <div className="landingpage">
            <div className="background"></div>
            <div className="content">
                <h1 className="title">MusiCal</h1>
                <p className="description">
                    Login to explore your harmonic music recommendations based on a color recommendation system.
                </p>
                <button className="login-button" onClick={handleInitialLogin}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-2 !fill-black fill-[#1DB954]"><g><path fill-rule="nonzero" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.55 2 12 2zm3.75 14.65c-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.35.15.4.55.25.85-.2.3-.55.4-.85.2zm1-2.7c-2.7-1.65-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.2 1s-.7.5-1.05.25zM6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.55-1.05 9.4-.85 13.1 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25C14.7 9 9.35 8.8 6.3 9.75z"></path></g></svg>
                Log In with Spotify</button>
            </div>
        </div>
    );
}

export default LandingPage;
