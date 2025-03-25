import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiSettings, FiHeart, FiStar, FiMessageCircle } from 'react-icons/fi';
import { BsChatLeftText, BsGoogle, BsStars, BsCloudSun } from 'react-icons/bs';
import { SiOpenai } from 'react-icons/si';
import { RiRobot2Line, RiBearSmileLine, RiMagicLine } from 'react-icons/ri';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
  aiModel?: string;
}

interface AIProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  requiresKey: boolean;
  isActive: boolean;
}

// Simulated AI response function
const simulateAIResponse = async (query: string, provider: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Convert query to lowercase for easier matching
  const queryLower = query.toLowerCase();
  
  // Common responses for both providers
  const commonResponses: Record<string, string> = {
    'hello': 'Hello! How can I help you with your baby today?',
    'hi': 'Hi there! I\'m here to help with any baby-related questions.',
    'help': 'I can help with questions about development milestones, feeding, sleep, activities, and other baby-related topics. What would you like to know?',
  };
  
  // Provider-specific responses for certain keywords
  const providerResponses: Record<string, Record<string, string>> = {
    'openai': {
      'development': "Based on leading pediatric research, babies typically start babbling around 6 months, say their first words between 10-14 months, and form simple sentences by 18-24 months. Remember that all babies develop at their own pace, within a normal range of variation.",
      'sleep': "For optimal development, most 6-12 month babies need 12-16 hours of sleep daily, including naps. Create a consistent bedtime routine with quiet activities like reading. If your baby wakes at night, briefly comfort them without turning on lights or playing.",
      'food': "When introducing solid foods, start with iron-fortified cereals around 6 months, followed by pureed fruits and vegetables. Introduce foods one at a time, waiting 3-5 days between new foods to watch for allergic reactions. Avoid honey until after 12 months due to botulism risk.",
    },
    'gemini': {
      'development': "Research shows that babies reach developmental milestones at varying ages. Typically, first words emerge between 11-13 months, rolling over happens around 4-6 months, and walking begins between 9-15 months. If you're concerned about significant delays, consult your pediatrician.",
      'sleep': "For healthy development, infants 4-12 months typically need 12-15 hours of sleep daily. Try establishing a calming bedtime routine and consistent schedule. Gentle sleep training methods like check-and-console can help babies learn to self-soothe if they're having trouble.",
      'food': "Current pediatric guidelines recommend introducing solid foods around 6 months while continuing breast milk or formula. Begin with iron-rich foods like fortified cereals or pureed meats. Follow your baby's hunger and fullness cues, and introduce potential allergens early (except honey) under medical guidance.",
    }
  };
  
  // Check for matching responses based on provider
  if (commonResponses[queryLower]) {
    return commonResponses[queryLower];
  }
  
  // Check for keyword matches in provider-specific responses
  for (const keyword in providerResponses[provider]) {
    if (queryLower.includes(keyword)) {
      return providerResponses[provider][keyword];
    }
  }
  
  // Default fallback responses by provider
  if (provider === 'openai') {
    return "I've analyzed your question about baby care. While I don't have a specific answer ready, I recommend consulting your pediatrician who can provide personalized guidance based on your baby's health history and development. Would you like me to suggest some general resources on this topic?";
  } else {
    return "Based on my analysis, this is a nuanced question that may depend on your specific situation. I'd recommend consulting with your child's healthcare provider for personalized advice. In the meantime, I can provide you with some general information resources if you'd like.";
  }
};

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your BabyBloom AI assistant. I can help with development questions, suggest activities, analyze milestones, and more. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      aiModel: 'default'
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions' | 'settings'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<Record<string, string>>({
    openai: '',
    gemini: ''
  });
  const [savedKeys, setSavedKeys] = useState<Record<string, string>>({
    openai: '',
    gemini: ''
  });
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');
  const [showSettingsSuccess, setShowSettingsSuccess] = useState(false);
  const [favoriteQuestions, setFavoriteQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AI providers configuration
  const aiProviders: AIProvider[] = [
    {
      id: 'openai',
      name: 'ChatGPT',
      icon: <SiOpenai className="text-green-500" />,
      requiresKey: true,
      isActive: selectedProvider === 'openai'
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      icon: <BsGoogle className="text-blue-500" />,
      requiresKey: true,
      isActive: selectedProvider === 'gemini'
    }
  ];

  // Sample suggested questions categorized
  const suggestedQuestionCategories = [
    {
      title: "Development Milestones",
      icon: <BsStars className="text-purple-500" />,
      color: "gradient-purple",
      questions: [
        "When should my baby start saying first words?",
        "What are the typical motor skills at 10 months?",
        "When should I be concerned about developmental delays?"
      ]
    },
    {
      title: "Nutrition & Feeding",
      icon: <FiSettings className="text-green-500" />,
      color: "gradient-mint",
      questions: [
        "What foods should I introduce to my 8-month-old?",
        "How much formula should my baby drink daily?",
        "When can my baby start eating finger foods?"
      ]
    },
    {
      title: "Sleep & Comfort",
      icon: <BsChatLeftText className="text-blue-500" />,
      color: "gradient-blue",
      questions: [
        "Is my baby's sleep schedule normal for their age?",
        "How do I manage teething pain?",
        "What's the best bedtime routine for a 1-year-old?"
      ]
    },
    {
      title: "Health & Wellness",
      icon: <RiRobot2Line className="text-pink-500" />,
      color: "gradient-pink",
      questions: [
        "How to tell if my baby has a fever?",
        "What vaccinations are needed in the first year?",
        "How to treat diaper rash naturally?"
      ]
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedOpenAIKey = localStorage.getItem('openai_api_key');
    const savedGeminiKey = localStorage.getItem('gemini_api_key');
    
    if (savedOpenAIKey) {
      setSavedKeys(prev => ({ ...prev, openai: savedOpenAIKey }));
      setApiKey(prev => ({ ...prev, openai: savedOpenAIKey }));
    }
    
    if (savedGeminiKey) {
      setSavedKeys(prev => ({ ...prev, gemini: savedGeminiKey }));
      setApiKey(prev => ({ ...prev, gemini: savedGeminiKey }));
    }

    // Load favorite questions
    const savedFavorites = localStorage.getItem('babybloom-favorite-questions');
    if (savedFavorites) {
      try {
        setFavoriteQuestions(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorite questions:', error);
      }
    }
  }, []);

  const toggleFavoriteQuestion = (question: string) => {
    let updatedFavorites;
    if (favoriteQuestions.includes(question)) {
      updatedFavorites = favoriteQuestions.filter(q => q !== question);
    } else {
      updatedFavorites = [...favoriteQuestions, question];
    }
    
    setFavoriteQuestions(updatedFavorites);
    localStorage.setItem('babybloom-favorite-questions', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (question: string) => {
    return favoriteQuestions.includes(question);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessageId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMessageId,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add loading message
    const loadingMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: loadingMessageId,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isLoading: true,
      aiModel: selectedProvider
    };

    setMessages(prev => [...prev, newUserMessage, loadingMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to OpenAI or Google Gemini
      const response = await simulateAIResponse(inputValue, selectedProvider);
      
      // Replace loading message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessageId 
            ? {
                id: loadingMessageId,
                text: response,
                sender: 'ai',
                timestamp: new Date(),
                aiModel: selectedProvider
              } 
            : msg
        )
      );
    } catch (error) {
      // Handle error case
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessageId 
            ? {
                id: loadingMessageId,
                text: "Sorry, I encountered an error processing your request. Please try again or check your API settings.",
                sender: 'ai',
                timestamp: new Date(),
                aiModel: selectedProvider
              } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    setActiveTab('chat');
    
    // Focus the input field after setting the value
    const inputField = document.getElementById('messageInput');
    if (inputField) {
      inputField.focus();
    }
  };

  const saveAPIKeys = () => {
    // Save API keys to localStorage
    if (apiKey.openai) {
      localStorage.setItem('openai_api_key', apiKey.openai);
      setSavedKeys(prev => ({ ...prev, openai: apiKey.openai }));
    }
    
    if (apiKey.gemini) {
      localStorage.setItem('gemini_api_key', apiKey.gemini);
      setSavedKeys(prev => ({ ...prev, gemini: apiKey.gemini }));
    }
    
    // Show success message
    setShowSettingsSuccess(true);
    setTimeout(() => {
      setShowSettingsSuccess(false);
    }, 3000);
  };

  // Function to determine if we have API keys saved
  const hasApiKey = (providerId: string) => {
    return savedKeys[providerId as keyof typeof savedKeys]?.length > 0;
  };

  const renderMessageBubble = (message: Message) => {
    if (message.isLoading) {
      return (
        <div className="flex justify-start mb-4">
          <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-[80%] shadow-soft border border-gray-100 dark:border-gray-600">
            <div className="flex items-center">
              <div className="mr-3 h-8 w-8 rounded-full bg-gradient-to-r from-lavender to-babypink flex items-center justify-center animate-pulse">
                <RiBearSmileLine className="text-white" />
              </div>
              <div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="h-2 w-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Thinking...</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (message.sender === 'user') {
      return (
        <div className="flex justify-end mb-4">
          <div className="bg-gradient-to-r from-lavender to-babypink text-white rounded-2xl px-4 py-3 max-w-[80%] shadow-soft">
            <p className="leading-relaxed">{message.text}</p>
            <div className="text-xs text-right mt-2 opacity-70 flex items-center justify-end">
              <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex justify-start mb-4">
          <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-[80%] shadow-soft border border-gray-100 dark:border-gray-600">
            <div className="flex items-center mb-2">
              <div className="mr-2 h-6 w-6 rounded-full bg-gradient-to-r from-lavender to-babypink flex items-center justify-center">
                <RiBearSmileLine className="text-white text-xs" />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {message.aiModel === 'openai' 
                  ? 'ChatGPT Assistant' 
                  : message.aiModel === 'gemini'
                    ? 'Gemini Assistant'
                    : 'BabyBloom AI'}
              </span>
            </div>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{message.text}</p>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                {message.aiModel && message.aiModel !== 'default' && (
                  <span className="flex items-center bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                    {message.aiModel === 'openai' 
                      ? <><SiOpenai className="mr-1 text-green-500" /> ChatGPT</> 
                      : <><BsGoogle className="mr-1 text-blue-500" /> Gemini</>}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 animate-gradient-x">
      {/* Header with cute animation */}
      <div className="text-center pt-6 pb-4 relative">
        <div className="absolute top-2 left-2 w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-full opacity-30 animate-float" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-10 right-10 w-5 h-5 bg-yellow-100 dark:bg-yellow-800 rounded-full opacity-30 animate-float" style={{ animationDelay: '0.9s' }}></div>
        <div className="absolute bottom-2 left-1/4 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full opacity-30 animate-float" style={{ animationDelay: '0.5s' }}></div>
        
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lavender via-lavender-light to-babypink transform rotate-12 flex items-center justify-center mx-auto mb-2 shadow-glow relative overflow-hidden group transition-all duration-300 hover:rotate-0">
          <div className="absolute inset-0 bg-white opacity-20 group-hover:opacity-10 transition-opacity"></div>
          <RiBearSmileLine className="text-white text-3xl transform -rotate-12 group-hover:rotate-0 transition-all duration-300 group-hover:scale-110" />
        </div>
        <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-lavender to-babypink-light bg-clip-text text-transparent mt-3">Baby Bloom AI Assistant</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 max-w-xs mx-auto">Your friendly AI guide to baby development and parenting tips</p>
      </div>

      {/* Tab navigation - Softer, rounder tabs */}
      <div className="flex justify-center px-4 mb-4">
        <div className="flex gap-3 bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-elevated border border-gray-100 dark:border-gray-700">
          <button 
            className={`flex items-center px-4 py-2.5 transition-all rounded-2xl font-medium text-sm ${
              activeTab === 'chat' 
                ? 'text-white bg-gradient-to-r from-lavender to-babypink shadow-soft' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-lavender'
            }`}
            onClick={() => setActiveTab('chat')}
          >
            <FiMessageCircle className={`${activeTab === 'chat' ? 'text-white' : 'text-lavender'} mr-2`} />
            <span>Chat</span>
          </button>
          <button 
            className={`flex items-center px-4 py-2.5 transition-all rounded-2xl font-medium text-sm ${
              activeTab === 'suggestions' 
                ? 'text-white bg-gradient-to-r from-cyan-400 to-blue-500 shadow-soft' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('suggestions')}
          >
            <RiMagicLine className={`${activeTab === 'suggestions' ? 'text-white' : 'text-blue-500'} mr-2`} />
            <span>Ideas</span>
          </button>
          <button 
            className={`flex items-center px-4 py-2.5 transition-all rounded-2xl font-medium text-sm ${
              activeTab === 'settings' 
                ? 'text-white bg-gradient-to-r from-amber-400 to-orange-400 shadow-soft' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-amber-500'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings className={`${activeTab === 'settings' ? 'text-white' : 'text-amber-500'} mr-2`} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden px-3 relative">
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-900 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/3 -right-5 w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-900 rounded-full opacity-20 blur-xl"></div>

        {activeTab === 'chat' && (
          <div className="flex flex-col h-full relative">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-5 bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-sm rounded-3xl mb-3 shadow-inner" style={{ minHeight: '65vh' }}>
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className="animate-fade-in">
                      {renderMessageBubble(message)}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 py-10 animate-fade-in">
                  <RiBearSmileLine className="text-5xl text-lavender mb-4 animate-bounce" style={{ animationDuration: '2s' }} />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Welcome to Baby Bloom AI!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                    I'm here to help with all your parenting questions. Ask me anything about your baby's development, feeding, sleep, and more!
                  </p>
                </div>
              )}
            </div>
            
            {/* AI Provider Selection */}
            <div className="px-5 py-4 mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-soft">
              <div className="flex justify-start space-x-3 mb-3">
                {aiProviders.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    disabled={!hasApiKey(provider.id)}
                    className={`px-3 py-1.5 rounded-full flex items-center text-xs font-medium transition-all transform hover:-translate-y-1 active:translate-y-0
                      ${provider.id === selectedProvider 
                        ? provider.id === 'openai' 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-soft' 
                          : 'bg-gradient-to-r from-blue-400 to-indigo-600 text-white shadow-soft'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} 
                      ${!hasApiKey(provider.id) 
                        ? 'opacity-50 cursor-not-allowed hover:translate-y-0' 
                        : ''}`}
                  >
                    <span className="mr-1.5">{provider.icon}</span>
                    {provider.name}
                  </button>
                ))}
              </div>
              
              {/* Input area */}
              <div className="flex items-center bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-600 shadow-soft transition-shadow focus-within:shadow-glow focus-within:border-lavender">
                <textarea
                  id="messageInput"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your baby..."
                  className="flex-1 p-4 rounded-l-2xl outline-none resize-none bg-transparent dark:text-white font-rounded"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || inputValue.trim() === ''}
                  className={`p-4 rounded-r-2xl transition-all ${
                    isLoading || inputValue.trim() === '' 
                      ? 'text-gray-400 dark:text-gray-600' 
                      : 'text-white bg-gradient-to-r from-lavender to-babypink hover:from-lavender-light hover:to-babypink-light'
                  }`}
                >
                  <FiSend className={`transform transition-transform duration-300 ${
                    isLoading || inputValue.trim() === '' ? '' : 'hover:rotate-45'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="p-4 animate-fade-in-up overflow-y-auto bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-sm rounded-3xl shadow-soft">
            {favoriteQuestions.length > 0 && (
              <div className="mb-6 animate-fade-in-up">
                <h3 className="text-md font-display font-bold mb-3 flex items-center text-gray-700 dark:text-gray-200">
                  <FiHeart className="text-babypink mr-2" /> Your Favorite Questions
                </h3>
                <div className="space-y-2">
                  {favoriteQuestions.map((question, index) => (
                    <div key={`fav-${index}`} className="flex items-center">
                      <button
                        onClick={() => handleSuggestedQuestion(question)}
                        className="flex-1 text-left p-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-soft hover:-translate-y-1 active:translate-y-0 transition-all text-gray-800 dark:text-gray-200"
                      >
                        <span className="font-medium">{question}</span>
                      </button>
                      <button 
                        onClick={() => toggleFavoriteQuestion(question)}
                        className="ml-2 p-2 text-babypink"
                      >
                        <FiHeart className="text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedQuestionCategories.map((category, index) => (
                <div key={index} className="relative overflow-hidden">
                  <div className={`p-4 bg-${category.color === 'gradient-purple' ? 'lavender' : category.color === 'gradient-mint' ? 'teal' : category.color === 'gradient-blue' ? 'blue' : 'pink'}-50 dark:bg-gray-700 rounded-2xl hover:shadow-soft transition-all group`}>
                    <h3 className={`text-md font-display font-bold mb-3 flex items-center text-${category.color === 'gradient-purple' ? 'lavender' : category.color === 'gradient-mint' ? 'teal' : category.color === 'gradient-blue' ? 'blue' : 'pink'}-500 dark:text-${category.color === 'gradient-purple' ? 'lavender' : category.color === 'gradient-mint' ? 'teal' : category.color === 'gradient-blue' ? 'blue' : 'pink'}-300`}>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r from-${category.color === 'gradient-purple' ? 'lavender' : category.color === 'gradient-mint' ? 'teal' : category.color === 'gradient-blue' ? 'blue' : 'pink'}-400 to-${category.color === 'gradient-purple' ? 'lavender' : category.color === 'gradient-mint' ? 'teal' : category.color === 'gradient-blue' ? 'blue' : 'pink'}-500 flex items-center justify-center mr-2 shadow-soft`}>
                        {category.icon}
                      </div>
                      {category.title}
                    </h3>
                    <div className="space-y-2">
                      {category.questions.map((question, qIndex) => (
                        <div key={`${index}-${qIndex}`} className="flex items-center">
                          <button
                            onClick={() => handleSuggestedQuestion(question)}
                            className={`flex-1 text-left p-3 bg-white dark:bg-gray-800 rounded-xl hover:shadow-soft hover:-translate-y-1 active:translate-y-0 transition-all text-gray-800 dark:text-gray-200 border border-${category.color === 'gradient-purple' ? 'lavender' : category.color === 'gradient-mint' ? 'teal' : category.color === 'gradient-blue' ? 'blue' : 'pink'}-100 dark:border-gray-700`}
                          >
                            <span className="font-medium">{question}</span>
                          </button>
                          <button 
                            onClick={() => toggleFavoriteQuestion(question)}
                            className={`ml-2 p-2 text-${isFavorite(question) ? 'babypink' : 'gray-400 hover:text-babypink'} transition-colors`}
                          >
                            <FiHeart className={`text-lg ${isFavorite(question) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 animate-fade-in-up bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-sm rounded-3xl shadow-soft">
            <h2 className="text-xl font-display font-bold mb-5 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">AI Assistant Settings</h2>
            
            <div className="space-y-6">
              {aiProviders.map(provider => (
                <div key={provider.id} className="bg-white dark:bg-gray-700 p-4 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-soft">
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-xl ${provider.id === 'openai' ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-gradient-to-r from-blue-400 to-indigo-600'} flex items-center justify-center mr-3 shadow-soft`}>
                      {provider.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">{provider.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {provider.requiresKey 
                          ? hasApiKey(provider.id) 
                            ? "API key configured" 
                            : "Requires API key" 
                          : "No API key required"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor={`${provider.id}_api_key`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API Key
                    </label>
                    <div className="flex">
                      <input
                        type="password"
                        id={`${provider.id}_api_key`}
                        value={apiKey[provider.id as keyof typeof apiKey] || ''}
                        onChange={(e) => setApiKey({...apiKey, [provider.id]: e.target.value})}
                        placeholder={`Enter your ${provider.name} API key`}
                        className="flex-1 p-3 rounded-l-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-lavender dark:focus:ring-babypink focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const inputField = document.getElementById(`${provider.id}_api_key`) as HTMLInputElement;
                          if (inputField.type === 'password') {
                            inputField.type = 'text';
                          } else {
                            inputField.type = 'password';
                          }
                        }}
                        className="px-3 py-3 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <FiStar className="text-base" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {provider.id === 'openai' 
                        ? "Available at https://platform.openai.com/account/api-keys" 
                        : "Available at https://makersuite.google.com/app/apikey"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={saveAPIKeys}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium shadow-soft hover:shadow-glow hover:-translate-y-1 active:translate-y-0 transition-all flex items-center"
              >
                <FiSettings className="mr-2" />
                Save Settings
              </button>
            </div>
            
            {showSettingsSuccess && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl text-green-800 dark:text-green-200 flex items-center animate-fade-in">
                <BsCloudSun className="text-green-500 mr-2" />
                <span>Settings saved successfully!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
