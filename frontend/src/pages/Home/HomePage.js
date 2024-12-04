import React, { useEffect } from 'react';
import './HomePage.css';  // For styling this page
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const db = getFirestore();
function HomePage() {
    const navigate = useNavigate();
    useEffect(() => {
        fetch('http://127.0.0.1:5000/listening_data', { //fetch request recieves a response object
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },})
            .then((response) => {
                return response.json(); //parses the reponse object which gives us the actual JSON data sent from app.py
            })
            .then((data) => console.log('user listening data:', data)) //handles the data recieved
            .catch((error) => console.error('error:', error.message)); //catches any errors that occur throughout the whole process
    }, []);

    const handleLogout = async () => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            await deleteDoc(doc(db, 'user tokens', email));
        }
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    return (
        <div className="home">
            <div className="content">
                <h1 className="title">MusiCal</h1>
                 <p className="description">
                    Discover music based on colors and explore the relationship between sound and color.
                </p>
            </div>
        </div>
  );
}

export default HomePage;