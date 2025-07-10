import React from 'react';
import { DashboardStats } from '../../types';

interface GenderDistributionProps {
  stats: DashboardStats;
}

const GenderDistribution: React.FC<GenderDistributionProps> = ({ stats }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Gender Distribution</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.maleEmployees}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Male Employees</div>
          <div className="text-xs text-gray-400">
            {((stats.maleEmployees / stats.totalEmployees) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-600">{stats.femaleEmployees}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Female Employees</div>
          <div className="text-xs text-gray-400">
            {((stats.femaleEmployees / stats.totalEmployees) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Employees</div>
          <div className="text-xs text-gray-400">100%</div>
        </div>
      </div>
    </div>
  );
};

export default GenderDistribution;