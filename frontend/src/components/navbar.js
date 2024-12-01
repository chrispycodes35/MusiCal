// Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';  // Style this file as needed

function Navbar({ onLogout }) {
    const navigate = useNavigate();    
    const logoutClick = () => {
        localStorage.removeItem('userEmail');
        onLogout();
        navigate('/');
    }                                
    return (
        <header className="navbar">
            <div className="navbar-content">
                <h1 className="navbar-title" onClick={() => navigate('/home')}>MusiCal</h1>
                <nav className="navbar-links">
                    <a href="#" onClick={logoutClick}>Logout</a>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
