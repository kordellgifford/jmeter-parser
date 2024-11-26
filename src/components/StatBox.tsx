// src/components/StatBox.tsx
import React from 'react';

interface StatBoxProps {
  title: string;
  value: string | number;
  caption?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ title, value, caption }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
    {caption && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{caption}</p>}
  </div>
);

export default StatBox;