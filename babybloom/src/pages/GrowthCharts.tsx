import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FiPlus, FiCalendar, FiEdit3 } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTheme } from '../contexts/ThemeContext';
import { BsRulers, BsGraphUp } from 'react-icons/bs';
import { GiWeight } from 'react-icons/gi';
import { MdOutlineFace } from 'react-icons/md';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GrowthRecord {
  id: string;
  date: string;
  weight: number; // in kg
  height: number; // in cm
  headCircumference?: number; // in cm
  notes?: string;
}

interface StandardData {
  months: number[];
  p3: number[];
  p15: number[];
  p50: number[];
  p85: number[];
  p97: number[];
}

const GrowthCharts: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme: _ } = useTheme();
  const [childName, setChildName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'weight' | 'height' | 'head'>('weight');
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState<Omit<GrowthRecord, 'id'>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: 0,
    height: 0,
    headCircumference: 0,
    notes: ''
  });

  // Mock data - would come from API in real app
  useEffect(() => {
    // Set child info based on ID
    if (id === '1') {
      setChildName('Emma');
      setBirthDate(new Date('2023-06-15'));
      
      // Mock growth records
      const mockRecords: GrowthRecord[] = [
        {
          id: '1',
          date: '2023-06-15',
          weight: 3.5,
          height: 50,
          headCircumference: 35,
          notes: 'Birth measurements'
        },
        {
          id: '2',
          date: '2023-07-15',
          weight: 4.2,
          height: 53,
          headCircumference: 36.5,
          notes: '1-month checkup'
        },
        {
          id: '3',
          date: '2023-08-15',
          weight: 5.1,
          height: 56,
          headCircumference: 38,
          notes: '2-month checkup'
        },
        {
          id: '4',
          date: '2023-10-15',
          weight: 6.4,
          height: 61,
          headCircumference: 40,
          notes: '4-month checkup'
        },
        {
          id: '5',
          date: '2023-12-15',
          weight: 7.5,
          height: 65,
          headCircumference: 42,
          notes: '6-month checkup'
        },
        {
          id: '6',
          date: '2024-03-15',
          weight: 9.1,
          height: 72,
          headCircumference: 44.5,
          notes: '9-month checkup'
        }
      ];
      
      setRecords(mockRecords);
    } else if (id === '2') {
      setChildName('Noah');
      setBirthDate(new Date('2023-09-10'));
      
      // Mock growth records for Noah
      const mockRecords: GrowthRecord[] = [
        {
          id: '1',
          date: '2023-09-10',
          weight: 3.7,
          height: 51,
          headCircumference: 35.5,
          notes: 'Birth measurements'
        },
        {
          id: '2',
          date: '2023-10-10',
          weight: 4.5,
          height: 54,
          headCircumference: 37,
          notes: '1-month checkup'
        },
        {
          id: '3',
          date: '2023-11-10',
          weight: 5.3,
          height: 57.5,
          headCircumference: 38.5,
          notes: '2-month checkup'
        },
        {
          id: '4',
          date: '2024-01-10',
          weight: 6.8,
          height: 62.5,
          headCircumference: 40.5,
          notes: '4-month checkup'
        },
        {
          id: '5',
          date: '2024-03-10',
          weight: 8.0,
          height: 68,
          headCircumference: 43,
          notes: '6-month checkup'
        }
      ];
      
      setRecords(mockRecords);
    }
  }, [id]);

  // Mock WHO standard growth data
  const getStandardData = (metric: 'weight' | 'height' | 'head'): StandardData => {
    // These are simplified approximations of WHO growth standards
    // In a real app, these would be more comprehensive and accurate
    
    if (metric === 'weight') {
      return {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        p3: [2.5, 3.4, 4.3, 5.0, 5.6, 6.1, 6.4, 6.7, 7.0, 7.2, 7.4, 7.6, 7.7],
        p15: [2.9, 3.9, 4.9, 5.7, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.4, 8.6, 8.7],
        p50: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6],
        p85: [3.7, 5.0, 6.2, 7.0, 7.7, 8.2, 8.6, 9.0, 9.4, 9.7, 10.0, 10.2, 10.4],
        p97: [4.3, 5.8, 7.1, 8.0, 8.7, 9.3, 9.8, 10.2, 10.5, 10.9, 11.2, 11.5, 11.7]
      };
    } else if (metric === 'height') {
      return {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        p3: [46.0, 50.0, 53.0, 55.5, 57.5, 59.5, 61.0, 62.5, 64.0, 65.0, 66.0, 67.0, 68.0],
        p15: [47.5, 51.5, 54.5, 57.0, 59.0, 61.0, 62.5, 64.0, 65.5, 67.0, 68.0, 69.0, 70.0],
        p50: [49.9, 54.0, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.0, 71.3, 72.5, 73.5],
        p85: [51.5, 56.0, 59.5, 62.0, 64.5, 66.5, 68.5, 70.0, 71.5, 73.0, 74.5, 75.5, 77.0],
        p97: [53.0, 58.0, 61.5, 64.5, 67.0, 69.0, 71.0, 73.0, 74.5, 76.0, 77.5, 79.0, 80.0]
      };
    } else {
      return {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        p3: [32.0, 35.0, 36.5, 38.0, 39.0, 40.0, 41.0, 41.5, 42.0, 42.5, 43.0, 43.5, 44.0],
        p15: [33.0, 36.0, 37.5, 39.0, 40.0, 41.0, 42.0, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0],
        p50: [34.5, 37.3, 38.8, 40.0, 41.0, 42.0, 43.0, 43.6, 44.2, 44.7, 45.2, 45.6, 46.0],
        p85: [36.0, 38.5, 40.0, 41.0, 42.0, 43.0, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5, 47.0],
        p97: [37.0, 39.5, 41.0, 42.0, 43.0, 44.0, 45.0, 45.5, 46.0, 46.5, 47.0, 47.5, 48.0]
      };
    }
  };

  // Calculate age in months from birthdate
  const calculateAgeInMonths = (date: string): number => {
    if (!birthDate) return 0;
    
    const recordDate = new Date(date);
    const ageInMs = recordDate.getTime() - birthDate.getTime();
    const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
    return Math.round(ageInDays / 30.44); // average days in a month
  };

  // Prepare chart data
  const getChartData = () => {
    const standardData = getStandardData(activeTab);
    const metricKey = activeTab === 'weight' ? 'weight' : activeTab === 'height' ? 'height' : 'headCircumference';
    
    // Sort records by date
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const recordData = sortedRecords.map(record => ({
      x: calculateAgeInMonths(record.date),
      y: record[metricKey as keyof GrowthRecord] as number
    }));
    
    return {
      labels: standardData.months,
      datasets: [
        {
          label: '3rd Percentile',
          data: standardData.p3.map((value, index) => ({ x: standardData.months[index], y: value })),
          borderColor: 'rgba(220, 220, 220, 0.6)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 1,
          pointRadius: 0,
          borderDash: [5, 5]
        },
        {
          label: '15th Percentile',
          data: standardData.p15.map((value, index) => ({ x: standardData.months[index], y: value })),
          borderColor: 'rgba(180, 180, 180, 0.6)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 1,
          pointRadius: 0,
          borderDash: [3, 3]
        },
        {
          label: '50th Percentile',
          data: standardData.p50.map((value, index) => ({ x: standardData.months[index], y: value })),
          borderColor: 'rgba(130, 130, 130, 0.8)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: '85th Percentile',
          data: standardData.p85.map((value, index) => ({ x: standardData.months[index], y: value })),
          borderColor: 'rgba(180, 180, 180, 0.6)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 1,
          pointRadius: 0,
          borderDash: [3, 3]
        },
        {
          label: '97th Percentile',
          data: standardData.p97.map((value, index) => ({ x: standardData.months[index], y: value })),
          borderColor: 'rgba(220, 220, 220, 0.6)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 1,
          pointRadius: 0,
          borderDash: [5, 5]
        },
        {
          label: `${childName}'s Growth`,
          data: recordData,
          borderColor: activeTab === 'weight' 
            ? 'rgba(255, 126, 95, 1)'  // Orange for weight
            : activeTab === 'height' 
              ? 'rgba(111, 166, 239, 1)'  // Blue for height
              : 'rgba(154, 106, 255, 1)',  // Purple for head
          backgroundColor: activeTab === 'weight'
            ? 'rgba(255, 126, 95, 0.2)'
            : activeTab === 'height'
              ? 'rgba(111, 166, 239, 0.2)'
              : 'rgba(154, 106, 255, 0.2)',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 9,
          tension: 0.3,
          fill: true
        }
      ]
    };
  };

  // Chart options
  const getChartOptions = () => {
    const yLabel = activeTab === 'weight' 
      ? 'Weight (kg)' 
      : activeTab === 'height'
        ? 'Height (cm)'
        : 'Head Circumference (cm)';
        
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Age (months)',
            font: {
              family: "'Nunito', sans-serif",
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              family: "'Nunito', sans-serif"
            }
          }
        },
        y: {
          title: {
            display: true,
            text: yLabel,
            font: {
              family: "'Nunito', sans-serif",
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              family: "'Nunito', sans-serif"
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              family: "'Nunito', sans-serif",
              size: 11
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#555',
          titleFont: {
            family: "'Nunito', sans-serif",
            size: 12,
            weight: "bold" as const
          },
          bodyFont: {
            family: "'Nunito', sans-serif",
            size: 11
          },
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          cornerRadius: 10,
          boxPadding: 4,
          callbacks: {
            label: function(context: any) {
              return `${context.dataset.label}: ${context.raw.y}`;
            }
          }
        }
      }
    };
  };

  // Handle adding a new growth record
  const handleAddRecord = () => {
    const newId = (Math.max(...records.map(r => parseInt(r.id))) + 1).toString();
    
    setRecords([
      ...records,
      {
        id: newId,
        ...newRecord
      }
    ]);
    
    setShowAddForm(false);
    setNewRecord({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: 0,
      height: 0,
      headCircumference: 0,
      notes: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setNewRecord({
      ...newRecord,
      [name]: name === 'notes' ? value : parseFloat(value)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg baby-pattern-dots pb-16">
      
      <div className="p-5 max-w-3xl mx-auto">
        {/* Tab Navigation */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-soft p-3 mb-6">
          <div className="flex">
            <button 
              className={`flex-1 py-3 px-2 text-center rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'weight' 
                ? 'bg-gradient-to-r from-orange-300 to-orange-400 text-white shadow-glow' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-orange-400 dark:hover:text-orange-300 hover:-translate-y-0.5 active:translate-y-0'
              }`}
              onClick={() => setActiveTab('weight')}
            >
              <GiWeight className={`${activeTab === 'weight' ? 'text-white animate-pulse-gentle' : 'text-orange-400'}`} />
              <span>Weight</span>
            </button>
            <button 
              className={`flex-1 py-3 px-2 mx-2 text-center rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'height' 
                ? 'bg-gradient-to-r from-blue-300 to-blue-400 text-white shadow-glow' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-400 dark:hover:text-blue-300 hover:-translate-y-0.5 active:translate-y-0'
              }`}
              onClick={() => setActiveTab('height')}
            >
              <BsRulers className={`${activeTab === 'height' ? 'text-white animate-pulse-gentle' : 'text-blue-400'}`} />
              <span>Height</span>
            </button>
            <button 
              className={`flex-1 py-3 px-2 text-center rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'head' 
                ? 'bg-gradient-to-r from-purple-300 to-purple-400 text-white shadow-glow' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-400 dark:hover:text-purple-300 hover:-translate-y-0.5 active:translate-y-0'
              }`}
              onClick={() => setActiveTab('head')}
            >
              <MdOutlineFace className={`${activeTab === 'head' ? 'text-white animate-pulse-gentle' : 'text-purple-400'}`} />
              <span>Head</span>
            </button>
          </div>
        </div>
        
        {/* Growth Chart */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-soft hover:shadow-elevated transition-all duration-300 p-5 mb-6 animate-fade-in">
          <div className="mb-3">
            <h2 className={`text-xl font-display font-bold bg-gradient-to-r ${
              activeTab === 'weight' 
                ? 'from-orange-500 to-orange-300' 
                : activeTab === 'height' 
                  ? 'from-blue-500 to-blue-300' 
                  : 'from-purple-500 to-purple-300'
            } bg-clip-text text-transparent`}>
              {activeTab === 'weight' 
                ? 'Weight Chart' 
                : activeTab === 'height' 
                  ? 'Height Chart' 
                  : 'Head Circumference Chart'}
            </h2>
          </div>
          <div className="h-72 md:h-96 bg-gray-50 dark:bg-dark-bg p-3 rounded-lg shadow-inner">
            <Line data={getChartData()} options={getChartOptions()} />
          </div>
          <div className="flex justify-center mt-3">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 py-1 px-3 rounded-full">
              <BsGraphUp className="inline mr-1" />
              Chart displays WHO growth standards percentiles
            </p>
          </div>
        </div>
        
        {/* Add New Measurement Button */}
        {!showAddForm && (
          <button 
            className="bg-gradient-to-r from-primary to-primary-light text-white py-3 px-4 rounded-xl mb-6 w-full flex items-center justify-center shadow-soft hover:shadow-glow transition-all hover:-translate-y-1 active:translate-y-0"
            onClick={() => setShowAddForm(true)}
          >
            <FiPlus className="mr-2" />
            Add New Measurement
          </button>
        )}
        
        {/* Add New Measurement Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-soft hover:shadow-elevated transition-all duration-300 p-6 mb-6 animate-fade-in">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center mr-3 shadow-glow">
                <FiEdit3 className="text-white animate-pulse-gentle" />
              </div>
              <h3 className="font-display font-bold text-xl bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">New Measurement</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  <FiCalendar className="inline mr-2 text-primary" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={newRecord.date}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  <GiWeight className="inline mr-2 text-orange-400" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={newRecord.weight || ''}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  <BsRulers className="inline mr-2 text-blue-400" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={newRecord.height || ''}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  <MdOutlineFace className="inline mr-2 text-purple-400" />
                  Head Circumference (cm)
                </label>
                <input
                  type="number"
                  name="headCircumference"
                  value={newRecord.headCircumference || ''}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={newRecord.notes || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  rows={2}
                  placeholder="Optional notes about this measurement"
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button 
                  className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-glow transition-all flex-1 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center"
                  onClick={handleAddRecord}
                >
                  <FiPlus className="mr-2" />
                  Save Measurement
                </button>
                <button 
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:shadow-soft transition-all hover:-translate-y-1 active:translate-y-0"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Measurement History */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-soft hover:shadow-elevated transition-all duration-300 p-6 mb-5">
          <h3 className="font-display font-bold text-xl bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4 flex items-center">
            <FiCalendar className="mr-2 text-primary" />
            Measurement History
          </h3>
          
          <div className="space-y-4">
            {records.length > 0 ? (
              [...records]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record, index) => (
                  <div 
                    key={record.id} 
                    className="border-b border-gray-100 dark:border-gray-700 pb-4 animate-fade-in-up hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-all"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-display font-bold text-gray-800 dark:text-white">
                        {format(parseISO(record.date), 'MMMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full shadow-soft">
                        {calculateAgeInMonths(record.date)} months old
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg shadow-soft">
                        <div className="text-sm text-orange-500 dark:text-orange-300 font-medium flex items-center">
                          <GiWeight className="mr-1" />
                          Weight
                        </div>
                        <div className="font-medium text-gray-800 dark:text-white mt-1">{record.weight} kg</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg shadow-soft">
                        <div className="text-sm text-blue-500 dark:text-blue-300 font-medium flex items-center">
                          <BsRulers className="mr-1" />
                          Height
                        </div>
                        <div className="font-medium text-gray-800 dark:text-white mt-1">{record.height} cm</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg shadow-soft">
                        <div className="text-sm text-purple-500 dark:text-purple-300 font-medium flex items-center">
                          <MdOutlineFace className="mr-1" />
                          Head
                        </div>
                        <div className="font-medium text-gray-800 dark:text-white mt-1">{record.headCircumference} cm</div>
                      </div>
                    </div>
                    
                    {record.notes && (
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-inner">
                        {record.notes}
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-soft">
                  <BsGraphUp className="text-2xl text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">No measurements recorded yet</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="text-primary dark:text-primary-light hover:underline inline-flex items-center hover:text-primary-dark transition-colors"
                >
                  <FiPlus className="mr-1" /> Add your first measurement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthCharts;
