import _ from 'lodash';
import { JMeterRecord, PerformanceStats, TimeSeriesData, DistributionData } from '../types';

export interface ProcessedData {
  stats: PerformanceStats;
  distributionData: DistributionData[];
  timeSeriesData: TimeSeriesData[];
  percentileData: { percentile: number; value: number }[];
  errorRateOverTime: { timestamp: string; errorRate: number }[];
  responseTimeOutliers: { timestamp: string; elapsed: number }[];
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
  const totalKB = totalBytes / 1024;

  // Basic stats
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
    totalDataTransferred: totalKB.toFixed(2),
    avgThroughput: requestsPerSecond.toFixed(2),
    avgThreads: _.meanBy(rawData, 'allThreads').toFixed(1)
  };

  // Generate percentile distribution data
  const percentileData = [
    { percentile: 50, value: stats.medianResponseTime },
    { percentile: 90, value: stats.percentile90 },
    { percentile: 95, value: stats.percentile95 },
    { percentile: 99, value: stats.percentile99 },
    { percentile: 100, value: stats.maxResponseTime }
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

  // Distribution data
  const distributionData = Object.entries(_.countBy(rawData, row => {
    if (row.elapsed < 150) return '<150ms';
    if (row.elapsed < 200) return '150-200ms';
    if (row.elapsed < 250) return '200-250ms';
    return '>250ms';
  })).map(([range, count]) => ({
    range,
    count,
    percentage: ((count / rawData.length) * 100).toFixed(1)
  }));

  return {
    stats,
    timeSeriesData,
    distributionData,
    percentileData,
    errorRateOverTime,
    responseTimeOutliers
  };
};