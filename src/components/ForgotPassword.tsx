import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { forgetPassword } from '../services/api';

const ForgotPassword: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError(t('auth.emailRequired') || 'Email is required');
      return;
    }
    try {
      await forgetPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to send reset link');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className={`relative w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm border transition-all duration-300 ${
        isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <button
          onClick={onBack}
          className={`absolute left-4 top-4 flex items-center text-sm font-medium rounded-md px-3 py-1 transition-colors ${
            isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> {t('auth.backToLogin') || 'Back to Login'}
        </button>
        <div className="text-center mb-8 mt-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          }`}>
            <Mail className="h-8 w-8" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 transition-colors ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            {t('auth.forgotPasswordTitle') || 'Forgot Password'}
          </h1>
          <p className={`transition-colors ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t('auth.forgotPasswordSubtitle') || 'Enter your email to reset your password.'}
          </p>
        </div>
        {submitted ? (
          <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}> 
            {t('auth.resetLinkSent') || 'If your email is registered, a reset link has been sent.'}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {t('auth.email') || 'Email'}
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                    isDark
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white'
                      : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black'
                  }`}
                  placeholder={t('auth.emailPlaceholder') || 'Enter your email'}
                  required
                />
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:scale-105 ${
                isDark
                  ? 'bg-white text-black hover:bg-gray-100 focus:bg-gray-100'
                  : 'bg-black text-white hover:bg-gray-800 focus:bg-gray-800'
              }`}
            >
              {t('auth.sendResetLink') || 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 