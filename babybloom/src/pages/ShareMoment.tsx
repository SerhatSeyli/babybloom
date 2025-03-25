import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiShare2, FiUsers, FiGlobe, FiLock, FiCopy, FiCheck } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

interface ShareableEvent {
  id: string;
  childId: string;
  childName: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

const ShareMoment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<ShareableEvent | null>(null);
  const [privacyLevel, setPrivacyLevel] = useState<'private' | 'family' | 'public'>('family');
  const [shareLink, setShareLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Mock data - would come from API in real app
  useEffect(() => {
    // Fetch event details from API
    // For now, using mock data
    const mockEvent: ShareableEvent = {
      id: '1',
      childId: '1',
      childName: 'Emma',
      title: 'First Steps',
      description: 'Emma took her first steps today! She walked from the couch to the coffee table without falling.',
      date: '2024-03-14',
      imageUrl: 'https://via.placeholder.com/400x300'
    };
    
    setEvent(mockEvent);
    
    // Generate a mock share link
    const baseUrl = window.location.origin;
    setShareLink(`${baseUrl}/shared/${id}?token=abc123xyz456`);
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = () => {
    // In a real app, this would save the sharing preferences and send out emails if specified
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
      // Navigate back to the event
      navigate(`/child/${event?.childId}/timeline`);
    }, 3000);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-4 text-center">
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Share Moment" showBackButton={true} />
      
      <div className="p-4">
        {/* Event Preview */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-1">{event.title}</h2>
            <p className="text-sm text-gray-500 mb-3">
              {event.childName} • {new Date(event.date).toLocaleDateString()}
            </p>
            
            {event.imageUrl && (
              <div className="mb-3 rounded-lg overflow-hidden">
                <img src={event.imageUrl} alt={event.title} className="w-full h-auto" />
              </div>
            )}
            
            <p className="text-gray-700">{event.description}</p>
          </div>
        </div>
        
        {/* Share Options */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-medium mb-3">Privacy Settings</h3>
          
          <div className="space-y-2">
            <button 
              className={`w-full flex items-center p-3 rounded-lg border ${
                privacyLevel === 'private' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
              }`}
              onClick={() => setPrivacyLevel('private')}
            >
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FiLock className="text-blue-500" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Private</h4>
                <p className="text-xs text-gray-500">Only visible to you</p>
              </div>
            </button>
            
            <button 
              className={`w-full flex items-center p-3 rounded-lg border ${
                privacyLevel === 'family' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
              }`}
              onClick={() => setPrivacyLevel('family')}
            >
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FiUsers className="text-blue-500" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Family & Friends</h4>
                <p className="text-xs text-gray-500">Only visible to people you share with</p>
              </div>
            </button>
            
            <button 
              className={`w-full flex items-center p-3 rounded-lg border ${
                privacyLevel === 'public' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
              }`}
              onClick={() => setPrivacyLevel('public')}
            >
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FiGlobe className="text-blue-500" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Public</h4>
                <p className="text-xs text-gray-500">Anyone with the link can view</p>
              </div>
            </button>
          </div>
        </div>
        
        {/* Share Link */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-medium mb-3">Share Link</h3>
          
          <div className="flex">
            <input 
              type="text" 
              value={shareLink} 
              readOnly 
              className="flex-1 p-2 border border-gray-300 rounded-l-md bg-gray-50"
            />
            <button 
              onClick={handleCopyLink}
              className="px-4 py-2 bg-primary text-white rounded-r-md flex items-center"
            >
              {copied ? <FiCheck /> : <FiCopy />}
              <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
        
        {/* Share via Email */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-medium mb-3">Share via Email</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Recipients (separate with commas)
              </label>
              <input 
                type="text" 
                value={emailRecipients} 
                onChange={(e) => setEmailRecipients(e.target.value)}
                placeholder="grandma@example.com, grandpa@example.com"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Message (optional)
              </label>
              <textarea 
                value={customMessage} 
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Check out this special moment from Emma!"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Share on Social Media */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-medium mb-3">Share on Social Media</h3>
          
          <div className="flex space-x-4 justify-center">
            <button className="p-3 bg-blue-600 text-white rounded-full">
              <FaFacebook />
            </button>
            <button className="p-3 bg-blue-400 text-white rounded-full">
              <FaTwitter />
            </button>
            <button className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
              <FaInstagram />
            </button>
            <button className="p-3 bg-green-500 text-white rounded-full">
              <FaWhatsapp />
            </button>
          </div>
        </div>
        
        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="w-full py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center"
        >
          <FiShare2 className="mr-2" />
          Share Moment
        </button>
        
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed bottom-20 left-0 right-0 mx-auto w-11/12 max-w-md bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg shadow-lg flex items-center">
            <FiCheck className="mr-2" />
            Moment shared successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareMoment;
