import React from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { TimeSeriesData } from '../../types';

interface ResponseTimeBreakdownProps {
  data: TimeSeriesData[];
}

const ResponseTimeBreakdown: React.FC<ResponseTimeBreakdownProps> = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Response Time Breakdown</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            label={{ value: 'Active Threads', angle: 90, position: 'insideRight' }}
          />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleTimeString()}
            formatter={(value: number, name: string) => [
              `${value}${name === 'Active Threads' ? '' : 'ms'}`,
              name
            ]}
          />
          <Legend />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="connect" 
            stackId="1" 
            fill="#fee2e2" 
            stroke="#ef4444" 
            name="Connect" 
          />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="latency" 
            stackId="1" 
            fill="#dbeafe" 
            stroke="#3b82f6" 
            name="Latency" 
          />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="processing" 
            stackId="1" 
            fill="#dcfce7" 
            stroke="#22c55e" 
            name="Processing" 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="threads" 
            stroke="#8b5cf6" 
            name="Active Threads"
          />
          <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ResponseTimeBreakdown;