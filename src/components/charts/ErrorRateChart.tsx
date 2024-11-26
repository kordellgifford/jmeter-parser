import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ErrorRateChartProps {
  data: Array<{
    timestamp: string;
    errorRate: number;
  }>;
}

const ErrorRateChart: React.FC<ErrorRateChartProps> = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Error Rate Over Time</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleTimeString()}
            formatter={(value: number) => [`${value.toFixed(2)}%`]}
          />
          <Area type="monotone" dataKey="errorRate" fill="#fee2e2" stroke="#ef4444" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ErrorRateChart;