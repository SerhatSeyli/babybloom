import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { format } from 'date-fns';
import { 
  FiLink, 
  FiCheck, 
  FiUsers, 
  FiLock, 
  FiGlobe, 
  FiCopy,
  FiHeart,
  FiMessageSquare,
  FiPlus,
  FiShare2,
  FiMail,
  FiCalendar
} from 'react-icons/fi';
import { RiWhatsappLine } from 'react-icons/ri';
import { FaFacebook, FaTwitter } from 'react-icons/fa';

interface ShareableEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'none';
  privacy: 'private' | 'family' | 'public';
  linkGenerated: boolean;
  shareLink?: string;
  likes: number;
  comments: number;
  shared: boolean;
}

interface Family {
  id: string;
  name: string;
  relationship: string;
  email: string;
  hasAccess: boolean;
}

const ShareMoments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [childName, setChildName] = useState('');
  const [events, setEvents] = useState<ShareableEvent[]>([]);
  const [showFamilySettings, setShowFamilySettings] = useState(false);
  const [family, setFamily] = useState<Family[]>([]);
  const [newFamilyMember, setNewFamilyMember] = useState({
    name: '',
    relationship: '',
    email: ''
  });
  const [linkCopied, setLinkCopied] = useState<string | null>(null);

  // Mock data - would come from API in real app
  useEffect(() => {
    // Set child name based on ID
    if (id === '1') {
      setChildName('Emma');
    } else if (id === '2') {
      setChildName('Noah');
    }

    // Mock family members
    const mockFamily: Family[] = [
      {
        id: '1',
        name: 'Grandma Susan',
        relationship: 'Grandmother',
        email: 'grandma.susan@example.com',
        hasAccess: true
      },
      {
        id: '2',
        name: 'Grandpa Joe',
        relationship: 'Grandfather',
        email: 'grandpa.joe@example.com',
        hasAccess: true
      },
      {
        id: '3',
        name: 'Uncle Mike',
        relationship: 'Uncle',
        email: 'uncle.mike@example.com',
        hasAccess: false
      },
      {
        id: '4',
        name: 'Aunt Sarah',
        relationship: 'Aunt',
        email: 'aunt.sarah@example.com',
        hasAccess: true
      }
    ];

    setFamily(mockFamily);

    // Mock shareable events
    const mockEvents: ShareableEvent[] = [
      {
        id: '1',
        title: 'First Steps!',
        description: 'Emma took her first steps today! She walked from the couch to the coffee table without falling.',
        date: new Date('2024-03-14'),
        mediaUrl: 'https://via.placeholder.com/800x600/FF5733/FFFFFF?text=First+Steps',
        mediaType: 'video',
        privacy: 'family',
        linkGenerated: true,
        shareLink: 'https://babybloom.app/share/abc123',
        likes: 12,
        comments: 5,
        shared: true
      },
      {
        id: '2',
        title: '9-Month Checkup',
        description: 'Regular checkup with Dr. Smith. Weight: 18 lbs, Height: 28 inches. All development on track.',
        date: new Date('2024-02-19'),
        mediaType: 'none',
        privacy: 'private',
        linkGenerated: false,
        likes: 0,
        comments: 0,
        shared: false
      },
      {
        id: '3',
        title: 'First Word: Mama',
        description: "Emma said 'Mama' clearly for the first time while reaching for me!",
        date: new Date('2023-11-10'),
        mediaUrl: 'https://via.placeholder.com/800x600/33A8FF/FFFFFF?text=First+Word',
        mediaType: 'image',
        privacy: 'public',
        linkGenerated: true,
        shareLink: 'https://babybloom.app/share/def456',
        likes: 24,
        comments: 8,
        shared: true
      },
      {
        id: '4',
        title: 'Birthday Party',
        description: "Emma's first birthday party! So many friends and family came to celebrate.",
        date: new Date('2024-06-15'),
        mediaUrl: 'https://via.placeholder.com/800x600/33FF57/FFFFFF?text=Birthday+Party',
        mediaType: 'image',
        privacy: 'family',
        linkGenerated: true,
        shareLink: 'https://babybloom.app/share/ghi789',
        likes: 18,
        comments: 7,
        shared: true
      }
    ];

    setEvents(mockEvents);
  }, [id]);

  // Generate a share link for an event
  const generateShareLink = (eventId: string) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const randomStr = Math.random().toString(36).substring(2, 8);
        return {
          ...event,
          linkGenerated: true,
          shareLink: `https://babybloom.app/share/${randomStr}`
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
  };

  // Copy share link to clipboard
  const copyShareLink = (link: string, eventId: string) => {
    navigator.clipboard.writeText(link);
    setLinkCopied(eventId);
    
    // Reset the "Copied" status after 2 seconds
    setTimeout(() => {
      setLinkCopied(null);
    }, 2000);
  };

  // Update privacy setting for an event
  const updatePrivacy = (eventId: string, privacy: 'private' | 'family' | 'public') => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          privacy
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
  };

  // Add a new family member
  const addFamilyMember = () => {
    if (!newFamilyMember.name || !newFamilyMember.email) return;
    
    const newId = (Math.max(...family.map(f => parseInt(f.id))) + 1).toString();
    const newMember: Family = {
      id: newId,
      name: newFamilyMember.name,
      relationship: newFamilyMember.relationship,
      email: newFamilyMember.email,
      hasAccess: true
    };
    
    setFamily([...family, newMember]);
    setNewFamilyMember({
      name: '',
      relationship: '',
      email: ''
    });
  };

  // Toggle access for a family member
  const toggleFamilyAccess = (familyId: string) => {
    const updatedFamily = family.map(member => {
      if (member.id === familyId) {
        return {
          ...member,
          hasAccess: !member.hasAccess
        };
      }
      return member;
    });
    
    setFamily(updatedFamily);
  };

  // Get icon for privacy setting
  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'private':
        return <FiLock className="text-gray-600 dark:text-gray-300" />;
      case 'family':
        return <FiUsers className="text-blue-500 dark:text-blue-400" />;
      case 'public':
        return <FiGlobe className="text-green-500 dark:text-green-400" />;
      default:
        return <FiLock className="text-gray-600 dark:text-gray-300" />;
    }
  };

  // Get color for privacy setting
  const getPrivacyColor = (privacy: string) => {
    switch (privacy) {
      case 'private':
        return 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
      case 'family':
        return 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
      case 'public':
        return 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300';
      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg baby-pattern-confetti pb-16">
      <Navbar title={`Share ${childName}'s Moments`} showBackButton={true} />
      
      <div className="p-5 max-w-3xl mx-auto">
        {/* Family Access Settings */}
        <div className="mb-6 rounded-xl shadow-soft overflow-hidden bg-white dark:bg-dark-card animate-fade-in">
          <div 
            className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setShowFamilySettings(!showFamilySettings)}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full gradient-blue flex items-center justify-center shadow-soft mr-4">
                <FiUsers className="text-xl text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white">Family Access</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage who can see {childName}'s special moments
                </p>
              </div>
            </div>
            <div className={`${showFamilySettings ? 'rotate-180' : ''} transition-transform p-2 rounded-full bg-gray-100 dark:bg-gray-800`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          
          {showFamilySettings && (
            <div className="p-5 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
              <h4 className="font-display font-bold text-lg text-gray-800 dark:text-white mb-4 flex items-center">
                <FiUsers className="mr-2 text-blue-500 dark:text-blue-400" />
                Family Members
              </h4>
              
              <div className="space-y-3 mb-6">
                {family.map((member, index) => (
                  <div 
                    key={member.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 shadow-soft hover:shadow-elevated transition-all animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{member.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                        {member.relationship} • {member.email}
                      </p>
                    </div>
                    <button 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        member.hasAccess 
                          ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => toggleFamilyAccess(member.id)}
                    >
                      {member.hasAccess ? <FiCheck className="text-white" /> : <FiLock />}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-soft mb-2">
                <h4 className="font-display font-bold text-lg text-gray-800 dark:text-white mb-4 flex items-center">
                  <FiPlus className="mr-2 text-blue-500 dark:text-blue-400" />
                  Add Family Member
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input 
                      type="text"
                      value={newFamilyMember.name}
                      onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                      placeholder="Enter name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Relationship
                    </label>
                    <input 
                      type="text"
                      value={newFamilyMember.relationship}
                      onChange={(e) => setNewFamilyMember({...newFamilyMember, relationship: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                      placeholder="E.g., Grandmother, Uncle, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input 
                      type="email"
                      value={newFamilyMember.email}
                      onChange={(e) => setNewFamilyMember({...newFamilyMember, email: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-pressed focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-elevated transition-all flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0"
                    onClick={addFamilyMember}
                  >
                    <FiPlus className="mr-2" />
                    Add Family Member
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Shareable Moments */}
        <div className="flex items-center mb-5">
          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center mr-3 shadow-soft">
            <FiShare2 className="text-white" />
          </div>
          <h3 className="font-display font-bold text-xl text-gray-800 dark:text-white">Shareable Moments</h3>
        </div>
        
        <div className="space-y-6">
          {events.map((event, index) => (
            <div 
              key={event.id}
              className="rounded-xl shadow-soft overflow-hidden bg-white dark:bg-dark-card hover:shadow-elevated transition-all animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Media section */}
              {event.mediaType !== 'none' && event.mediaUrl && (
                <div className="relative">
                  <img 
                    src={event.mediaUrl}
                    alt={event.title}
                    className="w-full h-60 object-cover"
                  />
                  {event.mediaType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="bg-white bg-opacity-90 rounded-full p-4 shadow-elevated hover:bg-opacity-100 transition-all cursor-pointer transform hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white py-1 px-3 rounded-full text-xs font-medium shadow-soft">
                    {event.mediaType === 'video' ? 'Video' : 'Photo'}
                  </div>
                </div>
              )}
              
              {/* Content section */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-800 dark:text-white mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FiCalendar className="mr-1 text-primary" />
                      {format(event.date, 'MMMM d, yyyy')}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`py-1 px-3 rounded-full ${getPrivacyColor(event.privacy)} flex items-center shadow-soft`}>
                      {getPrivacyIcon(event.privacy)}
                      <select
                        value={event.privacy}
                        onChange={(e) => updatePrivacy(event.id, e.target.value as any)}
                        className="ml-2 text-sm border-none bg-transparent focus:outline-none font-medium"
                      >
                        <option value="private">Only Me</option>
                        <option value="family">Family Only</option>
                        <option value="public">Public</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <p className="my-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-pressed">
                  {event.description}
                </p>
                
                {/* Social stats */}
                {event.shared && (
                  <div className="flex space-x-5 my-4 px-2">
                    <div className="flex items-center group cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-gray-800 flex items-center justify-center mr-2 group-hover:bg-red-100 dark:group-hover:bg-red-900 transition-colors">
                        <FiHeart className="text-red-400 dark:text-red-300 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {event.likes} likes
                      </span>
                    </div>
                    <div className="flex items-center group cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-gray-800 flex items-center justify-center mr-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                        <FiMessageSquare className="text-blue-400 dark:text-blue-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {event.comments} comments
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Share options */}
                <div>
                  {event.privacy !== 'private' && (
                    <div>
                      {!event.linkGenerated ? (
                        <button
                          className="mt-3 flex items-center py-3 px-4 rounded-xl w-full justify-center bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5 active:translate-y-0"
                          onClick={() => generateShareLink(event.id)}
                        >
                          <FiLink className="mr-2" />
                          Generate Share Link
                        </button>
                      ) : (
                        <>
                          <div className="mt-4 rounded-xl overflow-hidden shadow-pressed">
                            <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                              SHARE LINK
                            </div>
                            <div className="flex items-center bg-white dark:bg-gray-900">
                              <input
                                type="text"
                                value={event.shareLink}
                                readOnly
                                className="flex-1 p-3 border-none bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none"
                              />
                              <button
                                className={`p-3 flex items-center justify-center transition-all ${
                                  linkCopied === event.id
                                    ? 'bg-green-400 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                                onClick={() => event.shareLink && copyShareLink(event.shareLink, event.id)}
                              >
                                {linkCopied === event.id ? <FiCheck className="text-lg" /> : <FiCopy className="text-lg" />}
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Share via:</p>
                            <div className="grid grid-cols-3 gap-3">
                              <button className="py-3 px-2 rounded-xl flex items-center justify-center bg-gradient-to-r from-green-400 to-green-500 text-white shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5 active:translate-y-0">
                                <RiWhatsappLine className="mr-2 text-lg" />
                                WhatsApp
                              </button>
                              <button className="py-3 px-2 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5 active:translate-y-0">
                                <FaFacebook className="mr-2 text-lg" />
                                Facebook
                              </button>
                              <button className="py-3 px-2 rounded-xl flex items-center justify-center bg-gradient-to-r from-cyan-400 to-cyan-500 text-white shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5 active:translate-y-0">
                                <FaTwitter className="mr-2 text-lg" />
                                Twitter
                              </button>
                            </div>
                            <button className="mt-3 py-3 px-4 rounded-xl flex items-center justify-center w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5 active:translate-y-0">
                              <FiMail className="mr-2" />
                              Send via Email
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="rounded-xl shadow-soft p-10 text-center bg-white dark:bg-dark-card animate-fade-in">
              <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center shadow-soft">
                <FiShare2 className="text-3xl text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-800 dark:text-white mb-2">No Shareable Moments Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create moments from your child's timeline or gallery to share with family and friends
              </p>
              <button className="py-3 px-4 rounded-xl bg-gradient-primary text-white shadow-soft hover:shadow-elevated transition-all flex items-center justify-center mx-auto hover:-translate-y-0.5 active:translate-y-0">
                <FiPlus className="mr-2" />
                Create Your First Moment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareMoments;
