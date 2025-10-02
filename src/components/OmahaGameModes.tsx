import React from 'react';
import { Users, Play, Star, Clock, Award } from 'lucide-react';

interface OmahaGame {
  id: string;
  name: string;
  subtitle: string;
  cardCount: 4 | 6;
  players: number;
  maxPlayers: number;
  icon: string;
  featured: boolean;
  duration?: string;
  speed?: string;
  vip?: string;
}

interface OmahaGameModesProps {
  onJoinGame: (gameType: string) => void;
}

const OmahaGameModes: React.FC<OmahaGameModesProps> = ({ onJoinGame }) => {
  const omahaGames: OmahaGame[] = [
    {
      id: 'omaha4',
      name: '4 Картын Омаха',
      subtitle: 'Боосоо $2 / $5',
      cardCount: 4,
      players: 234,
      maxPlayers: 6,
      icon: '♥️',
      featured: true,
      duration: 'Дундаж пот $150',
      speed: 'Суудал олох 2 мин',
      vip: 'VIP уралдаанууд x2'
    },
    {
      id: 'omaha6',
      name: '6 Картын Омаха',
      subtitle: 'Боосоо $5 / $10',
      cardCount: 6,
      players: 89,
      maxPlayers: 6,
      icon: '♦️',
      featured: true,
      duration: 'Дундаж пот $280',
      speed: 'Суудал олох 3 мин',
      vip: 'VIP уралдаанууд x3'
    }
  ];

  const getGradientClass = (gameId: string) => {
    switch (gameId) {
      case 'omaha4':
        return 'from-purple-600 to-purple-800';
      case 'omaha6':
        return 'from-blue-600 to-blue-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Омаха Тоглоомууд</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{omahaGames.reduce((sum, game) => sum + game.players, 0)} тоглогч</span>
        </div>
      </div>

      {omahaGames.map((game) => (
        <div
          key={game.id}
          className={`bg-gradient-to-r ${getGradientClass(game.id)} rounded-2xl p-6 border border-gray-700/30 hover:border-accent/50 transition-all relative overflow-hidden`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-bold text-xl text-white">{game.name}</h3>
                <span className="bg-white/20 text-white px-2 py-1 rounded-lg text-xs font-bold">
                  {game.cardCount} КАРТ
                </span>
              </div>
              <p className="text-white/80 text-sm mb-3">{game.subtitle}</p>
              <p className="text-white/70 text-sm">{game.players} ширээ • {(game.players * 4).toLocaleString()}к тоглогч</p>
            </div>
            <button
              onClick={() => onJoinGame(game.id)}
              className="bg-accent hover:bg-accent/80 text-white rounded-xl px-4 py-2 font-medium transition-all"
            >
              Нэгдэх
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs text-white/70">
            <div>{game.duration}</div>
            <div>{game.speed}</div>
            <div>{game.vip}</div>
          </div>

          {game.featured && (
            <div className="absolute top-4 right-4">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OmahaGameModes;