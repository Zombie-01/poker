import React, { useState } from 'react';
import { User, Settings, Shield, Bell, Palette, Globe, Volume2, Smartphone, Eye, Gamepad2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Profile: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');

  const renderProfile = () => (
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
          <p className="text-sm font-medium uppercase tracking-wider">ПРОФАЙЛ & ТОХИРГОО</p>
        </div>
        
        <div className="w-10"></div>
      </div>

      <div className="px-4 py-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-accent to-neon-blue rounded-2xl p-6 text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1">AuroraPrime</h2>
          <p className="text-white/80 text-sm">VIP III • Баталгаажсан</p>
        </div>

        {/* Game Settings */}
        <div className="bg-secondary/80 backdrop-blur rounded-2xl p-6 mb-6 border border-gray-700/50">
          <h3 className="font-bold text-lg mb-4 text-white uppercase tracking-wide">
            Тоглолтын тохиргоо
          </h3>
          
          <div className="space-y-4">
            {[
              { label: 'Дуу', key: 'sound', status: 'АСААЛТ' },
              { label: 'Хөдөлгөөн', key: 'vibration', status: 'УНТРААЛТ' },
              { label: 'Том сохорыг хүлээх', key: 'waitBigBlind', status: 'АСААЛТ' },
              { label: 'Карт нуулах', key: 'hideCards', status: 'АСААЛТ' },
              { label: 'Стример горим', key: 'streamMode', status: 'УНТРААЛТ' },
              { label: 'Чичиргээ', key: 'vibration', status: 'АСААЛТ' },
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                <span className="text-white font-medium">{setting.label}</span>
                <button className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  setting.status === 'АСААЛТ' 
                    ? 'bg-accent text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {setting.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-secondary/80 backdrop-blur rounded-2xl p-6 mb-6 border border-gray-700/50">
          <h3 className="font-bold text-lg mb-4 text-white uppercase tracking-wide">
            Гадаад төрх
          </h3>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { name: 'Ширээ', active: true },
              { name: 'Карт', active: false },
              { name: 'Аватар', active: false },
            ].map((theme, index) => (
              <button
                key={index}
                className={`p-3 rounded-xl font-medium transition-all ${
                  theme.active
                    ? 'bg-accent text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* KYC Status */}
        <div className="bg-secondary/80 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
          <h3 className="font-bold text-lg mb-4 text-white uppercase tracking-wide">
            КҮС АХИЦ
          </h3>
          
          <div className="space-y-3">
            {[
              { label: 'Иргэний үнэмлэх мэдээлэл', status: 'verified', icon: CheckCircle },
              { label: 'Хаяг баталгаажуулалт хүлээлэх байна', status: 'pending', icon: Clock },
              { label: 'Харилцагчийн тоглолтын хил тогтосон', status: 'verified', icon: CheckCircle },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-xl">
                  <Icon className={`w-5 h-5 ${
                    item.status === 'verified' ? 'text-green-400' : 'text-yellow-400'
                  }`} />
                  <span className="text-white text-sm flex-1">{item.label}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
            <div className="bg-accent h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    renderProfile()
  );
};

export default Profile;