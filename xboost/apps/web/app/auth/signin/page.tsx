'use client';

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  const handleTwitterSignIn = () => {
    signIn('twitter', { callbackUrl: '/' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Xboostにログイン
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            X（Twitter）アカウントでログインしてください
          </p>
        </div>

        <button
          onClick={handleTwitterSignIn}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-4 font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Xでログイン
        </button>

        <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            ログインすることで、
            <a href="/terms" className="text-teal-600 hover:underline">
              利用規約
            </a>
            と
            <a href="/privacy" className="text-teal-600 hover:underline">
              プライバシーポリシー
            </a>
            に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  );
}
