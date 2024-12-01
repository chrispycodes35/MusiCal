// Footer.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './footer.css';

function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <button onClick={() => navigate('/home')}>Home</button>
            <button onClick={() => navigate('/about')}>About</button>
            <button onClick={() => navigate('/privacy')}>Privacy</button>
        </footer>
    );
}

export default Footer;
