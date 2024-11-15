// Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';  // Style this file as needed

function Navbar({ onLogout }) {
    const navigate = useNavigate();

    return (
        <header className="navbar">
            <div className="navbar-content">
                <h1 className="navbar-title" onClick={() => navigate('/home')}>MusiCal</h1>
                <nav className="navbar-links">
                    <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); navigate('/'); }}>Logout</a>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
