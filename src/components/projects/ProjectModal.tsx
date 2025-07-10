import React from 'react';
import { format } from 'date-fns';
import { Mail, Phone, Globe } from 'lucide-react';
import { Project } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
      <div className={`relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md transition-colors ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold transition-colors ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {t('projects.projectDetails')}
          </h3>
          <button
            onClick={onClose}
            className={`transition-colors hover:scale-110 ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className={`font-semibold transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Company Information
              </h4>
              <p className={`text-lg font-medium transition-colors ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                {project.companyName}
              </p>
              <p className={`transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {project.sector}
              </p>
            </div>
            
            <div>
              <h4 className={`font-semibold transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Location
              </h4>
              <p className={`transition-colors ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                {project.region}
              </p>
              <p className={`transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {project.zone}, {project.woreda}
              </p>
            </div>
            
            <div>
              <h4 className={`font-semibold transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Project Details
              </h4>
              <div className="space-y-2">
                <p>Status: <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.projectStatus)}`}>
                  {project.projectStatus}
                </span></p>
                <p>Clinic: <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getClinicColor(project.clinic)}`}>
                  {project.clinic}
                </span></p>
                <p className={`transition-colors ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Approval Date: {format(new Date(project.approvalDate), 'MMM dd, yyyy')}
                </p>
                <p className={`transition-colors ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Granted By: {project.grantedBy}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className={`font-semibold transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Contact Information
              </h4>
              <p className={`transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Owner: {project.owner}
              </p>
              <p className={`transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Contact: {project.contactPerson}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <a href={`tel:${project.ownerPhone}`} className={`flex items-center transition-colors hover:scale-105 ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                }`}>
                  <Phone className="h-4 w-4 mr-1" />
                  {project.ownerPhone}
                </a>
                <a href={`mailto:${project.companyEmail}`} className={`flex items-center transition-colors hover:scale-105 ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                }`}>
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </a>
                {project.companyWebsite && (
                  <a href={project.companyWebsite} target="_blank" rel="noopener noreferrer" className={`flex items-center transition-colors hover:scale-105 ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}>
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </a>
                )}
              </div>
            </div>
            
            <div>
              <h4 className={`font-semibold transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Team & Advisors
              </h4>
              <p className={`transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Advisor Company: {project.advisorCompany}
              </p>
              <p className={`transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Evaluator: {project.evaluator}
              </p>
            </div>
            
            <div>
              <h4 className={`font-semibold transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Employee Statistics
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className={`p-2 rounded transition-colors ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}>
                  <div className={`text-lg font-bold transition-colors ${
                    isDark ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    {project.employeesMale}
                  </div>
                  <div className={`text-xs transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Male
                  </div>
                </div>
                <div className={`p-2 rounded transition-colors ${
                  isDark ? 'bg-pink-900/30' : 'bg-pink-50'
                }`}>
                  <div className={`text-lg font-bold transition-colors ${
                    isDark ? 'text-pink-300' : 'text-pink-600'
                  }`}>
                    {project.employeesFemale}
                  </div>
                  <div className={`text-xs transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Female
                  </div>
                </div>
                <div className={`p-2 rounded transition-colors ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className={`text-lg font-bold transition-colors ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {project.employeesTotal}
                  </div>
                  <div className={`text-xs transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;