import React from 'react';
import { Building2, Users, TrendingUp, Activity } from 'lucide-react';
import StatCard from '../common/StatCard';
import { DashboardStats as StatsType } from '../../types';

interface DashboardStatsProps {
  stats: StatsType;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Projects"
        value={stats.totalProjects}
        icon={Building2}
        color="text-blue-600"
      />
      <StatCard
        title="Total Employees"
        value={stats.totalEmployees}
        icon={Users}
        color="text-green-600"
        subtitle={`${stats.maleEmployees} Male, ${stats.femaleEmployees} Female`}
      />
      <StatCard
        title="Completed Projects"
        value={stats.completedProjects}
        icon={TrendingUp}
        color="text-yellow-600"
      />
      <StatCard
        title="In Progress"
        value={stats.inProgressProjects}
        icon={Activity}
        color="text-purple-600"
      />
    </div>
  );
};

export default DashboardStats;