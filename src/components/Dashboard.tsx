import React, { useState } from 'react';
import { JMeterRecord } from '../types';
import { processJMeterData, ProcessedData } from '../utils/DataProcessor';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Download, FileUp, AlertTriangle } from 'lucide-react';
import FileUpload from './FileUpload';
import StatBox from './StatBox';
import DetailedStats from './DetailedStats';
import ResponseTimeBreakdown from './charts/ResponseTimeBreakdown';
import PercentileChart from './charts/PercentileChart';
import ErrorRateChart from './charts/ErrorRateChart';
import OutliersChart from './charts/OutliersChart';
import DistributionChart from './charts/DistributionChart';
import ThemeToggle from './ThemeToggle';

const PerformanceDashboard: React.FC = () => {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleFileLoad = (rawData: JMeterRecord[]) => {
    try {
      const processedData = processJMeterData(rawData);
      setData(processedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const handleExport = () => {
    if (!data) return;
    const exportData = {
      summary: data.stats,
      detailed: {
        percentiles: data.percentileData,
        distribution: data.distributionData,
        outliers: data.responseTimeOutliers
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'performance-analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen transition-colors">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Processing File</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <FileUpload onFileLoad={handleFileLoad} onError={setError} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen transition-colors">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="w-5 h-5" />
              Upload Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload onFileLoad={handleFileLoad} onError={setError} />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { stats, timeSeriesData, percentileData, errorRateOverTime, responseTimeOutliers, distributionData } = data;

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Test Dashboard</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Analysis
          </button>
          <button
            onClick={() => setData(null)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FileUp className="w-4 h-4" />
            Upload New File
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="response-times">Response Times</TabsTrigger>
          <TabsTrigger value="errors">Errors & Outliers</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox 
              title="Success Rate" 
              value={`${(100 - Number(stats.errorRate)).toFixed(2)}%`}
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
          <ResponseTimeBreakdown data={timeSeriesData} />
        </TabsContent>

        <TabsContent value="response-times" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PercentileChart data={percentileData} />
            <DistributionChart data={distributionData} />
          </div>
          <DetailedStats stats={stats} />
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorRateChart data={errorRateOverTime} />
            <OutliersChart data={responseTimeOutliers} />
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Raw Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto max-h-96 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;