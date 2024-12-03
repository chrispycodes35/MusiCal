import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
            <div className="app-container">
                {/* Navbar */}
                {isAuthenticated && <Navbar onLogout={handleLogout} />}

                {/* Main content */}
                <div className="main-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <LandingPage setIsAuthenticated={setIsAuthenticated} />
                                )
                            }
                        />
                        <Route
                            path="/home"
                            element={
                                isAuthenticated ? <HomePage /> : <Navigate to="/" />
                            }
                        />
                        <Route
                            path="/callback"
                            element={<CallbackPage onAuthenticate={() => setIsAuthenticated(true)} />}
                        />
                        <Route path="/about" element={<About />} />
                        <Route path="/privacy" element={<Privacy />} />
                    </Routes>
                </div>

                {/* Footer */}
                {!isAuthenticated && <Footer isAuthenticated={isAuthenticated} />}
            </div>
        </Router>
    );
}

export default App;
