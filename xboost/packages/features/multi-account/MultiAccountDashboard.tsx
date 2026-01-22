'use client';

import { useState, useEffect } from 'react';
import { AccountList } from './components/AccountList';
import { AccountSwitcher } from './components/AccountSwitcher';

type TwitterAccountRole = 'MAIN' | 'SUB' | 'NICHE';

interface TwitterAccount {
  id: string;
  username: string;
  displayName: string | null;
  profileImageUrl: string | null;
  role: TwitterAccountRole;
  color: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    posts: number;
    scheduledPosts: number;
  };
}

interface AccountMetrics {
  accountId: string;
  postCount: number;
  avgEngagementRate: number;
}

export const MultiAccountDashboard = () => {
  const [activeAccountId, setActiveAccountId] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TwitterAccount | null>(null);
  const [accounts, setAccounts] = useState<TwitterAccount[]>([]);
  const [metrics, setMetrics] = useState<Record<string, AccountMetrics>>({});
  const [loading, setLoading] = useState(true);

  // Fetch accounts from API
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/twitter-accounts');
      const data = await response.json();
      setAccounts(data.accounts || []);

      // Calculate metrics for each account
      const metricsMap: Record<string, AccountMetrics> = {};
      for (const account of data.accounts || []) {
        metricsMap[account.id] = {
          accountId: account.id,
          postCount: account._count?.posts || 0,
          avgEngagementRate: 2.5, // Default for now, should come from analytics
        };
      }
      setMetrics(metricsMap);

      // Set active account if not set
      if (!activeAccountId && data.accounts && data.accounts.length > 0) {
        setActiveAccountId(data.accounts[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelect = async (accountId: string) => {
    try {
      // Call API to switch active account
      await fetch(`/api/twitter-accounts/${accountId}/switch`, {
        method: 'POST',
      });
      setActiveAccountId(accountId);
      setShowSettings(false);
    } catch (error) {
      console.error('Failed to switch account:', error);
    }
  };

  const handleOpenSettings = (account: TwitterAccount) => {
    setSelectedAccount(account);
    setShowSettings(true);
  };

  const activeAccount = accounts.find((a) => a.id === activeAccountId);
  const activeMetrics = activeAccountId ? metrics[activeAccountId] : null;

  const getRoleEmoji = (role: TwitterAccountRole) => {
    switch (role) {
      case 'MAIN': return '🎯 本アカ';
      case 'SUB': return '💼 サブ';
      case 'NICHE': return '🎨 特化';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

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
        <AccountSwitcher accounts={accounts} onSelect={handleAccountSelect} />
      </div>

      {/* Active Account Overview */}
      {activeAccount && activeMetrics && (
        <div
          className="rounded-xl shadow-lg p-6 text-white"
          style={{ backgroundColor: activeAccount.color || '#3B82F6' }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">
              {activeAccount.profileImageUrl ? (
                <img
                  src={activeAccount.profileImageUrl}
                  alt={activeAccount.displayName || activeAccount.username}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{activeAccount.displayName || activeAccount.username}</h2>
              <p className="opacity-90">@{activeAccount.username}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-white/20">
                {getRoleEmoji(activeAccount.role)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">投稿数</p>
              <p className="text-2xl font-bold">{activeMetrics.postCount}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">予約投稿</p>
              <p className="text-2xl font-bold">{activeAccount._count?.scheduledPosts || 0}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">アカウントID</p>
              <p className="text-sm font-mono opacity-90">{activeAccount.id.substring(0, 8)}...</p>
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
        accounts={accounts}
        metrics={metrics}
        activeAccountId={activeAccountId}
        onAccountSelect={handleAccountSelect}
        onOpenSettings={handleOpenSettings}
      />
    </div>
  );
};
