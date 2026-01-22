'use client';

import { useState, useEffect } from 'react';
import { AccountList } from './components/AccountList';
import { AccountSwitcher } from './components/AccountSwitcher';
import { AccountSettings } from './components/AccountSettings';
import { type TwitterAccount } from './components/AccountCard';

export const MultiAccountDashboard = () => {
  const [activeAccountId, setActiveAccountId] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TwitterAccount | null>(null);
  const [accounts, setAccounts] = useState<TwitterAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/twitter-accounts');
      const data = await response.json();
      setAccounts(data.accounts || []);

      if (!activeAccountId && data.accounts && data.accounts.length > 0) {
        const activeAccount = data.accounts.find((a: TwitterAccount) => a.isActive) || data.accounts[0];
        setActiveAccountId(activeAccount.id);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelect = async (accountId: string) => {
    try {
      await fetch(`/api/twitter-accounts/${accountId}/switch`, {
        method: 'POST',
      });
      setActiveAccountId(accountId);
      setShowSettings(false);

      const updatedAccounts = accounts.map((acc) =>
        acc.id === accountId ? { ...acc, isActive: true } : { ...acc, isActive: false }
      );
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error('Failed to switch account:', error);
      alert('アカウントの切り替えに失敗しました。');
    }
  };

  const handleOpenSettings = (account: TwitterAccount) => {
    setSelectedAccount(account);
    setShowSettings(true);
  };

  const handleSaveSettings = async (accountId: string, updates: Partial<TwitterAccount>) => {
    try {
      const response = await fetch(`/api/twitter-accounts/${accountId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to save account settings');
      }

      const data = await response.json();
      const updatedAccounts = accounts.map((acc) =>
        acc.id === accountId ? { ...acc, ...data.account } : acc
      );
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error('Failed to save account settings:', error);
      throw error;
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/twitter-accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      const updatedAccounts = accounts.filter((acc) => acc.id !== accountId);
      setAccounts(updatedAccounts);

      if (activeAccountId === accountId && updatedAccounts.length > 0) {
        const newActiveAccount = updatedAccounts.find((acc) => acc.isActive) || updatedAccounts[0];
        setActiveAccountId(newActiveAccount.id);
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  };

  const activeAccount = accounts.find((a) => a.id === activeAccountId);

  const getRoleEmoji = (role: TwitterAccount['role']) => {
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">マルチアカウント管理</h1>
          <p className="text-gray-600">
            複数アカウントをワンクリックで切り替えて運用
          </p>
        </div>
        <AccountSwitcher accounts={accounts} activeAccountId={activeAccountId} onSelect={handleAccountSelect} />
      </div>

      {activeAccount && (
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

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">投稿数</p>
              <p className="text-2xl font-bold">{activeAccount._count?.posts || 0}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">予約投稿</p>
              <p className="text-2xl font-bold">{activeAccount._count?.scheduledPosts || 0}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">アカウントID</p>
              <p className="text-sm font-mono opacity-90">{activeAccount.id.substring(0, 8)}...</p>
            </div>
          </div>
        </div>
      )}

      <AccountList
        accounts={accounts}
        activeAccountId={activeAccountId}
        onAccountSelect={handleAccountSelect}
        onOpenSettings={handleOpenSettings}
      />

      <AccountSettings
        account={selectedAccount}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        onDelete={handleDeleteAccount}
      />
    </div>
  );
};
