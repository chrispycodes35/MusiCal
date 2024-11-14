// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/Home/HomePage';
import CallbackPage from './pages/CallBackPage';
import Footer from './pages/footer';
import './App.css';
import About from "./pages/About/About";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is authenticated by checking for the token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('spotifyAccessToken');
        setIsAuthenticated(!!token);  // Set to true if token exists, false otherwise
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken'); // Clear the token
        setIsAuthenticated(false);  // Update authentication status
    };

    return (
        <Router>
            <Routes>
                {/* LandingPage is accessible to all users */}
                <Route path="/" element={<LandingPage />} />

                {/* HomePage is accessible only if authenticated */}
                <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/" />} />

                {/* CallbackPage handles Spotify login and sets isAuthenticated */}
                <Route path="/callback" element={<CallbackPage onAuthenticate={() => setIsAuthenticated(true)} />} />
                
                <Route path="/about" element={<About />} />  {/* Route for About page */}


            </Routes>
            {/* Display Footer on all pages, passing isAuthenticated and handleLogout */}
            <Footer isLoggedIn={isAuthenticated} onLogout={handleLogout} />
        </Router>
    );
}

export default App;
