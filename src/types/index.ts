export interface Project {
  id: string;
  companyName: string;
  sector: string;
  region: string;
  zone: string;
  woreda: string;
  approvalDate: string;
  owner: string;
  advisorCompany: string;
  evaluator: string;
  grantedBy: string;
  contactPerson: string;
  ownerPhone: string;
  companyEmail: string;
  companyWebsite: string;
  projectStatus: string;
  clinic: string;
  employeesMale: number;
  employeesFemale: number;
  employeesTotal: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Metadata {
  regions: string[];
  sectors: string[];
  projectStatuses: string[];
  clinicOptions: string[];
}

export interface DashboardStats {
  totalProjects: number;
  totalEmployees: number;
  maleEmployees: number;
  femaleEmployees: number;
  completedProjects: number;
  inProgressProjects: number;
}