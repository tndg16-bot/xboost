'use client';

import { useState } from 'react';
import { getSettings, getViralPosts } from '../mockData';

export const ViralPostQueue = () => {
  const [posts, setPosts] = useState(getViralPosts());
  const [filter, setFilter] = useState<'all' | 'queued' | 'reposted'>('all');

  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    if (filter === 'queued') return post.inQueue;
    if (filter === 'reposted') return post.lastReposted !== null;
    return true;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const handleToggleQueue = (postId: string) => {
    setPosts(posts.map((post) =>
      post.id === postId ? { ...post, inQueue: !post.inQueue } : post
    ));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">バズ投稿キュー</h3>
            <p className="text-sm text-gray-500">10万インプレ超えの投稿 ({posts.filter(p => p.impressions >= 100000).length}件)</p>
          </div>
          <div className="flex gap-2">
            {(['all', 'queued', 'reposted'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' && 'すべて'}
                {f === 'queued' && 'キュ内'}
                {f === 'reposted' && '再投稿済み'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredPosts.map((post) => (
          <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {post.impressions >= 100000 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                      🔥 バズ
                    </span>
                  )}
                  {post.inQueue && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      キュー済み
                    </span>
                  )}
                  <span className="text-xs text-gray-500">投稿日: {post.originalDate}</span>
                </div>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>👁️ {formatNumber(post.impressions)}</span>
                  <span>❤️ {formatNumber(post.likes)}</span>
                  <span>🔁 {formatNumber(post.retweets)}</span>
                  {post.lastReposted && (
                    <span className="text-blue-600">最終再投稿: {post.lastReposted}</span>
                  )}
                  {post.repostCount > 0 && (
                    <span className="text-gray-400">再投稿回数: {post.repostCount}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleToggleQueue(post.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  post.inQueue
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {post.inQueue ? '削除' : 'キューに追加'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
