
// Home Page
import React from 'react';
import './HomePage.css';  // For styling this page

function HomePage() {
    console.log(localStorage.getItem('userEmail'));
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