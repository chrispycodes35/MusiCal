import React from 'react';
import { useNavigate } from 'react-router-dom';
import './footer.css';

function Footer({ isAuthenticated }) { // Accept isAuthenticated as a prop
    const navigate = useNavigate();

    const handleHomeClick = () => {
        
        if (localStorage.getItem('userEmail')) {
            navigate('/home');
        }
        else{
            navigate('/');
        }
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
