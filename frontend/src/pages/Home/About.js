import React from 'react';
import "./About.css";

// Reusable AboutItem Component
function AboutItem({ title, content }) {
    return (
        <div className="about-item">
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    );
}

function About() {
    const aboutItems = [
        {
            title: 'Mission',
            content: 'Make music enjoyable and accessible for everyone, breaking barriers and connecting cultures through melodies.',
        },
        {
            title: 'Vision',
            content: 'Create a vibrant global music community where every sound resonates with a story and brings people closer together.',
        },
        {
            title: 'Values',
            content: 'We believe in inclusivity, creativity, and the transformative power of music to inspire and connect.',
        },
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero">
                {/* Text Section */}
                <div className="about-text">
                    <h1>What is MusiCAL?</h1>
                    <p>
                        A platform designed for music lovers to discover, explore, and experience music 
                        from around the world. Whether you're a fan of indie rock, jazz, hip hop, or classical, 
                        MusiCAL connects you to the sounds you love and introduces you to new music experiences.
                    </p>
                </div>

                {/* Image Section */}
                <div className="about-image">
                    <img src="/halfrecord.png" alt="Record" />
                </div>
            </div>

            {/* Mission, Vision, and Values Section */}
            <div className="about-mission-vision">
                {aboutItems.map((item, index) => (
                    <AboutItem key={index} title={item.title} content={item.content} />
                ))}
            </div>
        </div>
    );
}

export default About;
