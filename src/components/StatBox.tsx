import React from 'react';

interface StatBoxProps {
  title: string;
  value: string | number;
  caption?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ title, value, caption }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    {caption && <p className="mt-1 text-sm text-gray-500">{caption}</p>}
  </div>
);

export default StatBox;