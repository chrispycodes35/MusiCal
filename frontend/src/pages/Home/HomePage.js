import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import PopularGenres from './MainFeatures/PopularGenres/PopularGenres';
import GenreBreakdown from './MainFeatures/GenreBreakdown/GenreBreakdown';

const db = getFirestore();

function HomePage() {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]); // State for raw genres data
    const [genreData, setGenreData] = useState([]); // State for chart-ready data
    const [isLoading, setIsLoading] = useState(true); // Loading state for data fetching

    useEffect(() => {
        fetch('http://127.0.0.1:5000/listening_data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json()) // Parse JSON response
            .then((data) => {
                console.log('User listening data:', data);
    
                // Transform top_genres to chart-ready data
                const genreFrequency = data.top_genres || [];
                const total = genreFrequency.reduce((sum, genre) => sum + genre.count, 0);
    
                const formattedData = genreFrequency.map((genre) => ({
                    name: genre.name,
                    count: genre.count,
                    percentage: ((genre.count / total) * 100).toFixed(2),
                }));
    
                // Update states for the components
                setGenres(genreFrequency.slice(0, 5)); // Top 5 genres for PopularGenres
                setGenreData(formattedData); // All genres for GenreBreakdown
                setIsLoading(false); // Data fetching complete
            })
            .catch((error) => {
                console.error('Error fetching data:', error.message);
                setIsLoading(false); // Avoid infinite loading
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
            <div className="content">
                <h1 className="title">MusiCal</h1>
                <p className="description">
                    Receive Harmonically Compatible Song Recommendations and Explore Your Music Taste
                </p>
    
                {/* Render PopularGenres */}
                {genres.length > 0 ? (
                    <PopularGenres genres={genres} />
                ) : (
                    <p>Loading popular genres...</p>
                )}
    
                {/* Render GenreBreakdown */}
                {!isLoading && genreData.length > 0 ? (
                    <GenreBreakdown genreData={genreData} />
                ) : (
                    <p>Loading genre breakdown...</p>
                )}
            </div>
        </div>
    );
    
}

export default HomePage;
