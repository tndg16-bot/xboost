import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl">
            発信をプロダクトが<br />
            売れる導線に
          </h1>
          <p className="mb-8 text-xl text-zinc-600 dark:text-zinc-400">
            発信は才能じゃない、フォーマットだ
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signin"
              className="flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xアカウントで始める
            </Link>
            <a
              href="https://discord.com/invite/CXa5mdJjUv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Discordに参加
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            X運用を一元管理できるSaaSツール
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-8 shadow-sm transition-all hover:border-teal-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                <svg className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536M17 9H5m2 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2zm2-4h.01" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">投稿作成</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                AI支援、下書き、テンプレートを使った投稿作成で効率的にコンテンツを作成
              </p>
            </div>

            <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-8 shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-500">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">予約投稿</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                2ヶ月先まで予約可能な投稿スケジュール管理で、ベストなタイミングで配信
              </p>
            </div>

            <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-8 shadow-sm transition-all hover:border-purple-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-purple-500">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">分析・検証</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                1年分のデータ同期と勝ちパターン発見で、データドリブンな意思決定
              </p>
            </div>

            <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-8 shadow-sm transition-all hover:border-green-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-green-500">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">自動化</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                バズ投稿の自動再投稿で、アカウントのブースト状態を自動維持
              </p>
            </div>

            <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-8 shadow-sm transition-all hover:border-orange-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-orange-500">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                <svg className="h-8 w-8 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M7 8a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 8a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">複数アカウント</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                ワンクリック切り替えで複数アカウントを効率的に管理
              </p>
            </div>

            <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-8 shadow-sm transition-all hover:border-pink-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-pink-500">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900">
                <svg className="h-8 w-8 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 4.37a19.791 19.791 0 01-4.885-1.515.074.074 0 01-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 01-5.487 0 12.64 12.64 0 01-.617-1.25.077.077 0 01-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.18-.135.362-.276.534-.423a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.173.147.356.288.536.423a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873-.892.076.076 0 01-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">ネタ生成</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                AIによる投稿ネタの提案・アイデア出しで、常に新しいコンテンツ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            実績
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <p className="mb-4 text-6xl font-bold text-teal-600 dark:text-teal-400">
                1000万+
              </p>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                3週間で達成したインプレッション数
              </p>
            </div>
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <p className="mb-4 text-6xl font-bold text-blue-600 dark:text-blue-400">
                1万/月
              </p>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                1日500〜600フォロワー増加
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-zinc-100 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            ユーザーの声
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <p className="mb-4 text-lg text-zinc-700 dark:text-zinc-300">
                「アカウントが常にホットな状態になる」
              </p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">- 運用者</p>
            </div>
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <p className="mb-4 text-lg text-zinc-700 dark:text-zinc-300">
                「他のプロジェクトで忙しくても投稿が止まらない」
              </p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">- 起業家</p>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border-2 border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <p className="mb-4 text-2xl text-zinc-700 dark:text-zinc-300">
              「成長シミュレーションのようにアカウントを回せる」
            </p>
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">- Xboostユーザー</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            料金プラン
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Starter</h3>
              <p className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-50">¥2,980<span className="text-lg font-normal">/月</span></p>
              <ul className="mb-8 space-y-3 text-zinc-600 dark:text-zinc-400">
                <li>• アカウント数: 1</li>
                <li>• 基本機能全般</li>
                <li>• コミュニティサポート</li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full rounded-lg bg-zinc-900 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              >
                無料で始める
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-teal-500 bg-white p-8 shadow-lg ring-4 ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Pro</h3>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800 dark:bg-teal-900 dark:text-teal-200">人気</span>
              </div>
              <p className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-50">¥5,980<span className="text-lg font-normal">/月</span></p>
              <ul className="mb-8 space-y-3 text-zinc-600 dark:text-zinc-400">
                <li>• アカウント数: 3</li>
                <li>• 全機能利用可能</li>
                <li>• 優先サポート</li>
                <li>• モバイルアプリ</li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full rounded-lg bg-teal-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-teal-700"
              >
                プランを選択
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Team</h3>
              <p className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-50">¥14,800<span className="text-lg font-normal">/月</span></p>
              <ul className="mb-8 space-y-3 text-zinc-600 dark:text-zinc-400">
                <li>• アカウント数: 10</li>
                <li>• チーム機能</li>
                <li>• 専用サポート</li>
                <li>• カスタマイズ</li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full rounded-lg bg-zinc-900 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-zinc-900 to-black text-white dark:from-black dark:to-zinc-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold">
            今すぐXboostを始めよう
          </h2>
          <p className="mb-8 text-xl text-zinc-300">
            発信をプロダクトが売れる導線に変える
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-12 py-5 text-xl font-bold text-white transition-colors hover:bg-teal-700"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            無料で始める
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 sm:px-6 lg:px-8 border-t border-zinc-200 dark:border-zinc-700">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © 2026 Xboost. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="https://discord.com/invite/CXa5mdJjUv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Discord
              </a>
              <Link
                href="/"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                利用規約
              </Link>
              <Link
                href="/"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
