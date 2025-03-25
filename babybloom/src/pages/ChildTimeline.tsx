import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { BsCalendarEvent, BsBookmark, BsX, BsStars, BsClock } from 'react-icons/bs';
import { RiHeartPulseFill } from 'react-icons/ri';
import { FaSyringe, FaPlus } from 'react-icons/fa';
import { FiEdit2, FiTrash2, FiShare2, FiCamera, FiCheckCircle } from 'react-icons/fi';

const ChildTimeline: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [childName, setChildName] = useState('');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<TimelineEvent, 'id'>>({
    type: 'milestone',
    title: '',
    description: '',
    date: new Date(),
    hasMedia: false
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  interface TimelineEvent {
    id: string;
    type: 'milestone' | 'appointment' | 'vaccine' | 'health' | 'other';
    title: string;
    description: string;
    date: Date;
    hasMedia?: boolean;
    mediaUrl?: string;
  }

  // Mock data - would come from API in real app
  useEffect(() => {
    // Set child name based on ID
    if (id === '1') {
      setChildName('Emma');
    } else if (id === '2') {
      setChildName('Noah');
    }

    // Fetch timeline events from API
    // For now, using mock data
    const mockEvents: TimelineEvent[] = [
      {
        id: '1',
        type: 'milestone',
        title: 'First Steps',
        description: 'Emma took her first steps today! She walked from the couch to the coffee table without falling.',
        date: new Date('2024-03-14'),
        hasMedia: true,
        mediaUrl: 'https://via.placeholder.com/600x400/FF5733/FFFFFF?text=First+Steps'
      },
      {
        id: '2',
        type: 'appointment',
        title: '9-Month Checkup',
        description: 'Regular checkup with Dr. Smith. Weight: 18 lbs, Height: 28 inches. All development on track.',
        date: new Date('2024-02-19')
      },
      {
        id: '3',
        type: 'vaccine',
        title: 'Flu Vaccine',
        description: 'Received seasonal flu vaccine. No adverse reactions.',
        date: new Date('2024-01-09')
      },
      {
        id: '4',
        type: 'health',
        title: 'Fever',
        description: 'Fever of 101.2°F. Gave infant Tylenol as directed. Fever subsided after 24 hours.',
        date: new Date('2023-12-04')
      },
      {
        id: '5',
        type: 'milestone',
        title: "First Word: 'Mama'",
        description: "Emma said 'Mama' clearly for the first time while reaching for me!",
        date: new Date('2023-11-10'),
        hasMedia: true,
        mediaUrl: 'https://via.placeholder.com/600x400/33A8FF/FFFFFF?text=First+Word'
      }
    ];

    setEvents(mockEvents);
  }, [id]);

  // Filter events based on active filter
  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(event => event.type === activeFilter);

  // Helper functions to get styles for different event types
  const getEventColor = (type: string) => {
    switch(type) {
      case 'milestone':
        return 'bg-lavender text-white';
      case 'appointment':
        return 'bg-babypink text-white';
      case 'vaccine':
        return 'bg-mintgreen text-white';
      case 'health':
        return 'bg-primary-light text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };
  
  const getEventBgColor = (type: string) => {
    switch(type) {
      case 'milestone':
        return 'bg-lavender-lightest text-purple-700 dark:bg-purple-800 dark:text-purple-200';
      case 'appointment':
        return 'bg-babypink-lightest text-pink-700 dark:bg-pink-800 dark:text-pink-200';
      case 'vaccine':
        return 'bg-mintgreen-lightest text-green-700 dark:bg-green-800 dark:text-green-200';
      case 'health':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'milestone':
        return <BsStars className="text-xl" />;
      case 'appointment':
        return <BsCalendarEvent className="text-xl" />;
      case 'vaccine':
        return <FaSyringe className="text-lg" />;
      case 'health':
        return <RiHeartPulseFill className="text-xl" />;
      default:
        return <BsBookmark className="text-xl" />;
    }
  };

  // Get title for event type
  const getEventTypeTitle = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'Milestone';
      case 'appointment':
        return 'Appointment';
      case 'vaccine':
        return 'Vaccine';
      case 'health':
        return 'Health Note';
      default:
        return 'Other Event';
    }
  };

  // Open event details modal
  const openEventDetails = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Handle adding a new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.type) return;

    const newId = (Math.max(...events.map(e => parseInt(e.id))) + 1).toString();
    
    setEvents([
      {
        id: newId,
        ...newEvent,
        date: new Date(newEvent.date)
      },
      ...events
    ]);
    
    // Reset form and close modal
    setNewEvent({
      type: 'milestone',
      title: '',
      description: '',
      date: new Date(),
      hasMedia: false
    });
    setImagePreview(null);
    setShowAddModal(false);
  };

  // Handle deleting an event
  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
      setShowEventModal(false);
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setNewEvent({
          ...newEvent,
          hasMedia: true,
          mediaUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-bg baby-pattern-clouds">
      {/* Navbar is provided by the AppLayout wrapper in App.tsx */}
      
      <div className="p-3 mx-auto pb-20 max-w-full sm:max-w-3xl">
        {/* Page Title with Child Name */}
        <div className="mb-2 text-center">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white font-display">
            {childName}'s Journey
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Capture and celebrate all the special moments</p>
        </div>
        
        {/* Add Event Button */}
        <button 
          className="fixed bottom-16 right-4 z-10 bg-gradient-to-r from-babypink to-babypink-dark text-white rounded-full p-2 sm:p-3 shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          onClick={() => setShowAddModal(true)}
          aria-label="Add new event"
        >
          <FaPlus className="text-sm sm:text-lg" />
        </button>
        
        {/* Filter Tabs */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-md mb-3 overflow-hidden animate-fade-in">
          <div className="flex p-1 space-x-1 sm:p-2 sm:space-x-2 overflow-x-auto no-scrollbar">
            <button 
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeFilter === 'all' 
                  ? 'bg-gradient-to-r from-lavender to-babypink text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              <BsStars className="inline mr-1" /> All
            </button>
            <button 
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === 'milestone' 
                  ? 'bg-gradient-to-r from-lavender to-lavender-dark text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveFilter('milestone')}
            >
              <BsStars className="inline mr-1" /> Milestones
            </button>
            <button 
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === 'appointment' 
                  ? 'bg-gradient-to-r from-babypink to-babypink-dark text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveFilter('appointment')}
            >
              <BsCalendarEvent className="inline mr-1" /> Appointments
            </button>
            <button 
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === 'vaccine' 
                  ? 'bg-gradient-to-r from-mintgreen to-mintgreen-dark text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveFilter('vaccine')}
            >
              <FaSyringe className="inline mr-1" /> Vaccines
            </button>
            <button 
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === 'health' 
                  ? 'bg-gradient-to-r from-skyblue to-skyblue-dark text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveFilter('health')}
            >
              <RiHeartPulseFill className="inline mr-1" /> Health
            </button>
          </div>
        </div>
        
        {/* Timeline Events */}
        <div className="relative">
          {/* Vertical line for timeline */}
          <div className="absolute left-4 sm:left-6 top-6 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-lavender via-babypink to-mintgreen z-0 rounded-full"></div>
          
          <div className="space-y-2 sm:space-y-3">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div 
                  key={event.id} 
                  className="animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="bg-white dark:bg-dark-card rounded-xl shadow-md overflow-hidden relative pl-10 sm:pl-12 transform transition-all hover:-translate-y-1 hover:shadow-lg">
                    {/* Timeline dot */}
                    <div className={`absolute left-4 sm:left-5 top-4 sm:top-5 w-6 h-6 sm:w-8 sm:h-8 ${getEventColor(event.type)} rounded-full flex items-center justify-center z-10 shadow-md transform -translate-x-1/2 border-2 border-white dark:border-dark-card`}>
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="p-2 sm:p-3 cursor-pointer" onClick={() => openEventDetails(event)}>
                      <div className="flex items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                            <div className="mb-1 sm:mb-0">
                              <span className={`text-2xs sm:text-xs font-bold ${getEventBgColor(event.type)} px-2 py-1 sm:px-3 sm:py-1.5 rounded-full inline-block mb-1 sm:mb-2`}>
                                {getEventTypeTitle(event.type)}
                              </span>
                              <h3 className="font-display font-bold text-base sm:text-lg text-gray-800 dark:text-white truncate max-w-[200px] sm:max-w-full">{event.title}</h3>
                            </div>
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-inner whitespace-nowrap">
                              <BsClock className="text-gray-700 dark:text-gray-300 mr-1 text-xs sm:text-sm" />
                              <span className="text-2xs sm:text-xs text-gray-700 dark:text-gray-300 font-medium">
                                {format(event.date, 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mt-1 sm:mt-2 bg-gray-50 dark:bg-gray-800/50 p-2 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium line-clamp-3 sm:line-clamp-none">
                            {event.description}
                          </p>
                          
                          {event.hasMedia && (
                            <div className="mt-1 sm:mt-2 flex justify-end">
                              <div className={`flex items-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-600`}>
                                <FiCamera className="mr-1 text-xs sm:text-sm" />
                                <span className="text-2xs sm:text-xs font-medium">View Photo</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-dark-card rounded-xl shadow-md p-4 sm:p-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-lavender-lightest dark:bg-lavender-darkest rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <BsCalendarEvent className="text-purple-700 dark:text-purple-300 text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">No events found</h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 font-medium">Add your first {activeFilter === 'all' ? 'event' : activeFilter} to get started!</p>
                  <button
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-lavender to-lavender-dark text-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 font-medium text-xs sm:text-sm"
                    onClick={() => setShowAddModal(true)}
                  >
                    <FaPlus className="inline mr-1 text-xs" /> Add New Event
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-elevated">
            <div className="relative">
              {selectedEvent.hasMedia && selectedEvent.mediaUrl && (
                <div className="relative">
                  <img 
                    src={selectedEvent.mediaUrl} 
                    alt={selectedEvent.title}
                    className="w-full h-64 object-cover rounded-t-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20 rounded-t-2xl"></div>
                </div>
              )}
              
              <button 
                className="absolute top-3 right-3 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2 transition-colors shadow-soft"
                onClick={() => setShowEventModal(false)}
              >
                <BsX size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-5">
                <div className={`mr-4 ${getEventColor(selectedEvent.type)} p-3 rounded-full shadow-glow`}>
                  {getEventIcon(selectedEvent.type)}
                </div>
                <div>
                  <span className={`text-xs font-medium ${getEventBgColor(selectedEvent.type)} px-2.5 py-0.5 rounded-full inline-block mb-1.5 shadow-soft`}>
                    {getEventTypeTitle(selectedEvent.type)}
                  </span>
                  <h3 className="font-display font-bold text-xl text-gray-800 dark:text-white">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center">
                    <BsClock className="mr-1.5 text-primary dark:text-primary-light" />
                    {format(selectedEvent.date, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className={`${getEventBgColor(selectedEvent.type)} p-4 rounded-xl mb-6 shadow-pressed`}>
                <p className="text-gray-700 dark:text-gray-200 font-rounded">
                  {selectedEvent.description}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <button 
                  className="bg-gradient-to-r from-lavender to-lavender-dark text-white py-2.5 rounded-xl font-medium shadow-soft hover:shadow-elevated transition-all flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0"
                  onClick={() => {
                    // Logic for editing event would go here
                    setShowEventModal(false);
                  }}
                >
                  <FiEdit2 className="mr-1.5" />
                  <span>Edit</span>
                </button>
                <button 
                  className="bg-gradient-to-r from-red-400 to-red-500 text-white py-2.5 rounded-xl font-medium shadow-soft hover:shadow-elevated transition-all flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <FiTrash2 className="mr-1.5" />
                  <span>Delete</span>
                </button>
                <button 
                  className="bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2.5 rounded-xl font-medium shadow-soft hover:shadow-elevated transition-all flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0"
                  onClick={() => {
                    // Logic for sharing event would go here
                    setShowEventModal(false);
                  }}
                >
                  <FiShare2 className="mr-1.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-elevated">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-lavender-lightest dark:bg-lavender-darkest rounded-full flex items-center justify-center mr-3 shadow-glow">
                    <BsStars className="text-lavender-dark dark:text-lavender-light text-2xl" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-800 dark:text-white">Add New Moment</h3>
                </div>
                <button 
                  className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full transition-colors shadow-soft hover:shadow-elevated"
                  onClick={() => {
                    setShowAddModal(false);
                    setImagePreview(null);
                  }}
                >
                  <BsX size={24} />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="w-5 h-5 rounded-full bg-lavender-lightest dark:bg-lavender-darkest flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Event Type
                  </label>
                  <select
                    name="type"
                    value={newEvent.type}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  >
                    <option value="milestone">Milestone</option>
                    <option value="appointment">Appointment</option>
                    <option value="vaccine">Vaccine</option>
                    <option value="health">Health</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="w-5 h-5 rounded-full bg-lavender-lightest dark:bg-lavender-darkest flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    placeholder="e.g., First Steps, 6-month Checkup"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="w-5 h-5 rounded-full bg-lavender-lightest dark:bg-lavender-darkest flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={format(new Date(newEvent.date), 'yyyy-MM-dd')}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="w-5 h-5 rounded-full bg-lavender-lightest dark:bg-lavender-darkest flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    placeholder="Describe the event..."
                    rows={3}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="w-5 h-5 rounded-full bg-lavender-lightest dark:bg-lavender-darkest flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Add Photo
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative mb-4 rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <button
                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-soft hover:shadow-elevated transition-all hover:scale-110"
                        onClick={() => {
                          setImagePreview(null);
                          setNewEvent({
                            ...newEvent,
                            hasMedia: false,
                            mediaUrl: undefined
                          });
                        }}
                      >
                        <BsX size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        id="media-upload"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <label 
                        htmlFor="media-upload"
                        className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors p-4 group"
                      >
                        <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-soft mb-3 group-hover:-translate-y-1 transition-transform">
                          <FiCamera className="text-2xl text-primary dark:text-primary-light" />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 text-center font-medium">
                          Click to upload a photo of this moment
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Supports JPG, PNG, GIF
                        </span>
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="pt-3">
                  <button
                    onClick={handleAddEvent}
                    disabled={!newEvent.title || !newEvent.type}
                    className={`w-full py-3 rounded-xl font-medium flex items-center justify-center transition-all ${
                      !newEvent.title || !newEvent.type
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        : 'bg-gradient-to-r from-lavender to-lavender-dark text-white shadow-soft hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                  >
                    <FiCheckCircle className="mr-2" />
                    Save Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildTimeline;
