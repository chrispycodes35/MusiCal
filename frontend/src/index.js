import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Import global styles
import App from './App';
import reportWebVitals from './reportWebVitals';

// Render the App component inside the root div
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Optional: report app performance metrics (optional feature from create-react-app)
reportWebVitals();
