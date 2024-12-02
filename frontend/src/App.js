import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/Home/HomePage';
import CallbackPage from './pages/CallBackPage';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 
import About from './pages/Home/About';
import Privacy from './pages/Home/Privacy';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return Boolean(localStorage.getItem('userEmail'));
    });

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout}>
                <Footer isAuthenticated={isAuthenticated} />
                <Routes>
                    <Route path="/" element={<LandingPage setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/" />} />
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