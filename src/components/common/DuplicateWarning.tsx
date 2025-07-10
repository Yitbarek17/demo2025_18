import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface DuplicateWarningProps {
  duplicateWarning: string;
  isDuplicateBlocked: boolean;
  companyName: string;
  sector: string;
  region: string;
}

const DuplicateWarning: React.FC<DuplicateWarningProps> = ({
  duplicateWarning,
  isDuplicateBlocked,
  companyName,
  sector,
  region
}) => {
  const { isDark } = useTheme();

  if (companyName && sector && region && !duplicateWarning) {
    return (
      <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-green-800 dark:text-green-200">No Duplicates Found</h4>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            This project combination is unique and can be saved.
          </p>
        </div>
      </div>
    );
  }

  if (!duplicateWarning) return null;

  return (
    <div className={`mb-4 p-4 border rounded-lg flex items-start space-x-3 ${
      isDuplicateBlocked 
        ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
        : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700'
    }`}>
      <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
        isDuplicateBlocked 
          ? 'text-red-600 dark:text-red-400'
          : 'text-yellow-600 dark:text-yellow-400'
      }`} />
      <div>
        <h4 className={`font-medium ${
          isDuplicateBlocked 
            ? 'text-red-800 dark:text-red-200'
            : 'text-yellow-800 dark:text-yellow-200'
        }`}>
          {isDuplicateBlocked ? 'Duplicate Project Detected' : 'Potential Duplicate Detected'}
        </h4>
        <p className={`text-sm mt-1 ${
          isDuplicateBlocked 
            ? 'text-red-700 dark:text-red-300'
            : 'text-yellow-700 dark:text-yellow-300'
        }`}>
          {duplicateWarning}
        </p>
        {isDuplicateBlocked && (
          <p className="text-sm mt-2 text-red-700 dark:text-red-300 font-medium">
            Please modify the company name, sector, or region to proceed.
          </p>
        )}
      </div>
    </div>
  );
};

export default DuplicateWarning;