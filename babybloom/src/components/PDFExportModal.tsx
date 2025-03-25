import React, { useState } from 'react';
import { format, subMonths } from 'date-fns';
import { FiX, FiMail, FiDownload, FiCheck, FiCalendar } from 'react-icons/fi';
import EmailPreviewModal from './EmailPreviewModal';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
  childName: string;
  childAge?: string;
  childDateOfBirth?: string;
}

// Sample milestone data for demonstration
const getSampleMilestones = () => {
  const today = new Date();
  return [
    {
      date: subMonths(today, 4),
      description: "First smile"
    },
    {
      date: subMonths(today, 3),
      description: "Rolled over"
    },
    {
      date: subMonths(today, 2),
      description: "Started babbling"
    },
    {
      date: subMonths(today, 1),
      description: "Sat up unassisted"
    },
    {
      date: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      description: "First steps with support"
    }
  ];
};

// Sample growth data for demonstration
const getSampleGrowthData = () => {
  const today = new Date();
  return [
    {
      date: subMonths(today, 4),
      weight: 4.2,
      height: 52.3,
      headCircumference: 36.1
    },
    {
      date: subMonths(today, 3),
      weight: 5.1,
      height: 55.8,
      headCircumference: 37.2
    },
    {
      date: subMonths(today, 2),
      weight: 5.8,
      height: 58.4,
      headCircumference: 38.5
    },
    {
      date: subMonths(today, 1),
      weight: 6.5,
      height: 61.2,
      headCircumference: 39.4
    },
    {
      date: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      weight: 7.1,
      height: 63.1,
      headCircumference: 40.2
    }
  ];
};

// Sample appointment data
const getSampleAppointments = () => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 14);
  
  return [
    {
      date: subMonths(today, 3),
      type: "Well-baby checkup",
      notes: "All measurements within normal range"
    },
    {
      date: subMonths(today, 2),
      type: "Vaccination",
      notes: "2-month vaccines completed"
    },
    {
      date: subMonths(today, 1),
      type: "Well-baby checkup",
      notes: "Slight diaper rash, prescribed cream"
    },
    {
      date: futureDate,
      type: "6-month checkup",
      notes: "Scheduled for vaccinations"
    }
  ];
};

const PDFExportModal: React.FC<PDFExportModalProps> = ({ 
  isOpen, 
  onClose, 
  childId, 
  childName,
  childAge,
  childDateOfBirth
}) => {
  const [exportOptions, setExportOptions] = useState({
    includeMilestones: true,
    includeGrowth: true,
    includePhotos: false,
    includeAppointments: true,
    period: 'last3Months',
    email: '',
    enableAutoExport: false
  });
  
  const [loading, setLoading] = useState(false);
  // Remove the unused variable but keep setSuccess since it might be used
  const [, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState<'options' | 'preview' | 'success'>('options');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  
  const getPeriodText = (): string => {
    switch(exportOptions.period) {
      case 'lastMonth':
        return 'Last Month';
      case 'last3Months':
        return 'Last 3 Months';
      case 'last6Months':
        return 'Last 6 Months';
      case 'lastYear':
        return 'Last Year';
      case 'allTime':
        return 'All Time';
      default:
        return 'Custom Period';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setExportOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      const childData = {
        id: childId,
        name: childName,
        age: childAge || '10 months',
        dateOfBirth: childDateOfBirth || format(subMonths(new Date(), 10), 'yyyy-MM-dd'),
        milestones: getSampleMilestones(),
        measurements: getSampleGrowthData(),
        appointments: getSampleAppointments(),
        photos: Array(12).fill(0).map((_, i) => ({
          url: 'sample-url',
          caption: `${childName}'s special moment`,
          date: subMonths(new Date(), i % 5)
        }))
      };
      
      const today = new Date();
      let startDate;
      
      switch(exportOptions.period) {
        case 'lastMonth':
          startDate = subMonths(today, 1);
          break;
        case 'last3Months':
          startDate = subMonths(today, 3);
          break;
        case 'last6Months':
          startDate = subMonths(today, 6);
          break;
        case 'lastYear':
          startDate = subMonths(today, 12);
          break;
        case 'allTime':
          startDate = undefined; // From birth
          break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Generating PDF from', startDate, 'with child data', childData);
      
      setPreviewImage('/pdf-preview.jpg');
      setActiveStep('preview');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendEmail = async () => {
    if (!exportOptions.email) {
      alert('Please enter an email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowEmailPreview(true);
      
      setSuccess(true);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setActiveStep('success');
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setActiveStep('options');
    setSuccess(false);
    setPreviewImage(null);
    setShowEmailPreview(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {activeStep === 'options' && 'Export Memory PDF'}
              {activeStep === 'preview' && 'PDF Preview'}
              {activeStep === 'success' && 'Success!'}
            </h2>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="p-5">
            {activeStep === 'options' && (
              <>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create a beautiful PDF document of {childName}'s development journey that you can save or email to yourself.
                </p>
                
                <div className="mb-4">
                  <label className="font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Time Period
                  </label>
                  <select 
                    name="period"
                    value={exportOptions.period}
                    onChange={(e) => setExportOptions({...exportOptions, period: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    <option value="lastMonth">Last Month</option>
                    <option value="last3Months">Last 3 Months</option>
                    <option value="last6Months">Last 6 Months</option>
                    <option value="lastYear">Last Year</option>
                    <option value="allTime">All Time</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Include in PDF
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        id="includeMilestones"
                        name="includeMilestones"
                        checked={exportOptions.includeMilestones}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-500"
                      />
                      <label htmlFor="includeMilestones" className="ml-2 text-gray-700 dark:text-gray-300">
                        Development Milestones
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        id="includeGrowth"
                        name="includeGrowth"
                        checked={exportOptions.includeGrowth}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-500"
                      />
                      <label htmlFor="includeGrowth" className="ml-2 text-gray-700 dark:text-gray-300">
                        Growth Measurements
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        id="includeAppointments"
                        name="includeAppointments"
                        checked={exportOptions.includeAppointments}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-500"
                      />
                      <label htmlFor="includeAppointments" className="ml-2 text-gray-700 dark:text-gray-300">
                        Medical Appointments
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        id="includePhotos"
                        name="includePhotos"
                        checked={exportOptions.includePhotos}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-500"
                      />
                      <label htmlFor="includePhotos" className="ml-2 text-gray-700 dark:text-gray-300">
                        Photo References
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Email (Optional)
                  </label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    value={exportOptions.email}
                    onChange={handleChange}
                    placeholder="Enter your email to receive the PDF"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <FiCalendar className="text-primary text-xl mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <label htmlFor="enableAutoExport" className="font-medium text-gray-800 dark:text-gray-200 cursor-pointer">
                            Automatic Monthly Memory Reports
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            We'll generate and email this report on the 1st of each month
                          </p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          id="enableAutoExport"
                          name="enableAutoExport"
                          checked={exportOptions.enableAutoExport}
                          onChange={handleChange}
                          className="opacity-0 w-0 h-0"
                        />
                        <label
                          htmlFor="enableAutoExport"
                          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                            exportOptions.enableAutoExport ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span 
                            className={`absolute w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                              exportOptions.enableAutoExport ? 'left-7' : 'left-1'
                            }`}
                            style={{ top: '4px', transform: exportOptions.enableAutoExport ? 'translateX(-4px)' : 'none' }}
                          ></span>
                        </label>
                      </div>
                    </div>
                    {exportOptions.enableAutoExport && !exportOptions.email && (
                      <p className="mt-2 text-xs text-red-500">
                        Please enter an email address above to enable automatic reports.
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-3 px-4 gradient-blue text-white rounded-lg font-medium flex items-center justify-center"
                >
                  {loading ? 'Generating...' : 'Generate PDF'}
                </button>
              </>
            )}
            
            {activeStep === 'preview' && (
              <>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 mb-4 aspect-[3/4] flex items-center justify-center">
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4 overflow-hidden">
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-blue-600">{childName}'s Development Report</h3>
                          <p className="text-sm text-gray-500">
                            {getPeriodText()}
                          </p>
                        </div>
                        
                        <div className="w-full mb-4">
                          <h4 className="text-sm font-bold text-blue-600 mb-1">Child Information</h4>
                          <div className="text-xs text-gray-700 border-b pb-2">
                            <div>Name: {childName}</div>
                            <div>Age: {childAge || '10 months'}</div>
                            {childDateOfBirth && <div>Date of Birth: {childDateOfBirth}</div>}
                          </div>
                        </div>
                        
                        {exportOptions.includeMilestones && (
                          <div className="w-full mb-4">
                            <h4 className="text-sm font-bold text-blue-600 mb-1">Developmental Milestones</h4>
                            <div className="text-xs text-gray-700 border-b pb-2">
                              <div className="flex justify-between">
                                <span>1 month ago:</span>
                                <span>Sat up unassisted</span>
                              </div>
                              <div className="flex justify-between">
                                <span>2 months ago:</span>
                                <span>Started babbling</span>
                              </div>
                              <div className="flex justify-between">
                                <span>10 days ago:</span>
                                <span>First steps with support</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {exportOptions.includeGrowth && (
                          <div className="w-full mb-4">
                            <h4 className="text-sm font-bold text-blue-600 mb-1">Growth Measurements</h4>
                            <div className="text-xs text-gray-700 border-b pb-2">
                              <div className="grid grid-cols-4 gap-1">
                                <span>Date</span>
                                <span>Weight</span>
                                <span>Height</span>
                                <span>Head</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1">
                                <span>10 days ago</span>
                                <span>7.1 kg</span>
                                <span>63.1 cm</span>
                                <span>40.2 cm</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1">
                                <span>1 month ago</span>
                                <span>6.5 kg</span>
                                <span>61.2 cm</span>
                                <span>39.4 cm</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {exportOptions.includeAppointments && (
                          <div className="w-full mb-4">
                            <h4 className="text-sm font-bold text-blue-600 mb-1">Medical Appointments</h4>
                            <div className="text-xs text-gray-700">
                              <div className="grid grid-cols-5 gap-1">
                                <span className="col-span-2">Date</span>
                                <span className="col-span-3">Type</span>
                              </div>
                              <div className="grid grid-cols-5 gap-1">
                                <span className="col-span-2">1 month ago</span>
                                <span className="col-span-3">Well-baby checkup</span>
                              </div>
                              <div className="grid grid-cols-5 gap-1">
                                <span className="col-span-2">2 months ago</span>
                                <span className="col-span-3">Vaccination</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-center text-gray-500 mt-auto">
                          Generated by BabyBloom App
                          <div>{format(new Date(), 'MMM d, yyyy')}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-center">
                      Generating preview...
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  {exportOptions.email && (
                    <button
                      onClick={handleSendEmail}
                      disabled={loading}
                      className="flex-1 py-3 px-4 gradient-blue text-white rounded-lg font-medium flex items-center justify-center"
                    >
                      {loading ? 'Sending...' : (
                        <>
                          <FiMail className="mr-2" />
                          Email PDF
                        </>
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={handleDownload}
                    disabled={loading}
                    className={`${exportOptions.email ? 'flex-1' : 'w-full'} py-3 px-4 gradient-mint text-white rounded-lg font-medium flex items-center justify-center`}
                  >
                    {loading ? 'Downloading...' : (
                      <>
                        <FiDownload className="mr-2" />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
            
            {activeStep === 'success' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 gradient-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-white text-2xl" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {exportOptions.email ? 'Email Sent!' : 'Download Complete!'}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {exportOptions.email 
                    ? `The PDF has been sent to ${exportOptions.email}. Please check your inbox!`
                    : `The PDF has been downloaded successfully.`
                  }
                </p>
                
                <button
                  onClick={handleClose}
                  className="w-full py-3 px-4 gradient-blue text-white rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <EmailPreviewModal 
        isOpen={showEmailPreview}
        onClose={() => {
          setShowEmailPreview(false);
          setActiveStep('success');
        }}
        childName={childName}
        emailAddress={exportOptions.email}
        reportPeriod={getPeriodText()}
      />
    </>
  );
};

export default PDFExportModal;
