import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PercentileChartProps {
  data: Array<{
    percentile: number;
    value: number;
  }>;
}

const PercentileChart: React.FC<PercentileChartProps> = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Response Time Percentiles</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="percentile" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value}ms`} />
          <Line type="stepAfter" dataKey="value" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PercentileChart;