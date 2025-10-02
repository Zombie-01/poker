import React, { useState } from 'react';
import { X, Users, DollarSign, Settings } from 'lucide-react';
import { usePokerTables } from '../hooks/useSupabase';
import { useAppContext } from '../context/AppContext';

interface CreateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTableCreated: (tableId: string) => void;
}

const CreateTableModal: React.FC<CreateTableModalProps> = ({ isOpen, onClose, onTableCreated }) => {
  const { state } = useAppContext();
  const { createTable } = usePokerTables();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gameType: 'omaha4' as 'holdem' | 'omaha4' | 'omaha6',
    stakesSmall: 2,
    stakesBig: 5,
    maxPlayers: 6
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user) return;

    setLoading(true);
    try {
      const table = await createTable({
        name: formData.name || `${state.user.username}-ийн ширээ`,
        game_type: formData.gameType,
        stakes_small: formData.stakesSmall,
        stakes_big: formData.stakesBig,
        max_players: formData.maxPlayers,
        created_by: state.user.id
      });

      onTableCreated(table.id);
      onClose();
    } catch (error) {
      console.error('Error creating table:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-secondary rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Ширээ үүсгэх</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ширээний нэр
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={`${state.user?.username}-ийн ширээ`}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Тоглоомын төрөл
            </label>
            <select
              value={formData.gameType}
              onChange={(e) => setFormData({ ...formData, gameType: e.target.value as any })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-accent"
            >
              <option value="holdem">Техас Холдем</option>
              <option value="omaha4">4 Картын Омаха</option>
              <option value="omaha6">6 Картын Омаха</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Жижиг сохор
              </label>
              <input
                type="number"
                value={formData.stakesSmall}
                onChange={(e) => setFormData({ ...formData, stakesSmall: parseInt(e.target.value) })}
                min="1"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Том сохор
              </label>
              <input
                type="number"
                value={formData.stakesBig}
                onChange={(e) => setFormData({ ...formData, stakesBig: parseInt(e.target.value) })}
                min={formData.stakesSmall + 1}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Хамгийн их тоглогч
            </label>
            <select
              value={formData.maxPlayers}
              onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-accent"
            >
              <option value={2}>2 тоглогч</option>
              <option value={4}>4 тоглогч</option>
              <option value={6}>6 тоглогч</option>
              <option value={8}>8 тоглогч</option>
              <option value={9}>9 тоглогч</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-xl py-3 font-medium transition-all"
            >
              Цуцлах
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white rounded-xl py-3 font-medium transition-all"
            >
              {loading ? 'Үүсгэж байна...' : 'Ширээ үүсгэх'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTableModal;