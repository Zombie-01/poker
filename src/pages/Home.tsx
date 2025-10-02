import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Users, Table, TrendingUp, Play, Star, Clock, Bell, Settings } from 'lucide-react';
import GameModeCard from '../components/GameModeCard';
import OmahaGameModes from '../components/OmahaGameModes';

const Home: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const gameTypes = [
    {
      id: 'holdem',
      name: 'Но Лимит Холдем',
      subtitle: 'Боосоо $2 / $5',
      players: 847,
      maxPlayers: 6,
      icon: '♠️',
      featured: true,
      duration: 'Дундаж пот $120',
      speed: 'Суудал олох 3 мин',
      vip: 'VIP уралдаанууд x2'
    },
    {
      id: 'omaha',
      name: 'Пот Лимит Омаха',
      subtitle: 'Боосоо $5 / $10',
      players: 234,
      maxPlayers: 6,
      icon: '♥️',
      featured: false,
      duration: 'Дундаж пот $120',
      speed: 'Суудал олох 3 мин',
      vip: 'VIP уралдаанууд x2'
    },
    {
      id: 'triton',
      name: 'Шорт Дэк Раш',
      subtitle: 'Боосоо $1 / $3',
      players: 45,
      maxPlayers: 6,
      icon: '♦️',
      featured: true,
      duration: 'Дундаж пот $120',
      speed: 'Суудал олох 3 мин',
      vip: 'VIP уралдаанууд x2'
    },
  ];

  const handleJoinGame = (gameType: string) => {
    // Navigate to tables with filter
    navigate(`/tables?game=${gameType}`);
  };

  const quickStats = [
    { icon: Users, label: 'Идэвхтэй тоглогч', value: '12 540', subtext: 'Өнөөдөр +8.2%', color: 'text-accent' },
    { icon: Table, label: 'Идэвхтэй ширээ', value: '1 203', subtext: 'Өнөөдөр +5.6%', color: 'text-gold' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary pb-20">

      {/* Hero Section */}
      <div className="px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-secondary/80 backdrop-blur rounded-2xl p-4 border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{stat.label}</p>
              <p className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-3">Тоглоомын горим сонгох</p>
          <button 
            onClick={() => navigate('/tables')}
            className="w-full bg-accent hover:bg-accent/80 text-white rounded-2xl py-4 px-6 font-medium transition-all flex items-center justify-between"
          >
            <span>🎯 Ухаалаг сонголт</span>
            <Play className="w-5 h-5" />
          </button>
        </div>

        {/* Game Types */}
        <div className="mb-8">
          <div className="space-y-4">
            {gameTypes.map((game) => (
              <GameModeCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        {/* Omaha Games Section */}
        <div className="mb-8">
          <OmahaGameModes onJoinGame={handleJoinGame} />
        </div>
      </div>
    </div>
  );
};

export default Home;