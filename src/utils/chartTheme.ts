// src/utils/chartTheme.ts
import { useTheme } from '../contexts/ThemeContext';

export const useChartTheme = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    backgroundColor: isDark ? '#1f2937' : '#ffffff', // gray-800 for dark mode
    textColor: isDark ? '#e5e7eb' : '#111827', // gray-200 for dark mode
    gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    tooltipStyle: {
      backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      border: isDark ? '1px solid rgba(75, 85, 99, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
      color: isDark ? '#e5e7eb' : '#111827',
    },
    colors: {
      primary: isDark ? '#60a5fa' : '#3b82f6', // blue-400 for dark mode
      success: isDark ? '#34d399' : '#10b981', // green-400 for dark mode
      error: isDark ? '#f87171' : '#ef4444',   // red-400 for dark mode
      connect: isDark ? '#fb7185' : '#f43f5e',  // rose-400 for dark mode
      latency: isDark ? '#60a5fa' : '#3b82f6',  // blue-400 for dark mode
      processing: isDark ? '#4ade80' : '#22c55e', // green-400 for dark mode
    }
  };
};