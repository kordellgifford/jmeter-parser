# JMeter Performance Dashboard

A modern, interactive dashboard for visualizing and analyzing JMeter performance test results. Built with React, TypeScript, and Recharts.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Docker Setup](#docker-setup)
- [Usage](#usage)
  - [Uploading Test Results](#uploading-test-results)
  - [Understanding the Dashboard](#understanding-the-dashboard)
- [Chart Guides](#chart-guides)
  - [Response Time Breakdown](#response-time-breakdown)
  - [Percentile Distribution](#percentile-distribution)
  - [Error Rate Analysis](#error-rate-analysis)
  - [Response Time Distribution](#response-time-distribution)
  - [Outliers Analysis](#outliers-analysis)
- [Key Metrics Explained](#key-metrics-explained)
- [Dark Mode](#dark-mode)
- [Exporting Results](#exporting-results)

## Features

- 📊 Interactive visualizations of JMeter test results
- 📈 Comprehensive performance metrics and statistics
- 🔍 Detailed response time analysis with breakdown
- ⚠️ Error rate tracking and outlier detection
- 📱 Responsive design for desktop and mobile
- 🌓 Dark/Light mode support
- 💾 Export analysis results as JSON
- 📁 Drag-and-drop file upload
- 📉 Real-time data processing
- 🔄 Support for large datasets

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jmeter-performance-dashboard.git
cd jmeter-performance-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Docker Setup

1. Build the Docker image:
```bash
docker build -t performance-dashboard .
```

2. Run the container:
```bash
docker run -p 3000:80 performance-dashboard
```

The application will be available at `http://localhost:3000`.

## Usage

### Uploading Test Results

1. Export your JMeter test results as CSV with the following columns:
   - timeStamp
   - elapsed
   - label
   - responseCode
   - success
   - bytes
   - sentBytes
   - grpThreads
   - allThreads
   - Latency
   - IdleTime
   - Connect

2. Either drag and drop the CSV file onto the upload area or click to browse and select the file.

### Understanding the Dashboard

The dashboard is organized into four main tabs:

1. **Overview**
   - Quick summary of test results
   - Key performance indicators
   - Response time breakdown chart

2. **Response Times**
   - Detailed response time analysis
   - Percentile distribution
   - Response time patterns

3. **Errors & Outliers**
   - Error rate tracking
   - Response time anomalies
   - Error patterns

4. **Detailed Analysis**
   - Raw performance metrics
   - Comprehensive statistics
   - Additional insights

## Chart Guides

### Response Time Breakdown

The stacked area chart shows three components of response time:
- **Connect Time (Red)**: Time to establish connection
- **Latency (Blue)**: Time until first byte
- **Processing (Green)**: Server processing time
- **Active Threads (Line)**: Concurrent users

Use the brush tool at the bottom to zoom into specific time periods.

### Percentile Distribution

Shows response time distribution across percentiles:
- X-axis: Percentile (0-100)
- Y-axis: Response time (ms)
- Use this to understand performance under different load conditions

### Error Rate Analysis

Tracks error rate over time:
- X-axis: Time
- Y-axis: Error rate percentage
- Helps identify periods of instability

### Response Time Distribution

Histogram showing response time frequency:
- X-axis: Response time ranges
- Y-axis: Number of requests
- Helps understand response time patterns

### Outliers Analysis

Scatter plot of response time outliers:
- X-axis: Time
- Y-axis: Response time
- Shows requests > 2 standard deviations from mean

## Key Metrics Explained

- **Success Rate**: Percentage of successful requests
- **Avg Response Time**: Mean response time across all requests
- **95th Percentile**: Response time below which 95% of requests fall
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests
- **Standard Deviation**: Measure of response time variability
- **Peak Concurrent Users**: Maximum number of simultaneous users
- **Total Data Transferred**: Total bytes sent and received

## Dark Mode

Toggle between light and dark modes using the theme switch in the top-right corner. The dashboard automatically adapts all charts and metrics for optimal visibility in both modes.

## Exporting Results

1. Click the "Export Analysis" button in the top-right corner
2. The dashboard will generate a JSON file containing:
   - Summary statistics
   - Detailed metrics
   - Distribution data
   - Outlier information

The exported file can be used for further analysis or reporting.
