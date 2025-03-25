import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { BsCalendarEvent, BsActivity } from 'react-icons/bs';
import { FaSyringe } from 'react-icons/fa';
import { FiImage, FiPlusCircle } from 'react-icons/fi';
import { RiMedicineBottleLine } from 'react-icons/ri';

interface Child {
  id: string;
  name: string;
}

const AddEvent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const childId = location.state?.childId || '';

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>(childId);
  const [eventType, setEventType] = useState<string>('milestone');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Load children data
  useEffect(() => {
    // In a real app, this would be an API call
    // Mock data for now
    const mockChildren: Child[] = [
      { id: '1', name: 'Emma' },
      { id: '2', name: 'Noah' }
    ];
    setChildren(mockChildren);
  }, []);

  // Update child selection if childId was passed
  useEffect(() => {
    if (childId) {
      setSelectedChild(childId);
    }
  }, [childId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create event object
    const event = {
      childId: selectedChild,
      type: eventType,
      title,
      description,
      date,
      time,
      hasAttachments: attachments.length > 0
    };
    
    // In a real app, you would save this to the database
    console.log('Saving event:', event);
    
    // Mock success
    alert('Event added successfully!');
    
    // Navigate back to child profile or timeline
    if (selectedChild) {
      navigate(`/child/${selectedChild}/timeline`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Add Event" showBackButton={true} />
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Child Selection */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a child</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
          </div>
          
          {/* Event Type */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  eventType === 'milestone' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-300'
                }`}
                onClick={() => setEventType('milestone')}
              >
                <BsActivity className={`mr-2 ${eventType === 'milestone' ? 'text-purple-500' : 'text-gray-500'}`} />
                <span>Milestone</span>
              </button>
              
              <button
                type="button"
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  eventType === 'appointment' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'
                }`}
                onClick={() => setEventType('appointment')}
              >
                <BsCalendarEvent className={`mr-2 ${eventType === 'appointment' ? 'text-blue-500' : 'text-gray-500'}`} />
                <span>Appointment</span>
              </button>
              
              <button
                type="button"
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  eventType === 'vaccine' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300'
                }`}
                onClick={() => setEventType('vaccine')}
              >
                <FaSyringe className={`mr-2 ${eventType === 'vaccine' ? 'text-green-500' : 'text-gray-500'}`} />
                <span>Vaccine</span>
              </button>
              
              <button
                type="button"
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  eventType === 'health' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-300'
                }`}
                onClick={() => setEventType('health')}
              >
                <RiMedicineBottleLine className={`mr-2 ${eventType === 'health' ? 'text-red-500' : 'text-gray-500'}`} />
                <span>Health</span>
              </button>
            </div>
          </div>
          
          {/* Event Details */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Enter ${eventType} title`}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this event..."
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time (optional)</label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          
          {/* Attachments */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (optional)</label>
            
            <div className="mb-3">
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                <FiImage className="text-2xl text-gray-400 mx-auto mb-2" />
                <span className="text-gray-500">Add photos or videos</span>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            
            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Selected files:</p>
                <div className="grid grid-cols-3 gap-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="bg-gray-100 rounded p-2 flex items-center">
                        <FiImage className="text-gray-500 mr-2" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center"
          >
            <FiPlusCircle className="mr-2" />
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
