// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import CallbackPage from './pages/CallBackPage';
import './App.css';  // Import App CSS globally

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is authenticated by checking for the token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('spotifyAccessToken');
        setIsAuthenticated(!!token);  // Set to true if token exists, false otherwise
    }, []);

    return (
        <Router>
            <Routes>
                {/* Always direct users to LandingPage first */}
                <Route path="/" element={<LandingPage />} />

                {/* HomePage accessible only if authenticated */}
                <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/" />} />

                {/* Callback route to handle Spotify login */}
                <Route path="/callback" element={<CallbackPage onAuthenticate={() => setIsAuthenticated(true)} />} />
            </Routes>
        </Router>
    );
}

export default App;
