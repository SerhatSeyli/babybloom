import React, { useState, useEffect } from 'react';
import { BsStars, BsBookmark, BsBookmarkFill, BsExclamationCircle } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { differenceInMonths } from 'date-fns';

// Types for the tips
interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'development' | 'nutrition' | 'health' | 'sleep' | 'activity';
  ageRange: string;
  minAge: number; // Minimum age in months
  maxAge: number; // Maximum age in months
  isAlert?: boolean;
}

interface Child {
  id: string;
  name: string;
  age?: string;
  dateOfBirth?: string;
  color?: string;
  emoji?: string;
}

interface ParentingTipsProps {
  children?: Child[];
}

// Sample parenting tips with age ranges
const sampleTips: Tip[] = [
  {
    id: '1',
    title: 'Tummy Time',
    content: 'Give your baby supervised tummy time daily to strengthen neck, shoulder and arm muscles. Start with 3-5 minutes a few times a day.',
    category: 'development',
    ageRange: '0-3 months',
    minAge: 0,
    maxAge: 3
  },
  {
    id: '2',
    title: 'Responding to Cries',
    content: 'Responding quickly to your baby\'s cries builds trust and security. You cannot spoil a newborn by holding them too much.',
    category: 'health',
    ageRange: '0-3 months',
    minAge: 0,
    maxAge: 3
  },
  {
    id: '3',
    title: 'First Foods',
    content: 'When introducing solids around 6 months, try single-grain cereals mixed with breast milk or formula, or pureed fruits and vegetables.',
    category: 'nutrition',
    ageRange: '4-6 months',
    minAge: 4,
    maxAge: 6
  },
  {
    id: '4',
    title: 'Sleep Training',
    content: 'Establish a consistent bedtime routine with calming activities like bathing, reading, and singing to help your baby recognize when it\'s time to sleep.',
    category: 'sleep',
    ageRange: '4-6 months',
    minAge: 4,
    maxAge: 6
  },
  {
    id: '5',
    title: 'Stranger Anxiety',
    content: 'Stranger anxiety is normal around 8-9 months. Allow your baby time to warm up to new people gradually rather than forcing interactions.',
    category: 'development',
    ageRange: '7-9 months',
    minAge: 7,
    maxAge: 9
  },
  {
    id: '6',
    title: 'Self-Feeding',
    content: 'Encourage self-feeding with appropriate finger foods like small pieces of soft fruits, well-cooked vegetables, or pasta to develop fine motor skills.',
    category: 'nutrition',
    ageRange: '7-9 months',
    minAge: 7,
    maxAge: 9
  },
  {
    id: '7',
    title: 'Reading Together',
    content: 'Read to your baby daily. Choose books with bright colors, simple pictures, and different textures to engage multiple senses.',
    category: 'development',
    ageRange: '10-12 months',
    minAge: 10,
    maxAge: 12
  },
  {
    id: '8',
    title: 'Setting Boundaries',
    content: 'Start setting simple, consistent boundaries as your baby becomes more mobile. Use redirection rather than saying "no" constantly.',
    category: 'health',
    ageRange: '10-12 months',
    minAge: 10,
    maxAge: 12
  },
  {
    id: '9',
    title: 'Language Development',
    content: 'Support language development by narrating your activities, responding to babbling, and using simple, clear language when speaking to your toddler.',
    category: 'development',
    ageRange: '1-2 years',
    minAge: 12,
    maxAge: 24
  },
  {
    id: '10',
    title: 'Dealing With Tantrums',
    content: 'Stay calm during tantrums and acknowledge your toddler\'s feelings. Offer comfort and help them find words for their emotions.',
    category: 'health',
    ageRange: '1-2 years',
    minAge: 12,
    maxAge: 24
  },
  {
    id: '11',
    title: 'Picky Eating',
    content: 'Picky eating is common in toddlers. Continue offering a variety of healthy foods without pressure, and model healthy eating habits yourself.',
    category: 'nutrition',
    ageRange: '1-2 years',
    minAge: 12,
    maxAge: 24
  },
  {
    id: '12',
    title: 'Outdoor Play',
    content: 'Regular outdoor play helps develop gross motor skills and releases energy. Aim for at least 30-60 minutes of active play daily.',
    category: 'activity',
    ageRange: '1-2 years',
    minAge: 12,
    maxAge: 24
  }
];

// Developmental alerts
const developmentalAlerts: Tip[] = [
  {
    id: 'alert-1',
    title: 'Two-Month Vaccinations',
    content: 'Your baby is approaching the two-month mark when first major vaccinations are recommended. Schedule an appointment with your pediatrician.',
    category: 'health',
    ageRange: '6-8 weeks',
    minAge: 1.5,
    maxAge: 2.5,
    isAlert: true
  },
  {
    id: 'alert-2',
    title: 'Starting Solids Soon',
    content: 'Your baby is approaching 6 months. Look for signs of readiness for solid foods: sitting with support, good head control, and interest in your food.',
    category: 'nutrition',
    ageRange: '5-6 months',
    minAge: 5,
    maxAge: 6,
    isAlert: true
  },
  {
    id: 'alert-3',
    title: 'Mobility Coming Soon',
    content: 'Most babies start crawling between 7-10 months. Now is the time to thoroughly baby-proof your home before mobility begins.',
    category: 'development',
    ageRange: '6-7 months',
    minAge: 6,
    maxAge: 7,
    isAlert: true
  },
  {
    id: 'alert-4',
    title: 'One-Year Checkup',
    content: 'Your baby\'s one-year checkup is coming up. Prepare questions about development, nutrition, and sleep for your pediatrician.',
    category: 'health',
    ageRange: '11-12 months',
    minAge: 11,
    maxAge: 12,
    isAlert: true
  },
  {
    id: 'alert-5',
    title: 'Language Explosion',
    content: 'Between 18-24 months, many children experience a "language explosion." Support this by reading frequently and narrating daily activities.',
    category: 'development',
    ageRange: '17-18 months',
    minAge: 17,
    maxAge: 18,
    isAlert: true
  },
  {
    id: 'alert-6',
    title: 'Toilet Training Readiness',
    content: 'Around 24-30 months, look for signs of toilet training readiness: staying dry for 2+ hours, interest in the bathroom, telling you when they\'ve gone.',
    category: 'development',
    ageRange: '23-24 months',
    minAge: 23,
    maxAge: 24,
    isAlert: true
  }
];

// Get the appropriate category color
const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'development':
      return 'gradient-blue';
    case 'nutrition':
      return 'gradient-mint';
    case 'health':
      return 'gradient-purple';
    case 'sleep':
      return 'gradient-lavender';
    case 'activity':
      return 'gradient-pink';
    default:
      return 'gradient-blue';
  }
};

// Get child's age in months
const getChildAgeInMonths = (dateOfBirth: string | undefined, ageString: string | undefined): number => {
  if (dateOfBirth) {
    try {
      const dob = new Date(dateOfBirth);
      return differenceInMonths(new Date(), dob);
    } catch (e) {
      console.error('Invalid date format:', e);
    }
  }
  
  if (ageString) {
    // Parse age string like "10 months old" or "2 years old"
    if (ageString.includes('month')) {
      const months = parseInt(ageString);
      return isNaN(months) ? 0 : months;
    } else if (ageString.includes('year')) {
      const years = parseInt(ageString);
      return isNaN(years) ? 0 : years * 12;
    }
  }
  
  return 0; // Default to 0 if we can't determine age
};

// Get age-appropriate tips for a child
const getAgeAppropriateTips = (childAgeMonths: number, tips: Tip[]): Tip[] => {
  return tips.filter(tip => childAgeMonths >= tip.minAge && childAgeMonths <= tip.maxAge);
};

const ParentingTips: React.FC<ParentingTipsProps> = ({ children = [] }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [favoriteTips, setFavoriteTips] = useState<string[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [relevantTips, setRelevantTips] = useState<Tip[]>(sampleTips);
  const [showAlerts, setShowAlerts] = useState(true);
  
  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('babybloom-favorite-tips');
    if (savedFavorites) {
      setFavoriteTips(JSON.parse(savedFavorites));
    }
    
    // If there are children, select the first one by default
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, []);
  
  // Update tips when selected child changes
  useEffect(() => {
    if (selectedChildId) {
      const selectedChild = children.find(child => child.id === selectedChildId);
      if (selectedChild) {
        const childAgeMonths = getChildAgeInMonths(selectedChild.dateOfBirth, selectedChild.age);
        
        // Get age-appropriate regular tips
        const regularTips = getAgeAppropriateTips(childAgeMonths, sampleTips);
        
        // Get developmental alerts if enabled
        const alerts = showAlerts ? getAgeAppropriateTips(childAgeMonths, developmentalAlerts) : [];
        
        // Combine regular tips and alerts, putting alerts first
        setRelevantTips([...alerts, ...regularTips]);
        
        // Reset tip index
        setCurrentTipIndex(0);
      }
    } else {
      // If no child is selected, show generic tips
      setRelevantTips(sampleTips);
    }
  }, [selectedChildId, showAlerts]);
  
  // Save favorites to localStorage
  const saveFavorites = (tips: string[]) => {
    localStorage.setItem('babybloom-favorite-tips', JSON.stringify(tips));
  };
  
  const nextTip = () => {
    if (relevantTips.length > 0) {
      setCurrentTipIndex((prev) => (prev + 1) % relevantTips.length);
    }
  };
  
  const prevTip = () => {
    if (relevantTips.length > 0) {
      setCurrentTipIndex((prev) => (prev - 1 + relevantTips.length) % relevantTips.length);
    }
  };
  
  const toggleFavorite = (tipId: string) => {
    if (favoriteTips.includes(tipId)) {
      const updated = favoriteTips.filter(id => id !== tipId);
      setFavoriteTips(updated);
      saveFavorites(updated);
    } else {
      const updated = [...favoriteTips, tipId];
      setFavoriteTips(updated);
      saveFavorites(updated);
    }
  };
  
  // If no tips are available
  if (relevantTips.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft w-full mb-6 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-display font-bold text-lg flex items-center">
            <BsStars className="text-primary mr-2" /> 
            Parenting Tip
          </h2>
        </div>
        
        {children.length > 0 && (
          <div className="mb-3">
            <label htmlFor="child-selector" className="sr-only">Select child</label>
            <select
              id="child-selector"
              value={selectedChildId || ''}
              onChange={(e) => setSelectedChildId(e.target.value || null)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-3"
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.emoji} {child.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <p className="text-gray-600 dark:text-gray-300 text-center py-6">
          No age-appropriate tips available at this time.
        </p>
      </div>
    );
  }
  
  const currentTip = relevantTips[currentTipIndex];
  const isFavorite = favoriteTips.includes(currentTip.id);
  const isAlert = currentTip.isAlert;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft w-full mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-display font-bold text-lg flex items-center">
          {isAlert ? 
            <BsExclamationCircle className="text-yellow-500 mr-2" /> : 
            <BsStars className="text-primary mr-2" />
          } 
          {isAlert ? 'Developmental Alert' : 'Parenting Tip'}
        </h2>
        <div className="flex space-x-1">
          <button 
            onClick={prevTip}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 transition-transform hover:-translate-y-1"
            aria-label="Previous tip"
          >
            <FiChevronLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <button 
            onClick={nextTip}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 transition-transform hover:-translate-y-1"
            aria-label="Next tip"
          >
            <FiChevronRight className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
      
      {children.length > 0 && (
        <div className="mb-3">
          <label htmlFor="child-selector" className="sr-only">Select child</label>
          <select
            id="child-selector"
            value={selectedChildId || ''}
            onChange={(e) => setSelectedChildId(e.target.value || null)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-2"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {child.emoji} {child.name}
              </option>
            ))}
          </select>
          
          <div className="flex items-center mt-2 mb-1">
            <input
              type="checkbox"
              id="show-alerts"
              checked={showAlerts}
              onChange={() => setShowAlerts(!showAlerts)}
              className="mr-2"
            />
            <label htmlFor="show-alerts" className="text-sm text-gray-600 dark:text-gray-300">
              Show developmental alerts
            </label>
          </div>
        </div>
      )}
      
      <div className="flex mb-3">
        <div className={`rounded-full px-3 py-1 text-xs text-white ${isAlert ? 'bg-yellow-500' : getCategoryColor(currentTip.category)}`}>
          {currentTip.category.charAt(0).toUpperCase() + currentTip.category.slice(1)}
        </div>
        <div className="rounded-full px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 ml-2">
          {currentTip.ageRange}
        </div>
      </div>
      
      <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
        {currentTip.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {currentTip.content}
      </p>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Tip {currentTipIndex + 1} of {relevantTips.length}
        </span>
        <button
          onClick={() => toggleFavorite(currentTip.id)}
          className={`p-2 rounded-full ${isFavorite ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-600'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <BsBookmarkFill /> : <BsBookmark />}
        </button>
      </div>
    </div>
  );
};

export default ParentingTips;
