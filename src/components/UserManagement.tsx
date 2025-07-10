import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Shield, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import InputField from './common/InputField';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!editingUser && !formData.password.trim()) newErrors.password = 'Password is required';
    else if (!editingUser && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.role) newErrors.role = 'Role is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Don't update password if empty
        }
        const updatedUser = await updateUser(editingUser.id, updateData);
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      } else {
        const newUser = await createUser(formData);
        setUsers([...users, newUser]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please try again.');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowForm(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user'
    });
    setEditingUser(null);
    setShowForm(false);
    setErrors({});
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Access Denied</h3>
        <p className="text-gray-600 dark:text-gray-400">You need administrator privileges to access user management.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-[calc(100vh-200px)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Users className={`h-8 w-8 ${isDark ? 'text-white' : 'text-black'}`} />
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            User Management
          </h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
            isDark 
              ? 'text-black bg-white hover:bg-gray-100' 
              : 'text-white bg-black hover:bg-gray-800'
          }`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className={`p-6 rounded-lg shadow-sm border transition-colors ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`transition-colors ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors ${
              isDark ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'
            }`}>
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900' : 'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        {user.role === 'admin' ? (
                          <Shield className={`h-5 w-5 ${user.role === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`} />
                        ) : (
                          <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user.username}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className={`p-1 rounded transition-colors hover:scale-110 ${
                          isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'
                        }`}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className={`p-1 rounded transition-colors hover:scale-110 ${
                          isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'
                        }`}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
          <div className={`relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md transition-colors ${
            isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-bold transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={resetForm}
                className={`transition-colors hover:scale-110 ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                isDark={isDark}
              />
              
              <InputField
                label="Email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                isDark={isDark}
              />
              
              <InputField
                label={editingUser ? "Password (leave empty to keep current)" : "Password"}
                name="password"
                type="password"
                required={!editingUser}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                isDark={isDark}
              />
              
              <InputField
                label="Role"
                name="role"
                required
                options={['admin', 'user']}
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
                isDark={isDark}
              />
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-all hover:scale-105 ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition-all hover:scale-105 ${
                    isDark 
                      ? 'text-black bg-white hover:bg-gray-100' 
                      : 'text-white bg-black hover:bg-gray-800'
                  }`}
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;