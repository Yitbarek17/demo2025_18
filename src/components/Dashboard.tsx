import React from 'react';
import { Project, Metadata, DashboardStats as DashboardStatsType } from '../types';
import DashboardStats from './dashboard/DashboardStats';
import SectorChart from './dashboard/SectorChart';
import StatusChart from './dashboard/StatusChart';
import RegionalChart from './dashboard/RegionalChart';
import GenderDistribution from './dashboard/GenderDistribution';

interface DashboardProps {
  projects: Project[];
  metadata: Metadata | null;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, metadata }) => {
  const stats: DashboardStatsType = {
    totalProjects: projects.length,
    totalEmployees: projects.reduce((sum, p) => sum + p.employeesTotal, 0),
    maleEmployees: projects.reduce((sum, p) => sum + p.employeesMale, 0),
    femaleEmployees: projects.reduce((sum, p) => sum + p.employeesFemale, 0),
    completedProjects: projects.filter(p => p.projectStatus === 'Completed').length,
    inProgressProjects: projects.filter(p => p.projectStatus === 'In Progress').length,
  };

  const sectorData = metadata?.sectors.map(sector => ({
    name: sector,
    value: projects.filter(p => p.sector === sector).length,
    employees: projects.filter(p => p.sector === sector).reduce((sum, p) => sum + p.employeesTotal, 0)
  })) || [];

  const statusData = metadata?.projectStatuses.map(status => ({
    name: status,
    value: projects.filter(p => p.projectStatus === status).length
  })) || [];

  const regionData = metadata?.regions.slice(0, 8).map(region => ({
    name: region,
    projects: projects.filter(p => p.region === region).length,
    employees: projects.filter(p => p.region === region).reduce((sum, p) => sum + p.employeesTotal, 0)
  })) || [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorChart data={sectorData} colors={COLORS} />
        <StatusChart data={statusData} />
      </div>

      <RegionalChart data={regionData} />
      <GenderDistribution stats={stats} />
    </div>
  );
};

export default Dashboard;