'use client';

import { FollowerBasedSuggestionsPanel } from '@xboost/follower-based-suggestions';

export default function FollowerBasedSuggestionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            フォロワー数に応じた投稿サジェスト
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            あなたのフォロワー数に応じて、最適な投稿戦略を提案します
          </p>
        </div>

        <FollowerBasedSuggestionsPanel />
      </div>
    </div>
  );
}
