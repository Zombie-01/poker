import React, { useState } from 'react';
import { Menu, Bell, Settings, User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-secondary border-b border-gray-700 px-4 py-3 flex items-center justify-between relative z-50">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-neon-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider">ZENITH</div>
            <div className="text-sm font-bold text-accent">Poker</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            {state.notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {state.notifications.length}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <img
                src={state.user?.avatar}
                alt="Avatar"
                className="w-6 h-6 rounded-full"
              />
              <span className="hidden md:inline text-sm font-medium">
                {state.user?.username}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-gray-700 rounded-lg shadow-xl">
                <div className="p-3 border-b border-gray-700">
                  <p className="font-medium">{state.user?.username}</p>
                  <p className="text-sm text-gray-400">Түвшин {state.user?.level}</p>
                </div>
                <div className="py-2">
                  <button className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors">
                    <User className="w-4 h-4" />
                    <span>Профайл</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Тохиргоо</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors text-error"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Гарах</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowSidebar(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-secondary shadow-xl">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-4">Цэс</h3>
              <nav className="space-y-2">
                <a href="/" className="block p-2 hover:bg-gray-700 rounded">Нүүр</a>
                <a href="/tables" className="block p-2 hover:bg-gray-700 rounded">Ширээ</a>
                <a href="/tournaments" className="block p-2 hover:bg-gray-700 rounded">Тэмцээн</a>
                <a href="/chat" className="block p-2 hover:bg-gray-700 rounded">Чат</a>
                <a href="/profile" className="block p-2 hover:bg-gray-700 rounded">Профайл</a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;