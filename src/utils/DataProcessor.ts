// src/utils/DataProcessor.ts
import _ from 'lodash';
import type { 
  JMeterRecord, 
  PerformanceStats, 
  TimeSeriesData, 
  DistributionData,
  ErrorBreakdownData,
  ThreadMetricsData,
  BandwidthMetricsData
} from '../types';

export interface ProcessedData {
  stats: PerformanceStats;
  distributionData: DistributionData[];
  timeSeriesData: TimeSeriesData[];
  percentileData: { percentile: number; value: number }[];
  errorRateOverTime: { timestamp: string; errorRate: number }[];
  responseTimeOutliers: { timestamp: string; elapsed: number }[];
  errorBreakdown: ErrorBreakdownData[];
  threadMetrics: ThreadMetricsData[];
  bandwidthMetrics: BandwidthMetricsData[];
}

export const processJMeterData = (rawData: JMeterRecord[]): ProcessedData => {
  // Sort data chronologically once
  rawData = _.sortBy(rawData, 'timeStamp');
  
  // Calculate basic metrics
  const totalRequests = rawData.length;
  const successfulRequests = rawData.filter(r => r.success).length;
  const failedRequests = totalRequests - successfulRequests;
  
  // Calculate response time stats efficiently
  const sortedResponseTimes = _.sortBy(rawData, 'elapsed');
  const responseTimeValues = sortedResponseTimes.map(r => r.elapsed);
  
  // Calculate mean and standard deviation in one pass
  const { sum, sumSq } = responseTimeValues.reduce((acc, val) => ({
    sum: acc.sum + val,
    sumSq: acc.sumSq + val * val
  }), { sum: 0, sumSq: 0 });
  
  const mean = sum / totalRequests;
  const standardDeviation = Math.sqrt(sumSq / totalRequests - mean * mean);

  // Calculate throughput
  const testDurationSecs = (_.last(rawData)?.timeStamp ?? 0) - (rawData[0]?.timeStamp ?? 0);
  const requestsPerSecond = (totalRequests / (testDurationSecs / 1000));

  // Calculate percentile data
  const percentilePoints = [50, 75, 90, 95, 99, 99.9, 100];
  const percentileData = percentilePoints.map(percentile => ({
    percentile,
    value: responseTimeValues[Math.floor(responseTimeValues.length * (percentile / 100))]
  }));

  // Time series data with efficient sampling for large datasets
  const maxDataPoints = 300;
  const samplingRate = Math.max(1, Math.floor(rawData.length / maxDataPoints));
  
  const timeSeriesData: TimeSeriesData[] = rawData
    .filter((_, index) => index % samplingRate === 0)
    .map(row => ({
      timestamp: new Date(row.timeStamp).toISOString(),
      elapsed: row.elapsed,
      connect: row.Connect,
      latency: row.Latency - row.Connect,
      processing: row.elapsed - row.Latency,
      threads: row.allThreads
    }));

  // Calculate error rate over time with the same sampling rate
  const errorRateOverTime = _.chain(rawData)
    .groupBy(row => Math.floor(row.timeStamp / 1000) * 1000)
    .map((group, timestamp) => ({
      timestamp: new Date(parseInt(timestamp)).toISOString(),
      errorRate: (group.filter(r => !r.success).length / group.length) * 100
    }))
    .filter((_, index) => index % samplingRate === 0)
    .value();

  // Calculate outliers (responses > 2 standard deviations from mean)
  const outlierThreshold = mean + (2 * standardDeviation);
  const responseTimeOutliers = rawData
    .filter(row => row.elapsed > outlierThreshold)
    .map(row => ({
      timestamp: new Date(row.timeStamp).toISOString(),
      elapsed: row.elapsed
    }));

  // Distribution data with fixed buckets
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
    percentage: ((count / totalRequests) * 100).toFixed(1)
  }));

  // Error breakdown by response code
  const errorBreakdown = _.chain(rawData)
    .groupBy('responseCode')
    .map((group, code) => ({
      responseCode: parseInt(code),
      count: group.length,
      percentage: ((group.length / totalRequests) * 100).toFixed(1)
    }))
    .value();

  // Thread metrics over time with sampling
  const threadMetrics = _.chain(rawData)
    .groupBy(row => Math.floor(row.timeStamp / 1000) * 1000)
    .map((group, timestamp) => ({
      timestamp: new Date(parseInt(timestamp)).toISOString(),
      threadCount: _.meanBy(group, 'allThreads'),
      avgResponseTime: _.meanBy(group, 'elapsed')
    }))
    .filter((_, index) => index % samplingRate === 0)
    .value();

  // Bandwidth metrics over time with sampling
  const bandwidthMetrics = _.chain(rawData)
    .groupBy(row => Math.floor(row.timeStamp / 1000) * 1000)
    .map((group, timestamp) => ({
      timestamp: new Date(parseInt(timestamp)).toISOString(),
      bytesPerSecond: _.sumBy(group, 'bytes'),
      sentBytesPerSecond: _.sumBy(group, 'sentBytes')
    }))
    .filter((_, index) => index % samplingRate === 0)
    .value();

  // Calculate total data transferred
  const totalBytes = _.sumBy(rawData, 'bytes');
  const totalSentBytes = _.sumBy(rawData, 'sentBytes');
  const totalKB = (totalBytes + totalSentBytes) / 1024;

  // Complete stats object
  const stats: PerformanceStats = {
    totalRequests,
    successfulRequests,
    failedRequests,
    averageResponseTime: mean.toFixed(2),
    maxResponseTime: _.maxBy(rawData, 'elapsed')?.elapsed ?? 0,
    minResponseTime: _.minBy(rawData, 'elapsed')?.elapsed ?? 0,
    medianResponseTime: responseTimeValues[Math.floor(responseTimeValues.length / 2)],
    errorRate: ((failedRequests / totalRequests) * 100).toFixed(2),
    percentile90: percentileData.find(p => p.percentile === 90)?.value ?? 0,
    percentile95: percentileData.find(p => p.percentile === 95)?.value ?? 0,
    percentile99: percentileData.find(p => p.percentile === 99)?.value ?? 0,
    standardDeviation,
    requestsPerSecond,
    peakConcurrentUsers: _.maxBy(rawData, 'allThreads')?.allThreads ?? 0,
    avgConnectTime: _.meanBy(rawData, 'Connect').toFixed(2),
    avgLatency: _.meanBy(rawData, 'Latency').toFixed(2),
    totalDataTransferred: `${(totalKB / 1024).toFixed(2)} MB`,
    avgThroughput: requestsPerSecond.toFixed(2),
    avgThreads: _.meanBy(rawData, 'allThreads').toFixed(1),
    totalBandwidthMbps: ((totalBytes + totalSentBytes) / testDurationSecs / 125000).toFixed(2),
    avgBandwidthPerUser: `${((totalBytes + totalSentBytes) / totalRequests / 1024).toFixed(2)} KB`,
    testDuration: `${(testDurationSecs / 1000).toFixed(2)} seconds`,
    erroneousResponses: errorBreakdown.filter(e => e.responseCode >= 400).length,
    successfulResponseRate: `${((successfulRequests / totalRequests) * 100).toFixed(2)}%`
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