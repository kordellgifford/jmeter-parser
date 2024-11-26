import _ from 'lodash';
import { JMeterRecord, PerformanceStats, TimeSeriesData, DistributionData } from '../types';

export interface ProcessedData {
  stats: PerformanceStats;
  distributionData: DistributionData[];
  timeSeriesData: TimeSeriesData[];
  percentileData: { percentile: number; value: number }[];
  errorRateOverTime: { timestamp: string; errorRate: number }[];
  responseTimeOutliers: { timestamp: string; elapsed: number }[];
  errorBreakdown: { responseCode: number; count: number; percentage: string }[];
  threadMetrics: {
    timestamp: string;
    threadCount: number;
    avgResponseTime: number;
  }[];
  bandwidthMetrics: {
    timestamp: string;
    bytesPerSecond: number;
    sentBytesPerSecond: number;
  }[];
}

export const processJMeterData = (rawData: JMeterRecord[]): ProcessedData => {
  // Sort response times for percentile calculations
  const sortedResponseTimes = _.sortBy(rawData, 'elapsed');
  const responseTimeValues = sortedResponseTimes.map(r => r.elapsed);
  
  // Calculate statistics
  const mean = _.mean(responseTimeValues);
  const standardDeviation = Math.sqrt(
    _.mean(responseTimeValues.map(x => Math.pow(x - mean, 2)))
  );

  // Calculate throughput based on test duration
  const testDurationSecs = (_.last(rawData)?.timeStamp ?? 0) - (rawData[0]?.timeStamp ?? 0);
  const requestsPerSecond = (rawData.length / (testDurationSecs / 1000));

  // Total data transferred
  const totalBytes = _.sumBy(rawData, 'bytes');
  const totalSentBytes = _.sumBy(rawData, 'sentBytes');
  const totalKB = totalBytes / 1024;

  // Error breakdown by response code
  const errorBreakdown = _(rawData)
    .groupBy('responseCode')
    .map((group, code) => ({
      responseCode: parseInt(code),
      count: group.length,
      percentage: ((group.length / rawData.length) * 100).toFixed(1)
    }))
    .value();

  // Thread metrics over time
  const threadMetrics = _(rawData)
    .groupBy(row => Math.floor(row.timeStamp / 1000) * 1000)
    .map((group, timestamp) => ({
      timestamp: new Date(parseInt(timestamp)).toISOString(),
      threadCount: _.meanBy(group, 'allThreads'),
      avgResponseTime: _.meanBy(group, 'elapsed')
    }))
    .value();

  // Bandwidth metrics over time
  const bandwidthMetrics = _(rawData)
    .groupBy(row => Math.floor(row.timeStamp / 1000) * 1000)
    .map((group, timestamp) => ({
      timestamp: new Date(parseInt(timestamp)).toISOString(),
      bytesPerSecond: _.sumBy(group, 'bytes') / 1000,
      sentBytesPerSecond: _.sumBy(group, 'sentBytes') / 1000
    }))
    .value();

  // Calculate percentile distribution data
  const percentileData = [
    { percentile: 50, value: responseTimeValues[Math.floor(responseTimeValues.length * 0.5)] },
    { percentile: 75, value: responseTimeValues[Math.floor(responseTimeValues.length * 0.75)] },
    { percentile: 90, value: responseTimeValues[Math.floor(responseTimeValues.length * 0.9)] },
    { percentile: 95, value: responseTimeValues[Math.floor(responseTimeValues.length * 0.95)] },
    { percentile: 99, value: responseTimeValues[Math.floor(responseTimeValues.length * 0.99)] },
    { percentile: 99.9, value: responseTimeValues[Math.floor(responseTimeValues.length * 0.999)] },
    { percentile: 100, value: responseTimeValues[responseTimeValues.length - 1] }
  ];

  // Calculate outliers (responses > 2 standard deviations from mean)
  const outlierThreshold = mean + (2 * standardDeviation);
  const responseTimeOutliers = rawData
    .filter(row => row.elapsed > outlierThreshold)
    .map(row => ({
      timestamp: new Date(row.timeStamp).toISOString(),
      elapsed: row.elapsed
    }));

  // Calculate error rate over time in 1-second windows
  const errorRateOverTime = _(rawData)
    .groupBy(row => Math.floor(row.timeStamp / 1000) * 1000)
    .map((group, timestamp) => ({
      timestamp: new Date(parseInt(timestamp)).toISOString(),
      errorRate: (group.filter(r => !r.success).length / group.length) * 100
    }))
    .value();

  // Time series data with response components
  const timeSeriesData = rawData.map(row => ({
    timestamp: new Date(row.timeStamp).toISOString(),
    elapsed: row.elapsed,
    connect: row.Connect,
    latency: row.Latency - row.Connect,
    processing: row.elapsed - row.Latency,
    threads: row.allThreads
  }));

  // Distribution data with more granular buckets
  const distributionData = Object.entries(_.countBy(rawData, row => {
    if (row.elapsed < 100) return '<100ms';
    if (row.elapsed < 200) return '100-200ms';
    if (row.elapsed < 300) return '200-300ms';
    if (row.elapsed < 500) return '300-500ms';
    if (row.elapsed < 1000) return '500ms-1s';
    return '>1s';
  })).map(([range, count]) => ({
    range,
    count,
    percentage: ((count / rawData.length) * 100).toFixed(1)
  }));

  // Enhanced stats object with additional metrics
  const stats: PerformanceStats = {
    totalRequests: rawData.length,
    successfulRequests: rawData.filter(row => row.success).length,
    failedRequests: rawData.filter(row => !row.success).length,
    averageResponseTime: mean.toFixed(2),
    maxResponseTime: _.maxBy(rawData, 'elapsed')?.elapsed ?? 0,
    minResponseTime: _.minBy(rawData, 'elapsed')?.elapsed ?? 0,
    medianResponseTime: responseTimeValues[Math.floor(responseTimeValues.length / 2)],
    errorRate: ((rawData.filter(row => !row.success).length / rawData.length) * 100).toFixed(2),
    percentile90: responseTimeValues[Math.floor(responseTimeValues.length * 0.9)],
    percentile95: responseTimeValues[Math.floor(responseTimeValues.length * 0.95)],
    percentile99: responseTimeValues[Math.floor(responseTimeValues.length * 0.99)],
    standardDeviation,
    requestsPerSecond,
    peakConcurrentUsers: _.maxBy(rawData, 'allThreads')?.allThreads ?? 0,
    avgConnectTime: _.meanBy(rawData, 'Connect').toFixed(2),
    avgLatency: _.meanBy(rawData, 'Latency').toFixed(2),
    totalDataTransferred: (totalKB / 1024).toFixed(2) + ' MB',
    avgThroughput: requestsPerSecond.toFixed(2),
    avgThreads: _.meanBy(rawData, 'allThreads').toFixed(1),
    totalBandwidthMbps: ((totalBytes + totalSentBytes) / testDurationSecs / 125000).toFixed(2),
    avgBandwidthPerUser: ((totalBytes + totalSentBytes) / rawData.length / 1024).toFixed(2) + ' KB',
    testDuration: (testDurationSecs / 1000).toFixed(2) + ' seconds',
    erroneousResponses: errorBreakdown.filter(e => e.responseCode >= 400).length,
    successfulResponseRate: ((rawData.filter(r => r.responseCode < 400).length / rawData.length) * 100).toFixed(2) + '%'
  };

  return {
    stats,
    timeSeriesData,
    distributionData,
    percentileData,
    errorRateOverTime,
    responseTimeOutliers,
    errorBreakdown,
    threadMetrics,
    bandwidthMetrics
  };
};