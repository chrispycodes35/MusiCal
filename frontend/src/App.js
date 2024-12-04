import React, { useState, useEffect } from 'react';
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            // Verify email with the backend to ensure valid token
            fetch('http://127.0.0.1:5000/save-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
                .then((res) => {
                    if (res.ok) {
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem('userEmail'); // Remove invalid token
                    }
                })
                .catch(() => localStorage.removeItem('userEmail'))
                .finally(() => setCheckingAuth(false));
        } else {
            setCheckingAuth(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        setIsAuthenticated(false);
    };

    if (checkingAuth) {
        return <div>Loading...</div>;
    }

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
                {!isAuthenticated && <Footer />}
            </div>
        </Router>
    );
}

export default App;
