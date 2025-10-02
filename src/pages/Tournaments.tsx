import React, { useState } from 'react';
import { Trophy, Clock, Users, DollarSign, Star, Calendar, Zap, Medal, Bell, Settings } from 'lucide-react';

const Tournaments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [showScheduled, setShowScheduled] = useState(false);

  const tournaments = [
    {
      id: 1,
      name: 'Sit & Go Хайпер',
      type: 'ХУРДНЫ ГОРИМ',
      buyIn: '$5к бэлэглээ',
      status: 'Бүртгүүлэх',
      progress: 60,
      timeLeft: '6 хүн бүрдээд шууд эхэлнэ',
    },
    {
      id: 2,
      name: 'Галакси аварга',
      type: 'VIP IV ШАТ',
      buyIn: '$250к',
      status: 'Бүртгүүлэх',
      progress: 40,
      timeLeft: '1-р өвөр • Бүртгэл хаагдана 02:14',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-secondary/50 backdrop-blur">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-700 rounded-lg">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium">Тэмцээн ба шагнал</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="bg-accent hover:bg-accent/80 text-white rounded-xl px-4 py-2 text-sm font-medium">
            Шуурхай
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-white mb-6">Тэмцээний жагсаалт</h1>
        
        {/* Tournament Cards */}
        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-secondary/80 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                    {tournament.type}
                  </span>
                  <button className="bg-accent hover:bg-accent/80 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all">
                    Бүртгүүлэх
                  </button>
                </div>
                
                <h3 className="font-bold text-xl text-white mb-1">{tournament.name}</h3>
                <p className="text-accent font-bold text-lg">{tournament.buyIn}</p>
              </div>
              
              <div className="mb-4">
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all"
                    style={{ width: `${tournament.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">{tournament.timeLeft}</p>
              </div>
            </div>
          ))}
        </div>

        {/* VIP Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/30">
          <div className="mb-4">
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
              ШАГНАЛЫН ШАТ
            </span>
          </div>
          
          <p className="text-white font-medium text-lg mb-2">VIP түвшин амих тусгай ширээ, аварга, ширээний эрхс нээгдэнэ.</p>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;