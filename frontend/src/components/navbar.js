import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import './Navbar.css';

const db = getFirestore();

function Navbar({ onLogout }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            await deleteDoc(doc(db, 'user tokens', email));
        }
        localStorage.removeItem('userEmail');
        onLogout();
        navigate('/');
    };

    return (
        <div className="navbar">
            <h1 className="navbar-title" onClick={() => navigate('/home')}>MusiCal</h1>
            <div className="navbar-links">
                <a onClick={() => navigate('/about')}>About</a>
                <a onClick={() => navigate('/privacy')}>Privacy</a>
                <a onClick={handleLogout}>Logout</a>
            </div>
        </div>
    );
}

export default Navbar;
