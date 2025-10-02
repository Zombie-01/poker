import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Tables from './pages/Tables';
import Chat from './pages/Chat';
import PokerTable from './pages/PokerTable';
import Tournaments from './pages/Tournaments';
import Profile from './pages/Profile';
import { AppProvider } from './context/AppContext';
import { useAppContext } from './context/AppContext';
import './App.css';

function AppContent() {
  const { state } = useAppContext();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!state.isLoggedIn) {
    return <AuthPage />;
  }

  return (
    <Router>
      <div className="app min-h-screen bg-primary text-white flex flex-col">
        {!isOnline && (
          <div className="bg-red-600 text-white text-center py-2 text-sm">
            Интернет холболт тасарсан - Хязгаарлагдмал функц ашиглах боломжтой
          </div>
        )}
        
        <Header />
        
        <main className="flex-1 pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/table/:id" element={<PokerTable />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        
        <BottomNav />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;