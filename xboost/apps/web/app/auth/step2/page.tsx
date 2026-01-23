'use client';

import { signIn } from 'next-auth/react';

export default function AuthStep2Page() {
  const handleSecondAuth = () => {
    signIn('twitter', { callbackUrl: '/' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            アカウント連携が完了しました
          </h1>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            投稿するための許可を取得します
          </p>

          {/* Step Indicator */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white dark:bg-green-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="h-0.5 flex-1 bg-zinc-200 dark:bg-zinc-700">
                <div className="h-full w-full bg-teal-600 dark:bg-teal-400" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white dark:bg-teal-400">
                2
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-green-600 dark:text-green-400">
                アカウント連携
              </span>
              <span className="font-medium text-teal-600 dark:text-teal-400">
                投稿許可取得
              </span>
            </div>
          </div>

          <button
            onClick={handleSecondAuth}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-4 font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            投稿許可を取得する
          </button>

          <div className="rounded-lg bg-zinc-100 p-4 text-left dark:bg-zinc-700">
            <div className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  必要な権限
                </p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  • 投稿の作成・編集・削除
                  <br />
                  • 投稿の予約・スケジュール管理
                  <br />
                  • アカウント情報の読み取り
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            ※ 投稿許可を取得しないと投稿機能は使用できません
          </p>
        </div>
      </div>
    </div>
  );
}
