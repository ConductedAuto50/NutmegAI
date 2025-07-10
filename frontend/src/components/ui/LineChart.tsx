'use client';

import React from 'react';
import { Line, Bar, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  chartData: any;
}

const Chart: React.FC<ChartProps> = ({ chartData }) => {
  const chartType = chartData.type || 'line';
  
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
            color: '#FCFAF6'
        }
      },
      title: {
        display: true,
        color: '#FCFAF6',
        font: {
            size: 16
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(252, 250, 246, 0.1)',
        },
        ticks: {
          color: '#FCFAF6',
        },
      },
      y: {
        grid: {
          color: 'rgba(252, 250, 246, 0.1)',
        },
        ticks: {
          color: '#FCFAF6',
        },
      },
    },
  };

  const mergedOptions = {
      ...defaultOptions,
      ...chartData.options,
      plugins: {
          ...defaultOptions.plugins,
          ...(chartData.options?.plugins || {}),
          legend: {
              ...defaultOptions.plugins.legend,
              ...(chartData.options?.plugins?.legend || {})
          },
          title: {
              ...defaultOptions.plugins.title,
              ...(chartData.options?.plugins?.title || {})
          },
      },
      scales: {
          ...defaultOptions.scales,
          ...(chartData.options?.scales || {}),
          x: {
            ...defaultOptions.scales.x,
            ...(chartData.options?.scales?.x || {})
          },
          y: {
            ...defaultOptions.scales.y,
            ...(chartData.options?.scales?.y || {})
          }
      }
  };


  const ChartComponents = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut,
    polarArea: PolarArea,
    radar: Radar
  };

  const ChartComponent = ChartComponents[chartType as keyof typeof ChartComponents];

  if (!ChartComponent) {
    console.error(`Unsupported chart type: ${chartType}`);
    return <div>Unsupported chart type: {chartType}</div>;
  }

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <ChartComponent data={chartData.data} options={mergedOptions} />
    </div>
  );
};

export default Chart; 