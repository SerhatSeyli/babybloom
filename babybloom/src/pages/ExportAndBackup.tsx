import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiDownload, FiCloud, FiCheckCircle, FiCalendar, FiClipboard, FiPieChart } from 'react-icons/fi';
import { format } from 'date-fns';

interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  image?: string;
}

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface BackupOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ExportAndBackup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [backupProgress, setBackupProgress] = useState(0);
  const [selectedExportOptions, setSelectedExportOptions] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [backupMessage, setBackupMessage] = useState('');
  const [autoExportEnabled, setAutoExportEnabled] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [autoExportOptions, setAutoExportOptions] = useState<string[]>([]);
  const [autoExportSuccess, setAutoExportSuccess] = useState(false);

  // Mock data - would be fetched from API in real app
  useEffect(() => {
    // Mock child data
    const mockChild: Child = {
      id: id || '1',
      name: id === '1' ? 'Emma' : 'Noah',
      birthDate: '2023-06-15',
      gender: id === '1' ? 'female' : 'male',
      image: 'https://via.placeholder.com/150'
    };
    
    setChild(mockChild);
    
    // Mock last backup date
    setLastBackupDate('2024-03-15T14:30:00');
  }, [id]);

  // Export options
  const exportOptions: ExportOption[] = [
    {
      id: 'timeline',
      title: 'Timeline Events',
      description: 'All events, milestones, and appointments',
      icon: <FiCalendar />
    },
    {
      id: 'health',
      title: 'Health Records',
      description: 'Medical visits, vaccinations, and health metrics',
      icon: <FiClipboard />
    },
    {
      id: 'growth',
      title: 'Growth Charts',
      description: 'Weight, height, and head circumference data',
      icon: <FiPieChart />
    },
    {
      id: 'sleep',
      title: 'Sleep & Feeding',
      description: 'Sleep patterns and feeding records',
      icon: <FiClipboard />
    }
  ];

  // Backup options
  const backupOptions: BackupOption[] = [
    {
      id: 'cloud',
      title: 'Cloud Backup',
      description: 'Securely backup all data to the cloud',
      icon: <FiCloud />
    },
    {
      id: 'local',
      title: 'Local Backup',
      description: 'Save a backup file to your device',
      icon: <FiDownload />
    }
  ];

  const toggleExportOption = (optionId: string) => {
    setSelectedExportOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const toggleAutoExportOption = (optionId: string) => {
    setAutoExportOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleExport = () => {
    if (selectedExportOptions.length === 0) {
      alert('Please select at least one export option.');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setExportSuccess(true);
          
          // Reset success message after 3 seconds
          setTimeout(() => {
            setExportSuccess(false);
          }, 3000);
          
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleBackup = (backupType: string) => {
    setIsBackingUp(true);
    setBackupProgress(0);
    setBackupMessage(`${backupType.charAt(0).toUpperCase() + backupType.slice(1)} backup in progress...`);

    // Simulate backup process
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          setBackupSuccess(true);
          setLastBackupDate(new Date().toISOString());
          setBackupMessage('');
          
          // Reset success message after 3 seconds
          setTimeout(() => {
            setBackupSuccess(false);
          }, 3000);
          
          return 0;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleAutoExportToggle = () => {
    if (!autoExportEnabled && !emailAddress) {
      alert('Please enter an email address.');
      return;
    }
    
    if (!autoExportEnabled && autoExportOptions.length === 0) {
      alert('Please select at least one export option.');
      return;
    }
    
    setAutoExportEnabled(prev => !prev);
    
    if (!autoExportEnabled) {
      // Simulating saving auto-export settings
      setTimeout(() => {
        setAutoExportSuccess(true);
        setTimeout(() => {
          setAutoExportSuccess(false);
        }, 3000);
      }, 1000);
    }
  };

  if (!child) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-4 text-center">
          <p>Loading child information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg dark:text-dark-text">
      <Navbar title="Export & Backup" showBackButton={true} />
      
      <div className="p-4">
        {/* Child Info */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center">
            {child.image && (
              <div className="mr-3">
                <img 
                  src={child.image} 
                  alt={child.name} 
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
            )}
            
            <div>
              <h2 className="text-lg font-medium">{child.name}</h2>
              <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                {format(new Date(child.birthDate), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Export Section */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium">Export Data as PDF</h3>
            <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
              Create a detailed report of your baby's history
            </p>
          </div>
          
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Date Range
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 dark:text-dark-text-secondary mb-1">
                    Start Date
                  </label>
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 dark:text-dark-text-secondary mb-1">
                    End Date
                  </label>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                Information to Include
              </label>
              
              <div className="space-y-2">
                {exportOptions.map(option => (
                  <div 
                    key={option.id} 
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      selectedExportOptions.includes(option.id) 
                        ? 'border-primary bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => toggleExportOption(option.id)}
                  >
                    <div className={`p-2 rounded-full mr-3 ${
                      selectedExportOptions.includes(option.id) 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {option.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{option.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {isExporting && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm mt-2 text-gray-500 dark:text-dark-text-secondary">
                  Generating report... {exportProgress}%
                </p>
              </div>
            )}
            
            <button 
              onClick={handleExport}
              disabled={isExporting || selectedExportOptions.length === 0}
              className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center ${
                isExporting || selectedExportOptions.length === 0
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white'
              }`}
            >
              <FiDownload className="mr-2" />
              Export PDF Report
            </button>
            
            {exportSuccess && (
              <div className="mt-3 p-2 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 text-green-800 dark:text-green-300 rounded-lg flex items-center">
                <FiCheckCircle className="mr-2" />
                Report generated successfully! Check your downloads folder.
              </div>
            )}
          </div>
        </div>
        
        {/* Automatic Export Section */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Automatic Memory Downloads</h3>
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                  Set up monthly PDF reports sent directly to your email
                </p>
              </div>
              <div className="relative inline-block w-12 h-6 mr-2">
                <input
                  type="checkbox"
                  id="autoExportToggle"
                  className="opacity-0 w-0 h-0"
                  checked={autoExportEnabled}
                  onChange={handleAutoExportToggle}
                />
                <label
                  htmlFor="autoExportToggle"
                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                    autoExportEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span 
                    className={`absolute w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                      autoExportEnabled ? 'left-7' : 'left-1'
                    } top-1`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                value={emailAddress}
                onChange={e => setEmailAddress(e.target.value)}
                placeholder="Enter your email address"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                Information to Include in Monthly Reports
              </label>
              
              <div className="space-y-2">
                {exportOptions.map(option => (
                  <div 
                    key={`auto-${option.id}`} 
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      autoExportOptions.includes(option.id) 
                        ? 'border-primary bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => toggleAutoExportOption(option.id)}
                  >
                    <div className={`p-2 rounded-full mr-3 ${
                      autoExportOptions.includes(option.id) 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {option.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{option.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg text-sm text-gray-700 dark:text-blue-200 mb-4">
              <p className="flex items-center">
                <FiCalendar className="mr-2 text-blue-500 dark:text-blue-300" />
                Reports will be generated and sent on the 1st of each month.
              </p>
            </div>
            
            {autoExportSuccess && (
              <div className="mt-3 p-2 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 text-green-800 dark:text-green-300 rounded-lg flex items-center">
                <FiCheckCircle className="mr-2" />
                Automatic download settings saved successfully!
              </div>
            )}
          </div>
        </div>
        
        {/* Backup Section */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium">Backup Data</h3>
            <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
              Securely store your data for safekeeping
            </p>
            {lastBackupDate && (
              <p className="text-xs text-primary mt-1">
                Last backup: {format(new Date(lastBackupDate), 'MMM d, yyyy h:mm a')}
              </p>
            )}
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              {backupOptions.map(option => (
                <div key={option.id} className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-primary mr-3">
                      {option.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{option.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="px-4 pb-3">
                    {isBackingUp && option.id === 'cloud' && (
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${backupProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-center text-sm mt-2 text-gray-500 dark:text-dark-text-secondary">
                          {backupMessage} {backupProgress}%
                        </p>
                      </div>
                    )}
                    
                    {isBackingUp && option.id === 'local' && (
                      <div className="mb-3">
                        <p className="text-center text-sm mt-2 text-gray-500 dark:text-dark-text-secondary">
                          {backupMessage} {backupProgress}%
                        </p>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleBackup(option.id)}
                      disabled={isBackingUp}
                      className={`w-full py-2 rounded-md font-medium text-sm flex items-center justify-center ${
                        isBackingUp
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-primary text-white'
                      }`}
                    >
                      {option.id === 'cloud' ? 'Backup to Cloud' : 'Download Backup File'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {backupSuccess && (
              <div className="mt-3 p-2 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 text-green-800 dark:text-green-300 rounded-lg flex items-center">
                <FiCheckCircle className="mr-2" />
                Data backup completed successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportAndBackup;
