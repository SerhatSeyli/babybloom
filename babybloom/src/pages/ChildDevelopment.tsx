import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface DevelopmentFact {
  category: 'physical' | 'cognitive' | 'social';
  facts: string[];
}

interface ActivitySuggestion {
  description: string;
}

const ChildDevelopment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(10); // Age in months
  const [activeCategory, setActiveCategory] = useState<'physical' | 'cognitive' | 'social'>('physical');
  
  // Mock data for development facts and activities
  const [developmentFacts, setDevelopmentFacts] = useState<DevelopmentFact[]>([]);
  const [activities, setActivities] = useState<ActivitySuggestion[]>([]);

  useEffect(() => {
    // Set child name and age based on ID
    if (id === '1') {
      setChildName('Emma');
      setChildAge(10); // 10 months old
    } else if (id === '2') {
      setChildName('Noah');
      setChildAge(24); // 2 years old
    }

    // 10-month development facts
    const tenMonthDevelopmentFacts: DevelopmentFact[] = [
      {
        category: 'physical',
        facts: [
          'Can sit without support',
          'May start crawling or scooting',
          'Can transfer objects from one hand to another',
          'May pull to stand with support',
          'May take a few steps while holding onto furniture'
        ]
      },
      {
        category: 'cognitive',
        facts: [
          'Explores objects by putting them in mouth',
          'Looks for hidden objects when dropped',
          'Responds to simple verbal requests',
          'Makes specific sounds like "mama" and "dada"',
          'Points at objects of interest'
        ]
      },
      {
        category: 'social',
        facts: [
          'Shows stranger anxiety',
          'Plays interactive games like peek-a-boo',
          'May be clingy with familiar adults',
          'Shows specific preferences for people',
          'Expresses emotions like joy and sadness clearly'
        ]
      }
    ];

    // 10-month activities
    const tenMonthActivities: ActivitySuggestion[] = [
      { description: 'Play peek-a-boo to help develop object permanence' },
      { description: 'Read simple board books together daily' },
      { description: 'Provide safe spaces for crawling and exploring' },
      { description: 'Sing songs with hand motions to encourage coordination' },
      { description: 'Practice standing while holding onto furniture' },
      { description: 'Introduce finger foods to develop pincer grasp' }
    ];

    setDevelopmentFacts(tenMonthDevelopmentFacts);
    setActivities(tenMonthActivities);
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Development" showBackButton={true} />
      
      <div className="p-4">
        {/* Development Facts */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-2">Development Facts: {childAge} months</h2>
            <p className="text-sm text-gray-600 mb-4">What to expect at this age. Every child develops at their own pace.</p>
            
            <div className="flex space-x-2 border-b border-gray-200 mb-4">
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeCategory === 'physical' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
                onClick={() => setActiveCategory('physical')}
              >
                Physical
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeCategory === 'cognitive' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
                onClick={() => setActiveCategory('cognitive')}
              >
                Cognitive
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeCategory === 'social' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
                onClick={() => setActiveCategory('social')}
              >
                Social
              </button>
            </div>
            
            <ul className="space-y-2">
              {developmentFacts
                .find(fact => fact.category === activeCategory)?.facts
                .map((fact, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2 text-lg">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        
        {/* Activity Suggestions */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-2">Activities to Try</h2>
            <p className="text-sm text-gray-600 mb-4">Fun activities that support your child's development</p>
            
            <ul className="space-y-2">
              {activities.map((activity, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2 text-lg">•</span>
                  <span>{activity.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildDevelopment;
