import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Settings, Volume2, VolumeX } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'system' | 'admin';
  emoji?: string;
}

const Chat: React.FC = () => {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState('global');
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'System',
      content: 'Welcome to PokerPro Global Chat!',
      timestamp: new Date(Date.now() - 300000),
      type: 'system'
    },
    {
      id: '2',
      user: 'HighRoller99',
      content: 'Anyone for high stakes Hold\'em?',
      timestamp: new Date(Date.now() - 240000),
      type: 'user'
    },
    {
      id: '3',
      user: 'Admin',
      content: 'Tournament starts in 15 minutes! Don\'t miss out!',
      timestamp: new Date(Date.now() - 180000),
      type: 'admin'
    },
    {
      id: '4',
      user: 'PokerPro',
      content: 'gg everyone!',
      timestamp: new Date(Date.now() - 120000),
      type: 'user',
      emoji: '🎉'
    },
    {
      id: '5',
      user: 'ChipCollector',
      content: 'Looking for Omaha players',
      timestamp: new Date(Date.now() - 60000),
      type: 'user'
    }
  ]);

  const emojis = [
    '😀', '😂', '😍', '🤔', '😎', '😢', '😡', '🙄', '👍', '👎', 
    '✋', '👏', '🤝', '💪', '🔥', '💯', '🎉', '💰', '♠️', '♥️', 
    '♦️', '♣️', '🎲', '🃏', '💎', '👑'
  ];

  const quickPhrases = [
    'Good game!',
    'Well played',
    'Nice hand',
    'Good luck',
    'Thanks!',
    'See you later',
    'All in!',
    'Fold'
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: state.user?.username || 'Anonymous',
        content: message,
        timestamp: new Date(),
        type: 'user'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      if (soundEnabled) {
        // Play sound notification
        const audio = new Audio('/message-sound.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojis(false);
  };

  const handleQuickPhrase = (phrase: string) => {
    setMessage(phrase);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const tabs = [
    { id: 'global', label: 'Global Chat', count: 1247 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary flex flex-col">
      {/* Header */}
      <div className="bg-secondary border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Chat - ЧАТ</h1>
        </div>

        {/* Chat Tabs */}
        <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.user === state.user?.username ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.type === 'system'
                    ? 'bg-gray-600 text-gray-300 text-center text-sm mx-auto'
                    : msg.type === 'admin'
                    ? 'bg-gold text-black font-medium'
                    : msg.user === state.user?.username
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-white'
                }`}
              >
                {msg.type === 'user' && msg.user !== state.user?.username && (
                  <p className="text-xs text-gray-400 mb-1 font-medium">{msg.user}</p>
                )}
                
                <div className="flex items-center space-x-2">
                  <p className="text-sm">{msg.content}</p>
                  {msg.emoji && <span className="text-lg">{msg.emoji}</span>}
                </div>
                
                <p className="text-xs opacity-70 mt-1">{formatTime(msg.timestamp)}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Phrases */}
        <div className="px-4 py-2 bg-secondary/50 border-t border-gray-700">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {quickPhrases.map((phrase, index) => (
              <button
                key={index}
                onClick={() => handleQuickPhrase(phrase)}
                className="flex-shrink-0 bg-gray-700 hover:bg-accent text-white px-3 py-1 rounded-full text-xs font-medium transition-all"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji Panel */}
        {showEmojis && (
          <div className="px-4 py-2 bg-secondary border-t border-gray-700">
            <div className="grid grid-cols-8 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="text-xl hover:bg-gray-700 rounded-lg p-2 transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 bg-secondary border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                maxLength={200}
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {message.length}/200
              </span>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-accent hover:bg-accent/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;