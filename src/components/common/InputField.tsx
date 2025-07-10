import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  options?: string[] | null;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  isDark: boolean;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  name, 
  type = 'text', 
  required = false, 
  options = null,
  value,
  onChange,
  error,
  isDark,
  readOnly = false
}) => (
  <div>
    <label className={`block text-sm font-medium mb-1 transition-colors ${
      isDark ? 'text-gray-200' : 'text-gray-700'
    }`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-offset-2 ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : isDark 
              ? 'bg-gray-800 border-gray-600 text-white focus:border-white focus:ring-white' 
              : 'bg-white border-gray-300 text-black focus:border-black focus:ring-black'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-offset-2 ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : isDark 
              ? 'bg-gray-800 border-gray-600 text-white focus:border-white focus:ring-white' 
              : 'bg-white border-gray-300 text-black focus:border-black focus:ring-black'
        } ${readOnly ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
        min={type === 'number' ? '0' : undefined}
      />
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default InputField;