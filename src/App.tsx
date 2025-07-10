import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Building2, BarChart3, Users, FileText, Plus, Home, LogOut, Moon, Sun, Shield } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import Analytics from './components/Analytics';
import Homepage from './components/Homepage';
import LoginPage from './components/LoginPage';
import UserManagement from './components/UserManagement';
import Footer from './components/Footer';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { Project, Metadata } from './types';
import { fetchProjects, fetchMetadata } from './services/api';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Wrapper for ResetPassword to extract the encoded param from the URL
const ResetPasswordRoute: React.FC = () => {
  const { encoded } = useParams<{ encoded: string }>();
  return <ResetPassword encoded={encoded || ''} />;
};

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeApp = async () => {
      if (isAuthenticated) {
        await loadData();
      } else {
        setLoading(false);
      }
    };
    
    initializeApp();
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, metadataData] = await Promise.all([
        fetchProjects(),
        fetchMetadata()
      ]);
      setProjects(projectsData);
      setMetadata(metadataData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectAdded = (project: Project) => {
    setProjects([...projects, project]);
    setShowProjectForm(false);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setEditingProject(null);
    setShowProjectForm(false);
  };

  const handleProjectDeleted = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'login') {
      // This will be handled by showing the login page
    }
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot" element={<ForgotPassword onBack={() => navigate('/login')} />} />
        <Route path="/reset/:encoded" element={<ResetPasswordRoute />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  const navigation = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'dashboard', label: t('nav.dashboard'), icon: BarChart3 },
    { id: 'projects', label: t('nav.projects'), icon: Building2 },
    { id: 'analytics', label: t('nav.analytics'), icon: Users },
  ];

  // Add user management for admins
  if (isAdmin) {
    navigation.push({ id: 'users', label: 'Users', icon: Shield });
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-32 w-32 border-b-2 mx-auto transition-colors ${
            isDark ? 'border-white' : 'border-black'
          }`}></div>
          <p className={`mt-4 transition-colors ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t('common.loading')}
          </p>
        </div>
      </div>
    );
  }

  // Show homepage without header/navigation
  if (activeTab === 'home') {
    return (
      <div className="min-h-screen flex flex-col">
        <Homepage onNavigate={handleNavigate} />
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      <header className={`shadow-sm border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <FileText className={`h-8 w-8 transition-colors ${
                isDark ? 'text-white' : 'text-black'
              }`} />
              <h1 className={`text-xl font-bold transition-colors ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                {t('app.title')}
              </h1>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                      activeTab === item.id
                        ? isDark 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white'
                        : isDark 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                          : 'text-gray-500 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className={`flex rounded-lg p-1 transition-colors ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    language === 'en'
                      ? isDark 
                        ? 'bg-white text-black shadow-md' 
                        : 'bg-black text-white shadow-md'
                      : isDark 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-black'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('am')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    language === 'am'
                      ? isDark 
                        ? 'bg-white text-black shadow-md' 
                        : 'bg-black text-white shadow-md'
                      : isDark 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-black'
                  }`}
                >
                  አማ
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {/* Add Project Button */}
              {(activeTab === 'projects' || activeTab === 'dashboard') && (
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setShowProjectForm(true);
                  }}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                    isDark 
                      ? 'text-black bg-white hover:bg-gray-100' 
                      : 'text-white bg-black hover:bg-gray-800'
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('projects.addProject')}
                </button>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className={`text-sm font-medium transition-colors ${
                    isDark ? 'text-white' : 'text-black'
                  }`}>
                    {user?.username}
                  </span>
                  <div className={`text-xs transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {user?.role}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                    isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                  title={t('auth.logout')}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            <div className="flex space-x-2 overflow-x-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200 ${
                      activeTab === item.id
                        ? isDark 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white'
                        : isDark 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                          : 'text-gray-500 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        {activeTab === 'dashboard' && (
          <Dashboard projects={projects} metadata={metadata} />
        )}
        {activeTab === 'projects' && (
          <ProjectList
            projects={projects}
            onEdit={handleEditProject}
            onDelete={handleProjectDeleted}
          />
        )}
        {activeTab === 'analytics' && (
          <Analytics projects={projects} metadata={metadata} />
        )}
        {activeTab === 'users' && isAdmin && (
          <UserManagement />
        )}
      </main>

      <Footer />

      {showProjectForm && (
        <ProjectForm
          project={editingProject}
          metadata={metadata}
          onSubmit={editingProject ? handleProjectUpdated : handleProjectAdded}
          onCancel={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;