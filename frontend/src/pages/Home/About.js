import React from 'react';
import "./About.css";


function About() {
    return (
        <div className="about-page">

            <div className="hero">

                <div className = "record-img-container">

                    <div className = "main-body">
                        <h1>What is MusiCAL?</h1>
                        <p>A platform designed for music lovers to discover, explore, and experience music from around the world. Whether you're a fan of indie rock, jazz, hip hop, or classical, MusiCAL connects you to the sounds you love and introduces you to new music experiences.</p>
                    </div>

                        <img src = "halfrecord.png" alt="Record"/>

                </div>

                <div className = "mission-vision-grid">
                    <div className = "mission">
                        <h2>Mission</h2>
                        <p>Make music enjoyable and accesible for everyone.</p>
                    </div>

                    <div className = "vision">
                        <h2>Vision</h2>
                        <p>Create a vibrant music community.</p>

                    </div>



                </div>

            </div>


        </div>


    );
}

export default About;