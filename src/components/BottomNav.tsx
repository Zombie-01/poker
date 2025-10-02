import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, DollarSign, MessageCircle, Trophy, Grid3x3 as Grid3X3, Layers } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const tabs = [
    { id: 'home', icon: Layers, label: 'САНХҮҮ', path: '/finance' },
    { id: 'tables', icon: Grid3X3, label: 'ШИРЭЭ', path: '/tables' },
    { id: 'tournaments', icon: Trophy, label: 'ЧАТ', path: '/chat' },
  ];

  // Alternative layout with icons only
  const iconTabs = [
    { id: 'home', icon: Home, label: 'НҮҮР', path: '/' },
    { id: 'tables', icon: Layers, label: 'ШИРЭЭ', path: '/tables' },
    { id: 'chat', icon: MessageCircle, label: 'ЧАТ', path: '/chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary/90 backdrop-blur border-t border-gray-700/50 px-4 py-3 md:hidden z-30 rounded-t-3xl">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {iconTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-accent bg-accent/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium tracking-wide">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;