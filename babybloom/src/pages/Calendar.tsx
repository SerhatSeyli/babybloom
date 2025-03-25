import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isToday 
} from 'date-fns';
import { 
  FiCalendar, 
  FiPlus, 
  FiChevronLeft, 
  FiChevronRight, 
  FiX, 
  FiClock, 
  FiMapPin, 
  FiUser,
  FiTrash2,
  FiEdit2,
  FiFilter
} from 'react-icons/fi';
import { IoMdTrophy } from 'react-icons/io';

// Define event types
interface Event {
  id: string;
  date: Date;
  title: string;
  type: 'appointment' | 'milestone';
  childId: string;
  time?: string;
  location?: string;
  note?: string;
}

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState<'all' | 'appointment' | 'milestone'>('all');
  const [selectedChild, setSelectedChild] = useState<string>('all');
  
  // Event management state
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    id: '',
    date: new Date(),
    title: '',
    type: 'appointment',
    childId: '',
    time: '',
    location: '',
    note: ''
  });
  
  // Debug state
  const [debugMessage, setDebugMessage] = useState('');

  // Store children data
  const [children, setChildren] = useState([
    { id: 'all', name: 'All Children' },
    { id: '1', name: 'Emma' },
    { id: '2', name: 'Noah' }
  ]);

  // Add state for email reminders
  const [emailReminder, setEmailReminder] = useState(false);

  // Load events and children from localStorage on component mount
  useEffect(() => {
    loadEvents();
    loadChildren();
  }, []);

  // Load children from localStorage
  const loadChildren = () => {
    try {
      const storedChildren = localStorage.getItem('babybloom-children');
      if (storedChildren) {
        const parsedChildren = JSON.parse(storedChildren);
        // Add the "All Children" option at the beginning
        setChildren([
          { id: 'all', name: 'All Children' },
          ...parsedChildren.map((child: any) => ({
            id: child.id,
            name: child.name
          }))
        ]);
      }
    } catch (error) {
      console.error('Error loading children data:', error);
    }
  };

  // Load events from localStorage
  const loadEvents = () => {
    try {
      const savedEvents = localStorage.getItem('babybloom-events');
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert the date strings back to Date objects
        return parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
    return [];
  };

  // Initialize events from localStorage
  useEffect(() => {
    const loadedEvents = loadEvents();
    if (loadedEvents) {
      setEvents(loadedEvents);
    }
  }, []);

  // Load children data
  useEffect(() => {
    const savedChildren = localStorage.getItem('babybloom-children');
    if (savedChildren) {
      try {
        const childrenData = JSON.parse(savedChildren);
        setChildren(childrenData);
      } catch (error) {
        console.error('Error parsing children data:', error);
      }
    }
  }, []);

  // Save events to localStorage
  const saveEvents = (eventsToSave: Event[]) => {
    try {
      // Make sure we properly serialize the dates
      const serializedEvents = eventsToSave.map(event => ({
        ...event,
        date: event.date.toISOString()
      }));
      localStorage.setItem('babybloom-events', JSON.stringify(serializedEvents));
      console.log('Events saved successfully:', serializedEvents);
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  // Add a new event
  const handleAddEvent = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const eventToAdd = {
      ...newEvent,
      id,
    };
    const updatedEvents = [...events, eventToAdd];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    
    // Reset the form and close the modal
    setNewEvent({
      id: '',
      date: new Date(),
      title: '',
      type: 'appointment',
      childId: '',
      time: '',
      location: '',
      note: ''
    });
    setShowAddEventModal(false);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const onDateSelect = (day: Date) => {
    setSelectedDate(day);
    const dayEvents = events.filter(event => isSameDay(day, event.date));
    
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0]);
      setShowEventDetailsModal(true);
    } else if (dayEvents.length > 1) {
      // Future functionality: show list of events for this day
      // setShowEventsForDay(true);
    } else {
      // No events, open add event modal
      setNewEvent({
        ...newEvent,
        date: day,
      });
      setShowAddEventModal(true);
    }
  };

  const renderHeader = () => {
    return (
      <div className="mb-6">
        {/* Calendar header with navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-lavender-light flex items-center justify-center mr-3">
              <FiCalendar size={22} className="text-lavender-dark" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">
              Calendar
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={prevMonth}
              className="w-10 h-10 rounded-full bg-lavender-light flex items-center justify-center text-lavender-dark hover:bg-lavender hover:text-white transition-colors"
              aria-label="Previous month"
            >
              <FiChevronLeft size={20} />
            </button>
            <div 
              className="px-5 py-2 font-medium bg-lavender-light text-lavender-dark rounded-full cursor-pointer hover:bg-lavender hover:text-white transition-colors"
              onClick={() => setCurrentMonth(new Date())}
              aria-label="Today"
            >
              Today
            </div>
            <button 
              onClick={nextMonth}
              className="w-10 h-10 rounded-full bg-lavender-light flex items-center justify-center text-lavender-dark hover:bg-lavender hover:text-white transition-colors"
              aria-label="Next month"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Month title and add event button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-gray-800 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          
          <button
            onClick={() => {
              setNewEvent({
                ...newEvent,
                date: selectedDate,
              });
              setShowAddEventModal(true);
            }}
            className="px-5 py-2.5 bg-babypink-light text-white rounded-full shadow-sm hover:shadow-md transition-all transform hover:scale-105 flex items-center"
            aria-label="Add event"
          >
            <span className="mr-1">+</span>
            <span>Add Event</span>
          </button>
        </div>
        
        {/* Filter tabs with fixed width and proper spacing */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center ${
              selectedTab === 'all'
                ? 'bg-lavender-light text-gray-700'
                : 'bg-gray-100 dark:bg-dark-input text-gray-500 dark:text-gray-400 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedTab('all')}
            aria-label="All events"
          >
            All
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center ${
              selectedTab === 'appointment'
                ? 'bg-lavender-light text-gray-700'
                : 'bg-gray-100 dark:bg-dark-input text-gray-500 dark:text-gray-400 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedTab('appointment')}
            aria-label="Appointments"
          >
            <FiCalendar className="mr-1.5" size={15} />
            Appointments
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center ${
              selectedTab === 'milestone'
                ? 'bg-lavender-light text-gray-700'
                : 'bg-gray-100 dark:bg-dark-input text-gray-500 dark:text-gray-400 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedTab('milestone')}
            aria-label="Milestones"
          >
            <IoMdTrophy className="mr-1.5" size={15} />
            Milestones
          </button>
        </div>
        
        {/* Child selection - optional section */}
        {children.length > 1 && (
          <div className="flex items-center mt-4 mb-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <FiFilter className="mr-1.5" size={15} />
              <span>Filter by child:</span>
            </div>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="ml-2 py-1 px-2 text-sm bg-white dark:bg-dark-input border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-lavender-light focus:outline-none focus:ring-1 focus:ring-lavender focus:border-lavender"
            >
              <option value="all">All Children</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium py-2">
          <span className={`text-sm ${i === 0 || i === 6 ? 'text-babypink-dark' : 'text-gray-700 dark:text-gray-200'}`}>
            {dayNames[i]}
          </span>
        </div>
      );
    }
    
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    // Function to check if a date has events
    const hasEvents = (day: Date) => {
      return events.some(event => isSameDay(day, event.date));
    };
    
    // Get events for a specific day
    const getEventsForDay = (day: Date) => {
      return events.filter(event => isSameDay(day, event.date));
    };
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = getEventsForDay(cloneDay);
        const isWeekend = i === 0 || i === 6;
        const formattedDate = format(cloneDay, 'd');
        
        days.push(
          <div
            key={day.toString()}
            className={`relative p-2 h-12 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
              !isSameMonth(day, monthStart) ? 'bg-gray-50 dark:bg-gray-800/30' : ''
            }`}
            onClick={() => onDateSelect(cloneDay)}
          >
            <div
              className={`flex items-center justify-center h-7 w-7 mx-auto ${
                isSameDay(day, selectedDate)
                ? 'bg-babypink rounded-full text-white'
                : isToday(day)
                ? 'bg-lavender-lightest dark:bg-lavender-darkest rounded-full text-lavender-dark dark:text-lavender-light'
                : ''
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  isSameDay(day, selectedDate) 
                  ? 'text-white'
                  : isToday(day)
                  ? 'text-lavender-dark dark:text-lavender-light'
                  : !isSameMonth(day, monthStart)
                  ? 'text-gray-400 dark:text-gray-500'
                  : isWeekend
                  ? 'text-babypink-dark'
                  : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                {formattedDate}
              </span>
            </div>
            
            {hasEvents(cloneDay) && dayEvents.length > 0 && (
              <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                <div className="flex items-center space-x-1">
                  {dayEvents.length === 1 ? (
                    <div 
                      className={`h-2 w-2 rounded-full ${
                        dayEvents[0].type === 'appointment' ? 'bg-babypink-dark' : 'bg-mintgreen-dark'
                      }`}
                    />
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-babypink-dark" />
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-300">+{dayEvents.length - 1}</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      
      days = [];
    }
    
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-soft overflow-hidden mb-8">
        {rows}
      </div>
    );
  };

  const renderEvents = () => {
    const dateEvents = events.filter(
      event => 
        isSameDay(event.date, selectedDate) &&
        (selectedTab === 'all' || event.type === selectedTab) &&
        (selectedChild === 'all' || event.childId === selectedChild)
    );
    
    return (
      <div className="mt-8 mb-8 animate-fade-in">
        <div className="bg-white dark:bg-dark-card rounded-xl max-w-md w-full shadow-lg p-5 animate-scale-in">
          {/* Date header with indicators */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className={`
                w-10 h-10 flex items-center justify-center rounded-full mr-3
                ${isToday(selectedDate) 
                  ? 'bg-gradient-to-br from-lavender-light to-lavender text-white' 
                  : 'bg-lavender-lightest dark:bg-lavender-darkest text-lavender-dark dark:text-lavender-light'}
              `}>
                <span className="font-bold">{format(selectedDate, 'd')}</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white">
                  {format(selectedDate, 'EEEE')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-lavender-light">
                  {format(selectedDate, 'MMMM yyyy')}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setNewEvent({
                  ...newEvent,
                  date: selectedDate,
                });
                setShowAddEventModal(true);
              }}
              className="p-2 rounded-full bg-gradient-to-r from-babypink to-babypink-dark text-white shadow-sm hover:shadow-md transition-all transform hover:scale-105"
              aria-label="Add event"
            >
              <FiPlus size={20} />
            </button>
          </div>
          
          {/* Event list */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {dateEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  <FiCalendar className="text-gray-400 dark:text-gray-500" size={24} />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">No events for this day</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Add an appointment or milestone</p>
                <button
                  onClick={() => {
                    setNewEvent({
                      ...newEvent,
                      date: selectedDate,
                    });
                    setShowAddEventModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-babypink to-babypink-dark text-white rounded-full shadow-sm hover:shadow-md transition-all transform hover:scale-105 flex items-center"
                  aria-label="Add event"
                >
                  <FiPlus className="mr-1" size={16} />
                  <span>Add Event</span>
                </button>
              </div>
            ) : (
              dateEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventDetailsModal(true);
                  }}
                >
                  <div className="flex items-start">
                    <div className={`
                      p-3 rounded-full mr-4 flex-shrink-0
                      ${event.type === 'appointment' 
                        ? 'bg-babypink-light text-babypink-dark dark:bg-babypink-dark dark:bg-opacity-20 dark:text-babypink-light' 
                        : 'bg-mintgreen-light text-mintgreen-dark dark:bg-mintgreen-dark dark:bg-opacity-20 dark:text-mintgreen-light'}
                    `}>
                      {event.type === 'appointment' ? <FiCalendar size={18} /> : <IoMdTrophy size={18} />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-white text-lg">{event.title}</h4>
                      <div className="flex flex-wrap gap-y-1 gap-x-4 mt-2">
                        {event.time && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-lavender-light">
                            <FiClock className="mr-1" size={14} />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-lavender-light">
                            <FiMapPin className="mr-1" size={14} />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500 dark:text-lavender-light">
                          <FiUser className="mr-1" size={14} />
                          <span>{children.find(c => c.id === event.childId)?.name || 'Unknown Child'}</span>
                        </div>
                      </div>
                      {event.note && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/30 p-2 rounded-lg">
                          {event.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAddEventModal = () => {
    if (!showAddEventModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-dark-card rounded-xl max-w-md w-full shadow-lg p-5 animate-scale-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-800 dark:text-lavender-light">Add New Event</h3>
            <button 
              onClick={() => setShowAddEventModal(false)} 
              className="p-2 text-gray-500 dark:text-lavender-light hover:bg-gray-100 dark:hover:bg-dark-input rounded-full"
              aria-label="Close modal"
            >
              <FiX className="text-xl" />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-lavender-light mb-1">
              Date
            </label>
            <div className="bg-gray-100 dark:bg-dark-input px-3 py-2 rounded-lg text-gray-700 dark:text-lavender-light">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-lavender-light mb-1">
              Event Type
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  newEvent.type === 'appointment'
                    ? 'bg-babypink-light text-babypink-dark'
                    : 'bg-gray-100 dark:bg-dark-input text-gray-600 dark:text-lavender-light'
                }`}
                onClick={() => setNewEvent({...newEvent, type: 'appointment'})}
                aria-label="Appointment"
              >
                Appointment
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  newEvent.type === 'milestone'
                    ? 'bg-mintgreen-light text-mintgreen-dark'
                    : 'bg-gray-100 dark:bg-dark-input text-gray-600 dark:text-lavender-light'
                }`}
                onClick={() => setNewEvent({...newEvent, type: 'milestone'})}
                aria-label="Milestone"
              >
                Milestone
              </button>
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddEvent();
          }}>
            <div className="mb-4">
              <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 dark:text-lavender-light mb-1">
                Title *
              </label>
              <input
                id="event-title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-input text-gray-700 dark:text-lavender-light"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="event-child" className="block text-sm font-medium text-gray-700 dark:text-lavender-light mb-1">
                Child
              </label>
              <select
                id="event-child"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-input text-gray-700 dark:text-lavender-light"
                value={newEvent.childId}
                onChange={(e) => setNewEvent({...newEvent, childId: e.target.value})}
              >
                {children.filter(child => child.id !== 'all').map(child => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </div>

            {newEvent.type === 'appointment' ? (
              <>
                <div className="mb-4">
                  <label htmlFor="event-time" className="block text-sm font-medium text-gray-700 dark:text-lavender-light mb-1">
                    <FiClock className="inline mr-1" /> Time
                  </label>
                  <input
                    id="event-time"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-input text-gray-700 dark:text-lavender-light"
                    placeholder="e.g. 2:30 PM"
                    value={newEvent.time || ''}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 dark:text-lavender-light mb-1">
                    <FiMapPin className="inline mr-1" /> Location
                  </label>
                  <input
                    id="event-location"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-input text-gray-700 dark:text-lavender-light"
                    placeholder="Enter location"
                    value={newEvent.location || ''}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <div className="mb-4">
                <label htmlFor="event-note" className="block text-sm font-medium text-gray-700 dark:text-lavender-light mb-1">
                  Note
                </label>
                <textarea
                  id="event-note"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-input text-gray-700 dark:text-lavender-light"
                  placeholder="Describe the milestone"
                  value={newEvent.note || ''}
                  onChange={(e) => setNewEvent({...newEvent, note: e.target.value})}
                />
              </div>
            )}

            <div className="flex space-x-3 mt-5">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-dark-input text-gray-800 dark:text-lavender-light rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-4 py-2 bg-primary text-white rounded-lg transition-colors ${!newEvent.title ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'}`}
                disabled={!newEvent.title}
                aria-label="Save event"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderEventDetailsModal = () => {
    if (!selectedEvent) return null;

    const childName = children.find(c => c.id === selectedEvent.childId)?.name || 'Unknown Child';
    
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${showEventDetailsModal ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowEventDetailsModal(false)}></div>
        <div className="relative bg-white dark:bg-dark-card rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-fade-in-up">
          
          {/* Modal header with event type indicator */}
          <div className={`p-4 ${selectedEvent.type === 'appointment' ? 'bg-babypink-light dark:bg-babypink-dark dark:bg-opacity-20' : 'bg-mintgreen-light dark:bg-mintgreen-dark dark:bg-opacity-20'} flex justify-between items-center`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-3 ${selectedEvent.type === 'appointment' ? 'bg-white text-babypink-dark' : 'bg-white text-mintgreen-dark'}`}>
                {selectedEvent.type === 'appointment' ? <FiCalendar size={20} /> : <IoMdTrophy size={20} />}
              </div>
              <h3 className={`font-display font-bold text-lg ${selectedEvent.type === 'appointment' ? 'text-babypink-dark dark:text-babypink-light' : 'text-mintgreen-dark dark:text-mintgreen-light'}`}>
                {selectedEvent.type === 'appointment' ? 'Appointment' : 'Milestone'}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  // Future implementation will go here
                  setShowEventDetailsModal(false);
                  alert("Edit functionality coming in the next update!");
                }}
                className="p-2 rounded-full bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                aria-label="Edit event"
              >
                <FiEdit2 size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
              <button 
                onClick={() => {
                  setShowEventDetailsModal(false);
                  setShowDeleteEventModal(true);
                }}
                className="p-2 rounded-full bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                aria-label="Delete event"
              >
                <FiTrash2 size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
          
          {/* Event details */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{selectedEvent.title}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">
                  <FiCalendar className="text-gray-600 dark:text-gray-300" size={16} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 dark:text-gray-400">Date</h4>
                  <p className="text-gray-800 dark:text-white">{format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </div>
              
              {selectedEvent.time && (
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">
                    <FiClock className="text-gray-600 dark:text-gray-300" size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Time</h4>
                    <p className="text-gray-800 dark:text-white">{selectedEvent.time}</p>
                  </div>
                </div>
              )}
              
              {selectedEvent.location && (
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">
                    <FiMapPin className="text-gray-600 dark:text-gray-300" size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Location</h4>
                    <p className="text-gray-800 dark:text-white">{selectedEvent.location}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">
                  <FiUser className="text-gray-600 dark:text-gray-300" size={16} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 dark:text-gray-400">Child</h4>
                  <p className="text-gray-800 dark:text-white">{childName}</p>
                </div>
              </div>
              
              {selectedEvent.note && (
                <div className="mt-4">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                    {selectedEvent.note}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer actions */}
          <div className="border-t border-gray-100 dark:border-gray-700 p-4 flex justify-end">
            <button
              onClick={() => setShowEventDetailsModal(false)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteEventModal = () => {
    if (!selectedEvent) return null;
    
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${showDeleteEventModal ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteEventModal(false)}></div>
        <div className="relative bg-white dark:bg-dark-card rounded-xl shadow-lg w-full max-w-md p-6 animate-fade-in-up">
          <div className="text-center mb-5">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900 dark:bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={24} className="text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete {selectedEvent.type}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Are you sure you want to delete "{selectedEvent.title}"? This action cannot be undone.
            </p>
          </div>
          
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => setShowDeleteEventModal(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedEvent) {
                  const updatedEvents = events.filter(e => e.id !== selectedEvent.id);
                  setEvents(updatedEvents);
                  saveEvents(updatedEvents);
                  setShowDeleteEventModal(false);
                }
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              aria-label="Delete event"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEmailReminder = () => {
    return (
      <div className="bg-mintgreen-lightest dark:bg-mintgreen-darkest dark:bg-opacity-20 rounded-xl p-4 flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              id="email-reminder"
              className="h-5 w-5 text-mintgreen-dark rounded border-gray-300 focus:ring-mintgreen-light"
              checked={emailReminder}
              onChange={() => setEmailReminder(!emailReminder)}
            />
          </div>
          <label htmlFor="email-reminder" className="text-sm text-gray-700 dark:text-gray-200">
            Set email reminders for appointments
          </label>
        </div>
        <button
          onClick={() => setEmailReminder(!emailReminder)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            emailReminder
              ? 'bg-gradient-to-r from-mintgreen to-mintgreen-dark text-white hover:shadow-md transform hover:scale-105'
              : 'bg-mintgreen-lightest text-mintgreen-dark dark:bg-gray-700 dark:text-gray-300 hover:bg-mintgreen-light hover:text-white dark:hover:bg-gray-600'
          }`}
        >
          {emailReminder ? 'Disable' : 'Enable'}
        </button>
      </div>
    );
  };

  const renderDebugInfo = () => {
    if (!debugMessage) return null;
    
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-red-100 text-red-800 p-2 text-xs">
        Debug: {debugMessage}
        <button 
          onClick={() => setDebugMessage('')}
          className="ml-2 bg-red-200 px-2 rounded"
          aria-label="Clear debug message"
        >
          Clear
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col pb-16 px-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderEvents()}
      {renderAddEventModal()}
      {renderEventDetailsModal()}
      {renderDeleteEventModal()}
      {renderEmailReminder()}
      {renderDebugInfo()}
    </div>
  );
};

export default Calendar;
