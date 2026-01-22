'use client';

import { useState } from 'react';
import { mockAccounts, type Account } from '../mockData';

export const AccountSwitcher = () => {
  const [activeAccountId, setActiveAccountId] = useState('1');
  const [showDropdown, setShowDropdown] = useState(false);
  const activeAccount = mockAccounts.find((a: Account) => a.id === activeAccountId);

  const handleSwitchAccount = (accountId: string) => {
    setActiveAccountId(accountId);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{activeAccount?.avatar}</span>
          <div className="text-left">
            <p className="font-semibold text-gray-900">{activeAccount?.displayName}</p>
            <p className="text-sm text-gray-500">@{activeAccount?.username.substring(1)}</p>
          </div>
        </div>
        <svg className={`w-5 h-5 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
          <div className="py-2">
            {mockAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleSwitchAccount(account.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  account.id === activeAccountId ? 'bg-blue-50' : ''
                }`}
              >
                <span className="text-xl">{account.avatar}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{account.displayName}</p>
                    {account.isActive && (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        現在アクティブ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">@{account.username.substring(1)}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>👁️ {(account.followerCount / 1000).toFixed(1)}K</span>
                    <span>
                      {account.role === 'main' && '🎯 本アカ'}
                      {account.role === 'sub' && '💼 サブ'}
                      {account.role === 'niche' && '🎨 特化'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
