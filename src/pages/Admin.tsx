import React, { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, AlertTriangle, Eye, MessageSquare, Shield } from 'lucide-react';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [realTimeData, setRealTimeData] = useState({
    activePlayers: 1247,
    activeTables: 89,
    totalRevenue: 234567,
    recentTransactions: 145,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activePlayers: prev.activePlayers + Math.floor(Math.random() * 10 - 5),
        activeTables: Math.max(1, prev.activeTables + Math.floor(Math.random() * 6 - 3)),
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 1000),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-accent to-neon-blue rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">LIVE</span>
          </div>
          <p className="text-3xl font-bold">{realTimeData.activePlayers.toLocaleString()}</p>
          <p className="text-sm opacity-80">Active Players</p>
        </div>

        <div className="bg-gradient-to-br from-gold to-yellow-500 rounded-xl p-6 text-black">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">TABLES</span>
          </div>
          <p className="text-3xl font-bold">{realTimeData.activeTables}</p>
          <p className="text-sm opacity-80">Running Games</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">TODAY</span>
          </div>
          <p className="text-3xl font-bold">${realTimeData.totalRevenue.toLocaleString()}</p>
          <p className="text-sm opacity-80">Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">ALERTS</span>
          </div>
          <p className="text-3xl font-bold">7</p>
          <p className="text-sm opacity-80">Pending Issues</p>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-secondary rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Revenue Analytics</h3>
        <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Revenue chart visualization would appear here</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {[
              { user: 'Player123', type: 'Deposit', amount: 500, time: '2 min ago' },
              { user: 'HighRoller', type: 'Withdrawal', amount: -1200, time: '5 min ago' },
              { user: 'NewPlayer', type: 'Deposit', amount: 50, time: '8 min ago' },
              { user: 'ProGamer', type: 'Win', amount: 250, time: '12 min ago' },
              { user: 'BluffKing', type: 'Deposit', amount: 300, time: '15 min ago' },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium">{transaction.user}</p>
                  <p className="text-sm text-gray-400">{transaction.type}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-400">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">System Alerts</h3>
          <div className="space-y-3">
            {[
              { type: 'warning', message: 'High CPU usage on Table Server 3', time: '5 min ago' },
              { type: 'info', message: 'Daily backup completed successfully', time: '1 hour ago' },
              { type: 'error', message: 'Payment gateway timeout', time: '2 hours ago' },
              { type: 'success', message: 'Tournament payout processed', time: '3 hours ago' },
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'error' ? 'bg-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-500' :
                  alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-400">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderModeration = () => (
    <div className="space-y-6">
      {/* Chat Monitoring */}
      <div className="bg-secondary rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-accent" />
          Live Chat Monitoring
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Recent Messages</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { user: 'Player123', message: 'gg everyone!', table: 'Table #5', flagged: false },
                { user: 'AngryPlayer', message: 'This is rigged!', table: 'Table #2', flagged: true },
                { user: 'NewBie', message: 'How do I fold?', table: 'Table #8', flagged: false },
                { user: 'SpamBot', message: 'Visit our site for free chips!', table: 'Global', flagged: true },
              ].map((msg, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  msg.flagged ? 'bg-red-500/20 border border-red-500' : 'bg-gray-700/50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{msg.user}</span>
                    <span className="text-xs text-gray-400">{msg.table}</span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                  {msg.flagged && (
                    <div className="flex space-x-2 mt-2">
                      <button className="bg-red-600 hover:bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Ban User
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-500 text-white text-xs px-2 py-1 rounded">
                        Delete Message
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Moderation Actions</h4>
            <div className="space-y-3">
              <button className="w-full bg-accent hover:bg-accent/80 text-white rounded-lg py-2 px-4 font-medium transition-all">
                Broadcast Announcement
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-500 text-white rounded-lg py-2 px-4 font-medium transition-all">
                View Banned Users
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-500 text-white rounded-lg py-2 px-4 font-medium transition-all">
                Chat Filters Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Player Management */}
      <div className="bg-secondary rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-accent" />
          Player Management
        </h3>
        
        <div className="space-y-4">
          {[
            { id: 1, user: 'SuspiciousPlayer', reason: 'Potential collusion', status: 'Under Review', priority: 'high' },
            { id: 2, user: 'MultiAccount', reason: 'Multiple accounts detected', status: 'Investigating', priority: 'medium' },
            { id: 3, user: 'CheatCode99', reason: 'Unusual play patterns', status: 'Resolved', priority: 'low' },
          ].map((case_item) => (
            <div key={case_item.id} className="p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${
                    case_item.priority === 'high' ? 'bg-red-500' :
                    case_item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="font-bold">{case_item.user}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    case_item.status === 'Resolved' ? 'bg-green-500/20 text-green-400' :
                    case_item.status === 'Under Review' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {case_item.status}
                  </span>
                </div>
                
                <button className="bg-accent hover:bg-accent/80 text-white px-3 py-1 rounded text-sm">
                  Review
                </button>
              </div>
              <p className="text-sm text-gray-400">{case_item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      {/* Payment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Pending Withdrawals</h3>
          <p className="text-3xl font-bold text-yellow-400">23</p>
          <p className="text-sm text-gray-400">Requiring approval</p>
        </div>
        
        <div className="bg-secondary rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Daily Volume</h3>
          <p className="text-3xl font-bold text-green-400">$45,230</p>
          <p className="text-sm text-gray-400">+12% from yesterday</p>
        </div>
        
        <div className="bg-secondary rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Failed Payments</h3>
          <p className="text-3xl font-bold text-red-400">7</p>
          <p className="text-sm text-gray-400">Need attention</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-secondary rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Payment Monitoring</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Method</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { user: 'HighRoller99', type: 'Withdrawal', amount: 2500, method: 'Bank Transfer', status: 'pending' },
                { user: 'NewPlayer', type: 'Deposit', amount: 100, method: 'Credit Card', status: 'completed' },
                { user: 'ProGamer', type: 'Withdrawal', amount: 800, method: 'PayPal', status: 'failed' },
                { user: 'LuckyWin', type: 'Deposit', amount: 50, method: 'Crypto', status: 'completed' },
              ].map((transaction, index) => (
                <tr key={index} className="border-b border-gray-700/50">
                  <td className="py-3">{transaction.user}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.type === 'Deposit' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-3 font-bold">${transaction.amount}</td>
                  <td className="py-3 text-sm text-gray-400">{transaction.method}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="bg-accent hover:bg-accent/80 text-white px-3 py-1 rounded text-xs">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Real-time platform monitoring and management</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">System Online</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-secondary rounded-xl p-1 mb-6">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-accent text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'moderation' && renderModeration()}
        {activeTab === 'payments' && renderPayments()}
      </div>
    </div>
  );
};

export default Admin;