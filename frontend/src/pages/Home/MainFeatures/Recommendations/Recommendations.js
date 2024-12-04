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
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.error || 'Failed to fetch recommendations');
            }

            const data = await response.json();
            setRecommendations(data.recommendations);
        } catch (err) {
            console.error(err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    return (
        <div className="recommendations">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
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
                    <button className="regenerate-button" onClick={fetchRecommendations}>
                        Regenerate Recommendations
                    </button>
                </>
            )}
        </div>
    );
}

export default Recommendations;
