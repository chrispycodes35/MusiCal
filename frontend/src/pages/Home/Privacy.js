import React from 'react';
import './Privacy.css';

// Reusable PrivacyItem component
function PrivacyItem({ title, content }) {
    return (
        <div className="privacy-item">
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    );
}

function Privacy() {
    const privacyItems = [
        {
            title: 'What are we doing?',
            content:
                'We are utilizing trends in your listening history such as popular keys, moods, and genres to compose unique recommendations.',
        },
        {
            title: 'Your Data',
            content:
                'We use the Spotify API to retrieve abstract data and do not use data outside of what the Spotify API provides.',
        },
        {
            title: 'Is my data stored?',
            content:
                'We store only anonymized metadata required for personalized recommendations. No private information is stored beyond session tokens.',
        },
        {
            title: 'Can I delete my data?',
            content:
                'Yes, you can contact us or navigate to the settings page to delete your stored data, including preferences and tokens, at any time.',
        },
    ];

    return (
        <div className="privacy-page">
            <div className="privacy-header">
                <h1>Privacy</h1>
                <p>
                    We do our best to provide an enjoyable and cool experience without overstepping
                    personal boundaries.
                </p>
            </div>

            <div className="privacy-content">
                {privacyItems.map((item, index) => (
                    <PrivacyItem key={index} title={item.title} content={item.content} />
                ))}
            </div>
        </div>
    );
}

export default Privacy;
