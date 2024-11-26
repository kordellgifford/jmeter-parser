import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OutliersChartProps {
  data: Array<{
    timestamp: string;
    elapsed: number;
  }>;
}

const OutliersChart: React.FC<OutliersChartProps> = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Response Time Outliers</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            type="category"
          />
          <YAxis dataKey="elapsed" />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleTimeString()}
            formatter={(value: number) => [`${value}ms`]}
          />
          <Scatter data={data} fill="#ef4444" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
    <p className="mt-2 text-sm text-gray-500">
      Shows requests with response times {'>'} 2 standard deviations from mean
    </p>
  </div>
);

export default OutliersChart;