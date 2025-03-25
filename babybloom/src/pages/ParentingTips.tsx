import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { differenceInMonths } from 'date-fns';
import { FiChevronDown, FiChevronUp, FiInfo, FiBriefcase, FiMoon, FiPackage, FiHeart, FiTarget } from 'react-icons/fi';

interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  image?: string;
}

interface TipCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface ParentingTip {
  id: string;
  category: string;
  title: string;
  content: string;
  ageRange: {
    min: number; // in months
    max: number; // in months
  };
}

interface BabyFact {
  id: string;
  title: string;
  content: string;
  ageRange: {
    min: number; // in months
    max: number; // in months
  };
}

const ParentingTips: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [ageInMonths, setAgeInMonths] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});
  const [showFacts, setShowFacts] = useState<boolean>(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('1');

  useEffect(() => {
    // Mock children data
    const mockChildren: Child[] = [
      {
        id: '1',
        name: 'Emma',
        birthDate: '2023-06-15',
        gender: 'female',
        image: 'https://via.placeholder.com/150'
      },
      {
        id: '2',
        name: 'Noah',
        birthDate: '2024-01-10',
        gender: 'male',
        image: 'https://via.placeholder.com/150'
      }
    ];
    
    setChildren(mockChildren);
    
    const selectedChild = id ? 
      mockChildren.find(c => c.id === id) : 
      mockChildren.find(c => c.id === selectedChildId) || mockChildren[0];
    
    if (selectedChild) {
      setChild(selectedChild);
      setSelectedChildId(selectedChild.id);
      
      if (selectedChild.birthDate) {
        const birthDate = new Date(selectedChild.birthDate);
        const today = new Date();
        const months = differenceInMonths(today, birthDate);
        setAgeInMonths(months);
      }
    }
  }, [id, selectedChildId]);

  const handleChildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChildId(e.target.value);
  };

  const tipCategories: TipCategory[] = [
    {
      id: 'growth',
      title: 'Growth & Development',
      icon: <FiTarget />,
      description: 'Physical and cognitive milestones for your baby\'s age'
    },
    {
      id: 'sleep',
      title: 'Sleep Patterns',
      icon: <FiMoon />,
      description: 'Recommended sleep schedules and routines'
    },
    {
      id: 'feeding',
      title: 'Feeding Recommendations',
      icon: <FiPackage />,
      description: 'Nutrition guidance and feeding suggestions'
    },
    {
      id: 'health',
      title: 'Health & Safety',
      icon: <FiHeart />,
      description: 'Common health concerns and safety tips'
    },
    {
      id: 'play',
      title: 'Play & Learning',
      icon: <FiBriefcase />,
      description: 'Age-appropriate activities to stimulate development'
    }
  ];

  const parentingTips: ParentingTip[] = [
    // Growth & Development Tips
    {
      id: '1',
      category: 'growth',
      title: 'Head Control',
      content: 'Your baby is developing better head control now. When placed on their tummy, they might be able to lift their head and chest off the floor, using their arms for support. This is an important milestone for physical development and precedes sitting and crawling.',
      ageRange: { min: 2, max: 4 }
    },
    {
      id: '2',
      category: 'growth',
      title: 'Hand-Eye Coordination',
      content: 'Your baby is beginning to develop hand-eye coordination. They may swipe at objects hanging in front of them and might start to bring their hands to their mouth intentionally. Encourage this development with colorful toys within their reach.',
      ageRange: { min: 2, max: 5 }
    },
    {
      id: '3',
      category: 'growth',
      title: 'First Tooth',
      content: 'Many babies get their first tooth around this time, though it can vary widely. Signs of teething include drooling, irritability, and a desire to chew on hard objects. Provide clean teething toys and comfort as needed.',
      ageRange: { min: 4, max: 7 }
    },
    {
      id: '4',
      category: 'growth',
      title: 'Starting to Sit',
      content: 'Around this age, your baby may start to sit with support. Their back and neck are getting stronger, which is essential for this milestone. You can help by providing brief periods of supported sitting practice.',
      ageRange: { min: 4, max: 7 }
    },
    {
      id: '5',
      category: 'growth',
      title: 'Crawling Preparation',
      content: 'Your baby may start rocking back and forth on all fours, which is preparation for crawling. This important movement helps strengthen the muscles needed for mobility. Provide plenty of supervised tummy time to encourage this development.',
      ageRange: { min: 6, max: 9 }
    },
    {
      id: '6',
      category: 'growth',
      title: 'First Steps',
      content: 'Many babies take their first steps between 9-12 months. Before walking independently, babies often "cruise" by holding onto furniture. Provide stable objects for cruising and celebrate these early mobility milestones!',
      ageRange: { min: 9, max: 14 }
    },
    {
      id: '7',
      category: 'growth',
      title: 'First Words',
      content: 'Around this time, your baby may say their first recognizable word. Continue talking, reading, and singing to your baby to support language development. Respond enthusiastically to their communication attempts.',
      ageRange: { min: 10, max: 14 }
    },
    
    // Sleep Pattern Tips
    {
      id: '8',
      category: 'sleep',
      title: 'Sleep Duration',
      content: 'At this age, babies typically need 14-17 hours of sleep in a 24-hour period, including naps. Most babies take 3-4 naps per day, which will gradually decrease as they get older.',
      ageRange: { min: 0, max: 3 }
    },
    {
      id: '9',
      category: 'sleep',
      title: 'Sleep Regression',
      content: 'Around 4 months, many babies experience sleep regression due to cognitive developments and changing sleep cycles. This is normal but can be challenging. Maintain consistent bedtime routines to help them through this phase.',
      ageRange: { min: 3, max: 5 }
    },
    {
      id: '10',
      category: 'sleep',
      title: 'Nap Transitions',
      content: 'Your baby may be transitioning from 3-4 naps to 2-3 naps per day. Morning and afternoon naps become more predictable. A consistent nap schedule can help your baby sleep better at night.',
      ageRange: { min: 4, max: 8 }
    },
    {
      id: '11',
      category: 'sleep',
      title: 'Nighttime Sleep Consolidation',
      content: 'Many babies begin to sleep for longer stretches at night, with some sleeping 6 hours or more. A bedtime routine helps signal that it\'s time to sleep. Consider a warm bath, story, or gentle lullaby before bed.',
      ageRange: { min: 6, max: 9 }
    },
    {
      id: '12',
      category: 'sleep',
      title: 'Two-Nap Schedule',
      content: 'Around this age, most babies transition to two naps - one in the morning and one in the afternoon. This is a good time to ensure the sleep environment is conducive to longer naps (dark room, white noise if helpful).',
      ageRange: { min: 7, max: 10 }
    },
    
    // Feeding Recommendations
    {
      id: '13',
      category: 'feeding',
      title: 'Exclusive Breastfeeding/Formula',
      content: 'Breast milk or formula should be your baby\'s sole source of nutrition until about 6 months. At this age, babies typically feed every 2-3 hours, though this can vary widely.',
      ageRange: { min: 0, max: 6 }
    },
    {
      id: '14',
      category: 'feeding',
      title: 'Introduction to Solids',
      content: 'Around 6 months, you can begin introducing solid foods while continuing breast milk or formula. Start with single-ingredient purees like iron-fortified rice cereal, pureed fruits or vegetables. Introduce new foods one at a time to watch for allergic reactions.',
      ageRange: { min: 5, max: 7 }
    },
    {
      id: '15',
      category: 'feeding',
      title: 'Advancing Textures',
      content: 'As your baby grows, they can handle more texture in their food. You can move from smooth purees to mashed and then small, soft pieces. This helps develop their oral motor skills and prepares them for table foods.',
      ageRange: { min: 7, max: 9 }
    },
    {
      id: '16',
      category: 'feeding',
      title: 'Self-Feeding Practice',
      content: 'Around this age, babies show interest in feeding themselves. Offer appropriate finger foods like small pieces of soft fruits, well-cooked vegetables, or pasta. This helps develop fine motor skills and independence.',
      ageRange: { min: 8, max: 12 }
    },
    {
      id: '17',
      category: 'feeding',
      title: 'Cup Introduction',
      content: 'You can begin introducing a sippy cup with a small amount of water. This helps with the transition from bottle or breast and develops new skills. Hold the cup to help them at first.',
      ageRange: { min: 6, max: 12 }
    },
    
    // Health & Safety Tips
    {
      id: '18',
      category: 'health',
      title: 'Vaccinations',
      content: 'Important vaccinations are scheduled at 2, 4, and 6 months. These protect against serious childhood diseases. Temporary side effects may include fussiness or low-grade fever. Contact your doctor if you have concerns.',
      ageRange: { min: 1, max: 7 }
    },
    {
      id: '19',
      category: 'health',
      title: 'Babyproofing',
      content: 'As your baby becomes more mobile, babyproofing becomes essential. Cover outlets, secure furniture that could tip, lock cabinets with harmful substances, and remove small objects that could be choking hazards.',
      ageRange: { min: 5, max: 10 }
    },
    {
      id: '20',
      category: 'health',
      title: 'Common Illnesses',
      content: 'Babies are developing their immune systems and may catch several colds in their first year. Contact your doctor if your baby has a fever above 100.4°F, difficulty breathing, or unusual lethargy.',
      ageRange: { min: 0, max: 24 }
    },
    {
      id: '21',
      category: 'health',
      title: 'Sun Protection',
      content: 'Your baby\'s skin is sensitive to sun exposure. For babies under 6 months, avoid direct sun and use shade, protective clothing, and hats. For older babies, you can use baby-safe sunscreen in addition to these measures.',
      ageRange: { min: 0, max: 24 }
    },
    
    // Play & Learning Tips
    {
      id: '22',
      category: 'play',
      title: 'Sensory Play',
      content: 'Your baby learns through their senses. Provide a variety of textures, sounds, and sights. Try soft fabrics, rattles, and high-contrast images. Narrate what they\'re experiencing to encourage language development.',
      ageRange: { min: 0, max: 6 }
    },
    {
      id: '23',
      category: 'play',
      title: 'Tummy Time',
      content: 'Daily supervised tummy time helps strengthen neck, shoulder, and arm muscles. Start with short sessions and gradually increase as your baby becomes more comfortable. Place colorful toys just out of reach to encourage movement.',
      ageRange: { min: 0, max: 6 }
    },
    {
      id: '24',
      category: 'play',
      title: 'Interactive Games',
      content: 'Your baby enjoys social interaction. Try games like peek-a-boo or patty-cake, which help develop cognitive skills and understanding of object permanence. Your baby\'s smiles and laughter are signs they\'re learning!',
      ageRange: { min: 3, max: 12 }
    },
    {
      id: '25',
      category: 'play',
      title: 'Reading Together',
      content: 'Even young babies benefit from being read to. Choose books with simple, high-contrast images for the youngest babies, and sturdy board books as they grow. Reading together supports language development and bonding.',
      ageRange: { min: 0, max: 24 }
    },
    {
      id: '26',
      category: 'play',
      title: 'Movement Activities',
      content: 'As your baby gains more control over their body, they enjoy activities that let them practice new skills. Supported sitting, reaching for toys, and gentle bouncing on your lap are all fun ways to engage their growing abilities.',
      ageRange: { min: 3, max: 9 }
    }
  ];

  // New baby facts data
  const babyFacts: BabyFact[] = [
    {
      id: '1',
      title: 'Newborn Vision',
      content: 'Newborns can only see 8-12 inches away from their face and prefer black and white contrast patterns over colors.',
      ageRange: { min: 0, max: 2 }
    },
    {
      id: '2',
      title: 'Incredible Brain Growth',
      content: 'Your baby\'s brain will double in size in the first year. It grows to about 80% of adult size by age 3.',
      ageRange: { min: 0, max: 12 }
    },
    {
      id: '3',
      title: 'Taste Buds Development',
      content: 'Babies have more taste buds than adults, spread throughout their mouth, not just on the tongue.',
      ageRange: { min: 1, max: 6 }
    },
    {
      id: '4',
      title: 'Crying Without Tears',
      content: 'Newborns cry without tears because their tear ducts aren\'t fully developed until 1-3 months of age.',
      ageRange: { min: 0, max: 3 }
    },
    {
      id: '5',
      title: 'Unique Fingerprints',
      content: 'Babies develop unique fingerprints in the womb around 17 weeks of pregnancy.',
      ageRange: { min: 0, max: 24 }
    },
    {
      id: '6',
      title: 'Rapid Vocabulary Growth',
      content: 'Between 18 and 24 months, children often learn 5-10 new words each day.',
      ageRange: { min: 18, max: 24 }
    },
    {
      id: '7',
      title: 'Heartbeat Facts',
      content: 'A baby\'s heart beats faster than an adult\'s, typically 120-160 beats per minute compared to 60-100 for adults.',
      ageRange: { min: 0, max: 12 }
    },
    {
      id: '8',
      title: 'Memory Development',
      content: 'Six-month-olds can remember specific people and objects for days or weeks.',
      ageRange: { min: 6, max: 9 }
    },
    {
      id: '9',
      title: 'Sleep Cycles',
      content: 'Babies have shorter sleep cycles (50-60 minutes) than adults (90 minutes), which is why they wake more frequently.',
      ageRange: { min: 0, max: 12 }
    },
    {
      id: '10',
      title: 'Bone Development',
      content: 'Babies are born with about 300 bones, which eventually fuse to become 206 adult bones.',
      ageRange: { min: 0, max: 36 }
    }
  ];

  const toggleTip = (tipId: string) => {
    setExpandedTips(prev => ({
      ...prev,
      [tipId]: !prev[tipId]
    }));
  };

  const filteredTips = parentingTips.filter(tip => 
    (activeCategory === null || tip.category === activeCategory) && 
    ageInMonths >= tip.ageRange.min && ageInMonths <= tip.ageRange.max
  );

  const filteredFacts = babyFacts.filter(fact => 
    ageInMonths >= fact.ageRange.min && ageInMonths <= fact.ageRange.max
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-5 mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">Parenting Tips & Facts</h1>
        
        <div className="mb-6">
          <label htmlFor="childSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select a child to see age-appropriate tips and facts:
          </label>
          <select
            id="childSelect"
            value={selectedChildId}
            onChange={handleChildChange}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} ({child.birthDate ? `${ageInMonths} months` : 'Age unknown'})
              </option>
            ))}
          </select>
        </div>

        {child && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-6">
            <p className="text-indigo-700 dark:text-indigo-300">
              Showing tips and facts for <strong>{child.name}</strong> who is <strong>{ageInMonths} months old</strong>.
            </p>
          </div>
        )}

        {/* Toggle buttons for tips and facts */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={() => setShowFacts(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!showFacts ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
          >
            Parenting Tips
          </button>
          <button 
            onClick={() => setShowFacts(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${showFacts ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
          >
            Baby Facts
          </button>
        </div>

        {!showFacts && (
          <>
            {/* Category filters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              <button
                onClick={() => setActiveCategory(null)}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeCategory === null ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
              >
                All Tips
              </button>
              {tipCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center ${activeCategory === category.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                >
                  <span className="mr-2">{category.icon}</span>
                  <span className="whitespace-nowrap">{category.title}</span>
                </button>
              ))}
            </div>

            {/* Tips display */}
            {filteredTips.length > 0 ? (
              <div className="space-y-4">
                {filteredTips.map(tip => (
                  <div key={tip.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleTip(tip.id)}
                      className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 text-left"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">{tip.title}</h3>
                      <span>
                        {expandedTips[tip.id] ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    </button>
                    {expandedTips[tip.id] && (
                      <div className="px-6 py-4 bg-white dark:bg-gray-800">
                        <p className="text-gray-700 dark:text-gray-300">{tip.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl text-center">
                <p className="text-yellow-800 dark:text-yellow-200">No tips available for this age range and category. Try selecting a different category.</p>
              </div>
            )}
          </>
        )}

        {showFacts && (
          <>
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiInfo className="mr-2 text-indigo-600 dark:text-indigo-400" /> 
              Interesting Baby Facts
            </h2>
            
            {filteredFacts.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {filteredFacts.map(fact => (
                  <div key={fact.id} className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800">
                    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">{fact.title}</h3>
                    <p className="text-gray-800 dark:text-gray-200">{fact.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl text-center">
                <p className="text-yellow-800 dark:text-yellow-200">No facts available for this age range. Try selecting a child of a different age.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ParentingTips;
