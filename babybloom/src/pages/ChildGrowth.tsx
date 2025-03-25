import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { format, parseISO } from 'date-fns';
import { FiPlus } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GrowthRecord {
  date: string;
  weight: number; // in kg
  height: number; // in cm
  headCircumference: number; // in cm
}

const ChildGrowth: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [childName, setChildName] = useState('');
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'weight' | 'height' | 'head'>('weight');
  
  // State for new growth record form
  const [showForm, setShowForm] = useState(false);
  const [newRecord, setNewRecord] = useState<GrowthRecord>({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: 0,
    height: 0,
    headCircumference: 0
  });

  // Mock data - would come from API in real app
  useEffect(() => {
    // Set child name based on ID
    if (id === '1') {
      setChildName('Emma');
    } else if (id === '2') {
      setChildName('Noah');
    }

    // Fetch growth records from API
    // For now, using mock data
    const mockGrowthRecords: GrowthRecord[] = [
      {
        date: '2023-10-01',
        weight: 3.5,
        height: 50,
        headCircumference: 35
      },
      {
        date: '2023-11-01',
        weight: 4.2,
        height: 53,
        headCircumference: 36.5
      },
      {
        date: '2023-12-01',
        weight: 5.1,
        height: 56,
        headCircumference: 38
      },
      {
        date: '2024-01-01',
        weight: 5.8,
        height: 58.5,
        headCircumference: 39.5
      },
      {
        date: '2024-02-01',
        weight: 6.3,
        height: 61,
        headCircumference: 40.5
      },
      {
        date: '2024-03-01',
        weight: 6.9,
        height: 63.5,
        headCircumference: 41.5
      }
    ];

    setGrowthRecords(mockGrowthRecords);
  }, [id]);

  // Prepare chart data
  const chartData = {
    labels: growthRecords.map(record => format(parseISO(record.date), 'MMM d, yyyy')),
    datasets: [
      {
        label: activeTab === 'weight' ? 'Weight (kg)' : 
               activeTab === 'height' ? 'Height (cm)' : 
               'Head Circumference (cm)',
        data: growthRecords.map(record => 
          activeTab === 'weight' ? record.weight : 
          activeTab === 'height' ? record.height : 
          record.height
        ),
        borderColor: activeTab === 'weight' ? 'rgb(53, 162, 235)' : 
                     activeTab === 'height' ? 'rgb(75, 192, 192)' : 
                     'rgb(255, 99, 132)',
        backgroundColor: activeTab === 'weight' ? 'rgba(53, 162, 235, 0.5)' : 
                         activeTab === 'height' ? 'rgba(75, 192, 192, 0.5)' : 
                         'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${childName}'s Growth Chart: ${
          activeTab === 'weight' ? 'Weight' : 
          activeTab === 'height' ? 'Height' : 
          'Head Circumference'
        }`,
      },
    },
  };

  const handleRecordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({
      ...prev,
      [name]: name === 'date' ? value : parseFloat(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add new record to the list
    setGrowthRecords(prev => [...prev, newRecord].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
    
    // Reset form
    setNewRecord({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: 0,
      height: 0,
      headCircumference: 0
    });
    
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showBackButton={true} />
      
      <div className="p-4">
        {/* Growth Chart Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          <div className="flex divide-x divide-gray-200">
            <button 
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === 'weight' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('weight')}
            >
              Weight
            </button>
            <button 
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === 'height' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('height')}
            >
              Height
            </button>
            <button 
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === 'head' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('head')}
            >
              Head
            </button>
          </div>
        </div>
        
        {/* Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Line options={chartOptions} data={chartData} />
        </div>
        
        {/* Growth Records Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-20">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium">Growth Records</h3>
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center text-primary"
            >
              <FiPlus className="mr-1" /> Add Record
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height (cm)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {growthRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">{format(parseISO(record.date), 'MMM d, yyyy')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{record.weight}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{record.height}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{record.headCircumference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add Record Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4">
            <h3 className="text-xl font-medium mb-4">Add Growth Record</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    name="date"
                    value={newRecord.date}
                    onChange={handleRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input 
                    type="number"
                    name="weight"
                    step="0.1"
                    min="0"
                    value={newRecord.weight || ''}
                    onChange={handleRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input 
                    type="number"
                    name="height"
                    step="0.1"
                    min="0"
                    value={newRecord.height || ''}
                    onChange={handleRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Head Circumference (cm)</label>
                  <input 
                    type="number"
                    name="headCircumference"
                    step="0.1"
                    min="0"
                    value={newRecord.headCircumference || ''}
                    onChange={handleRecordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
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

export default ChildGrowth;
