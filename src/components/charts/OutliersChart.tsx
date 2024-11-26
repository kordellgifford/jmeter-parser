// src/components/charts/OutliersChart.tsx
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartTheme } from '../../utils/chartTheme';

interface OutliersChartProps {
  data: Array<{
    timestamp: string;
    elapsed: number;
  }>;
}

const OutliersChart: React.FC<OutliersChartProps> = ({ data }) => {
  const theme = useChartTheme();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Response Time Outliers</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              stroke={theme.textColor}
            />
            <YAxis 
              dataKey="elapsed" 
              stroke={theme.textColor}
            />
            <Tooltip 
              contentStyle={theme.tooltipStyle}
              labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              formatter={(value: number) => [`${value}ms`]}
            />
            <Scatter 
              data={data} 
              fill={theme.colors.error}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Shows requests with response times {'>'} 2 standard deviations from mean
      </p>
    </div>
  );
};

export default OutliersChart;