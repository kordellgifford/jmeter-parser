// src/components/charts/ErrorRateChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartTheme } from '../../utils/chartTheme';

interface ErrorRateChartProps {
  data: Array<{
    timestamp: string;
    errorRate: number;
  }>;
}

const ErrorRateChart: React.FC<ErrorRateChartProps> = ({ data }) => {
  const theme = useChartTheme();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Error Rate Over Time</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              stroke={theme.textColor}
            />
            <YAxis stroke={theme.textColor} />
            <Tooltip 
              contentStyle={theme.tooltipStyle}
              labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              formatter={(value: number) => [`${value.toFixed(2)}%`]}
            />
            <Area 
              type="monotone" 
              dataKey="errorRate" 
              fill={`${theme.colors.error}40`}
              stroke={theme.colors.error}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ErrorRateChart;