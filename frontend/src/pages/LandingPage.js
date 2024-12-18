import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import './LandingPage.css';

/*
HOW THE FIREBASE DATABASE WORKS
*************************************************************************************************************************

1. run: npm install -g firebase-tools (installs firebase)
2. firebase login (create a firebase account online and run this command in the terminal if you want to see the database) 
               (you do not need to do this if you only are looking to read/write to the database)
3. send me your email so that I can add you as a collaborator to the firebase project -> (20990527778)

*************************************************************************************************************************
*/

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
function LandingPage({isAuthenticated, setIsAuthenticated}) {
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

    const handleInitialLogin = () => { //first component activated on click
        const clientId = 'ec1895b9fcb542cdab38b014c050f097';
        const redirectUri = 'http://localhost:3000/';
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

    const handleUserLogin = async (token) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.ok) {
                console.error('Spotify API error:', response.statusText);
                return;
            }
    
            const data = await response.json();
            console.log('Spotify user data:', data); // Add this log
            localStorage.setItem('userEmail', data.email); // Save email in local storage
            storeInFirebase(data.email, token);

    
            // Send email to backend
            const saveEmailResponse = await fetch('http://127.0.0.1:5000/save-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email }),
            });
    
            const saveEmailData = await saveEmailResponse.json();
            console.log('Save email response:', saveEmailData);
    
            if (saveEmailResponse.ok) {
                navigate('/home'); // Redirect to home
            } else {
                console.error('Failed to save email:', saveEmailData.error);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    
    

    const storeInFirebase = async (email, token) => {
        try {
            await setDoc(doc(db, 'user tokens', email), {
                email: email,
                accessToken: token, // Ensure the key matches what the backend expects
            });
            console.log(`Stored access token for ${email}`);
        } catch (error) {
            console.error('Error storing token in Firebase:', error);
        }
    };
    

    const checkFirebaseForToken = async (email) => {
            const userDoc = doc(db, 'user tokens', email);
            const snapshot = await getDoc(userDoc);

            if (snapshot.exists()) {
                const data = snapshot.data();
                if (data.accessToken) {
                    console.log('Token found in Firebase for email:', email);
                    await fetch('http://127.0.0.1:5000/save-email', { // send email to backend
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: data.email }),
                    });
                    
                    setIsAuthenticated(true);
                    navigate('/home'); // go back to homepage 
                }
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