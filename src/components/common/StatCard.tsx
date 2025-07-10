import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle }) => {
  const { isDark } = useTheme();

  return (
    <div className={`rounded-lg shadow-sm p-6 border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      isDark 
        ? 'bg-gray-900/80 border-gray-700 backdrop-blur-sm' 
        : 'bg-white/80 border-gray-200 backdrop-blur-sm'
    }`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className={`text-sm font-medium transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-500'
            } truncate`}>
              {title}
            </dt>
            <dd className={`text-2xl font-bold transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </dd>
            {subtitle && (
              <dd className={`text-sm transition-colors ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {subtitle}
              </dd>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StatCard;