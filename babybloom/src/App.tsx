import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import BottomNavigation from './components/BottomNavigation';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import AIAssistant from './pages/AIAssistant';
import ChildTimeline from './pages/ChildTimeline';
import GrowthCharts from './pages/GrowthCharts';
import ShareMoments from './pages/ShareMoments';
import AddChild from './pages/AddChild';
import ChildDashboard from './pages/ChildDashboard';
import ChildGallery from './pages/ChildGallery';
import ParentingTips from './pages/ParentingTips';
import Gallery from './pages/Gallery';

// App layout wrapper with navigation
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Show back button on pages that aren't the main navigation pages
  const shouldShowBackButton = () => {
    const path = location.pathname;
    return ![
      '/', 
      '/calendar', 
      '/gallery',
      '/ai-assistant'
    ].includes(path);
  };
  
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/calendar') return 'Calendar';
    if (path === '/gallery') return 'Gallery';
    if (path === '/ai-assistant') return 'AI Assistant';
    
    // Child profile related pages
    if (path.startsWith('/child/')) {
      const segments = path.split('/');
      if (segments.length >= 4) {
        if (segments[3] === 'timeline') return 'Timeline';
        if (segments[3] === 'growth') return 'Growth Charts';
        if (segments[3] === 'share') return 'Share Moments';
        if (segments[3] === 'dashboard') return 'Dashboard';
        if (segments[3] === 'gallery') return 'Gallery';
      }
      return 'Child Profile';
    }
    
    if (path === '/add-child') return 'Add Child';
    if (path === '/parenting-tips') return 'Parenting Tips';
    
    return 'BabyBloom';
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white">
      <Navbar title={getTitle()} showBackButton={shouldShowBackButton()} />
      <div className="flex-1 pb-16 w-full overflow-x-hidden">
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={
          <AppLayout>
            <Home />
          </AppLayout>
        } />
        <Route path="/calendar" element={
          <AppLayout>
            <Calendar />
          </AppLayout>
        } />
        <Route path="/gallery" element={
          <AppLayout>
            <Gallery />
          </AppLayout>
        } />
        <Route path="/ai-assistant" element={
          <AppLayout>
            <AIAssistant />
          </AppLayout>
        } />
        
        {/* Add Child route */}
        <Route path="/add-child" element={
          <AppLayout>
            <AddChild />
          </AppLayout>
        } />

        {/* Parenting Tips route */}
        <Route path="/parenting-tips" element={
          <AppLayout>
            <ParentingTips />
          </AppLayout>
        } />
        
        {/* Child-specific routes */}
        <Route path="/child/:id/dashboard" element={
          <AppLayout>
            <ChildDashboard />
          </AppLayout>
        } />
        <Route path="/child/:id/timeline" element={
          <AppLayout>
            <ChildTimeline />
          </AppLayout>
        } />
        <Route path="/child/:id/growth" element={
          <AppLayout>
            <GrowthCharts />
          </AppLayout>
        } />
        <Route path="/child/:id/share" element={
          <AppLayout>
            <ShareMoments />
          </AppLayout>
        } />
        <Route path="/child/:id/gallery" element={
          <AppLayout>
            <ChildGallery />
          </AppLayout>
        } />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
