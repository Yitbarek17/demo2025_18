import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Project, Metadata } from '../types';
import { createProject, updateProject, fetchProjects } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import InputField from './common/InputField';
import DuplicateWarning from './common/DuplicateWarning';

interface ProjectFormProps {
  project?: Project | null;
  metadata: Metadata | null;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, metadata, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    region: '',
    zone: '',
    woreda: '',
    approvalDate: '',
    owner: '',
    advisorCompany: '',
    evaluator: '',
    grantedBy: '',
    contactPerson: '',
    ownerPhone: '',
    companyEmail: '',
    companyWebsite: '',
    projectStatus: '',
    clinic: '',
    employeesMale: 0,
    employeesFemale: 0,
    employeesTotal: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateWarning, setDuplicateWarning] = useState<string>('');
  const [existingProjects, setExistingProjects] = useState<Project[]>([]);
  const [isDuplicateBlocked, setIsDuplicateBlocked] = useState(false);

  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    // Load existing projects for duplicate checking
    const loadExistingProjects = async () => {
      try {
        const projects = await fetchProjects();
        setExistingProjects(projects);
      } catch (error) {
        console.error('Error loading projects for duplicate check:', error);
      }
    };
    loadExistingProjects();
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        companyName: project.companyName,
        sector: project.sector,
        region: project.region,
        zone: project.zone,
        woreda: project.woreda,
        approvalDate: project.approvalDate,
        owner: project.owner,
        advisorCompany: project.advisorCompany,
        evaluator: project.evaluator,
        grantedBy: project.grantedBy,
        contactPerson: project.contactPerson,
        ownerPhone: project.ownerPhone,
        companyEmail: project.companyEmail,
        companyWebsite: project.companyWebsite,
        projectStatus: project.projectStatus,
        clinic: project.clinic,
        employeesMale: project.employeesMale,
        employeesFemale: project.employeesFemale,
        employeesTotal: project.employeesTotal,
      });
    }
  }, [project]);

  // Check for duplicates when key fields change
  useEffect(() => {
    if (formData.companyName && formData.sector && formData.region) {
      const duplicateProject = existingProjects.find(p => 
        p.companyName.toLowerCase() === formData.companyName.toLowerCase() &&
        p.sector === formData.sector &&
        p.region === formData.region &&
        (!project || p.id !== project.id) // Exclude current project when editing
      );
      
      if (duplicateProject) {
        setDuplicateWarning(
          `A project with the company name "${formData.companyName}" already exists in the ${formData.sector} sector in ${formData.region} region. Please verify this is not a duplicate entry.`
        );
        setIsDuplicateBlocked(true);
      } else {
        setDuplicateWarning('');
        setIsDuplicateBlocked(false);
      }
    } else {
      setDuplicateWarning('');
      setIsDuplicateBlocked(false);
    }
  }, [formData.companyName, formData.sector, formData.region, existingProjects, project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: name.includes('employees') ? Number(value) : value };
      
      // Auto-calculate total employees
      if (name === 'employeesMale' || name === 'employeesFemale') {
        const male = name === 'employeesMale' ? Number(value) : prev.employeesMale;
        const female = name === 'employeesFemale' ? Number(value) : prev.employeesFemale;
        newData.employeesTotal = male + female;
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = t('form.required');
    if (!formData.sector) newErrors.sector = t('form.required');
    if (!formData.region) newErrors.region = t('form.required');
    if (!formData.zone.trim()) newErrors.zone = t('form.required');
    if (!formData.woreda.trim()) newErrors.woreda = t('form.required');
    if (!formData.approvalDate) newErrors.approvalDate = t('form.required');
    if (!formData.owner.trim()) newErrors.owner = t('form.required');
    if (!formData.projectStatus) newErrors.projectStatus = t('form.required');
    if (!formData.clinic) newErrors.clinic = t('form.required');
    if (!formData.contactPerson.trim()) newErrors.contactPerson = t('form.required');
    if (!formData.ownerPhone.trim()) newErrors.ownerPhone = t('form.required');
    if (!formData.companyEmail.trim()) newErrors.companyEmail = t('form.required');
    else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) newErrors.companyEmail = 'Invalid email format';
    
    // Check for duplicates
    if (isDuplicateBlocked) {
      newErrors.duplicate = 'Cannot create duplicate project. Please modify the company name, sector, or region.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Prepare the data for submission
      const submitData = {
        ...formData,
        createdBy: user?.id || 'unknown'
      };
      
      let result;
      
      if (project) {
        result = await updateProject(project.id, submitData);
      } else {
        result = await createProject(submitData);
      }
      
      onSubmit(result);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
      <div className={`relative top-4 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md transition-colors ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold transition-colors ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {project ? t('projects.editProject') : t('projects.addProject')}
          </h3>
          <button
            onClick={onCancel}
            className={`transition-colors hover:scale-110 ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <DuplicateWarning
          duplicateWarning={duplicateWarning}
          isDuplicateBlocked={isDuplicateBlocked}
          companyName={formData.companyName}
          sector={formData.sector}
          region={formData.region}
        />

        {/* General error for duplicates */}
        {errors.duplicate && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{errors.duplicate}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label={t('form.companyName')} 
              name="companyName" 
              required 
              value={formData.companyName}
              onChange={handleChange}
              error={errors.companyName}
              isDark={isDark}
            />
            <InputField 
              label={t('form.owner')} 
              name="owner" 
              required 
              value={formData.owner}
              onChange={handleChange}
              error={errors.owner}
              isDark={isDark}
            />
            <InputField 
              label={t('form.sector')} 
              name="sector" 
              required 
              options={metadata?.sectors}
              value={formData.sector}
              onChange={handleChange}
              error={errors.sector}
              isDark={isDark}
            />
            <InputField 
              label="Clinic Availability" 
              name="clinic" 
              required 
              options={metadata?.clinicOptions}
              value={formData.clinic}
              onChange={handleChange}
              error={errors.clinic}
              isDark={isDark}
            />
            <InputField 
              label={t('form.region')} 
              name="region" 
              required 
              options={metadata?.regions}
              value={formData.region}
              onChange={handleChange}
              error={errors.region}
              isDark={isDark}
            />
            <InputField 
              label={t('form.zone')} 
              name="zone" 
              required 
              value={formData.zone}
              onChange={handleChange}
              error={errors.zone}
              isDark={isDark}
            />
            <InputField 
              label={t('form.woreda')} 
              name="woreda" 
              required 
              value={formData.woreda}
              onChange={handleChange}
              error={errors.woreda}
              isDark={isDark}
            />
            <InputField 
              label={t('form.approvalDate')} 
              name="approvalDate" 
              type="date" 
              required 
              value={formData.approvalDate}
              onChange={handleChange}
              error={errors.approvalDate}
              isDark={isDark}
            />
            <InputField 
              label={t('form.projectStatus')} 
              name="projectStatus" 
              required 
              options={metadata?.projectStatuses}
              value={formData.projectStatus}
              onChange={handleChange}
              error={errors.projectStatus}
              isDark={isDark}
            />
            <InputField 
              label={t('form.contactPerson')} 
              name="contactPerson" 
              required 
              value={formData.contactPerson}
              onChange={handleChange}
              error={errors.contactPerson}
              isDark={isDark}
            />
            <InputField 
              label={t('form.ownerPhone')} 
              name="ownerPhone" 
              type="tel" 
              required 
              value={formData.ownerPhone}
              onChange={handleChange}
              error={errors.ownerPhone}
              isDark={isDark}
            />
            <InputField 
              label={t('form.companyEmail')} 
              name="companyEmail" 
              type="email" 
              required 
              value={formData.companyEmail}
              onChange={handleChange}
              error={errors.companyEmail}
              isDark={isDark}
            />
            <InputField 
              label={t('form.companyWebsite')} 
              name="companyWebsite" 
              type="url" 
              value={formData.companyWebsite}
              onChange={handleChange}
              error={errors.companyWebsite}
              isDark={isDark}
            />
            <InputField 
              label={t('form.advisorCompany')} 
              name="advisorCompany" 
              value={formData.advisorCompany}
              onChange={handleChange}
              error={errors.advisorCompany}
              isDark={isDark}
            />
            <InputField 
              label={t('form.evaluator')} 
              name="evaluator" 
              value={formData.evaluator}
              onChange={handleChange}
              error={errors.evaluator}
              isDark={isDark}
            />
            <InputField 
              label={t('form.grantedBy')} 
              name="grantedBy" 
              value={formData.grantedBy}
              onChange={handleChange}
              error={errors.grantedBy}
              isDark={isDark}
            />
          </div>
          
          <div className={`border-t pt-6 transition-colors ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h4 className={`text-lg font-medium mb-4 transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {t('form.employeeInfo')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField 
                label={t('form.employeesMale')} 
                name="employeesMale" 
                type="number" 
                value={formData.employeesMale}
                onChange={handleChange}
                error={errors.employeesMale}
                isDark={isDark}
              />
              <InputField 
                label={t('form.employeesFemale')} 
                name="employeesFemale" 
                type="number" 
                value={formData.employeesFemale}
                onChange={handleChange}
                error={errors.employeesFemale}
                isDark={isDark}
              />
              <InputField 
                label={t('form.employeesTotal')} 
                name="employeesTotal" 
                type="number" 
                value={formData.employeesTotal}
                onChange={handleChange}
                error={errors.employeesTotal}
                isDark={isDark}
                readOnly={true}
              />
            </div>
          </div>
          
          <div className={`flex justify-end space-x-3 pt-6 border-t transition-colors ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              type="button"
              onClick={onCancel}
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-all hover:scale-105 ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black'
              }`}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || isDuplicateBlocked}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isDark 
                  ? 'text-black bg-white hover:bg-gray-100' 
                  : 'text-white bg-black hover:bg-gray-800'
              }`}
            >
              {loading ? t('form.saving') : project ? t('form.updateProject') : t('form.createProject')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;