export interface Account {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  role: 'main' | 'sub' | 'niche';
  followerCount: number;
  followingCount: number;
  isActive: boolean;
}

export interface AccountMetrics {
  accountId: string;
  postCount: number;
  totalImpressions: number;
  avgEngagementRate: number;
  lastPostedAt: string;
}

export const mockAccounts: Account[] = [
  {
    id: '1',
    username: '@yamada_dev',
    displayName: '山田 太郎',
    avatar: '👨️',
    role: 'main',
    followerCount: 12500,
    followingCount: 450,
    isActive: true,
  },
  {
    id: '2',
    username: '@tech_news_ai',
    displayName: 'AI Tech News',
    avatar: '🤖',
    role: 'sub',
    followerCount: 8200,
    followingCount: 230,
    isActive: false,
  },
  {
    id: '3',
    username: '@startup_tips_jp',
    displayName: 'スタートアップTips日本',
    avatar: '🚀',
    role: 'niche',
    followerCount: 5600,
    followingCount: 180,
    isActive: false,
  },
];

export const mockMetrics: AccountMetrics[] = [
  {
    accountId: '1',
    postCount: 145,
    totalImpressions: 2450000,
    avgEngagementRate: 3.2,
    lastPostedAt: '2026-01-22',
  },
  {
    accountId: '2',
    postCount: 89,
    totalImpressions: 1280000,
    avgEngagementRate: 2.8,
    lastPostedAt: '2026-01-21',
  },
  {
    accountId: '3',
    postCount: 67,
    totalImpressions: 890000,
    avgEngagementRate: 4.1,
    lastPostedAt: '2026-01-20',
  },
];
