import React from 'react';
import './PopularGenres.css';

function PopularGenres({ genres }) {
    const colors = ['#8B0000', '#004953', '#2F4F4F', '#4B0082', '#483D8B'];
    const limitedGenres = genres.slice(0, 5);

    const redirectToSpotify = (genre) => {
        const playlistSearchURL = `https://open.spotify.com/search/${encodeURIComponent(genre)}`;
        window.open(playlistSearchURL, '_blank'); // Opens the URL in a new tab
    };

    return (
        <div className="popular-genres-container">
            <h2 className="popular-genres-title">Your Top 5 Genres</h2>
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
