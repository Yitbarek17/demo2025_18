import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Project } from '../types';
import { deleteProject } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import ProjectTable from './projects/ProjectTable';
import ProjectFilters from './projects/ProjectFilters';
import ProjectModal from './projects/ProjectModal';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

type SortField = 'companyName' | 'employeesTotal' | 'approvalDate' | 'region' | 'sector';
type SortDirection = 'asc' | 'desc';

const ProjectList: React.FC<ProjectListProps> = ({ projects, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterSubSector, setFilterSubSector] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sortField, setSortField] = useState<SortField>('companyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const { isDark } = useTheme();

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = !filterSector || project.sector === filterSector;
      const matchesStatus = !filterStatus || project.projectStatus === filterStatus;
      const matchesRegion = !filterRegion || project.region === filterRegion;
      const matchesSubSector = !filterSubSector || project.subSector === filterSubSector;
      
      return matchesSearch && matchesSector && matchesStatus && matchesRegion && matchesSubSector;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'companyName':
          aValue = a.companyName.toLowerCase();
          bValue = b.companyName.toLowerCase();
          break;
        case 'employeesTotal':
          aValue = a.employeesTotal;
          bValue = b.employeesTotal;
          break;
        case 'approvalDate':
          aValue = new Date(a.approvalDate);
          bValue = new Date(b.approvalDate);
          break;
        case 'region':
          aValue = a.region.toLowerCase();
          bValue = b.region.toLowerCase();
          break;
        case 'sector':
          aValue = a.sector.toLowerCase();
          bValue = b.sector.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, searchTerm, filterSector, filterStatus, filterRegion, filterSubSector, sortField, sortDirection]);

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      onDelete(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSector('');
    setFilterStatus('');
    setFilterRegion('');
    setFilterSubSector('');
  };

  const sectors = [...new Set(projects.map(p => p.sector))];
  const statuses = [...new Set(projects.map(p => p.projectStatus))];
  const regions = [...new Set(projects.map(p => p.region))];
  const subSectors = [...new Set(projects.map(p => p.subSector))];

  return (
    <div className="space-y-6 animate-fadeIn min-h-[calc(100vh-200px)]">
      <div className={`p-8 rounded-lg shadow-sm border transition-colors ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <ProjectFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterSector={filterSector}
          setFilterSector={setFilterSector}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterRegion={filterRegion}
          setFilterRegion={setFilterRegion}
          filterSubSector={filterSubSector}
          setFilterSubSector={setFilterSubSector}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          sectors={sectors}
          statuses={statuses}
          regions={regions}
          subSectors={subSectors}
          filteredCount={filteredAndSortedProjects.length}
          totalCount={projects.length}
          onClearFilters={clearFilters}
        />

        <div className="mt-6">
          <ProjectTable
            projects={filteredAndSortedProjects}
            onEdit={onEdit}
            onDelete={handleDelete}
            onView={setSelectedProject}
          />
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectList;