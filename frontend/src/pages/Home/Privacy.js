import React from 'react';
import "./Privacy.css";

function Privacy() {
    return (
        <div className="privacy-page">

            <div className="hero">

                <div className = "main-body">
                    <h1>Your Privacy</h1>
                    <p>We do our best to provide an enjoyable and cool experience without overstepping
                        personal boundaries.
                    </p>
                </div>
                

                <div className = "mission-vision-grid">
                    <div className = "How">
                        <h2>What are we doing?</h2>
                        <p>We are utilizing trends in your listening history such as popular keys, moods, and genres
                            to compose unique recommendations.
                        </p>
                    </div>

                    <div className = "vision">
                        <h2>Your Data</h2>
                        <p>We use the Spotify API to retrieve abstract data and do not use data outside of
                            what the Spotify API provides.
                        </p>

                    </div>



                </div>

            </div>


        </div>


    );
}

export default Privacy;