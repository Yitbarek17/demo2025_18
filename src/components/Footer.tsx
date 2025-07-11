import React from 'react';
import { FileText, Mail, Phone, Shield, ScrollText, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <footer className={`border-t transition-colors mt-auto ${
      isDark 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className={`h-8 w-8 transition-colors ${
                isDark ? 'text-white' : 'text-black'
              }`} />
              <h3 className={`text-lg font-bold transition-colors ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                {t('app.title')}
              </h3>
            </div>
            <p className={`text-sm mb-4 max-w-md transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('app.subtitle')} - Comprehensive solution for managing and analyzing workplace data across Ethiopia.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 transition-colors ${
              isDark ? 'text-gray-200' : 'text-gray-900'
            }`}>
              About
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className={`text-sm transition-colors hover:underline ${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Our Mission
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`text-sm transition-colors hover:underline ${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Team
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`text-sm transition-colors hover:underline ${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Careers
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`text-sm transition-colors hover:underline ${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  News & Updates
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 transition-colors ${
              isDark ? 'text-gray-200' : 'text-gray-900'
            }`}>
              Legal & Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className={`flex items-center text-sm transition-colors hover:underline ${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`flex items-center text-sm transition-colors hover:underline ${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <ScrollText className="h-4 w-4 mr-2" />
                  Terms of Use
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@projectmanagement.com" 
                  className={`flex items-center text-sm transition-colors hover:underline ${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="tel:+251911234567" 
                  className={`flex items-center text-sm transition-colors hover:underline ${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  +251 991189834
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-8 pt-8 border-t transition-colors ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm transition-colors ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              © 2025 Workflow Repository System. All rights reserved.
            </p>
            <p className={`text-sm mt-2 md:mt-0 transition-colors ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Babi ❤️ from Ethiopia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
