import React from 'react';
import './PopularGenres.css';

function PopularGenres({ genres }) {
    // Updated colors with Berkeley-inspired palette
    const colors = ['#010133', '#002F6C', '#89CFF0', '#B0B0B0', '#FFD700'];
    const limitedGenres = genres.slice(0, 5);

    const redirectToSpotify = (genre) => {
        const playlistSearchURL = `https://open.spotify.com/search/${encodeURIComponent(genre)}`;
        window.open(playlistSearchURL, '_blank'); // Opens the URL in a new tab
    };

    return (
        <div className="popular-genres-container">
            <div className="popular-genres">
                {limitedGenres.map((genre, index) => (
                    <div
                        key={index}
                        className="genre-box"
                        style={{ backgroundColor: colors[index % colors.length] }}
                        onClick={() => redirectToSpotify(genre.name)} // Use `genre.name`
                    >
                        {genre.name} {/* Render the name */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PopularGenres;
