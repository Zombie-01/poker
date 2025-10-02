import React from 'react';
import { Users, Play, Star, Clock, Award } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  subtitle: string;
  players: number;
  maxPlayers: number;
  icon: string;
  featured: boolean;
  duration?: string;
  speed?: string;
  vip?: string;
}

interface GameModeCardProps {
  game: Game;
}

const GameModeCard: React.FC<GameModeCardProps> = ({ game }) => {
  const getGradientClass = () => {
    switch (game.id) {
      case 'holdem':
        return 'from-green-600 to-green-800';
      case 'omaha':
        return 'from-purple-600 to-purple-800';
      case 'triton':
        return 'from-blue-600 to-blue-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getGradientClass()} rounded-2xl p-6 border border-gray-700/30 hover:border-accent/50 transition-all relative overflow-hidden`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-xl text-white mb-1">{game.name}</h3>
          <p className="text-white/80 text-sm mb-3">{game.subtitle}</p>
          <p className="text-white/70 text-sm">{game.players} ширээ • 2.8к тоглогч</p>
        </div>
        <button className="bg-accent hover:bg-accent/80 text-white rounded-xl px-4 py-2 font-medium transition-all">
          Нэгдэх
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs text-white/70">
        <div>{game.duration}</div>
        <div>{game.speed}</div>
        <div>{game.vip}</div>
      </div>
    </div>
  );
};

export default GameModeCard;