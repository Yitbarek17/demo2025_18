import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Project } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onView: (project: Project) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onEdit, onDelete, onView }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Functional': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Terminated': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getClinicColor = (clinic: string) => {
    switch (clinic) {
      case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Unavailable': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm(t('projects.deleteConfirm'))) {
      onDelete(projectId);
    }
  };

  const canEdit = (project: Project) => {
    return isAdmin || project.createdBy === user?.id;
  };

  const canDelete = (project: Project) => {
    return isAdmin; // Only admins can delete
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className={`transition-colors ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {t('projects.noProjects')}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={`transition-colors ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t('projects.company')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t('common.sector')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t('projects.location')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t('common.status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Clinic
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t('common.employees')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t('common.date')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t('projects.actions')}
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y transition-colors ${
          isDark ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'
        }`}>
          {projects.map((project) => (
            <tr 
              key={project.id} 
              className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className={`text-sm font-medium transition-colors ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {project.companyName}
                    </div>
                    <div className={`text-sm transition-colors ${
                      isDark ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {project.owner}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm transition-colors ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {project.sector}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm transition-colors ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {project.region}
                </div>
                <div className={`text-sm transition-colors ${
                  isDark ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {project.zone}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.projectStatus)}`}>
                  {project.projectStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClinicColor(project.clinic)}`}>
                  {project.clinic}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm transition-colors ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {project.employeesTotal}
                </div>
                <div className={`text-xs transition-colors ${
                  isDark ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {project.employeesMale}M / {project.employeesFemale}F
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm transition-colors ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {format(new Date(project.approvalDate), 'MMM dd, yyyy')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onView(project)}
                    className={`p-1 rounded transition-colors hover:scale-110 ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'
                    }`}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {canEdit(project) && (
                    <button
                      onClick={() => onEdit(project)}
                      className={`p-1 rounded transition-colors hover:scale-110 ${
                        isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'
                      }`}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {canDelete(project) && (
                    <button
                      onClick={() => handleDelete(project.id)}
                      className={`p-1 rounded transition-colors hover:scale-110 ${
                        isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'
                      }`}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;