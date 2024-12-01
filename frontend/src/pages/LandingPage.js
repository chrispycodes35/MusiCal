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
    storageBucket: "musical-4eabd.firebasestorage.app",
    messagingSenderId: "566662839891",
    appId: "1:566662839891:web:1d2443efb466ae270790a6",
    measurementId: "G-TD79LE01X9"
};

const db = getFirestore(initializeApp(firebaseConfig));

function LandingPage(setIsAuthenticated) {
    const navigate = useNavigate();

    useEffect(() => {
        //checks for token in url, retrieves it, and hides it
        const hash = window.location.hash;
        const token = new URLSearchParams(hash.substring(1)).get('access_token');
        window.history.replaceState(null, null, window.location.pathname);

        if (token) { // if the token is in the url 
            handleUserLogin(token);
        } else { // if the email is in the local storage then retrieve the access token from the firebase
            const email = localStorage.getItem('userEmail');
            if (email) { 
                checkFirebaseForToken(email); // retrieve the access token from the firebase
            }
        }
    }, []);

    const handleLogin = () => { //first component activated on click
        const clientId = 'ec1895b9fcb542cdab38b014c050f097';
        const redirectUri = 'http://localhost:3000/home';
        const scope = [ //asks for user permission to access personal and listening info 
            'user-library-read',
            'playlist-read-private',
            'user-read-recently-played',
            'user-top-read',
            'user-read-email',
        ].join(' ');

        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl; //redirects back to landing page after done and useEffect() gets triggerecd
    };

    const handleUserLogin = async (token) => { //general login 
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();

            if (!data.email) {
                throw new Error('Email missing in Spotify API response.');
            }

            localStorage.setItem('userEmail', data.email); // put email in local storage
            await storeInFirebase(data.email, token); // save token in firebase
            setIsAuthenticated(true); // set is authenticated to true
            navigate('/home'); // go back to homepage
        } catch (error) {
            console.error('Error logging in user:', error);
            alert('Failed to log in. Please try again.');
        }
    };

    const storeInFirebase = async (email, token) => {
        try {
            await setDoc(doc(db, 'user tokens', email), { email, accessToken: token });
            console.log('Token stored in Firebase for email:', email);
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
                    console.log('Token found in Firebase for email:', email);
                    navigate('/home'); // go back to homepage 
                } else {
                    console.error('Access token missing in Firebase document.');
                }
            } else {
                console.error('No document found for the user in Firebase.');
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
                <button className="login-button" onClick={handleLogin}>
                    Log In with Spotify
                </button>
            </div>
        </div>
    );
}

export default LandingPage;
