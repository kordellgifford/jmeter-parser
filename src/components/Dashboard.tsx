import React, { useState } from 'react';
import { JMeterRecord } from '../types';
import { processJMeterData, ProcessedData } from '../utils/DataProcessor';
import FileUpload from './FileUpload';
import StatBox from './StatBox';
import DetailedStats from './DetailedStats';
import ResponseTimeBreakdown from './charts/ResponseTimeBreakdown';
import PercentileChart from './charts/PercentileChart';
import ErrorRateChart from './charts/ErrorRateChart';
import OutliersChart from './charts/OutliersChart';
import DistributionChart from './charts/DistributionChart';

const PerformanceDashboard: React.FC = () => {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileLoad = (rawData: JMeterRecord[]) => {
    try {
      const processedData = processJMeterData(rawData);
      setData(processedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
        <FileUpload onFileLoad={handleFileLoad} onError={setError} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 space-y-6">
        <FileUpload onFileLoad={handleFileLoad} onError={setError} />
      </div>
    );
  }

  const { stats, timeSeriesData, percentileData, errorRateOverTime, responseTimeOutliers, distributionData } = data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Performance Test Dashboard</h1>
        <button
          onClick={() => setData(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Upload New File
        </button>
      </div>
      
      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox 
          title="Success Rate" 
          value={`${(100 - Number(stats.errorRate))}%`}
          caption={`${stats.successfulRequests} of ${stats.totalRequests} requests`}
        />
        <StatBox 
          title="Avg Response Time" 
          value={`${stats.averageResponseTime}ms`}
          caption={`±${stats.standardDeviation.toFixed(2)}ms std dev`}
        />
        <StatBox 
          title="95th Percentile" 
          value={`${stats.percentile95}ms`}
          caption="95% of requests were faster than this"
        />
        <StatBox 
          title="Throughput" 
          value={`${stats.avgThroughput}/sec`}
          caption={`Peak: ${stats.peakConcurrentUsers} concurrent users`}
        />
      </div>

      {/* Response Time Components */}
      <ResponseTimeBreakdown data={timeSeriesData} />

      {/* Response Time Percentiles and Error Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PercentileChart data={percentileData} />
        <ErrorRateChart data={errorRateOverTime} />
        <OutliersChart data={responseTimeOutliers} />
        <DistributionChart data={distributionData} />
      </div>

      {/* Detailed Stats */}
      <DetailedStats stats={stats} />
    </div>
  );
};

export default PerformanceDashboard;