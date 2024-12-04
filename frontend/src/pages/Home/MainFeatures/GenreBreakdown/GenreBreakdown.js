import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './GenreBreakdown.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function GenreBreakdown({ genreData }) {
    const limitedGenres = genreData.slice(0, 20);
    const colors = [
        '#010133', '#002F6C', '#89CFF0', '#B0B0B0', '#FFD700',
        '#001F54', '#003366', '#00509E', '#7A8B99', '#E6BE8A',
        '#4A90E2', '#2A6478', '#4169E1', '#C0C0C0', '#DAA520',
        '#5B84B1', '#003F5C', '#4682B4', '#6C757D', '#FFC107',
    ];

    const data = {
        labels: limitedGenres.map((genre) => genre.name),
        datasets: [
            {
                label: 'Genre Breakdown',
                data: limitedGenres.map((genre) => genre.percentage),
                backgroundColor: colors.slice(0, limitedGenres.length),
                borderWidth: 1,
                borderColor: '#fff',
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
        },
        responsive: true,
    };

    return (
        <div className="genre-breakdown-container">
            <div className="chart-container">
                <Pie data={data} options={options} />
            </div>
            <div className="chart-legend">
                {limitedGenres.map((genre, index) => (
                    <div key={index} className="legend-item">
                        <div
                            className="legend-color"
                            style={{
                                backgroundColor: colors[index % colors.length],
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
