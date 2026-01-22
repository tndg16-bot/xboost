'use client';

import { useState } from 'react';

export interface PostCardProps {
  id: string;
  content: string;
  postedAt: string;
  likes: number;
  retweets: number;
  autoRetweetEnabled: boolean;
  autoRetweetScheduled?: string;
  onToggleAutoRetweet: (id: string) => void;
}

export function PostCard({
  id,
  content,
  postedAt,
  likes,
  retweets,
  autoRetweetEnabled,
  autoRetweetScheduled,
  onToggleAutoRetweet,
}: PostCardProps) {
  return (
    <div className="rounded-xl border-2 border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-3">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{content}</p>
      </div>

      <div className="mb-3 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span>📅 {new Date(postedAt).toLocaleDateString('ja-JP')}</span>
        <span>❤️ {likes}</span>
        <span>🔄 {retweets}</span>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          {autoRetweetEnabled ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-200">
              <span>✓</span>
              <span>自動リツイートON</span>
            </span>
          ) : (
            <span className="rounded-full bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
              自動リツイートOFF
            </span>
          )}
          {autoRetweetScheduled && (
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              次回: {new Date(autoRetweetScheduled).toLocaleDateString('ja-JP')}
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleAutoRetweet(id)}
          className="rounded-lg border-2 border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {autoRetweetEnabled ? '無効にする' : '有効にする'}
        </button>
      </div>
    </div>
  );
}
