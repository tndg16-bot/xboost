'use client';

import { useState } from 'react';
import { AutoRetweetSettingsPanel, AutoRetweetSettings } from './AutoRetweetSettings';
import { PostCard, PostCardProps } from './PostCard';

const MOCK_POSTS: PostCardProps[] = [
  {
    id: '1',
    content: 'AIを使った発信は、ただのツールです。本質は人間の判断です。',
    postedAt: '2024-01-15T10:30:00Z',
    likes: 156,
    retweets: 42,
    autoRetweetEnabled: true,
    autoRetweetScheduled: '2024-01-16T10:30:00Z',
    onToggleAutoRetweet: () => {},
  },
  {
    id: '2',
    content: '毎日投稿してるけど、イマイチ伸びない人、手を挙げて。',
    postedAt: '2024-01-14T15:45:00Z',
    likes: 89,
    retweets: 12,
    autoRetweetEnabled: false,
    onToggleAutoRetweet: () => {},
  },
  {
    id: '3',
    content: '3週間で1,000万インプレッションの話。',
    postedAt: '2024-01-13T09:00:00Z',
    likes: 234,
    retweets: 87,
    autoRetweetEnabled: true,
    autoRetweetScheduled: '2024-01-15T09:00:00Z',
    onToggleAutoRetweet: () => {},
  },
];

export function AutoRetweetDashboard() {
  const [settings, setSettings] = useState<AutoRetweetSettings>({
    enabled: true,
    delayHours: 24,
    maxRetweets: 3,
    onlyHighEngagement: true,
    minLikes: 50,
  });

  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleToggleAutoRetweet = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              autoRetweetEnabled: !post.autoRetweetEnabled,
              autoRetweetScheduled: !post.autoRetweetEnabled
                ? new Date(Date.now() + settings.delayHours * 60 * 60 * 1000).toISOString()
                : undefined,
            }
          : post
      )
    );
  };

  const postsWithHandlers = posts.map((post) => ({
    ...post,
    onToggleAutoRetweet: handleToggleAutoRetweet,
  }));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 py-12 font-sans dark:from-black dark:to-zinc-900">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            自動リツイート管理
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            バズ投稿を自動で再発信して、リーチを最大化しよう
          </p>
        </div>

        <div className="mb-8">
          <AutoRetweetSettingsPanel settings={settings} onChange={setSettings} />
        </div>

        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          投稿一覧
        </h2>

        <div className="space-y-4">
          {postsWithHandlers.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
