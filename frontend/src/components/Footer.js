import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer({ isAuthenticated }) {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate(isAuthenticated ? '/home' : '/'); // Navigate to home or landing based on login status
    };

    return (
        <footer className="footer">
            <button onClick={handleHomeClick}>Home</button>
            <button onClick={() => navigate('/about')}>About</button>
            <button onClick={() => navigate('/privacy')}>Privacy</button>
        </footer>
    );
}

export default Footer;
