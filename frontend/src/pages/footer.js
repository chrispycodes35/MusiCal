// footer.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './footer.css';

function Footer({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();

    return (
        <footer className="footer">

            
            {isLoggedIn ? (
                <>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Home</a>
                    <a href="/about">About</a>
                    <a href="/privacy">Privacy</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); navigate('/'); }}>Logout</a>
                </>
            ) : (
                <>
                    <a href="/about">About</a>
                    <a href="/privacy">Privacy</a>
                </>
            )}
        </footer>
    );
}

export default Footer;
