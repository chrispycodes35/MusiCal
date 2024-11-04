// Home Page
import React from 'react';
import './HomePage.css';  // For styling this page

function HomePage() {
  return (
    <div className="home">
    <div className="content">
      <h1 className="title">MusiCal</h1>
      <p className="description">
      Discover music based on colors and explore the relationship between sound and color.
      </p>
    </div>
    <footer className="footer">
      <a href="/about">About</a>
      <a href="/privacy">Privacy</a>
      <a href="/logout">Logout</a>
    </footer>
  </div>
  );
}

export default HomePage;
