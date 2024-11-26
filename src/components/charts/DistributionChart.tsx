// src/components/charts/DistributionChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DistributionData } from '../../types';
import { useChartTheme } from '../../utils/chartTheme';

interface DistributionChartProps {
  data: DistributionData[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data }) => {
  const theme = useChartTheme();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Response Time Distribution</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />
            <XAxis 
              dataKey="range" 
              stroke={theme.textColor}
            />
            <YAxis stroke={theme.textColor} />
            <Tooltip 
              contentStyle={theme.tooltipStyle}
              formatter={(value: number) => [`${value} requests`]}
            />
            <Bar 
              dataKey="count" 
              fill={theme.colors.primary}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistributionChart;