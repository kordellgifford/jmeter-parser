import React from 'react';
import { PerformanceStats } from '../types';

interface DetailedStatsProps {
  stats: PerformanceStats;
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ stats }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Detailed Statistics</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Response Time (avg)</p>
        <p className="mt-1">{stats.averageResponseTime}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Standard Deviation</p>
        <p className="mt-1">{stats.standardDeviation.toFixed(2)}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">90th Percentile</p>
        <p className="mt-1">{stats.percentile90}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">95th Percentile</p>
        <p className="mt-1">{stats.percentile95}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">99th Percentile</p>
        <p className="mt-1">{stats.percentile99}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Max Response Time</p>
        <p className="mt-1">{stats.maxResponseTime}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Avg Connect Time</p>
        <p className="mt-1">{stats.avgConnectTime}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Avg Latency</p>
        <p className="mt-1">{stats.avgLatency}ms</p>
      </div>
    </div>
  </div>
);

export default DetailedStats;