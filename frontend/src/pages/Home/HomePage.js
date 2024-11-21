import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import './HomePage.css';

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


function HomePage() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const hash = window.location.hash;
        const token = new URLSearchParams(hash.substring(1)).get('access_token');
        window.history.replaceState(null, null, window.location.pathname);
        fetchUserData(token);
    }, []);

    const fetchUserData = async (token) => {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        await storeInFirebase(data.email, token)
        setUserData(data);
    };
    const storeInFirebase = async(email, token) => {
        await setDoc(doc(db, 'user tokens', email), {
            email: email,
            accessToken: token
        });
    }

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
