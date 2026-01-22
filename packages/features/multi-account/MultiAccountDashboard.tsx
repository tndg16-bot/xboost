'use client';

import { useState } from 'react';
import { AccountList } from './components/AccountList';
import { AccountSwitcher } from './components/AccountSwitcher';
import { mockAccounts, mockMetrics, type Account } from './mockData';

export const MultiAccountDashboard = () => {
  const [activeAccountId, setActiveAccountId] = useState('1');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const activeAccount = mockAccounts.find((a: Account) => a.id === activeAccountId);
  const activeMetrics = mockMetrics.find((m) => m.accountId === activeAccountId);

  const handleAccountSelect = (accountId: string) => {
    setActiveAccountId(accountId);
    setShowSettings(false);
  };

  const handleOpenSettings = (account: Account) => {
    setSelectedAccount(account);
    setShowSettings(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">マルチアカウント管理</h1>
          <p className="text-gray-600">
            複数アカウントをワンクリックで切り替えて運用
          </p>
        </div>
        <AccountSwitcher />
      </div>

      {/* Active Account Overview */}
      {activeAccount && activeMetrics && (
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{activeAccount.avatar}</span>
            <div>
              <h2 className="text-xl font-bold">{activeAccount.displayName}</h2>
              <p className="opacity-90">@{activeAccount.username.substring(1)}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-white/20">
                {activeAccount.role === 'main' && '🎯 本アカ'}
                {activeAccount.role === 'sub' && '💼 サブ'}
                {activeAccount.role === 'niche' && '🎨 特化'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">フォロワー</p>
              <p className="text-2xl font-bold">{(activeAccount.followerCount / 1000).toFixed(1)}K</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">フォロー中</p>
              <p className="text-2xl font-bold">{activeAccount.followingCount}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">投稿数</p>
              <p className="text-2xl font-bold">{activeMetrics.postCount}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">エンゲージ率</p>
              <p className="text-2xl font-bold">{activeMetrics.avgEngagementRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Account List */}
      <AccountList
        accounts={mockAccounts}
        metrics={mockMetrics}
        activeAccountId={activeAccountId}
        onAccountSelect={handleAccountSelect}
        onOpenSettings={handleOpenSettings}
      />
    </div>
  );
};
