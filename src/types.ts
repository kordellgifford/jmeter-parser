// src/types.ts
export interface JMeterRecord {
    timeStamp: number;
    elapsed: number;
    label: string;
    responseCode: number;
    success: boolean;
    bytes: number;
    sentBytes: number;
    grpThreads: number;
    allThreads: number;
    URL: string;
    Latency: number;
    IdleTime: number;
    Connect: number;
  }
  
  export interface TimeSeriesData {
    timestamp: string;
    elapsed: number;
    connect: number;
    latency: number;
    processing: number;
    threads: number;
  }
  
  export interface DistributionData {
    range: string;
    count: number;
    percentage: string;
  }
  
  export interface PerformanceStats extends Record<string, number | string> {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: string;
    maxResponseTime: number;
    minResponseTime: number;
    errorRate: string;
    percentile90: number;
    percentile95: number;
    percentile99: number;
    standardDeviation: number;
    requestsPerSecond: number;
    peakConcurrentUsers: number;
    medianResponseTime: number;
    avgConnectTime: string;
    avgLatency: string;
    totalDataTransferred: string;
    avgThroughput: string;
    avgThreads: string;
    totalBandwidthMbps: string;
    avgBandwidthPerUser: string;
    testDuration: string;
    erroneousResponses: number;
    successfulResponseRate: string;
  }
  
  export interface ErrorBreakdownData {
    responseCode: number;
    count: number;
    percentage: string;
  }
  
  export interface ThreadMetricsData {
    timestamp: string;
    threadCount: number;
    avgResponseTime: number;
  }
  
  export interface BandwidthMetricsData {
    timestamp: string;
    bytesPerSecond: number;
    sentBytesPerSecond: number;
  }