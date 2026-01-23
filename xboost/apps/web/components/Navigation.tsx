'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function Navigation() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b-2 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
              onClick={handleLinkClick}
            >
              Xboost
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/post-editor"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              投稿作成
            </Link>
            <Link
              href="/scheduling"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              予約投稿
            </Link>
            <Link
              href="/analytics"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              分析
            </Link>
            <Link
              href="/strategy-room"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              戦略室
            </Link>
            <Link
              href="/automation"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              自動化
            </Link>
            <Link
              href="/multi-account"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              アカウント
            </Link>
            <Link
              href="/inspo"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              ネタ
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              プロフィール
            </Link>
            <Link
              href="/follower-suggestions"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              戦略
            </Link>
            <Link
              href="/empathy-posts"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              共感
            </Link>
            <Link
              href="/ai-rewrite"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              AIリライト
            </Link>
            <Link
              href="/viral-self-retweet"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              バズ再投稿
            </Link>
            <Link
              href="/quote-retweet"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              引用リツイート
            </Link>
            <Link
              href="/auto-followup"
              className="text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              追撃
            </Link>
            <a
              href="https://discord.com/invite/CXa5mdJjUv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-500"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.18-.135.362-.276.534-.423a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.173.147.356.288.536.423a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Discordコミュニティ
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://discord.com/invite/CXa5mdJjUv"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border-2 border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900 sm:inline-flex"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.18-.135.362-.276.534-.423a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.173.147.356.288.536.423a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Discord</span>
            </a>

            {status === 'loading' ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
            ) : session ? (
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                ログイン
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <a
              href="https://discord.com/invite/CXa5mdJjUv"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border-2 border-indigo-500 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900 sm:inline-flex"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.18-.135.362-.276.534-.423a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.173.147.356.288.536.423a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Discord</span>
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-300 dark:hover:bg-zinc-700"
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/post-editor"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              投稿作成
            </Link>
            <Link
              href="/scheduling"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              予約投稿
            </Link>
            <Link
              href="/analytics"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              分析
            </Link>
            <Link
              href="/strategy-room"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              戦略室
            </Link>
            <Link
              href="/automation"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              自動化
            </Link>
            <Link
              href="/multi-account"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              アカウント
            </Link>
            <Link
              href="/inspo"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              ネタ
            </Link>
            <Link
              href="/profile"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              プロフィール
            </Link>
            <Link
              href="/follower-suggestions"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              戦略
            </Link>
            <Link
              href="/empathy-posts"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              共感
            </Link>
            <Link
              href="/ai-rewrite"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              AIリライト
            </Link>
            <Link
              href="/viral-self-retweet"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              バズ再投稿
            </Link>
            <Link
              href="/quote-retweet"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              引用リツイート
            </Link>
            <Link
              href="/auto-followup"
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700 break-words"
              onClick={handleLinkClick}
            >
              追撃
            </Link>
            <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
              <a
                href="https://discord.com/invite/CXa5mdJjUv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                onClick={handleLinkClick}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.18-.135.362-.276.534-.423a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.173.147.356.288.536.423a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Discordコミュニティ
              </a>
            </div>

            {status === 'loading' ? (
              <div className="px-3 py-2">
                <div className="h-10 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
              </div>
            ) : session ? (
              <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
                <div className="flex items-center gap-3 px-3 py-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    ログアウト
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
                <Link
                  href="/auth/signin"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  onClick={handleLinkClick}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  ログイン
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
