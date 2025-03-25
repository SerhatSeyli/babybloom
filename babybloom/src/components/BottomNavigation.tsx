import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BsCalendar2Heart, BsRobot, BsImages } from 'react-icons/bs';
import logoImage from '../assets/bloom-baby-logo-v4.svg';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/', 
      icon: <span className="inline-block"><img src={logoImage} alt="Home" className="w-6 h-6" /></span>, 
      label: 'Home',
      gradient: 'gradient-purple'
    },
    { 
      path: '/calendar', 
      icon: <span className="inline-block"><BsCalendar2Heart className="text-2xl mb-1" /></span>, 
      label: 'Calendar',
      gradient: 'gradient-green'
    },
    { 
      path: '/gallery', 
      icon: <span className="inline-block"><BsImages className="text-2xl mb-1" /></span>, 
      label: 'Gallery',
      gradient: 'gradient-blue'
    },
    { 
      path: '/ai-assistant', 
      icon: <span className="inline-block"><BsRobot className="text-2xl mb-1" /></span>, 
      label: 'AI Help',
      gradient: 'gradient-pink'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10 dark:bg-dark-card dark:border-gray-700 shadow-elevated">
      <div className="flex justify-around items-center h-16 max-w-screen-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path} 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'text-primary-dark dark:text-primary font-medium transform scale-110' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`
            }
            end={item.path === '/'}
          >
            <div 
              className={`transition-all duration-300 transform ${
                location.pathname === item.path 
                  ? 'animate-bounce-soft' 
                  : ''
              }`}
            >
              {location.pathname === item.path ? (
                <div className={`p-2 rounded-full ${item.gradient} animate-scale-in`}>
                  {item.icon}
                </div>
              ) : (
                <div className="p-2">
                  {item.icon}
                </div>
              )}
            </div>
            <span className={`text-sm transition-all duration-300 ${
              location.pathname === item.path 
                ? 'opacity-100 font-semibold' 
                : 'opacity-80'
            }`}>
              {item.label}
            </span>
            
            {location.pathname === item.path && (
              <div className="absolute bottom-0 w-10 h-1 bg-primary dark:bg-primary rounded-t-full animate-fade-in"></div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
