'use client';

import { useState } from 'react';

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: 'アカウント連携',
    description: 'Xアカウントを連携して始めよう',
    content: [
      '右上の「ログイン」ボタンをクリック',
      'Xアカウントで認証',
      '連携が完了したら完了！',
    ],
  },
  {
    id: 2,
    title: 'プロフィール設定',
    description: '自分のブランドを定義しよう',
    content: [
      '「設定」メニューからプロフィール編集',
      'アイコン、ヘッダー、自己紹介を設定',
      '発信テーマを決める（例：ビジネス、エンタメ、技術）',
    ],
  },
  {
    id: 3,
    title: '最初の投稿',
    description: '構文テンプレートを使って投稿',
    content: [
      '「投稿作成」ページを開く',
      '構文テンプレートから好きなテンプレートを選択',
      '内容を入力して「投稿予約」または「今すぐ投稿」',
    ],
  },
  {
    id: 4,
    title: 'テンプレート活用',
    description: '効率的に発信しよう',
    content: [
      '構文テンプレートをブラウズ',
      'お気に入りに登録して再利用',
      'バズ構文を学んで自分のスタイルに応用',
    ],
  },
  {
    id: 5,
    title: '予約投稿',
    description: 'タイムラインを計画しよう',
    content: [
      '投稿時間を設定（2ヶ月先まで予約可能）',
      '最適な投稿時間を分析',
      '自動投稿で手間を削減',
    ],
  },
  {
    id: 6,
    title: '分析と改善',
    description: 'データで勝ちパターンを発見',
    content: [
      'アナリティクスで投稿データを確認',
      'エンゲージメントの高い投稿を分析',
      '勝ちパターンを特定して再現',
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: '投稿にはどんな構文がいいですか？',
    a: '初めての人は「断言型」や「問いかけ型」がおすすめ。バズりやすい構文は「断言しますが...」や「〜だと思いますか？」などです。',
  },
  {
    q: '1日何回投稿すればいいですか？',
    a: '推奨は1日3〜5回です。質より量を重視して、投稿頻度を保ちましょう。',
  },
  {
    q: 'バズる投稿のコツは？',
    a: '「エンゲージメントを誘う」「共感を呼ぶ」「新しい情報を提供する」の3つを意識した構文を使うことです。',
  },
  {
    q: 'フォロワーが増えないときは？',
    a: 'まず投稿頻度を増やしましょう。それでもダメなら、構文テンプレートを参考に投稿内容を見直してください。',
  },
];

const SYNTAX_CATEGORIES = [
  {
    category: '断言型',
    icon: '💪',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    examples: [
      '断言しますが、〜です',
      '〜は間違いありません',
      '〜だと考えています',
    ],
  },
  {
    category: '問いかけ型',
    icon: '❓',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    examples: [
      '〜だと思いますか？',
      '〜についてどう思いますか？',
      '〜を知っていますか？',
    ],
  },
  {
    category: '共感型',
    icon: '🤗',
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    examples: [
      '〜だと思っている人',
      '〜に共感する人',
      '〜を経験したことある？',
    ],
  },
  {
    category: '情報提供型',
    icon: '📚',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    examples: [
      '〜を知っていますか？',
      '〜を紹介します',
      '〜の事実をお伝えします',
    ],
  },
  {
    category: '読み物型',
    icon: '📖',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    examples: [
      '唐突ですが、〜',
      'ちょっとした話ですが、〜',
      'ある日〜',
    ],
  },
];

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'steps' | 'faq' | 'syntax'>('steps');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 py-12 font-sans dark:from-black dark:to-zinc-900">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Xboost チュートリアル
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            6ステップでX運用をマスターしよう
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setActiveTab('steps')}
            className={`rounded-full px-6 py-3 font-semibold transition-colors ${
              activeTab === 'steps'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            ステップバイステップ
          </button>
          <button
            onClick={() => setActiveTab('syntax')}
            className={`rounded-full px-6 py-3 font-semibold transition-colors ${
              activeTab === 'syntax'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            構文テンプレート
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`rounded-full px-6 py-3 font-semibold transition-colors ${
              activeTab === 'faq'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            よくある質問
          </button>
        </div>

        {activeTab === 'steps' && (
          <>
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {TUTORIAL_STEPS.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    currentStep === index
                      ? 'bg-teal-600 text-white scale-110'
                      : 'bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {step.id}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <span className="mb-2 inline-flex rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                    Step {TUTORIAL_STEPS[currentStep].id}
                  </span>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {TUTORIAL_STEPS[currentStep].title}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="rounded-lg border-2 border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    前へ
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.min(TUTORIAL_STEPS.length - 1, currentStep + 1))}
                    disabled={currentStep === TUTORIAL_STEPS.length - 1}
                    className="rounded-lg border-2 border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    次へ
                  </button>
                </div>
              </div>

              <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
                {TUTORIAL_STEPS[currentStep].description}
              </p>

              <ul className="space-y-3">
                {TUTORIAL_STEPS[currentStep].content.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                      {index + 1}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {activeTab === 'syntax' && (
          <div className="space-y-4">
            <div className="mb-4 rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                💡 構文テンプレートを参考に、効果的な投稿を作成しましょう！
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SYNTAX_CATEGORIES.map((syntax, index) => (
                <div
                  key={index}
                  className="rounded-xl border-2 border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl">{syntax.icon}</span>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${syntax.color}`}>
                      {syntax.category}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {syntax.examples.map((example, i) => (
                      <li
                        key={i}
                        className="rounded-lg bg-zinc-50 p-2 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                      >
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border-2 border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
              >
                <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.q}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>Powered by Xboost • 詳細はドキュメントをご確認ください</p>
        </div>
      </div>
    </div>
  );
}
