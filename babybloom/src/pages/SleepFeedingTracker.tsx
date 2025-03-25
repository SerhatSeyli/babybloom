import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { format, parseISO } from 'date-fns';
import { FiMoon, FiClock, FiPlus } from 'react-icons/fi';
import { GiBabyBottle } from 'react-icons/gi';
import { IoIosLeaf } from 'react-icons/io';

interface SleepRecord {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  quality: 'poor' | 'fair' | 'good';
  notes?: string;
}

interface FeedingRecord {
  id: string;
  time: string;
  type: 'breast' | 'formula' | 'solid';
  amount?: string; // For formula (oz) or solid
  duration?: number; // For breastfeeding (minutes)
  notes?: string;
}

const SleepFeedingTracker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [childName, setChildName] = useState('');
  const [activeTab, setActiveTab] = useState<'sleep' | 'feeding'>('sleep');
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [showSleepForm, setShowSleepForm] = useState(false);
  const [showFeedingForm, setShowFeedingForm] = useState(false);
  
  // New record form states
  const [newSleepRecord, setNewSleepRecord] = useState<Partial<SleepRecord>>({
    startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    quality: 'good'
  });
  
  const [newFeedingRecord, setNewFeedingRecord] = useState<Partial<FeedingRecord>>({
    time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    type: 'breast'
  });

  // Mock data - would come from API in real app
  useEffect(() => {
    // Set child name based on ID
    if (id === '1') {
      setChildName('Emma');
    } else if (id === '2') {
      setChildName('Noah');
    }

    // Mock sleep records
    const mockSleepRecords: SleepRecord[] = [
      {
        id: '1',
        startTime: '2024-03-23T20:30:00',
        endTime: '2024-03-24T06:30:00',
        duration: 600, // 10 hours in minutes
        quality: 'good',
        notes: 'Slept through the night!'
      },
      {
        id: '2',
        startTime: '2024-03-23T13:00:00',
        endTime: '2024-03-23T14:30:00',
        duration: 90, // 1.5 hours in minutes
        quality: 'fair',
        notes: 'Afternoon nap, woke up a bit fussy'
      },
      {
        id: '3',
        startTime: '2024-03-22T20:00:00',
        endTime: '2024-03-23T05:30:00',
        duration: 570, // 9.5 hours in minutes
        quality: 'poor',
        notes: 'Woke up twice during the night'
      }
    ];
    
    // Mock feeding records
    const mockFeedingRecords: FeedingRecord[] = [
      {
        id: '1',
        time: '2024-03-24T07:30:00',
        type: 'breast',
        duration: 15,
        notes: 'Good appetite this morning'
      },
      {
        id: '2',
        time: '2024-03-23T19:00:00',
        type: 'formula',
        amount: '5 oz',
        notes: 'Finished entire bottle'
      },
      {
        id: '3',
        time: '2024-03-23T12:00:00',
        type: 'solid',
        amount: '2 tbsp mashed banana',
        notes: 'First time trying banana, seemed to enjoy it'
      }
    ];
    
    setSleepRecords(mockSleepRecords);
    setFeedingRecords(mockFeedingRecords);
  }, [id]);

  const calculateSleepDuration = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours}h ${mins}m`;
  };

  const handleSleepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = calculateSleepDuration(
      newSleepRecord.startTime || '',
      newSleepRecord.endTime || ''
    );
    
    const sleepRecord: SleepRecord = {
      id: `sleep-${Date.now()}`,
      startTime: newSleepRecord.startTime || '',
      endTime: newSleepRecord.endTime || '',
      duration,
      quality: newSleepRecord.quality as 'poor' | 'fair' | 'good',
      notes: newSleepRecord.notes
    };
    
    setSleepRecords(prev => [sleepRecord, ...prev]);
    setShowSleepForm(false);
    setNewSleepRecord({
      startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      quality: 'good'
    });
  };

  const handleFeedingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const feedingRecord: FeedingRecord = {
      id: `feeding-${Date.now()}`,
      time: newFeedingRecord.time || '',
      type: newFeedingRecord.type as 'breast' | 'formula' | 'solid',
      amount: newFeedingRecord.amount,
      duration: newFeedingRecord.duration,
      notes: newFeedingRecord.notes
    };
    
    setFeedingRecords(prev => [feedingRecord, ...prev]);
    setShowFeedingForm(false);
    setNewFeedingRecord({
      time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      type: 'breast'
    });
  };

  const handleSleepRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSleepRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeedingRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFeedingRecord(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title={`${childName}'s Sleep & Feeding`} showBackButton={true} />
      
      <div className="p-4">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          <div className="flex divide-x divide-gray-200">
            <button 
              className={`flex-1 py-3 font-medium text-sm flex items-center justify-center ${
                activeTab === 'sleep' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('sleep')}
            >
              <FiMoon className="mr-2" /> Sleep
            </button>
            <button 
              className={`flex-1 py-3 font-medium text-sm flex items-center justify-center ${
                activeTab === 'feeding' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('feeding')}
            >
              <GiBabyBottle className="mr-2" /> Feeding
            </button>
          </div>
        </div>

        {/* Sleep Tab Content */}
        {activeTab === 'sleep' && (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Sleep Records</h3>
                <button 
                  onClick={() => setShowSleepForm(true)}
                  className="flex items-center text-primary"
                >
                  <FiPlus className="mr-1" /> Add Sleep
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {sleepRecords.length > 0 ? (
                  sleepRecords.map(record => (
                    <div key={record.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="mr-3 mt-1 p-2 bg-blue-50 rounded-full">
                            <FiMoon className="text-blue-500" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">
                                {format(parseISO(record.startTime), 'MMM d, h:mm a')}
                              </span>
                              <span className="mx-2">to</span>
                              <span className="font-medium">
                                {format(parseISO(record.endTime), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <FiClock className="mr-1" /> 
                              {formatDuration(record.duration)}
                              <span className="mx-2">•</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                record.quality === 'good' ? 'bg-green-100 text-green-800' :
                                record.quality === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {record.quality.charAt(0).toUpperCase() + record.quality.slice(1)}
                              </span>
                            </div>
                            {record.notes && (
                              <p className="mt-2 text-sm text-gray-600">{record.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No sleep records yet
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Feeding Tab Content */}
        {activeTab === 'feeding' && (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Feeding Records</h3>
                <button 
                  onClick={() => setShowFeedingForm(true)}
                  className="flex items-center text-primary"
                >
                  <FiPlus className="mr-1" /> Add Feeding
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {feedingRecords.length > 0 ? (
                  feedingRecords.map(record => (
                    <div key={record.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="mr-3 mt-1 p-2 rounded-full 
                            ${record.type === 'breast' ? 'bg-purple-50' : 
                              record.type === 'formula' ? 'bg-blue-50' : 'bg-green-50'}">
                            {record.type === 'breast' ? (
                              <GiBabyBottle className="text-purple-500" />
                            ) : record.type === 'formula' ? (
                              <GiBabyBottle className="text-blue-500" />
                            ) : (
                              <IoIosLeaf className="text-green-500" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">
                                {format(parseISO(record.time), 'MMM d, h:mm a')}
                              </span>
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                                {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {record.type === 'breast' && record.duration && (
                                <span>{record.duration} minutes</span>
                              )}
                              {record.type !== 'breast' && record.amount && (
                                <span>{record.amount}</span>
                              )}
                            </div>
                            {record.notes && (
                              <p className="mt-2 text-sm text-gray-600">{record.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No feeding records yet
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sleep Record Form Modal */}
      {showSleepForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4">
            <h3 className="text-xl font-medium mb-4">Add Sleep Record</h3>
            
            <form onSubmit={handleSleepSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input 
                    type="datetime-local" 
                    name="startTime"
                    value={newSleepRecord.startTime}
                    onChange={handleSleepRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input 
                    type="datetime-local"
                    name="endTime"
                    value={newSleepRecord.endTime}
                    onChange={handleSleepRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Quality</label>
                  <select
                    name="quality"
                    value={newSleepRecord.quality}
                    onChange={handleSleepRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea 
                    name="notes"
                    value={newSleepRecord.notes || ''}
                    onChange={handleSleepRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowSleepForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feeding Record Form Modal */}
      {showFeedingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4">
            <h3 className="text-xl font-medium mb-4">Add Feeding Record</h3>
            
            <form onSubmit={handleFeedingSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input 
                    type="datetime-local" 
                    name="time"
                    value={newFeedingRecord.time}
                    onChange={handleFeedingRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feeding Type</label>
                  <select
                    name="type"
                    value={newFeedingRecord.type}
                    onChange={handleFeedingRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="breast">Breastfeeding</option>
                    <option value="formula">Formula</option>
                    <option value="solid">Solid Food</option>
                  </select>
                </div>
                
                {newFeedingRecord.type === 'breast' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input 
                      type="number"
                      name="duration"
                      value={newFeedingRecord.duration || ''}
                      onChange={handleFeedingRecordChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="1"
                    />
                  </div>
                )}
                
                {newFeedingRecord.type !== 'breast' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {newFeedingRecord.type === 'formula' ? 'Amount (oz)' : 'Description'}
                    </label>
                    <input 
                      type="text"
                      name="amount"
                      value={newFeedingRecord.amount || ''}
                      onChange={handleFeedingRecordChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder={newFeedingRecord.type === 'formula' ? '5 oz' : '2 tbsp mashed banana'}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea 
                    name="notes"
                    value={newFeedingRecord.notes || ''}
                    onChange={handleFeedingRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowFeedingForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepFeedingTracker;
