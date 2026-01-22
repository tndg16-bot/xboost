import { Card } from '@xboost/ui';
import type { Account, AccountMetrics } from '../mockData';

interface AccountCardProps {
  account: Account;
  metrics?: AccountMetrics;
  isActive: boolean;
  onSelect: (accountId: string) => void;
  onOpenSettings: (account: Account) => void;
}

export const AccountCard = ({
  account,
  metrics,
  isActive,
  onSelect,
  onOpenSettings,
}: AccountCardProps) => {
  const getRoleLabel = () => {
    switch (account.role) {
      case 'main':
        return '🎯 本アカ';
      case 'sub':
        return '💼 サブ';
      case 'niche':
        return '🎨 特化';
      default:
        return '';
    }
  };

  const getRoleColor = () => {
    switch (account.role) {
      case 'main':
        return 'bg-blue-100 text-blue-700';
      case 'sub':
        return 'bg-purple-100 text-purple-700';
      case 'niche':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card
      className={`p-6 cursor-pointer transition-all ${
        isActive
          ? 'ring-2 ring-purple-500 bg-purple-50'
          : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{account.avatar}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{account.displayName}</h3>
            <p className="text-sm text-gray-500">@{account.username.substring(1)}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getRoleColor()}`}
        >
          {getRoleLabel()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">フォロワー</p>
          <p className="text-lg font-semibold text-gray-900">
            {(account.followerCount / 1000).toFixed(1)}K
          </p>
        </div>
        {metrics && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">投稿数</p>
            <p className="text-lg font-semibold text-gray-900">
              {metrics.postCount}
            </p>
          </div>
        )}
        {metrics && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">総インプ</p>
            <p className="text-lg font-semibold text-gray-900">
              {(metrics.totalImpressions / 1000000).toFixed(2)}M
            </p>
          </div>
        )}
        {metrics && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">エンゲ率</p>
            <p className="text-lg font-semibold text-gray-900">
              {metrics.avgEngagementRate}%
            </p>
          </div>
        )}
      </div>

      {metrics && metrics.lastPostedAt && (
        <p className="text-xs text-gray-400 mb-4">
          最終投稿: {metrics.lastPostedAt}
        </p>
      )}

      <div className="flex gap-2">
        {isActive ? (
          <div className="flex-1 py-2 px-4 text-center bg-green-100 text-green-700 rounded-lg font-medium text-sm">
            ✓ 現在アクティブ
          </div>
        ) : (
          <button
            onClick={() => onSelect(account.id)}
            className="flex-1 py-2 px-4 text-center bg-purple-500 text-white rounded-lg font-medium text-sm hover:bg-purple-600 transition-colors"
          >
            切り替え
          </button>
        )}
        <button
          onClick={() => onOpenSettings(account)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="設定"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </Card>
  );
};
