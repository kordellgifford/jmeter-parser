// src/components/DetailedStats.tsx
import React from 'react';
import { PerformanceStats } from '../types';

interface DetailedStatsProps {
  stats: PerformanceStats;
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ stats }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detailed Statistics</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Response Time (avg)</p>
        <p className="mt-1 text-gray-900 dark:text-white">{stats.averageResponseTime}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Standard Deviation</p>
        <p className="mt-1 text-gray-900 dark:text-white">{stats.standardDeviation.toFixed(2)}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">90th Percentile</p>
        <p className="mt-1 text-gray-900 dark:text-white">{stats.percentile90}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">95th Percentile</p>
        <p className="mt-1 text-gray-900 dark:text-white">{stats.percentile95}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">99th Percentile</p>
        <p className="mt-1 text-gray-900 dark:text-white">{stats.percentile99}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Response Time</p>
        <p className="mt-1 text-gray-900 dark:text-white">{stats.maxResponseTime}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Connect Time</p>
        <p className="mt-1 text-gray-900 dark:text-white">{stats.avgConnectTime}ms</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Latency</p>
        <p className="mt-1 text-gray-900 dark:text-white">{stats.avgLatency}ms</p>
      </div>
    </div>
  </div>
);

export default DetailedStats;