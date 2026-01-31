import Link from 'next/link';
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  description: "X（旧Twitter）運用に必要な全作業を一元管理できるSaaSツール。投稿作成、予約投稿、分析、自動化機能を搭載。",
});

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Xboost
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            X（旧Twitter）運用に必要な全作業を一元管理できるSaaSツール
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/post-editor"
            className="flex flex-col rounded-lg border-2 border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-teal-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
              <svg className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">投稿作成</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">AI支援、下書き、テンプレートを使った投稿作成</p>
          </Link>

          <Link
            href="/scheduling"
            className="flex flex-col rounded-lg border-2 border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-teal-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">予約投稿</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">2ヶ月先まで予約可能な投稿スケジュール管理</p>
          </Link>

          <Link
            href="/analytics"
            className="flex flex-col rounded-lg border-2 border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-teal-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">分析・検証</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">1年分のデータ同期、勝ちパターン発見</p>
          </Link>

          <Link
            href="/automation"
            className="flex flex-col rounded-lg border-2 border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-teal-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">自動化</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">バズ投稿の自動再投稿</p>
          </Link>

          <Link
            href="/multi-account"
            className="flex flex-col rounded-lg border-2 border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-teal-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">複数アカウント</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">ワンクリック切り替えで複数アカウント管理</p>
          </Link>

          <Link
            href="/inspo"
            className="flex flex-col rounded-lg border-2 border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-teal-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900">
              <svg className="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">ネタ</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">AIによる投稿ネタの提案・アイデア出し</p>
          </Link>
        </div>

        <div className="mt-12 rounded-lg border-2 border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">実績</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-3xl font-bold text-teal-600 dark:text-teal-400">1000万+</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">3週間で達成したインプレッション数</p>
            </div>
            <div>
              <p className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400">1万/月</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">1日500〜600フォロワー増加</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Xアカウントで連携して始める
          </Link>
        </div>
      </main>
    </div>
  );
}
