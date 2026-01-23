'use client';

export default function AuthLoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800">
        <div className="text-center">
          {/* X Logo Spinner */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
            <svg
              className="h-10 w-10 animate-spin text-black dark:text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Xアカウント連携中...
          </h1>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            認証情報を確認しています
          </p>

          {/* Step Indicator */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white dark:bg-teal-400">
                1
              </div>
              <div className="h-0.5 flex-1 bg-zinc-200 dark:bg-zinc-700">
                <div className="h-full w-full bg-teal-600 animate-pulse dark:bg-teal-400" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                2
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-teal-600 dark:text-teal-400">
                アカウント連携
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                投稿許可取得
              </span>
            </div>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            この処理は数秒で完了します
          </p>
        </div>
      </div>
    </div>
  );
}
