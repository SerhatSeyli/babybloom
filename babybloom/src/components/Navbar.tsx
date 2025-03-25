import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import logoImage from '../assets/bloom-baby-logo-v4.svg';

interface NavbarProps {
  title?: string;
  showBackButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  showBackButton = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    // Trigger title animation when location changes
    // removed animation effect
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

  // Determine the title based on the current path if not provided
  const getTitle = () => {
    if (title) return title;

    const path = location.pathname;
    
    // Check if we're on a child-specific page to prevent duplicate titles
    if (path.includes('/child/')) {
      const pathSegments = path.split('/');
      
      // For child-specific pages, don't show a title in the navbar
      // This prevents duplicates with the personalized titles shown on the page
      if (pathSegments.includes('dashboard') || 
          pathSegments.includes('growth') || 
          pathSegments.includes('timeline')) {
        return '';
      }
      
      // For other child pages, show a generic title
      if (pathSegments.includes('profile')) return 'Child Profile';
      if (pathSegments.includes('gallery')) return 'Photo Gallery';
    }
    
    if (path === '/') return 'BabyBloom';
    if (path === '/calendar') return 'Calendar';
    if (path === '/ai-assistant') return 'AI Assistant';
    
    return 'BabyBloom';
  };

  return (
    <header className="bg-white border-b border-gray-100 dark:bg-dark-card dark:border-gray-700 sticky top-0 z-10 shadow-soft">
      <div className="flex items-center justify-between p-4 max-w-screen-lg mx-auto">
        <div className="flex items-center">
          {showBackButton ? (
            <button 
              onClick={goBack} 
              className="mr-3 text-gray-600 dark:text-lavender-dark hover:bg-primary-light dark:hover:bg-dark-input p-2 rounded-full transition-all transform hover:scale-105 active:scale-95"
              aria-label="Go back"
            >
              <BiArrowBack className="text-xl animate-slide-in-left" />
            </button>
          ) : (
            <div className="w-12 h-12 mr-3 flex items-center justify-center overflow-visible">
              <img src={logoImage} alt="BabyBloom Logo" className="w-full h-full" style={{ objectFit: 'contain' }} />
            </div>
          )}
          <h1 
            className={`text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-300 ${getTitle() === '' ? 'hidden' : ''}`}
          >
            {getTitle()}
          </h1>
        </div>
        
        {/* Theme toggle button */}
        <button 
          onClick={toggleTheme} 
          className="p-3 rounded-full bg-primary-light dark:bg-dark-input text-primary-dark dark:text-lavender-light hover:shadow-md transition-all transform hover:scale-105 active:scale-95"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' 
            ? <FiMoon className="text-xl" /> 
            : <FiSun className="text-xl text-yellow-300" />
          }
        </button>
      </div>
    </header>
  );
};

export default Navbar;
