// Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';  // Style this file as needed

function Navbar({ onLogout }) {
    const navigate = useNavigate();                                                            
    const handleLogout = () => {
        const logoutUrl = 'https://accounts.spotify.com/en/logout'  
        //window.open(logoutUrl, 'Spotify Logout', 'width=700,height=500,top=40,left=40')   
        window.location.href = logoutUrl;  
    }
    return (
        <header className="navbar">
            <div className="navbar-content">
                <h1 className="navbar-title" onClick={() => navigate('/home')}>MusiCal</h1>
                <nav className="navbar-links">
                    <a href="#" onClick={handleLogout}>Logout</a>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
