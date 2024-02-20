import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarElement, Tooltip, Title } from 'chart.js';
Chart.register(LinearScale, CategoryScale, BarElement, Tooltip, Title);

const SalesPerMonth = ({ SalesPerMonth }) => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const graphData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let key in SalesPerMonth) {
        graphData[key - 1] = SalesPerMonth[key]
    }
    const data = {
        labels: labels,
        datasets: [{
            label: 'Earned Rupees',
            data: graphData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)'
            ],
            borderWidth: 1,
            barThickness: 30,
        }]

    };

    const options = {
        scales: {
            x: {
                barPercentage: 2,  // This controls the width of the bars
                categoryPercentage: 2,  // This controls the size of the outer container
            }
        },

        plugins: {
            title: {
                display: true,
                text: 'Monthly Earnings'  // This will be your chart title
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            enabled: true,  // Enable tooltips
        },
    };



    // Calculate the width of the canvas
    const barWidth = 30; // Set this to your desired bar width
    const totalWidth = barWidth * labels.length; // Total width of all bars

    return (
        <div style={{ overflowX: 'auto', width: '40%' }}>
            <div style={{ width: `${totalWidth}px`, minWidth: "465px", height: '300px' }}>
                <Bar data={data} options={options} height={300} />
            </div>
        </div>
    );
};

export default SalesPerMonth;
