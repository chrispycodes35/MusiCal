// CallBackPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CallbackPage({ onAuthenticate }) {
    const navigate = useNavigate();

    useEffect(() => {
        const processAuthentication = async () => {
            if (onAuthenticate) {
                await onAuthenticate(); // Trigger authentication logic (e.g., update state)
            }
            navigate('/home'); // Redirect to the HomePage after authentication
        };

        processAuthentication();
    }, [onAuthenticate, navigate]);

    return (
        <div>
            <p>Processing login...</p>
        </div>
    );
}

export default CallbackPage;
