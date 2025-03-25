import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FiImage, 
  FiActivity, 
  FiTrendingUp,
  FiShare2,
  FiTrash2
} from 'react-icons/fi';

interface ChildData {
  id: string;
  name: string;
  dob?: Date;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  imageUrl?: string;
  profileImageUrl?: string;
}

interface RecentEvent {
  id: string;
  type: 'milestone' | 'appointment' | 'vaccine' | 'health' | 'other';
  title: string;
  date: Date;
  hasMedia?: boolean;
}

interface GrowthData {
  date: Date;
  weight: number;
  height: number;
  headCircumference?: number;
}

const ChildDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [childData, setChildData] = useState<ChildData | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [recentMedia, setRecentMedia] = useState<{ id: string; url: string; type: 'image' | 'video'; caption: string; date: Date }[]>([]);
  const [latestGrowth, setLatestGrowth] = useState<GrowthData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Calculate age from DOB
  const calculateAge = (date: Date | string): string => {
    if (!date) return "Unknown age";
    
    const today = new Date();
    const birthDate = new Date(date);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // Get the last day of the previous month
      const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += lastDayOfPrevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      if (months > 0) {
        return `${months} ${months === 1 ? 'month' : 'months'}, ${days} ${days === 1 ? 'day' : 'days'}`;
      } else {
        return `${days} ${days === 1 ? 'day' : 'days'}`;
      }
    }
  };

  // Load data - first check localStorage, then fall back to mock data
  useEffect(() => {
    // Check localStorage for child data
    const storedChildren = localStorage.getItem('babybloom-children');
    let foundChild: ChildData | null = null;
    
    if (storedChildren) {
      const parsedChildren = JSON.parse(storedChildren);
      foundChild = parsedChildren.find((child: ChildData) => child.id === id);
    }
    
    // If found in localStorage, use that data
    if (foundChild) {
      setChildData({
        ...foundChild,
        imageUrl: foundChild.profileImageUrl
      });
    } 
    // Otherwise, fall back to mock data
    else {
      let mockChildData: ChildData | null = null;
      
      if (id === '1') {
        mockChildData = {
          id: '1',
          name: 'Emma',
          dob: new Date('2023-06-15'),
          gender: 'female',
          imageUrl: 'https://via.placeholder.com/150/FF8080/FFFFFF?text=Emma'
        };
      } else if (id === '2') {
        mockChildData = {
          id: '2',
          name: 'Noah',
          dob: new Date('2023-09-10'),
          gender: 'male',
          imageUrl: 'https://via.placeholder.com/150/80B0FF/FFFFFF?text=Noah'
        };
      }
      
      setChildData(mockChildData);
    }

    // Recent events
    const mockEvents: RecentEvent[] = [
      {
        id: '1',
        type: 'milestone',
        title: 'First Steps',
        date: new Date('2024-03-14'),
        hasMedia: true
      },
      {
        id: '2',
        type: 'appointment',
        title: '9-Month Checkup',
        date: new Date('2024-02-19')
      },
      {
        id: '3',
        type: 'vaccine',
        title: 'Flu Vaccine',
        date: new Date('2024-01-09')
      }
    ];
    
    setRecentEvents(mockEvents);

    // Recent media
    const mockMedia = [
      {
        id: '1',
        url: 'https://via.placeholder.com/300x200/FF5733/FFFFFF?text=First+Steps',
        type: 'image' as const,
        caption: 'First Steps',
        date: new Date('2024-03-14')
      },
      {
        id: '2',
        url: 'https://via.placeholder.com/300x200/33A8FF/FFFFFF?text=Bath+Time',
        type: 'image' as const,
        caption: 'Bath Time',
        date: new Date('2024-03-01')
      },
      {
        id: '3',
        url: 'https://via.placeholder.com/300x200/33FF57/FFFFFF?text=Playing',
        type: 'video' as const,
        caption: 'Playing with Toys',
        date: new Date('2024-02-20')
      }
    ];
    
    setRecentMedia(mockMedia);

    // Growth data
    if (id === '1') {
      setLatestGrowth({
        date: new Date('2024-03-15'),
        weight: 9.1,
        height: 72,
        headCircumference: 44.5
      });
    } else if (id === '2') {
      setLatestGrowth({
        date: new Date('2024-03-10'),
        weight: 8.0,
        height: 68,
        headCircumference: 43
      });
    }
  }, [id]);

  // Get days ago text
  const getDaysAgo = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  // Delete child profile function
  const handleDeleteProfile = () => {
    if (!childData || !id) return;

    // Don't delete sample children (with ids 1 or 2)
    if (id === '1' || id === '2') {
      alert("Sample profiles cannot be deleted");
      return;
    }

    // Get existing children from localStorage
    const storedChildren = localStorage.getItem('babybloom-children');
    if (storedChildren) {
      const parsedChildren = JSON.parse(storedChildren);
      // Filter out the child to be deleted
      const updatedChildren = parsedChildren.filter((child: ChildData) => child.id !== id);
      // Save back to localStorage
      localStorage.setItem('babybloom-children', JSON.stringify(updatedChildren));
    }

    // Close modal and navigate back to home
    setShowDeleteModal(false);
    navigate('/');
  };

  // Show confirmation modal
  const openDeleteModal = () => {
    if (id === '1' || id === '2') {
      alert("Sample profiles cannot be deleted");
      return;
    }
    setShowDeleteModal(true);
  };

  if (!childData) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        {/* Removed the Navbar component since it's already provided by the AppLayout wrapper */}
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-16 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Removed the Navbar component since it's already provided by the AppLayout wrapper */}
      
      <div className="p-4">
        {/* Child profile summary card */}
        <div className={`rounded-xl p-5 mb-6 shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="relative mr-4">
              {childData.imageUrl || childData.profileImageUrl ? (
                <img 
                  src={childData.imageUrl || childData.profileImageUrl} 
                  alt={childData.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl">
                  {childData.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">{childData.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {calculateAge(childData.dob || childData.dateOfBirth || new Date())}
              </p>
              <div className="mt-2 flex space-x-2">
                <Link 
                  to={`/child/${id}/growth`}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full"
                >
                  Growth
                </Link>
                <Link 
                  to={`/child/${id}/milestones`}
                  className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full"
                >
                  Milestones
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Latest growth data */}
        {latestGrowth && (
          <div className={`rounded-xl p-5 mb-6 shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Latest Measurements</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(latestGrowth.date, 'MMM d, yyyy')}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs">Weight</p>
                <p className="text-xl font-bold text-primary mt-1">{latestGrowth.weight} kg</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs">Height</p>
                <p className="text-xl font-bold text-secondary mt-1">{latestGrowth.height} cm</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs">Head</p>
                <p className="text-xl font-bold text-tertiary mt-1">{latestGrowth.headCircumference} cm</p>
              </div>
            </div>
            <Link 
              to={`/child/${id}/growth`}
              className="mt-4 block text-center text-primary dark:text-primary-light font-medium"
            >
              View full growth chart
            </Link>
          </div>
        )}
        
        {/* Recent events */}
        <div className={`rounded-xl p-5 mb-6 shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-bold mb-4">Recent Events</h2>
          <div className="space-y-4">
            {recentEvents.map(event => (
              <div 
                key={event.id} 
                className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      event.type === 'milestone' ? 'bg-green-500' : 
                      event.type === 'appointment' ? 'bg-blue-500' : 
                      event.type === 'vaccine' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}></span>
                    <span className="text-sm font-medium">{event.title}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getDaysAgo(event.date)}
                  </span>
                </div>
                {event.hasMedia && (
                  <div className="mt-2 flex justify-end">
                    <span className="text-xs text-primary dark:text-primary-light flex items-center">
                      <FiImage className="mr-1" /> Has photo
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Link 
            to={`/child/${id}/timeline`}
            className="mt-4 block text-center text-primary dark:text-primary-light font-medium"
          >
            View full timeline
          </Link>
        </div>
        
        {/* Recent media */}
        <div className={`rounded-xl p-5 mb-6 shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-bold mb-4">Recent Photos & Videos</h2>
          <div className="grid grid-cols-3 gap-2">
            {recentMedia.map(media => (
              <div key={media.id} className="relative aspect-square">
                <img 
                  src={media.url} 
                  alt={media.caption} 
                  className="w-full h-full object-cover rounded-lg"
                />
                {media.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-y-4 border-y-transparent border-l-6 border-l-primary ml-1"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Link 
            to={`/child/${id}/gallery`}
            className="mt-4 block text-center text-primary dark:text-primary-light font-medium"
          >
            View all photos & videos
          </Link>
        </div>
        
        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            to={`/child/${id}/add-event`}
            className={`rounded-xl p-4 shadow-md flex flex-col items-center justify-center text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <FiActivity className="text-xl text-primary mb-2" />
            <span className="text-xs font-medium">Add Event</span>
          </Link>
          <Link
            to={`/child/${id}/add-growth`}
            className={`rounded-xl p-4 shadow-md flex flex-col items-center justify-center text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <FiTrendingUp className="text-xl text-secondary mb-2" />
            <span className="text-xs font-medium">Add Growth</span>
          </Link>
          <Link
            to={`/child/${id}/share`}
            className={`rounded-xl p-4 shadow-md flex flex-col items-center justify-center text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <FiShare2 className="text-xl text-tertiary mb-2" />
            <span className="text-xs font-medium">Share</span>
          </Link>
        </div>
        
        {/* Delete Profile Button */}
        <button
          onClick={openDeleteModal}
          className="mt-3 inline-flex items-center px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300 rounded-full transition-colors"
        >
          <FiTrash2 className="mr-1" />
          <span>Delete Profile</span>
        </button>
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm mx-4 shadow-elevated animate-scale-in">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Delete Child Profile</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete {childData?.name}'s profile? This action cannot be undone.
              </p>
              <div className="flex space-x-4 justify-end">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteProfile}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildDashboard;
