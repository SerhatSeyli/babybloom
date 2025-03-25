import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { BiSearchAlt } from 'react-icons/bi';
import { BsCalendarEvent, BsMedical, BsActivity } from 'react-icons/bs';

interface SearchResult {
  id: string;
  type: 'milestone' | 'appointment' | 'health' | 'other';
  title: string;
  date: string;
  childName: string;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(['first steps', 'vaccination', 'development milestones']);
  const [isSearching, setIsSearching] = useState(false);

  // Sample data for search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'milestone',
      title: 'First Steps',
      date: '2024-03-14',
      childName: 'Emma'
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Pediatrician Visit',
      date: '2024-02-19',
      childName: 'Emma'
    },
    {
      id: '3',
      type: 'health',
      title: 'Fever',
      date: '2023-12-04',
      childName: 'Emma'
    },
    {
      id: '4',
      type: 'milestone',
      title: 'First Word: Mama',
      date: '2023-11-10',
      childName: 'Emma'
    },
    {
      id: '5',
      type: 'appointment',
      title: 'Dental Checkup',
      date: '2024-04-02',
      childName: 'Noah'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;

    // Set searching state for loading indicator
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      // Filter mock results based on search term
      const filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.childName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(filteredResults);
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchTerm)) {
        setRecentSearches(prev => [searchTerm, ...prev.slice(0, 4)]);
      }
      
      setIsSearching(false);
    }, 500);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    // Trigger search
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = term;
      searchInput.form?.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  };

  // Get icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <BsActivity className="text-purple-500" />;
      case 'appointment':
        return <BsCalendarEvent className="text-blue-500" />;
      case 'health':
        return <BsMedical className="text-red-500" />;
      default:
        return <BsCalendarEvent className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Search" showSearch={false} />
      
      <div className="p-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              id="searchInput"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events, milestones, health records..."
              className="w-full bg-white border border-gray-300 rounded-full py-3 px-5 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary p-1"
              aria-label="Search"
            >
              <BiSearchAlt className="text-xl" />
            </button>
          </div>
        </form>
        
        {/* Recent searches */}
        {recentSearches.length > 0 && searchResults.length === 0 && !isSearching && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
            <div className="space-y-2">
              {recentSearches.map((term, index) => (
                <div 
                  key={index}
                  onClick={() => handleRecentSearchClick(term)}
                  className="flex items-center p-3 bg-white rounded-lg shadow-sm cursor-pointer"
                >
                  <BiSearchAlt className="text-gray-400 mr-3" />
                  <span>{term}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {isSearching && (
          <div className="mt-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        )}
        
        {/* Search results */}
        {searchResults.length > 0 && !isSearching && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Results for "{searchTerm}"</h3>
            <div className="space-y-3">
              {searchResults.map(result => (
                <div key={result.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {getEventIcon(result.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{result.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(result.date).toLocaleDateString('en-US', { 
                          year: 'numeric',
                          month: 'short', 
                          day: 'numeric'
                        })} • {result.childName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* No results */}
        {searchTerm !== '' && searchResults.length === 0 && !isSearching && (
          <div className="mt-8 text-center py-8">
            <BiSearchAlt className="text-4xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No results found for "{searchTerm}"</p>
            <p className="text-sm text-gray-400 mt-2">Try different keywords or check spelling</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
