import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RegionalChartProps {
  data: Array<{
    name: string;
    projects: number;
    employees: number;
  }>;
}

const RegionalChart: React.FC<RegionalChartProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Regional Distribution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="projects" fill="#3B82F6" name="Projects" />
          <Bar yAxisId="right" dataKey="employees" fill="#10B981" name="Employees" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegionalChart;