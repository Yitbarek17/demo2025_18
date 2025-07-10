import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { resetPassword } from '../services/api';

// Helper to decode base64 and parse email/token/tokenId
function parseResetData(encoded: string) {
  try {
    const decoded = atob(encoded);
    // Expecting format: email:token:tokenId
    const [email, resetToken, tokenId] = decoded.split(':');
    return { email, resetToken, tokenId };
  } catch {
    return { email: '', resetToken: '', tokenId: '' };
  }
}

const ResetPassword: React.FC<{ encoded: string; onBack?: () => void }> = ({ encoded, onBack }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(atob(encoded))

  const { email, resetToken, tokenId } = parseResetData(encoded);

  console.log(encoded)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password || !confirmPassword) {
      setError('Password is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, resetToken, password, tokenId });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !resetToken || !tokenId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-white rounded shadow text-red-600">Invalid or expired reset link.</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm border transition-all duration-300 bg-white/80 border-gray-200">
        {onBack && (
          <button onClick={onBack} className="absolute left-4 top-4 text-sm font-medium rounded-md px-3 py-1 bg-gray-200 text-black hover:bg-gray-300">Back</button>
        )}
        <h1 className="text-2xl font-bold mb-4 text-center">{t('auth.resetPasswordTitle') || 'Reset Password'}</h1>
        {success ? (
          <div className="p-4 rounded-lg text-center bg-green-100 text-green-800">Your password has been reset successfully. You may now log in with your new password.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.newPassword') || 'New Password'}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black"
                placeholder={t('auth.newPasswordPlaceholder') || 'Enter your new password'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.confirmPassword') || 'Confirm New Password'}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black"
                placeholder={t('auth.confirmPasswordPlaceholder') || 'Confirm your new password'}
                required
              />
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-medium bg-black text-white hover:bg-gray-800 focus:bg-gray-800 transition-all duration-200 transform hover:scale-105 focus:scale-105"
              disabled={loading}
            >
              {loading ? 'Resetting...' : t('auth.resetPassword') || 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 