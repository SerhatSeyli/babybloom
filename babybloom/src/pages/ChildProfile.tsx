import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { format, differenceInMonths, differenceInDays, differenceInYears } from 'date-fns';
import { BsCalendarEvent, BsShare, BsClock, BsStars } from 'react-icons/bs';
import { FiPlusCircle, FiCamera, FiClipboard, FiImage } from 'react-icons/fi';
import { RiMedicineBottleLine, RiHeartPulseFill, RiCamera3Line } from 'react-icons/ri';
import { FaBaby, FaWeight, FaRuler } from 'react-icons/fa';

interface Child {
  id: string;
  name: string;
  dateOfBirth: Date;
  weight: string;
  height: string;
  profileImage?: string;
  nextAppointment?: {
    type: string;
    date: Date;
  }
}

const ChildProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'timeline' | 'development' | 'gallery'>('timeline');
  
  // Sample data for the child
  const [child, setChild] = useState<Child | null>(null);
  const [childAge, setChildAge] = useState({ months: 0, years: 0, days: 0 });

  // Mock data - would come from API in real app
  useEffect(() => {
    // Fetch child data from API
    // For now, using mock data
    if (id === '1') {
      setChild({
        id: '1',
        name: 'Emma',
        dateOfBirth: new Date('2023-05-14'),
        weight: '18 lbs',
        height: '28 inches',
        profileImage: 'https://images.unsplash.com/photo-1602973419993-30f7a2dc449a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        nextAppointment: {
          type: 'Vaccination',
          date: new Date('2024-03-25')
        }
      });
    } else if (id === '2') {
      setChild({
        id: '2',
        name: 'Noah',
        dateOfBirth: new Date('2022-03-10'),
        weight: '25 lbs',
        height: '34 inches',
        profileImage: 'https://images.unsplash.com/photo-1587926456670-219d762a831c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        nextAppointment: {
          type: 'Dental checkup',
          date: new Date('2024-04-02')
        }
      });
    }
  }, [id]);

  // Calculate age whenever child changes
  useEffect(() => {
    if (child) {
      const now = new Date();
      const months = differenceInMonths(now, child.dateOfBirth);
      const years = differenceInYears(now, child.dateOfBirth);
      const days = differenceInDays(now, child.dateOfBirth);
      setChildAge({ months, years, days });
    }
  }, [child]);

  const handleAddPhoto = () => {
    // Implement photo upload logic here
    alert('Photo upload feature would open here');
  };

  const handleAddEvent = () => {
    navigate('/add-event', { state: { childId: id } });
  };

  const handleShareProfile = () => {
    // Implement share functionality
    alert('Profile sharing feature would open here');
  };

  // Format child age in a friendly way
  const formatAge = () => {
    if (childAge.years > 0) {
      return `${childAge.years} ${childAge.years === 1 ? 'year' : 'years'}, ${childAge.months % 12} ${childAge.months % 12 === 1 ? 'month' : 'months'}`;
    } else {
      return `${childAge.months} ${childAge.months === 1 ? 'month' : 'months'}`;
    }
  };

  // Calculate days until next appointment
  const getDaysUntilAppointment = () => {
    if (!child?.nextAppointment) return null;
    
    const today = new Date();
    const appointmentDate = child.nextAppointment.date;
    const daysLeft = differenceInDays(appointmentDate, today);
    
    return daysLeft;
  };

  if (!child) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center baby-pattern-clouds">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-30 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-primary opacity-50 animate-pulse"></div>
          <div className="absolute inset-4 rounded-full border-t-4 border-primary animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg baby-pattern-clouds">
      <Navbar title={child.name} showBackButton={true} />
      
      <div className="p-5 max-w-3xl mx-auto pb-24">
        {/* Profile Header */}
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-soft overflow-hidden mb-6 animate-fade-in transform hover:shadow-elevated transition-all">
          <div className="relative h-56">
            {child.profileImage ? (
              <>
                <img 
                  src={child.profileImage} 
                  alt={child.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30"></div>
                <button 
                  onClick={handleAddPhoto}
                  className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 text-primary dark:text-primary-light rounded-full p-3 shadow-soft hover:shadow-elevated hover:-translate-y-1 active:translate-y-0 transition-all"
                >
                  <FiCamera className="text-xl" />
                </button>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-lavender-light to-babyblue-light dark:from-purple-900 dark:to-blue-800 flex flex-col items-center justify-center">
                <RiCamera3Line className="text-6xl text-white mb-3 opacity-70" />
                <button 
                  onClick={handleAddPhoto}
                  className="bg-white text-primary rounded-full px-4 py-2 font-medium flex items-center shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  <FiCamera className="mr-2" />
                  Add Photo
                </button>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-gray-800 dark:text-white">{child.name}</h1>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
                  <FaBaby className="text-primary dark:text-primary-light mr-2 text-lg" />
                  <span className="font-rounded">{formatAge()} old</span>
                </div>
              </div>
              <button 
                onClick={handleShareProfile}
                className="bg-gradient-blue text-white flex items-center text-sm px-4 py-2 rounded-full shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 active:translate-y-0"
              >
                <BsShare className="mr-1.5" /> Share Profile
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-pressed transform transition-all hover:scale-[1.02]">
                <div className="flex items-center mb-1.5">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-2 shadow-soft">
                    <BsClock className="text-white" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Birth Date</p>
                </div>
                <p className="font-medium text-gray-800 dark:text-white pl-10">
                  {format(child.dateOfBirth, 'MMM d, yyyy')}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-pressed transform transition-all hover:scale-[1.02]">
                <div className="flex items-center mb-1.5">
                  <div className="w-8 h-8 bg-gradient-purple rounded-full flex items-center justify-center mr-2 shadow-soft">
                    <BsCalendarEvent className="text-white" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Age in Days</p>
                </div>
                <p className="font-medium text-gray-800 dark:text-white pl-10">
                  {childAge.days} days
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-pressed transform transition-all hover:scale-[1.02]">
                <div className="flex items-center mb-1.5">
                  <div className="w-8 h-8 bg-gradient-green rounded-full flex items-center justify-center mr-2 shadow-soft">
                    <FaWeight className="text-white text-sm" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Weight</p>
                </div>
                <p className="font-medium text-gray-800 dark:text-white pl-10">{child.weight}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-pressed transform transition-all hover:scale-[1.02]">
                <div className="flex items-center mb-1.5">
                  <div className="w-8 h-8 bg-gradient-pink rounded-full flex items-center justify-center mr-2 shadow-soft">
                    <FaRuler className="text-white text-sm" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Height</p>
                </div>
                <p className="font-medium text-gray-800 dark:text-white pl-10">{child.height}</p>
              </div>
            </div>
            
            {child.nextAppointment && (
              <div className="bg-mintgreen-light dark:bg-green-900 rounded-xl p-4 mb-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-green rounded-full flex items-center justify-center mr-3 shadow-glow">
                      <RiMedicineBottleLine className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">Next Appointment</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{child.nextAppointment.type}</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-soft">
                    <p className="text-sm font-medium text-primary dark:text-primary-light">
                      {format(child.nextAppointment.date, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                {getDaysUntilAppointment() !== null && getDaysUntilAppointment() as number >= 0 && (
                  <div className="mt-3 flex justify-end">
                    <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-pressed">
                      {getDaysUntilAppointment() === 0 ? (
                        "Today!"
                      ) : (
                        `${getDaysUntilAppointment()} days left`
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleAddEvent} 
                className="bg-gradient-primary text-white py-3 px-4 rounded-xl flex items-center justify-center font-medium shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 active:translate-y-0"
              >
                <FiPlusCircle className="mr-2 text-lg" /> Add Event
              </button>
              <button 
                onClick={handleAddPhoto} 
                className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl flex items-center justify-center font-medium shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 active:translate-y-0 border border-gray-200 dark:border-gray-600"
              >
                <FiCamera className="mr-2 text-lg" /> Add Media
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-soft overflow-hidden mb-6 animate-fade-in">
          <div className="flex border-b border-gray-200 dark:border-gray-700 p-1">
            <button 
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'timeline' 
                ? 'text-white bg-gradient-primary shadow-soft' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </button>
            <button 
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'development' 
                ? 'text-white bg-gradient-purple shadow-soft' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab('development')}
            >
              Development
            </button>
            <button 
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'gallery' 
                ? 'text-white bg-gradient-green shadow-soft' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'timeline' && (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center shadow-soft">
                  <BsStars className="text-2xl text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white mb-2">Timeline Events</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">View and track all significant moments and milestones in your child's journey.</p>
                <Link 
                  to={`/child/${id}/timeline`} 
                  className="inline-flex items-center px-5 py-3 bg-gradient-primary text-white font-medium rounded-xl shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  <FiClipboard className="mr-2" />
                  View full timeline
                </Link>
              </div>
            )}
            
            {activeTab === 'development' && (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-4 gradient-purple rounded-full flex items-center justify-center shadow-soft">
                  <RiHeartPulseFill className="text-2xl text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white mb-2">Development Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">Monitor your child's developmental milestones and growth patterns.</p>
                <Link 
                  to={`/child/${id}/development`} 
                  className="inline-flex items-center px-5 py-3 bg-gradient-purple text-white font-medium rounded-xl shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  <FiClipboard className="mr-2" />
                  Track development
                </Link>
              </div>
            )}
            
            {activeTab === 'gallery' && (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-4 gradient-green rounded-full flex items-center justify-center shadow-soft">
                  <FiImage className="text-2xl text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white mb-2">Photo Gallery</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">Browse all the precious photos and videos of your child's special moments.</p>
                <Link 
                  to={`/child/${id}/gallery`} 
                  className="inline-flex items-center px-5 py-3 bg-gradient-green text-white font-medium rounded-xl shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  <FiImage className="mr-2" />
                  View gallery
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProfile;
