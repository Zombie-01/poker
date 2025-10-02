import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, Plus, Search, Users, DollarSign, Bell, Settings } from 'lucide-react';
import { usePokerTables } from '../hooks/useSupabase';
import { useAppContext } from '../context/AppContext';
import CreateTableModal from '../components/CreateTableModal';

const Tables: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useAppContext();
  const { tables, loading, joinTable, leaveTable } = usePokerTables();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('game') || 'holdem');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joiningTable, setJoiningTable] = useState<string | null>(null);

  const handleJoinTable = async (tableId: string) => {
    if (!state.user) return;
    
    setJoiningTable(tableId);
    try {
      await joinTable(tableId, state.user.id, state.user.username);
      navigate(`/table/${tableId}`);
    } catch (error) {
      console.error('Error joining table:', error);
      alert('Ширээнд нэгдэхэд алдаа гарлаа: ' + (error as Error).message);
    } finally {
      setJoiningTable(null);
    }
  };

  const handleTableCreated = (tableId: string) => {
    navigate(`/table/${tableId}`);
  };

  const getGameTypeLabel = (gameType: string) => {
    switch (gameType) {
      case 'holdem': return 'Холдем';
      case 'omaha4': return '4К Омаха';
      case 'omaha6': return '6К Омаха';
      default: return gameType;
    }
  };

  const gameFilters = [
    { id: 'holdem', label: 'Холдем', active: true },
    { id: 'omaha4', label: '4К Омаха', active: false },
    { id: 'omaha6', label: '6К Омаха', active: false },
    { id: 'shortdeck', label: 'Шорт дэк', active: false },
    { id: 'hairoller', label: 'Хай роллер', active: false },
  ];

  const filteredTables = tables.filter(table => {
    const matchesGameType = activeFilter === 'all' || table.game_type === activeFilter;
    const matchesFilter = filter === 'all' || 
      (filter === 'available' && table.current_players < table.max_players) ||
      (filter === 'full' && table.current_players === table.max_players);
    
    const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.game_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesGameType && matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-400">Ширээнүүдийг ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-secondary/50 backdrop-blur">
        <div className="text-center">
          <p className="text-sm font-medium">Нээлттэй ширээнүүд</p>
          <p className="text-xs text-accent">Амьд {tables.length}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="bg-accent hover:bg-accent/80 text-white rounded-xl px-4 py-2 text-sm font-medium">
            Шуурхай нэгдэх
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Game Type Filters */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
          <div className="flex items-center space-x-2 text-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Ухаалаг боосоо</span>
          </div>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {gameFilters.map((gameFilter) => (
            <button
              key={gameFilter.id}
              onClick={() => setActiveFilter(gameFilter.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeFilter === gameFilter.id
                  ? 'bg-accent text-white'
                  : 'bg-secondary text-gray-300 hover:bg-gray-600'
              }`}
            >
              {gameFilter.label}
            </button>
          ))}
        </div>

        {/* Tables List */}
        <div className="space-y-4">
          {filteredTables.map((table) => (
            <div key={table.id} className="bg-secondary/80 backdrop-blur rounded-2xl p-4 border border-gray-700/50 hover:border-accent/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                  {getGameTypeLabel(table.game_type)}
                </span>
                <span className="text-xs text-gray-400">{table.current_players} / {table.max_players} тоглогч</span>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-lg text-white mb-1">{table.name}</h3>
                <p className="text-sm text-gray-400">
                  ${table.stakes_small}/${table.stakes_big} • Пот ${table.pot} • 
                  {table.current_players < table.max_players ? ' Суудал бэлэн' : ' Дүүрсэн'}
                </p>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleJoinTable(table.id)}
                  disabled={table.current_players >= table.max_players || joiningTable === table.id}
                  className="flex-1 bg-accent hover:bg-accent/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl py-3 font-medium transition-all flex items-center justify-center"
                >
                  {joiningTable === table.id ? (
                    <div className="spinner w-4 h-4"></div>
                  ) : table.current_players >= table.max_players ? (
                    'Дүүрсэн'
                  ) : (
                    'Нэгдэх'
                  )}
                </button>
                <button className="bg-gray-600 hover:bg-gray-500 text-white rounded-xl px-4 py-3 font-medium transition-all">
                  Үзэх
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Table Button */}
        <div className="mt-8">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-accent/20 hover:bg-accent/30 border-2 border-dashed border-accent rounded-2xl py-6 flex items-center justify-center space-x-2 transition-all"
          >
            <Plus className="w-6 h-6 text-accent" />
            <span className="text-accent font-medium">Ширээ үүсгэх</span>
          </button>
        </div>
      </div>

      <CreateTableModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTableCreated={handleTableCreated}
      />
    </div>
  );
};

export default Tables;