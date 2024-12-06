import React, { useState, useEffect } from 'react';
import './Recommendations.css';

function Recommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecommendations = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch('http://127.0.0.1:5000/model_recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.status === 401) {
                // Handle token expiration
                setError("Session expired. Please log in again.");
                return;
            }
    
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.error || 'Failed to fetch recommendations');
            }
    
            const data = await response.json();
            setRecommendations(data.recommendations);
        } catch (err) {
            console.error("Error fetching recommendations:", err.message);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchRecommendations();
    }, []);

    if (loading) return <div className="loading">Loading recommendations...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="recommendations-container">
            <h2>Recommended Tracks</h2>
            <div className="recommendations-grid">
                {recommendations.map((track, index) => (
                    <div
                        key={index}
                        className="recommendation-card"
                        onClick={() => window.open(track.external_url, '_blank')}
                    >
                        <img
                            src={track.image || 'https://via.placeholder.com/150'}
                            alt={track.name}
                            className="recommendation-image"
                        />
                        <div className="recommendation-info">
                            <p className="recommendation-title">{track.name}</p>
                            <p className="recommendation-artist">{track.artist}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="regenerate-button" onClick={fetchRecommendations}>
                Regenerate Recommendations
            </button>
        </div>
    );
}

export default Recommendations;
