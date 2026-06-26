import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import ChatWindow from './components/Chat/ChatWindow';
import InputBar from './components/Input/InputBar';
import SidebarToggle from './components/UI/SidebarToggle';
import LandingPage from './components/Landing/LandingPage';
import { useSessions } from './hooks/useSessions';
import { useChat } from './hooks/useChat';
import DocPage from './components/DocPage';

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  // Session State
  const { 
    sessions, 
    currentSession, 
    currentSessionId, 
    createSession, 
    selectSession, 
    updateSessionMessages,
    deleteSession,
    clearAllSessions,
    getGroupedSessions
  } = useSessions();

  // Chat State
  const { sendMessage, isLoading, error, suggestions, suggestionsVisible, setSuggestionsVisible } = useChat(
    currentSessionId, 
    currentSession?.messages, 
    updateSessionMessages
  );

  // UI State
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Handle URL history state changes (back/forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewChat = () => {
    createSession();
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectSession = (id) => {
    selectSession(id);
    if (isMobile) setSidebarOpen(false);
  };

  const handleSend = async (text) => {
    let activeId = currentSessionId;
    
    // Create session if none exists
    if (!activeId) {
      activeId = createSession();
    }
    
    // Send message (useChat handles the logic)
    await sendMessage(text, activeId);
  };

  if (currentPath === '/doc' || currentPath === '/docs') {
    return <DocPage onBack={() => navigateTo('/')} />;
  }

  if (!hasEntered) {
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="flex h-[100dvh] w-full bg-warm-base overflow-hidden relative font-sans text-warm-text-primary">
      
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen}
        groupedSessions={getGroupedSessions()}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={deleteSession}
        onClearHistory={clearAllSessions}
        onDocsClick={() => navigateTo('/doc')}
      />

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[#2C2825]/30 backdrop-blur-[2px] z-40 transition-opacity duration-300" 
        />
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Toggle Button */}
        <SidebarToggle 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(prev => !prev)} 
        />

        {/* Header Bar */}
        <Header onDocsClick={() => navigateTo('/doc')} />

        {/* Primary Chat View */}
        <ChatWindow 
          messages={currentSession?.messages || []} 
          isLoading={isLoading} 
          onSendMessage={handleSend}
        />

        {/* Sticky Input Bar */}
        <InputBar 
          onSend={handleSend} 
          isLoading={isLoading} 
          suggestions={suggestions}
          suggestionsVisible={suggestionsVisible}
          setSuggestionsVisible={setSuggestionsVisible}
        />

        {/* Global Error Banner */}
        {error && (
          <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-50">
            <div className="bg-warm-message-usr text-black px-4 py-2 rounded-full text-xs shadow-md border border-white/10 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
