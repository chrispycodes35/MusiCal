// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/Home/HomePage';
import CallbackPage from './pages/CallBackPage';
import Navbar from './components/Navbar'; // Ensure Navbar's capitalization matches the file name
import Footer from './components/Footer'; // Ensure Footer's capitalization matches the file name
import About from './pages/Home/About';
import Privacy from './pages/Home/Privacy';

import './App.css';

// The rest of your App.js code remains the same

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return Boolean(localStorage.getItem('spotifyAccessToken'));
    });

    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
        setIsAuthenticated(false);  
        document.cookie = "cookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
       // window.location.href = 'https://accounts.spotify.com/en/logout'
    };

    return (
        <Router>
            <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout}>
                <Routes>
                    <Route path="/" element={<LandingPage setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/home" element={<HomePage onAuthenticate={() => setIsAuthenticated(true)}/> } />
                    <Route path="/callback" element={<CallbackPage onAuthenticate={() => setIsAuthenticated(true)} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                </Routes>
            </Layout>
        </Router>
    );
}


function Layout({ children, isAuthenticated, handleLogout }) {
    const location = useLocation();

    // Show Navbar only on the /home page when the user is authenticated
    const showNavbar = isAuthenticated && location.pathname === "/home";

    return (
        <div>
            {showNavbar && <Navbar onLogout={handleLogout} />}
            {children}
            <Footer isLoggedIn={isAuthenticated} onLogout={handleLogout} />
        </div>
    );
}

export default App;
