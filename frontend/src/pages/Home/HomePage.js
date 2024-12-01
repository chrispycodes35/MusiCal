import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {

    return (
        <div className="home">
            <div className="content">
                <h1 className="title">Welcome!</h1>
                <p className="description">
                    Discover music based on colors and explore the relationship between sound and color.
                </p>
            </div>
        </div>
    );
}

export default HomePage;
