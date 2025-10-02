import React, { useState } from 'react';
import { CreditCard, DollarSign, TrendingUp, TrendingDown, Clock, Shield, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Finance: React.FC = () => {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');

  const transactions = [
    {
      id: 1,
      type: 'deposit',
      amount: 500,
      method: 'Credit Card',
      status: 'completed',
      date: '2024-01-15 14:30',
      fee: 15,
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: 250,
      method: 'Bank Transfer',
      status: 'pending',
      date: '2024-01-14 09:15',
      fee: 10,
    },
    {
      id: 3,
      type: 'deposit',
      amount: 100,
      method: 'PayPal',
      status: 'completed',
      date: '2024-01-13 18:45',
      fee: 3,
    },
    {
      id: 4,
      type: 'withdrawal',
      amount: 1000,
      method: 'Crypto',
      status: 'completed',
      date: '2024-01-12 16:20',
      fee: 25,
    },
  ];

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-accent to-neon-blue rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Total Balance</p>
              <p className="text-3xl font-bold">${state.user?.balance.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-white/60" />
          </div>
          <div className="flex justify-between text-sm text-white/80">
            <span>Available</span>
            <span>${(state.user?.balance || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gold to-yellow-500 rounded-xl p-6 text-black">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-black/80 text-sm">Weekly P&L</p>
              <p className="text-3xl font-bold">+$1,247</p>
            </div>
            <TrendingUp className="w-8 h-8 text-black/60" />
          </div>
          <div className="flex justify-between text-sm text-black/80">
            <span>ROI</span>
            <span>+24.3%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-secondary rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-accent hover:bg-accent/80 text-white rounded-lg p-4 flex items-center justify-center space-x-2 transition-all">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Deposit</span>
          </button>
          <button className="bg-gray-600 hover:bg-gray-500 text-white rounded-lg p-4 flex items-center justify-center space-x-2 transition-all">
            <ArrowUpRight className="w-5 h-5" />
            <span className="font-medium">Withdraw</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-secondary rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Recent Transactions</h3>
          <button className="text-accent text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {transaction.type === 'deposit' ? 
                    <ArrowDownRight className="w-4 h-4" /> : 
                    <ArrowUpRight className="w-4 h-4" />
                  }
                </div>
                <div>
                  <p className="font-medium capitalize">{transaction.type}</p>
                  <p className="text-sm text-gray-400">{transaction.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                </p>
                <p className="text-sm text-gray-400">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeposit = () => (
    <div className="space-y-6">
      {/* Deposit Amount */}
      <div className="bg-secondary rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Deposit Amount</h3>
        <div className="mb-4">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white text-xl font-bold focus:outline-none focus:border-accent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              className="bg-gray-700 hover:bg-accent hover:text-white border border-gray-600 rounded-lg py-2 px-4 font-medium transition-all"
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-400 mb-4">
          <div className="flex justify-between">
            <span>Processing fee:</span>
            <span>$5.00</span>
          </div>
          <div className="flex justify-between font-bold text-white mt-2">
            <span>Total:</span>
            <span>$105.00</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-secondary rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Payment Method</h3>
        <div className="space-y-3">
          {[
            { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, fee: '2.9%' },
            { id: 'paypal', name: 'PayPal', icon: Shield, fee: '3.4%' },
            { id: 'crypto', name: 'Cryptocurrency', icon: DollarSign, fee: '1.0%' },
          ].map((method) => (
            <label
              key={method.id}
              className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
            >
              <div className="flex items-center space-x-3">
                <input type="radio" name="payment" className="text-accent" />
                <method.icon className="w-5 h-5 text-accent" />
                <span className="font-medium">{method.name}</span>
              </div>
              <span className="text-sm text-gray-400">Fee: {method.fee}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="w-full bg-accent hover:bg-accent/80 text-white rounded-xl py-4 font-bold text-lg transition-all">
        Deposit Funds
      </button>
    </div>
  );

  const renderWithdraw = () => (
    <div className="space-y-6">
      {/* Available Balance */}
      <div className="bg-secondary rounded-xl p-6">
        <div className="text-center mb-4">
          <p className="text-gray-400 mb-2">Available for Withdrawal</p>
          <p className="text-3xl font-bold text-accent">${state.user?.balance.toLocaleString()}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <p className="text-gray-400">Pending</p>
            <p className="font-bold">$250</p>
          </div>
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <p className="text-gray-400">Min. Withdrawal</p>
            <p className="font-bold">$50</p>
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-secondary rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Withdrawal Request</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Withdrawal Method</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-accent">
              <option>Bank Transfer</option>
              <option>PayPal</option>
              <option>Cryptocurrency</option>
            </select>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Processing time:</span>
              <span>1-3 business days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Processing fee:</span>
              <span>$10.00</span>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full bg-gold hover:bg-yellow-500 text-black rounded-xl py-4 font-bold text-lg transition-all">
        Request Withdrawal
      </button>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="bg-secondary rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {transaction.type === 'deposit' ? 
                  <ArrowDownRight className="w-5 h-5" /> : 
                  <ArrowUpRight className="w-5 h-5" />
                }
              </div>
              <div>
                <p className="font-bold text-lg capitalize">{transaction.type}</p>
                <p className="text-sm text-gray-400">{transaction.method}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-bold text-xl ${
                transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
              }`}>
                {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {transaction.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                  {transaction.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-400 pt-3 border-t border-gray-700">
            <span>Date: {transaction.date}</span>
            <span>Fee: ${transaction.fee}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'deposit', label: 'Deposit' },
    { id: 'withdraw', label: 'Withdraw' },
    { id: 'transactions', label: 'History' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Finance - САНХҮҮ</h1>
          <p className="text-gray-400">Manage your poker bankroll</p>
        </div>

        {/* Tabs */}
        <div className="bg-secondary rounded-xl p-1 mb-6">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'deposit' && renderDeposit()}
        {activeTab === 'withdraw' && renderWithdraw()}
        {activeTab === 'transactions' && renderTransactions()}
      </div>
    </div>
  );
};

export default Finance;