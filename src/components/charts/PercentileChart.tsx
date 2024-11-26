// src/components/charts/PercentileChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartTheme } from '../../utils/chartTheme';

interface PercentileChartProps {
  data: Array<{
    percentile: number;
    value: number;
  }>;
}

const PercentileChart: React.FC<PercentileChartProps> = ({ data }) => {
  const theme = useChartTheme();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Response Time Percentiles</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />
            <XAxis 
              dataKey="percentile" 
              stroke={theme.textColor}
            />
            <YAxis stroke={theme.textColor} />
            <Tooltip 
              contentStyle={theme.tooltipStyle}
              formatter={(value: number) => `${value}ms`}
            />
            <Line 
              type="stepAfter" 
              dataKey="value" 
              stroke={theme.colors.primary}
              dot={{ fill: theme.colors.primary }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PercentileChart;