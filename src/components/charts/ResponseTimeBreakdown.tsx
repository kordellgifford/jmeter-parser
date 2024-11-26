// src/components/charts/ResponseTimeBreakdown.tsx
import React from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { TimeSeriesData } from '../../types';
import { useChartTheme } from '../../utils/chartTheme';

interface ResponseTimeBreakdownProps {
  data: TimeSeriesData[];
}

const ResponseTimeBreakdown: React.FC<ResponseTimeBreakdownProps> = ({ data }) => {
  const theme = useChartTheme();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Response Time Breakdown</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              stroke={theme.textColor}
            />
            <YAxis 
              yAxisId="left"
              label={{ 
                value: 'Response Time (ms)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: theme.textColor } 
              }}
              stroke={theme.textColor}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ 
                value: 'Active Threads', 
                angle: 90, 
                position: 'insideRight',
                style: { fill: theme.textColor } 
              }}
              stroke={theme.textColor}
            />
            <Tooltip 
              contentStyle={theme.tooltipStyle}
              labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              formatter={(value: number, name: string) => [
                `${value}${name === 'Active Threads' ? '' : 'ms'}`,
                name
              ]}
            />
            <Legend 
              wrapperStyle={{ color: theme.textColor }}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="connect" 
              stackId="1" 
              fill={`${theme.colors.connect}40`}
              stroke={theme.colors.connect}
              name="Connect" 
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="latency" 
              stackId="1" 
              fill={`${theme.colors.latency}40`}
              stroke={theme.colors.latency}
              name="Latency" 
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="processing" 
              stackId="1" 
              fill={`${theme.colors.processing}40`}
              stroke={theme.colors.processing}
              name="Processing" 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="threads" 
              stroke={theme.colors.primary}
              name="Active Threads"
            />
            <Brush 
              dataKey="timestamp" 
              height={30} 
              stroke={theme.colors.primary}
              fill={theme.backgroundColor}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResponseTimeBreakdown;