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
                <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />} />
                <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/" />} />
                <Route path="/callback" element={<CallbackPage onAuthenticate={() => setIsAuthenticated(true)} />} />
            </Routes>
        </Router>
    );
}

export default App;
