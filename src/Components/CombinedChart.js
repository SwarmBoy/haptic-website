// src/components/CombinedChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function CombinedChart({ amplitudeData, frequencyData }) {
  const [chartData, setChartData] = useState(() => {
    const timeLabelsAmplitude = amplitudeData.map((point) => point.time);
    const timeLabelsFrequency = frequencyData.map((point) => point.time);

    const amplitudeValues = timeLabelsAmplitude.map((time) => {
      const point = amplitudeData.find((p) => p.time === time);
      return point ? point.amplitude : null;
    });

    const frequencyValues = timeLabelsFrequency.map((time) => {
      const point = frequencyData.find((p) => p.time === time);
      return point ? point.frequency : null;
    });

    amplitudeValues.pop();
    timeLabelsAmplitude.pop();

    const timeLabels = Array.from(new Set([...timeLabelsAmplitude, ...timeLabelsFrequency]));

    return {
      labels: timeLabels,
      datasets: [
        {
          label: 'Amplitude',
          data: amplitudeValues,
          yAxisID: 'y1',
          borderColor: 'rgba(0, 0, 255, 0.5)',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          fill: false,
          pointRadius: 0,
          tension: 0.1,
        },
        {
          label: 'Frequency',
          data: frequencyValues,
          yAxisID: 'y2',
          borderColor: 'rgba(255, 0, 0, 0.5)',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          fill: false,
          pointRadius: 0,
          tension: 0.1,
        },
      ],
    };
  });

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Time (s)',
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(3);
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Amplitude',
        },
        min: 0,
        max: 1,
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Frequency',
        },
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
        max: 1,
      },
    },
  };

 
  return (
    <div>
      <h2>Amplitude and Frequency Envelopes</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default CombinedChart;
