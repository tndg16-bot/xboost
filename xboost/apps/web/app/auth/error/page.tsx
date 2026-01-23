'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, { title: string; message: string }> = {
    Configuration: {
      title: '設定エラー',
      message: '認証設定に問題があります。管理者にお問い合わせください。',
    },
    AccessDenied: {
      title: 'アクセス拒否',
      message: '認証が拒否されました。もう一度お試しください。',
    },
    Verification: {
      title: '認証エラー',
      message: '認証トークンが無効です。再度ログインしてください。',
    },
    Default: {
      title: '認証失敗',
      message: '認証中にエラーが発生しました。再度やり直してください。',
    },
  };

  const errorInfo = errorMessages[error || ''] || errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {errorInfo.title}
          </h1>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            {errorInfo.message}
          </p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-left text-sm dark:bg-red-900/20">
              <p className="font-medium text-red-900 dark:text-red-300">
                エラーコード: {error}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              再度ログイン
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-zinc-200 px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              トップに戻る
            </Link>
          </div>

          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            継続的に問題が発生する場合は、{' '}
            <a
              href="https://discord.com/invite/CXa5mdJjUv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline dark:text-teal-400"
            >
              Discordコミュニティ
            </a>{' '}
            までお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  );
}
