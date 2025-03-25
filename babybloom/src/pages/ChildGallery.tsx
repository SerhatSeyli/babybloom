import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiPlusCircle, FiX, FiUpload } from 'react-icons/fi';
import { format } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';

interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail: string;
  caption?: string;
  date: Date;
  tags?: string[];
}

const ChildGallery: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const [childName, setChildName] = useState('');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'photos' | 'videos'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMediaData, setNewMediaData] = useState({
    type: 'photo' as 'photo' | 'video',
    caption: '',
    selectedFile: null as File | null,
    previewUrl: ''
  });

  // Mock data - would come from API in real app
  useEffect(() => {
    // Set child name based on ID
    if (id === '1') {
      setChildName('Emma');
    } else if (id === '2') {
      setChildName('Noah');
    }

    // Fetch gallery items from API
    // For now, using mock data with placeholder images
    const mockGalleryItems: GalleryItem[] = [
      {
        id: '1',
        type: 'photo',
        url: 'https://via.placeholder.com/800x600/FF5733/FFFFFF?text=First+Smile',
        thumbnail: 'https://via.placeholder.com/200x200/FF5733/FFFFFF?text=First+Smile',
        caption: 'First smile!',
        date: new Date('2023-06-15'),
        tags: ['milestone', 'smile']
      },
      {
        id: '2',
        type: 'photo',
        url: 'https://via.placeholder.com/800x600/33A8FF/FFFFFF?text=Bath+Time',
        thumbnail: 'https://via.placeholder.com/200x200/33A8FF/FFFFFF?text=Bath+Time',
        caption: 'Bath time fun',
        date: new Date('2023-07-20'),
        tags: ['bath', 'playtime']
      },
      {
        id: '3',
        type: 'video',
        url: 'https://via.placeholder.com/800x600/33FF57/FFFFFF?text=Rolling+Over',
        thumbnail: 'https://via.placeholder.com/200x200/33FF57/FFFFFF?text=Rolling+Over',
        caption: 'First time rolling over!',
        date: new Date('2023-08-10'),
        tags: ['milestone', 'development']
      },
      {
        id: '4',
        type: 'photo',
        url: 'https://via.placeholder.com/800x600/9D33FF/FFFFFF?text=Playing',
        thumbnail: 'https://via.placeholder.com/200x200/9D33FF/FFFFFF?text=Playing',
        caption: 'Playing with toys',
        date: new Date('2023-09-05'),
        tags: ['playtime']
      },
      {
        id: '5',
        type: 'video',
        url: 'https://via.placeholder.com/800x600/FF33A8/FFFFFF?text=Babbling',
        thumbnail: 'https://via.placeholder.com/200x200/FF33A8/FFFFFF?text=Babbling',
        caption: 'First babbling sounds',
        date: new Date('2023-10-12'),
        tags: ['milestone', 'language']
      },
      {
        id: '6',
        type: 'photo',
        url: 'https://via.placeholder.com/800x600/33FFF1/FFFFFF?text=With+Family',
        thumbnail: 'https://via.placeholder.com/200x200/33FFF1/FFFFFF?text=With+Family',
        caption: 'Family gathering',
        date: new Date('2023-11-25'),
        tags: ['family']
      }
    ];

    setGalleryItems(mockGalleryItems);
  }, [id]);

  // Handle adding a new photo or video
  const handleAddMedia = () => {
    setShowUploadModal(true);
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a URL for the file preview
    const previewUrl = URL.createObjectURL(file);
    
    // Determine if it's a photo or video based on file type
    const fileType = file.type.startsWith('image/') ? 'photo' : 'video';
    
    setNewMediaData({
      ...newMediaData,
      selectedFile: file,
      previewUrl,
      type: fileType
    });
  };

  // Handle saving the new media
  const handleSaveMedia = () => {
    if (!newMediaData.selectedFile || !newMediaData.previewUrl) {
      alert('Please select a file to upload');
      return;
    }

    // Create a new gallery item
    const newItem: GalleryItem = {
      id: `new-${Date.now()}`, // Generate a unique ID
      type: newMediaData.type,
      url: newMediaData.previewUrl,
      thumbnail: newMediaData.previewUrl,
      caption: newMediaData.caption || `New ${newMediaData.type}`,
      date: new Date(),
      tags: []
    };

    // Add to gallery items
    setGalleryItems([newItem, ...galleryItems]);
    
    // Reset form and close modal
    setNewMediaData({
      type: 'photo',
      caption: '',
      selectedFile: null,
      previewUrl: ''
    });
    
    setShowUploadModal(false);

    // In a real app, you'd also handle upload to a server here
    // For this demo, we're just storing in memory
  };

  // Close the upload modal
  const handleCloseUploadModal = () => {
    // Clean up any created object URLs to prevent memory leaks
    if (newMediaData.previewUrl) {
      URL.revokeObjectURL(newMediaData.previewUrl);
    }
    
    setNewMediaData({
      type: 'photo',
      caption: '',
      selectedFile: null,
      previewUrl: ''
    });
    
    setShowUploadModal(false);
  };

  // Close modal when viewing a selected item
  const closeModal = () => {
    setSelectedItem(null);
  };

  // Filter items based on active filter
  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : activeFilter === 'photos'
      ? galleryItems.filter(item => item.type === 'photo')
      : galleryItems.filter(item => item.type === 'video');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar title={`${childName}'s Gallery`} showBackButton={true} />
      
      <div className="p-4">
        {/* Filter buttons */}
        <div className={`bg-white ${theme === 'dark' ? 'dark:bg-dark-card' : ''} rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center`}>
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-dark-input text-gray-600 dark:text-lavender-light'
              } hover:opacity-90 transition-colors`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'photos' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-dark-input text-gray-600 dark:text-lavender-light'
              } hover:opacity-90 transition-colors`}
              onClick={() => setActiveFilter('photos')}
            >
              Photos
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'videos' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-dark-input text-gray-600 dark:text-lavender-light'
              } hover:opacity-90 transition-colors`}
              onClick={() => setActiveFilter('videos')}
            >
              Videos
            </button>
          </div>
          
          <button 
            onClick={handleAddMedia}
            className="p-2 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors"
            aria-label="Add media"
          >
            <FiPlusCircle className="text-xl" />
          </button>
        </div>
        
        {/* Gallery grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="rounded-lg overflow-hidden shadow-sm bg-white dark:bg-dark-card"
            >
              <div className="aspect-square w-full relative">
                <img 
                  src={item.thumbnail} 
                  alt={item.caption || 'Gallery item'} 
                  className="w-full h-full object-cover"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="text-white text-3xl">▶️</div>
                  </div>
                )}
              </div>
              
              <div className="p-2">
                <p className="text-sm text-gray-500 dark:text-lavender-light mb-1">
                  {format(item.date, 'MMM d, yyyy')}
                </p>
                {item.caption && (
                  <p className="text-gray-800 dark:text-lavender-light">{item.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-10 bg-white dark:bg-dark-card rounded-lg shadow-sm">
            <div className="text-5xl mb-4">
              {activeFilter === 'videos' ? '🎬' : '📷'}
            </div>
            <p className="text-gray-500 dark:text-lavender-light">No {activeFilter === 'all' ? 'media' : activeFilter} found</p>
            <button 
              onClick={handleAddMedia}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg inline-flex items-center"
            >
              <FiPlusCircle className="mr-2" />
              Add {activeFilter === 'videos' ? 'Video' : 'Photo'}
            </button>
          </div>
        )}
        
        {/* Media Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-card rounded-xl max-w-md w-full shadow-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-gray-800 dark:text-lavender-light">Add New Photo or Video</h3>
                <button 
                  onClick={handleCloseUploadModal}
                  className="p-2 text-gray-500 dark:text-lavender-light hover:bg-gray-100 dark:hover:bg-dark-input rounded-full"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              
              <div className="mb-4">
                {/* Media Preview */}
                {newMediaData.previewUrl ? (
                  <div className="relative">
                    <img 
                      src={newMediaData.previewUrl} 
                      alt="Preview" 
                      className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    {newMediaData.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <div className="text-white text-5xl">▶️</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="mb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-input"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <FiUpload size={48} className="text-gray-400 dark:text-lavender-light mb-3" />
                    <p className="text-gray-500 dark:text-lavender-light mb-2">Click to select a file or drag it here</p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">JPG, PNG, GIF or MP4 files</p>
                  </div>
                )}
                
                {/* File Input (hidden) */}
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden"
                  accept="image/*,video/*" 
                  onChange={handleFileChange}
                />
                
                {/* Caption Input */}
                <div className="mb-4">
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-lavender-light mb-1">
                    Caption
                  </label>
                  <input 
                    type="text"
                    id="caption"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-input text-gray-700 dark:text-lavender-light"
                    placeholder="Add a caption for this media"
                    value={newMediaData.caption}
                    onChange={(e) => setNewMediaData({...newMediaData, caption: e.target.value})}
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3 mt-5">
                  {!newMediaData.previewUrl ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-dark-input text-gray-800 dark:text-lavender-light rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FiUpload className="mr-2" />
                        Select File
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleCloseUploadModal}
                        className="px-4 py-2 bg-gray-200 dark:bg-dark-input text-gray-800 dark:text-lavender-light rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveMedia}
                        className={`px-4 py-2 bg-primary text-white rounded-lg transition-colors ${!newMediaData.selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'}`}
                        disabled={!newMediaData.selectedFile}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal for viewing selected item */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20 p-4">
            <div className="bg-white dark:bg-dark-card rounded-lg w-full max-w-3xl">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{selectedItem.caption}</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  {format(selectedItem.date, 'MMMM d, yyyy')}
                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <span className="ml-2">
                      • Tags: {selectedItem.tags.join(', ')}
                    </span>
                  )}
                </div>
                
                <div className="relative">
                  {selectedItem.type === 'photo' ? (
                    <img 
                      src={selectedItem.url} 
                      alt={selectedItem.caption || 'Full size image'} 
                      className="w-full object-contain max-h-[70vh]"
                    />
                  ) : (
                    <div className="bg-gray-900 aspect-video flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-6xl mb-2">▶️</div>
                        <p>Video would play here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildGallery;
