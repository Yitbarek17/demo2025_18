import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProjectFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterSector: string;
  setFilterSector: (sector: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterRegion: string;
  setFilterRegion: (region: string) => void;
  filterSubSector: string;
  setFilterSubSector: (subSector: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  sectors: string[];
  statuses: string[];
  regions: string[];
  subSectors: string[];
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterSector,
  setFilterSector,
  filterStatus,
  setFilterStatus,
  filterRegion,
  setFilterRegion,
  filterSubSector,
  setFilterSubSector,
  showFilters,
  setShowFilters,
  sectors,
  statuses,
  regions,
  subSectors,
  filteredCount,
  totalCount,
  onClearFilters
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder={t('common.search') + '...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full border rounded-md transition-colors focus:ring-2 focus:ring-offset-2 ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white' 
                : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black'
            }`}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border rounded-md transition-all hover:scale-105 ${
              showFilters
                ? isDark 
                  ? 'bg-white text-black border-white' 
                  : 'bg-black text-white border-black'
                : isDark 
                  ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                  : 'bg-white text-black border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            {t('common.filter')}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className={`p-4 rounded-lg border transition-colors animate-slideDown ${
          isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className={`px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-offset-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-white focus:ring-white' 
                  : 'bg-white border-gray-300 text-black focus:border-black focus:ring-black'
              }`}
            >
              <option value="">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>

            <select
              value={filterSubSector}
              onChange={(e) => setFilterSubSector(e.target.value)}
              className={`px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-offset-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-white focus:ring-white' 
                  : 'bg-white border-gray-300 text-black focus:border-black focus:ring-black'
              }`}
            >
              <option value="">All Sub-Sectors</option>
              {subSectors.map(subSector => (
                <option key={subSector} value={subSector}>{subSector}</option>
              ))}
            </select>

            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className={`px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-offset-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-white focus:ring-white' 
                  : 'bg-white border-gray-300 text-black focus:border-black focus:ring-black'
              }`}
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-offset-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-white focus:ring-white' 
                  : 'bg-white border-gray-300 text-black focus:border-black focus:ring-black'
              }`}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-between items-center">
            <span className={`text-sm transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Showing {filteredCount} of {totalCount} projects
            </span>
            <button
              onClick={onClearFilters}
              className={`text-sm px-3 py-1 rounded transition-colors hover:scale-105 ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
              }`}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;