// Navigation Bar
import React from 'react';
import './Navbar.css';  // For styling the navbar

function Navbar() {
  return (
    <nav className="navbar">
      <h1>MusiCal</h1>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
