import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css'; 

function Navbar({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="navbar">
            <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>MusiCAL</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
            {isLoggedIn && (
                <Link 
                    to="/" 
                    onClick={(e) => { 
                        e.preventDefault(); 
                        onLogout(); 
                        navigate('/'); 
                    }} 
                    className={location.pathname === '/' ? 'active' : ''}>Logout</Link>
            )}
        </nav>
    );
}

export default Navbar;
