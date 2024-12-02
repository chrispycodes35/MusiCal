// Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import './Navbar.css';  // Style this file as needed

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
