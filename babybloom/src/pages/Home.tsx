import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FiPlusCircle, FiBarChart2, FiDownload, FiActivity, FiFileText } from 'react-icons/fi';
import { BsCalendarEvent, BsStars } from 'react-icons/bs';
import { RiHeartPulseFill } from 'react-icons/ri';
import PDFExportModal from '../components/PDFExportModal';
import logoImage from '../assets/bloom-baby-logo-v4.svg';

// Sample data for the children
const sampleChildren = [
  {
    id: "1",
    name: 'Emma',
    age: '10 months old',
    recentMilestone: 'First steps',
    upcomingEvent: {
      type: 'Vaccination',
      date: '2024-03-25',
    },
    hasProfileImage: false,
    color: 'gradient-pink',
    emoji: '👶🏻',
  },
  {
    id: "2",
    name: 'Noah',
    age: '2 years old',
    recentMilestone: 'First full sentence',
    upcomingEvent: {
      type: 'Dental checkup',
      date: '2024-04-02',
    },
    hasProfileImage: false,
    color: 'gradient-blue',
    emoji: '👶🏽',
  }
];

interface Child {
  id: string;
  name: string;
  age: string;
  recentMilestone?: string;
  upcomingEvent?: {
    type: string;
    date: string;
  };
  hasProfileImage: boolean;
  color: string;
  emoji: string;
  profileImageUrl?: string;
  dateOfBirth?: string;
  isSample?: boolean;
}

const Home: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [activeChild, setActiveChild] = useState<string | null>(null);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [isActivityExpanded, setIsActivityExpanded] = useState(true);
  const [isArticleExpanded, setIsArticleExpanded] = useState(true);
  const navigate = useNavigate();
  
  // Load children from localStorage when the component mounts
  useEffect(() => {
    loadChildren();
  }, []);
  
  // Function to load children from localStorage and sample data
  const loadChildren = () => {
    const storedChildren = localStorage.getItem('babybloom-children');
    if (storedChildren) {
      const parsedChildren = JSON.parse(storedChildren);
      // Mark sample children as non-deletable
      const sampleWithFlag = sampleChildren.map(child => ({
        ...child,
        isSample: true // Adding a flag to identify sample children
      }));
      setChildren([...sampleWithFlag, ...parsedChildren]);
    } else {
      // Mark sample children as non-deletable
      const sampleWithFlag = sampleChildren.map(child => ({
        ...child,
        isSample: true // Adding a flag to identify sample children
      }));
      setChildren(sampleWithFlag);
    }
  };
  
  const handleChildClick = (childId: string) => {
    if (activeChild === childId) {
      setActiveChild(null);
    } else {
      setActiveChild(childId);
    }
  };
  
  const navigateToChildPage = (childId: string, page: string) => {
    navigate(`/child/${childId}/${page}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg baby-pattern-dots">
      <div className="p-5 max-w-xl mx-auto">
        {/* Enhanced modern header with new logo and design elements */}
        <div className="text-center py-8 relative animate-fade-in-down">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50 z-0">
            <div className="absolute -top-5 -left-10 w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/20 animate-float-slow"></div>
            <div className="absolute top-10 -right-5 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/20 animate-float"></div>
            <div className="absolute bottom-0 left-1/4 w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/20 animate-pulse"></div>
          </div>
          
          {/* Logo and title */}
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className="w-24 h-24 mb-3 animate-float shadow-glow">
              <img src={logoImage} alt="BabyBloom" className="w-full h-full" />
            </div>
            <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500 dark:from-primary-light dark:to-indigo-400 relative z-10">
              BabyBloom
            </h1>
            <div className="mt-4 relative">
              <p className="text-gray-600 dark:text-gray-300 font-rounded relative z-10 px-6 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full shadow-sm inline-block">
                <span className="text-pink-500 mr-1">✨</span> 
                Capture every precious moment of your little one's journey
                <span className="text-indigo-500 ml-1">✨</span>
              </p>
              <div className="absolute -bottom-1 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800/50 dark:to-pink-700/50 animate-pulse-slow z-0"></div>
              <div className="absolute -bottom-2 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 dark:from-indigo-800/50 dark:to-indigo-700/50 animate-pulse-slow z-0"></div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity & Parenting Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="rounded-2xl bg-white dark:bg-dark-card shadow-soft overflow-hidden transition-all duration-300" 
                 style={{ maxHeight: isActivityExpanded ? '500px' : '60px' }}>
              <div 
                className="p-5 flex justify-between items-center cursor-pointer"
                onClick={() => setIsActivityExpanded(!isActivityExpanded)}
              >
                <h2 className="font-display font-bold text-lg flex items-center text-gray-900 dark:text-white">
                  <span className="mr-2 text-purple-400"><BsStars /></span> Recent Activity
                </h2>
                <button 
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white shadow-md transition-all transform hover:scale-105 dark:from-purple-500 dark:to-purple-700 dark:hover:from-purple-400 dark:hover:to-purple-600"
                  aria-label={isActivityExpanded ? "Collapse" : "Expand"}
                >
                  {isActivityExpanded ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </button>
              </div>
              <div className={`px-5 pb-5 space-y-4 transition-all duration-300 ${isActivityExpanded ? 'opacity-100 visible' : 'opacity-0 invisible h-0 pb-0'}`}>
                <div className="bg-gray-50 dark:bg-dark-input border border-gray-100 dark:border-gray-700 rounded-xl p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                    <span><FiActivity className="text-2xl" /></span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Emma reached a milestone</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">First steps - 3 days ago</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-dark-input border border-gray-100 dark:border-gray-700 rounded-xl p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 mr-3">
                    <span><RiHeartPulseFill className="text-2xl" /></span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Noah had a checkup</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Pediatrician - 1 week ago</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-dark-input border border-gray-100 dark:border-gray-700 rounded-xl p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-500 mr-3">
                    <span><BsCalendarEvent className="text-2xl" /></span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Upcoming appointment</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Vaccination - Tomorrow at 10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add a Featured Article component instead of ParentingTips */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 shadow-soft overflow-hidden transition-all duration-300" 
                 style={{ maxHeight: isArticleExpanded ? '500px' : '60px' }}>
              <div 
                className="p-5 flex justify-between items-center cursor-pointer"
                onClick={() => setIsArticleExpanded(!isArticleExpanded)}
              >
                <h2 className="font-display font-bold text-lg flex items-center text-indigo-800 dark:text-indigo-300">
                  <span className="mr-2 text-indigo-500"><FiFileText /></span> Featured Article
                </h2>
                <button 
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 text-white shadow-md transition-all transform hover:scale-105 dark:from-indigo-500 dark:to-indigo-700 dark:hover:from-indigo-400 dark:hover:to-indigo-600"
                  aria-label={isArticleExpanded ? "Collapse" : "Expand"}
                >
                  {isArticleExpanded ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </button>
              </div>
              <div className={`px-5 pb-5 transition-all duration-300 ${isArticleExpanded ? 'opacity-100 visible' : 'opacity-0 invisible h-0 pb-0'}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Why Reading to Your Baby Matters</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">Reading to babies helps brain development, language skills, and creates a special bond between parent and child...</p>
                  <Link 
                    to="/parenting-tips" 
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-medium inline-flex items-center"
                  >
                    Read more on Parenting Tips
                  </Link>
                </div>
                <div className="mt-3 text-right">
                  <Link
                    to="/parenting-tips"
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-medium"
                  >
                    See all parenting tips and facts →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Your Children</h2>
            <Link 
              to="/add-child" 
              className="flex items-center text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-full shadow-soft hover:shadow-elevated transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              <FiPlusCircle className="mr-2" />
              <span className="font-medium">Add Child</span>
            </Link>
          </div>
        </div>

        {children.length > 0 ? (
          <div className="space-y-5">
            {children.map((child, index) => (
              <div key={child.id} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div 
                  onClick={() => handleChildClick(child.id)}
                  className={`bg-white dark:bg-dark-card rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-elevated transform hover:scale-[1.02] ${activeChild === child.id ? 'border-2 border-primary dark:border-primary' : 'border border-gray-100 dark:border-gray-700'}`}
                >
                  <div className={`h-2 ${child.color}`}></div>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className={`relative mr-4 w-20 h-20 ${child.color} rounded-full flex items-center justify-center text-white text-2xl shadow-soft`}>
                        {child.hasProfileImage && child.profileImageUrl ? (
                          <img 
                            src={child.profileImageUrl} 
                            alt={child.name} 
                            className="w-full h-full rounded-full object-cover transition-all hover:scale-105"
                          />
                        ) : (
                          <div className="animate-float">{child.emoji}</div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-gray-800 dark:text-white">{child.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{child.age}</p>
                        {child.recentMilestone && (
                          <div className="mt-1 inline-flex items-center text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-2 py-1 rounded-full">
                            <BsStars className="mr-1" /> {child.recentMilestone}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {activeChild === child.id && (
                      <div className="grid grid-cols-3 gap-3 mt-5 animate-fade-in-up">
                        <button 
                          onClick={() => navigateToChildPage(child.id, 'dashboard')}
                          className="flex flex-col items-center p-3 transition-all bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-xl hover:shadow-soft hover:-translate-y-1 active:translate-y-0"
                        >
                          <FiActivity className="text-2xl mb-1" />
                          <span className="text-xs font-medium">Dashboard</span>
                        </button>
                        <button 
                          onClick={() => navigateToChildPage(child.id, 'growth')}
                          className="flex flex-col items-center p-3 transition-all bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 rounded-xl hover:shadow-soft hover:-translate-y-1 active:translate-y-0"
                        >
                          <FiBarChart2 className="text-2xl mb-1" />
                          <span className="text-xs font-medium">Growth</span>
                        </button>
                        <button 
                          onClick={() => navigateToChildPage(child.id, 'timeline')}
                          className="flex flex-col items-center p-3 transition-all bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300 rounded-xl hover:shadow-soft hover:-translate-y-1 active:translate-y-0"
                        >
                          <BsCalendarEvent className="text-2xl mb-1" />
                          <span className="text-xs font-medium">Timeline</span>
                        </button>
                      </div>
                    )}
                    
                    {!activeChild && child.upcomingEvent && child.upcomingEvent.date && (
                      <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <RiHeartPulseFill className="text-primary mr-2" />
                        <span>
                          {child.upcomingEvent.type} on {format(new Date(child.upcomingEvent.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-dark-card rounded-2xl shadow-soft">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <FiPlusCircle className="text-3xl text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-display font-medium text-gray-700 dark:text-gray-300 mb-2">No children yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first child to get started with tracking their growth and development</p>
            <Link 
              to="/add-child" 
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-soft transition-all hover:shadow-glow hover:-translate-y-1 active:translate-y-0"
            >
              <FiPlusCircle className="mr-2" />
              <span>Add Child</span>
            </Link>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/calendar" className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <BsCalendarEvent className="text-blue-600 text-2xl" />
              </div>
              <span className="font-medium text-gray-800 dark:text-white">Calendar</span>
            </Link>
            <Link to="/ai-assistant" className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <BsStars className="text-purple-600 text-2xl" />
              </div>
              <span className="font-medium text-gray-800 dark:text-white">AI Help</span>
            </Link>
            <button 
              onClick={() => setIsPDFModalOpen(true)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center mr-3">
                <FiDownload className="text-emerald-700 text-3xl" />
              </div>
              <span className="font-medium text-gray-800 dark:text-white">Export Memories</span>
            </button>
            <Link to="/parenting-tips" className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <FiFileText className="text-yellow-600 text-2xl" />
              </div>
              <span className="font-medium text-gray-800 dark:text-white">Parenting Tips</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* PDF Export Modal */}
      <PDFExportModal 
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        childId={activeChild || (children.length > 0 ? children[0].id : "1")}
        childName={activeChild 
          ? children.find(c => c.id === activeChild)?.name || "Your Child" 
          : (children.length > 0 ? children[0].name : "Your Child")}
        childAge={activeChild 
          ? children.find(c => c.id === activeChild)?.age 
          : (children.length > 0 ? children[0].age : undefined)}
      />
    </div>
  );
};

export default Home;
