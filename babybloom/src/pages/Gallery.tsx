import React, { useState, useEffect, useRef } from 'react';
import { FiImage, FiVideo, FiPlus, FiFilter, FiDownload, FiShare2, FiX, FiChevronLeft, FiChevronRight, FiMaximize, FiCalendar, FiTag, FiUpload } from 'react-icons/fi';
import { format } from 'date-fns';

interface Child {
  id: string;
  name: string;
  profileImageUrl?: string;
  emoji?: string;
}

interface MediaItem {
  id: string;
  childId: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  date: Date;
  tags: string[];
}

const Gallery: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Form state for adding new media
  const [formData, setFormData] = useState({
    childId: '',
    type: 'image' as 'image' | 'video',
    caption: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    tags: ''
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - would come from API in real app
  useEffect(() => {
    // Load children
    const sampleChildren = [
      {
        id: "1",
        name: 'Emma',
        emoji: '👶🏻',
      },
      {
        id: "2",
        name: 'Noah',
        emoji: '👶🏽',
      }
    ];
    setChildren(sampleChildren);

    // Mock media items
    const mockMediaItems: MediaItem[] = [
      {
        id: '1',
        childId: '1',
        type: 'image',
        url: 'https://i.pravatar.cc/300?img=1',
        caption: 'First smile',
        date: new Date(2024, 2, 15),
        tags: ['milestone', 'happy']
      },
      {
        id: '2',
        childId: '1',
        type: 'video',
        url: 'https://i.pravatar.cc/300?img=2',
        caption: 'Learning to crawl',
        date: new Date(2024, 2, 20),
        tags: ['milestone', 'development']
      },
      {
        id: '3',
        childId: '2',
        type: 'image',
        url: 'https://i.pravatar.cc/300?img=3',
        caption: 'First birthday',
        date: new Date(2024, 1, 10),
        tags: ['birthday', 'family']
      },
      {
        id: '4',
        childId: '2',
        type: 'image',
        url: 'https://i.pravatar.cc/300?img=4',
        caption: 'Playing in the park',
        date: new Date(2024, 2, 5),
        tags: ['outdoor', 'play']
      }
    ];
    setMediaItems(mockMediaItems);
    setFilteredItems(mockMediaItems);
  }, []);

  // Filter media items based on selected child and media type
  useEffect(() => {
    let filtered = [...mediaItems];
    
    // Filter by child
    if (selectedChild) {
      filtered = filtered.filter(item => item.childId === selectedChild);
    }
    
    // Filter by media type
    if (activeFilter === 'images') {
      filtered = filtered.filter(item => item.type === 'image');
    } else if (activeFilter === 'videos') {
      filtered = filtered.filter(item => item.type === 'video');
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    setFilteredItems(filtered);
  }, [mediaItems, selectedChild, activeFilter]);

  const handleAddMedia = () => {
    setFormData({
      childId: selectedChild || (children.length > 0 ? children[0].id : ''),
      type: 'image',
      caption: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      tags: ''
    });
    setPreviewUrl(null);
    setShowAddModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Determine if it's an image or video
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      setFormData(prev => ({
        ...prev,
        type: fileType
      }));

      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmitMedia = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.childId || !formData.caption || !previewUrl) {
      alert('Please fill out all required fields and upload a media file');
      return;
    }

    // Create new media item
    const newItem: MediaItem = {
      id: `new-${Date.now()}`, // Generate temporary ID
      childId: formData.childId,
      type: formData.type,
      url: previewUrl, // In a real app, this would be the URL after uploading to server
      caption: formData.caption,
      date: new Date(formData.date),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    // Add to media items
    setMediaItems(prev => [newItem, ...prev]);
    
    // Reset form and close modal
    setShowAddModal(false);
    
    // Clean up the preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const getChildName = (childId: string): string => {
    const child = children.find(c => c.id === childId);
    return child ? child.name : 'Unknown';
  };

  const handleMediaClick = (item: MediaItem, index: number) => {
    setSelectedMedia(item);
    setSelectedIndex(index);
  };

  const handleCloseViewMode = () => {
    setSelectedMedia(null);
    setSelectedIndex(-1);
  };

  const handleNextMedia = () => {
    if (selectedIndex < filteredItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedMedia(filteredItems[selectedIndex + 1]);
    }
  };

  const handlePrevMedia = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedMedia(filteredItems[selectedIndex - 1]);
    }
  };

  const handleDownload = (url: string, caption: string) => {
    // In a real app, this would handle actual file download
    // For now, just simulate with an alert
    alert(`Downloading ${caption}...`);
    console.log(`Downloading ${caption} from ${url}`);
    
    // This is a placeholder. In a real implementation, you'd use:
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = `${caption.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const handleShare = (item: MediaItem) => {
    // Placeholder for share functionality
    // In a real app, this would integrate with the Web Share API or a custom sharing solution
    alert(`Sharing ${item.caption}...`);
    
    // Example of using Web Share API (only works on HTTPS):
    // if (navigator.share) {
    //   navigator.share({
    //     title: item.caption,
    //     text: `Check out this ${item.type} of ${getChildName(item.childId)}!`,
    //     url: window.location.href,
    //   })
    // }
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-bg baby-pattern-clouds">
      <div className="p-3 mx-auto pb-20 max-w-full sm:max-w-3xl">
        {/* Page Title */}
        <div className="mb-2 sm:mb-4 text-center">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white font-display">
            Memory Gallery
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Cherish special moments with your little ones
          </p>
        </div>

        {/* Child Selector */}
        <div className="mb-2 sm:mb-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-1 sm:space-x-2 p-1">
            <button 
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap
                ${!selectedChild 
                  ? 'bg-gradient-to-r from-lavender to-babypink text-white shadow-md' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              onClick={() => setSelectedChild(null)}
            >
              All Children
            </button>
            
            {children.map(child => (
              <button 
                key={child.id}
                className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap
                  ${selectedChild === child.id 
                    ? 'bg-gradient-to-r from-babypink to-babypink-dark text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                onClick={() => setSelectedChild(child.id)}
              >
                {child.emoji && <span className="mr-1">{child.emoji}</span>}
                {child.name}
              </button>
            ))}
          </div>
        </div>

        {/* Media Type Filter */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-md mb-2 sm:mb-4 overflow-hidden">
          <div className="flex p-1 sm:p-2 space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
            <button 
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center whitespace-nowrap
                ${activeFilter === 'all' 
                  ? 'bg-gradient-to-r from-lavender to-babypink text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              onClick={() => setActiveFilter('all')}
            >
              <FiFilter className="mr-1 text-xs sm:text-sm" /> All Media
            </button>
            
            <button 
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center whitespace-nowrap
                ${activeFilter === 'images' 
                  ? 'bg-gradient-to-r from-skyblue to-skyblue-dark text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              onClick={() => setActiveFilter('images')}
            >
              <FiImage className="mr-1 text-xs sm:text-sm" /> Images
            </button>
            
            <button 
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center whitespace-nowrap
                ${activeFilter === 'videos' 
                  ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              onClick={() => setActiveFilter('videos')}
            >
              <FiVideo className="mr-1 text-xs sm:text-sm" /> Videos
            </button>
          </div>
        </div>

        {/* Add Media Button */}
        <button 
          className="fixed bottom-16 right-4 z-10 bg-gradient-to-r from-babypink to-babypink-dark text-white rounded-full p-2 sm:p-3 shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          onClick={handleAddMedia}
          aria-label="Add media"
        >
          <FiPlus className="text-sm sm:text-lg" />
        </button>

        {/* Media Gallery */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 animate-fade-in">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-dark-card rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleMediaClick(item, index)}
              >
                <div className="relative h-28 sm:h-36 overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.caption} 
                    className="w-full h-full object-cover"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="rounded-full bg-white bg-opacity-80 p-1 sm:p-2">
                        <FiVideo className="text-xs sm:text-sm text-purple-600" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/5 to-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="rounded-full bg-white bg-opacity-80 p-1.5 sm:p-2">
                      <FiMaximize className="text-xs sm:text-sm text-gray-800" />
                    </div>
                  </div>
                </div>
                <div className="p-1.5 sm:p-2">
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <span className={`text-2xs sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full inline-block
                      ${item.type === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}
                    `}>
                      {item.type === 'image' ? 'Image' : 'Video'}
                    </span>
                    <span className="text-2xs sm:text-xs text-gray-500 dark:text-gray-400">
                      {format(item.date, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm text-gray-800 dark:text-white truncate">
                    {item.caption}
                  </h3>
                  <p className="text-2xs sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
                    {getChildName(item.childId)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-md p-4 sm:p-6 text-center mt-2 sm:mt-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <FiImage className="text-blue-600 dark:text-blue-300 text-lg sm:text-xl" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">No media found</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                {selectedChild ? `No ${activeFilter === 'all' ? 'media' : activeFilter} found for this child.` : `No ${activeFilter === 'all' ? 'media' : activeFilter} found.`}
              </p>
              <button
                className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-lavender to-lavender-dark text-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 font-medium text-xs sm:text-sm"
                onClick={handleAddMedia}
              >
                <FiPlus className="inline mr-1 text-2xs sm:text-xs" /> Add Media
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Media Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-dark-card rounded-xl p-3 sm:p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">Add New Media</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmitMedia} className="space-y-3 sm:space-y-4">
              {/* Child Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Child
                </label>
                <select 
                  name="childId"
                  value={formData.childId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-lavender dark:focus:ring-babypink"
                  required
                >
                  <option value="">Select a child</option>
                  {children.map(child => (
                    <option key={child.id} value={child.id}>
                      {child.emoji} {child.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Media Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload Media
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                  {previewUrl ? (
                    <div className="relative">
                      {formData.type === 'image' ? (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-h-40 mx-auto rounded-md object-contain" 
                        />
                      ) : (
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 flex flex-col items-center justify-center h-40">
                          <FiVideo className="text-2xl text-purple-500 mb-2" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Video selected</span>
                        </div>
                      )}
                      <button 
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer py-3 flex flex-col items-center space-y-2"
                    >
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <FiUpload className="text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Click to upload an image or video
                        </p>
                        <p className="text-2xs text-gray-500 dark:text-gray-400 mt-1">
                          JPG, PNG, GIF or MP4 (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*" 
                    className="hidden" 
                  />
                </div>
              </div>
              
              {/* Caption */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Caption
                </label>
                <input 
                  type="text"
                  name="caption"
                  value={formData.caption}
                  onChange={handleFormChange}
                  placeholder="Enter a caption for this memory"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-lavender dark:focus:ring-babypink"
                  required
                />
              </div>
              
              {/* Date */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <FiCalendar className="mr-1 text-gray-500 dark:text-gray-400" size={14} /> Date
                </label>
                <input 
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-lavender dark:focus:ring-babypink"
                  required
                />
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <FiTag className="mr-1 text-gray-500 dark:text-gray-400" size={14} /> Tags
                </label>
                <input 
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleFormChange}
                  placeholder="Separate tags with commas (e.g., milestone, family)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-lavender dark:focus:ring-babypink"
                />
                <p className="text-2xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                  Optional: Add tags to help organize your memories
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button"
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-xs sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-babypink to-babypink-dark text-white rounded-lg hover:shadow-md text-xs sm:text-sm flex items-center"
                >
                  <FiPlus className="mr-1" size={14} /> Add Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media View Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-50 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white"
              onClick={handleCloseViewMode}
              aria-label="Close"
            >
              <FiX className="text-base sm:text-lg" />
            </button>
            
            {/* Navigation buttons */}
            {selectedIndex > 0 && (
              <button 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white z-40"
                onClick={handlePrevMedia}
                aria-label="Previous"
              >
                <FiChevronLeft className="text-base sm:text-lg" />
              </button>
            )}
            
            {selectedIndex < filteredItems.length - 1 && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white z-40"
                onClick={handleNextMedia}
                aria-label="Next"
              >
                <FiChevronRight className="text-base sm:text-lg" />
              </button>
            )}
            
            {/* Media content */}
            <div className="w-full max-w-4xl max-h-[70vh] flex items-center justify-center mb-2 sm:mb-4">
              {selectedMedia.type === 'image' ? (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.caption} 
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" 
                />
              ) : (
                <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg shadow-lg flex items-center justify-center">
                  {/* This would be a real video player in production */}
                  <div className="flex flex-col items-center justify-center text-white">
                    <FiVideo className="text-4xl mb-2" />
                    <p className="text-sm">Video Player Placeholder</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Info and actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-4 max-w-lg w-full">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white">
                    {selectedMedia.caption}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {getChildName(selectedMedia.childId)} • {format(selectedMedia.date, 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                    onClick={() => handleDownload(selectedMedia.url, selectedMedia.caption)}
                    aria-label="Download"
                  >
                    <FiDownload className="text-base" />
                  </button>
                  <button 
                    className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
                    onClick={() => handleShare(selectedMedia)}
                    aria-label="Share"
                  >
                    <FiShare2 className="text-base" />
                  </button>
                </div>
              </div>
              
              {/* Tags */}
              {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedMedia.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-2xs sm:text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
