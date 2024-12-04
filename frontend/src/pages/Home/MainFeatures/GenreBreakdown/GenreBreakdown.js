import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './GenreBreakdown.css';

// Register the required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function GenreBreakdown({ genreData }) {
    // Format the data for the pie chart
    const data = {
        labels: genreData.map((genre) => genre.name), // Genre names
        datasets: [
            {
                label: 'Genre Breakdown',
                data: genreData.map((genre) => genre.percentage), // Genre percentages
                backgroundColor: ['#8B0000', '#004953', '#2F4F4F', '#4B0082', '#483D8B'], // Colors for each genre
                borderWidth: 1,
                borderColor: '#fff', // White border for pie segments
            },
        ],
    };

    // Options for the chart
    const options = {
        plugins: {
            legend: {
                display: false, // Disable default legend
            },
        },
        responsive: true,
    };

    return (
        <div className="genre-breakdown-container">
            <h2 className="genre-breakdown-title">Genre Listening Breakdown</h2>
            <div className="chart-container">
                <Pie data={data} options={options} />
            </div>
            <div className="chart-legend">
                {genreData.map((genre, index) => (
                    <div key={index} className="legend-item">
                        <div
                            className="legend-color"
                            style={{
                                backgroundColor: data.datasets[0].backgroundColor[index] || '#ccc', // Fallback color
                            }}
                        ></div>
                        <span>{genre.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GenreBreakdown;
