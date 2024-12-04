import React, { useEffect, useState } from 'react';
import './Top10Songs.css';

function Top10Songs() {
    const [topTracks, setTopTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch top tracks from the backend
        fetch('http://127.0.0.1:5000/listening_data', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error('Error fetching top tracks:', data.error);
                    return;
                }
                setTopTracks(data.top_tracks || []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="loading">Loading top tracks...</div>;
    }

    return (
        <>
            <h2>Top 10 Songs</h2>
            <div className="songs-grid">
                {topTracks.map((track, index) => (
                    <div
                        key={index}
                        className="song-card"
                        onClick={() => window.open(track.external_url, '_blank')}
                    >
                        <img
                            src={track.image || 'https://via.placeholder.com/150'} // Placeholder if no image exists
                            alt={track.name}
                            className="song-image"
                        />
                        <p className="song-title">{track.name}</p>
                        <p className="song-artist">{track.artist}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Top10Songs;
