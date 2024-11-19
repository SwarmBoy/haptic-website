// ActuatorPlot.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { time } from 'three/webgpu';

const ActuatorPlot = ({ data }) => {
  // Prepare data for plotting
  const timestamps = data.map(cmd => new Date(cmd.timestamp * 1000));
  const freqs = data.map(cmd => cmd.freq);
  const duties = data.map(cmd => cmd.duty);


  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Freq',
        data: freqs,
        borderColor: 'red',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        showLine: false, 
      },
      {
        label: 'Duty',
        data: duties,
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        showLine: false, 
      },
    ],
  };

  const options = {
    animation: false,
    scales: {
      x: {
        type: 'time', // Time scale for correct spacing
        time: {
          unit: 'second', // Define the unit of time to display
        }, 
        grid: {
          display: false, // Hide grid lines
        },
        ticks: {
          display: false, // Hide axis ticks and labels
        },
        // for min puit the currenr time - 3s
        min: new Date(Date.now() - 5000),
        // for max put the current time
        max: new Date(Date.now()),
      },  
      y: { 
        display: false, // Hide the y-axis completely
        min: 0,
        max: 10,
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
    elements: {
      point: {
        radius: 1, // Add spacing for points
      },
    },
    maintainAspectRatio: true,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ActuatorPlot;
