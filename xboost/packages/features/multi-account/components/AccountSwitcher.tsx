'use client';

import { useState } from 'react';
import { type TwitterAccount } from './AccountCard';

interface AccountSwitcherProps {
  accounts: TwitterAccount[];
  activeAccountId: string;
  onSelect: (accountId: string) => void;
}

export const AccountSwitcher = ({ accounts, activeAccountId, onSelect }: AccountSwitcherProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const activeAccount = accounts.find((a) => a.id === activeAccountId);

  const handleSwitchAccount = (accountId: string) => {
    onSelect(accountId);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {activeAccount?.profileImageUrl ? (
            <img
              src={activeAccount.profileImageUrl}
              alt={activeAccount.displayName || activeAccount.username}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: activeAccount?.color || '#3B82F6' }}
            >
              {activeAccount?.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <p className="font-semibold text-gray-900">{activeAccount?.displayName || activeAccount?.username}</p>
            <p className="text-sm text-gray-500">@{activeAccount?.username}</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleSwitchAccount(account.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  account.id === activeAccountId ? 'bg-blue-50' : ''
                }`}
              >
                {account.profileImageUrl ? (
                  <img
                    src={account.profileImageUrl}
                    alt={account.displayName || account.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: account.color || '#3B82F6' }}
                  >
                    {account.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{account.displayName || account.username}</p>
                    {account.id === activeAccountId && (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        現在アクティブ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">@{account.username}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span>
                      {account.role === 'MAIN' && '🎯 本アカ'}
                      {account.role === 'SUB' && '💼 サブ'}
                      {account.role === 'NICHE' && '🎨 特化'}
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
