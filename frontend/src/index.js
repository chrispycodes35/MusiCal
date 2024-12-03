import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Import global styles
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create root using React 18's createRoot API
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: report app performance metrics
reportWebVitals();
