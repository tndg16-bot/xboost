import { Card } from '@xboost/ui';

export type TwitterAccountRole = 'MAIN' | 'SUB' | 'NICHE';

export interface TwitterAccount {
  id: string;
  userId: string;
  twitterId: string;
  username: string;
  displayName: string | null;
  profileImageUrl: string | null;
  isActive: boolean;
  role: TwitterAccountRole;
  color: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    posts: number;
    scheduledPosts: number;
  };
}

interface AccountCardProps {
  account: TwitterAccount;
  isActive: boolean;
  onSelect: (accountId: string) => void;
  onOpenSettings: (account: TwitterAccount) => void;
}

export const AccountCard = ({
  account,
  isActive,
  onSelect,
  onOpenSettings,
}: AccountCardProps) => {
  const getRoleLabel = () => {
    switch (account.role) {
      case 'MAIN':
        return '🎯 本アカ';
      case 'SUB':
        return '💼 サブ';
      case 'NICHE':
        return '🎨 特化';
      default:
        return '';
    }
  };

  const getRoleColor = () => {
    switch (account.role) {
      case 'MAIN':
        return 'bg-blue-100 text-blue-700';
      case 'SUB':
        return 'bg-purple-100 text-purple-700';
      case 'NICHE':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const avatarDisplay = account.profileImageUrl ? (
    <img
      src={account.profileImageUrl}
      alt={account.displayName || account.username}
      className="w-12 h-12 rounded-full object-cover"
    />
  ) : (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
      style={{ backgroundColor: account.color }}
    >
      {(account.displayName || account.username)[0].toUpperCase()}
    </div>
  );

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
          {avatarDisplay}
          <div>
            <h3 className="font-semibold text-gray-900">{account.displayName || account.username}</h3>
            <p className="text-sm text-gray-500">@{account.username}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getRoleColor()}`}
        >
          {getRoleLabel()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {account._count && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">投稿数</p>
            <p className="text-lg font-semibold text-gray-900">
              {account._count.posts}
            </p>
          </div>
        )}
        {account._count && account._count.scheduledPosts > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">予約投稿</p>
            <p className="text-lg font-semibold text-gray-900">
              {account._count.scheduledPosts}
            </p>
          </div>
        )}
      </div>

      {account.description && (
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">
          {account.description}
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
