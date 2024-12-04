import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import PopularGenres from './MainFeatures/PopularGenres/PopularGenres';
import GenreBreakdown from './MainFeatures/GenreBreakdown/GenreBreakdown';
import Recommendations from './MainFeatures/Recommendations/Recommendations';
import Top10Songs from './MainFeatures/Top10Songs/Top10Songs'; // Import the component

const db = getFirestore();

function HomePage() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({ username: '', profile_picture: '' });
    const [genres, setGenres] = useState([]);
    const [genreData, setGenreData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/listening_data', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error('Error fetching data:', data.error);
                    return;
                }

                setUserInfo({
                    username: data.username || 'User',
                    profile_picture: data.profile_picture,
                });

                const genreFrequency = data.top_genres || [];
                const total = genreFrequency.reduce((sum, genre) => sum + genre.count, 0);
                const formattedData = genreFrequency.map((genre) => ({
                    name: genre.name,
                    count: genre.count,
                    percentage: ((genre.count / total) * 100).toFixed(2),
                }));

                setGenres(genreFrequency.slice(0, 5));
                setGenreData(formattedData);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error.message);
                setIsLoading(false);
            });
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
            {/* Introduction Section */}
            <section className="section introduction-section">
                <header className="header">
                    {userInfo.profile_picture && (
                        <img src={userInfo.profile_picture} alt="Profile" className="profile-picture" />
                    )}
                    <h1>Hello, {userInfo.username}</h1>
                </header>
                <h2>Explore Your Spotify Listening, Get Cool Recommendations, and more!</h2>
            </section>

            {/* Top 10 Songs Section */}
            <section className="section songs-section">
                <Top10Songs />
            </section>

            {/* Top Genres Section */}
            <section className="section genres-section">
                <h2>Top Genres</h2>
                {genres.length > 0 ? (
                    <PopularGenres genres={genres} />
                ) : (
                    <p>Loading popular genres...</p>
                )}
            </section>

            {/* Genre Breakdown Section */}
            <section className="section breakdown-section">
                <h2>Genre Listening Breakdown</h2>
                {!isLoading && genreData.length > 0 ? (
                    <GenreBreakdown genreData={genreData} />
                ) : (
                    <p>Loading genre breakdown...</p>
                )}
            </section>

            {/* Recommendations Section */}
            <section className="section recommendations-section">
                <h2>Recommended Tracks</h2>
                <Recommendations />
            </section>
        </div>
    );
}

export default HomePage;
