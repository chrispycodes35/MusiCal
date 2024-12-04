import React, { useState, useEffect } from 'react';
import './Recommendations.css';

function Recommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/model_recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: 'YOUR_SPOTIFY_USER_ID' }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setRecommendations(data.recommendations);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch recommendations');
                setLoading(false);
            });
    }, []);

    return (
        <div className="recommendations">
            <h2>Model-Based Recommendations</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <ul>
                    {recommendations.map((rec, index) => (
                        <li key={index} className="recommendation-item">
                            <a href={rec.external_url} target="_blank" rel="noopener noreferrer">
                                {rec.name} by {rec.artist}
                            </a>
                            {rec.preview_url && (
                                <audio controls>
                                    <source src={rec.preview_url} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Recommendations;
