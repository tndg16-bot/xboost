'use client';

import { useState } from 'react';

interface FollowerBasedSuggestion {
  id: string;
  followerRange: string;
  title: string;
  description: string;
  templates: string[];
  postingFrequency: string;
  bestPractices: string[];
}

const SUGGESTIONS: Record<string, FollowerBasedSuggestion> = {
  '0-1000': {
    id: 'beginner',
    followerRange: '0-1000',
    title: 'まずはコネクション作り',
    description: 'アカウントの信頼を築き、ターゲット層との関係を構築する段階です。',
    templates: [
      '【紹介】はじめまして！〇〇分野で情報発信を始めました。よろしくお願いします！\n\n#はじめまして #〇〇',
      '【質問】〇〇について、皆さんはどう考えていますか？\n\nコメントで教えていただけると嬉しいです！\n\n#質問 #〇〇',
      '【共有】今日学んだこと：〇〇についてまとめてみました。\n\nコメントで感想やご意見をお待ちしています！\n\n#学び #知識共有',
    ],
    postingFrequency: '1日1〜2回',
    bestPractices: [
      '他者への返信やいいねを積極的に行う',
      '質問型投稿でコメントを促す',
      '自己紹介を充実させる',
      '一貫したトーンで投稿する',
    ],
  },
  '1000-10000': {
    id: 'intermediate',
    followerRange: '1000-10000',
    title: '価値提供と成長',
    description: '自分の専門性を示しながら、フォロワーのニーズに応える段階です。',
    templates: [
      '【実践】〇〇の実践記録3日目。\n\n成果：〇〇\n学び：〇〇\n\n明日は〇〇に挑戦します！\n\n#実践記録 #成長記録',
      '【比較】〇〇vs〇〇、どちらがおすすめ？\n\n〇〇のメリット：〇〇\n〇〇のメリット：〇〇\n\n#比較 #おすすめ',
      '【ノウハウ】〇〇のやり方を解説します。\n\n1. 〇〇\n2. 〇〇\n3. 〇〇\n\nこれで誰でも簡単にできます！\n\n#ノウハウ #解説',
    ],
    postingFrequency: '1日2〜3回',
    bestPractices: [
      '専門知識を活かした投稿を増やす',
      'スレッド（連投）を活用する',
      '統計やデータを含める',
      'CTA（行動喚起）を明確にする',
    ],
  },
  '10000-50000': {
    id: 'advanced',
    followerRange: '10000-50000',
    title: '影響力拡大',
    description: 'より多くの人に届けつつ、コミュニティ形成を深める段階です。',
    templates: [
      '【視点】〇〇について考えてみた。\n\n従来の考え方：〇〇\n新しい視点：〇〇\n\n#視点 #新しい価値観',
      '【議論】〇〇について議論しましょう。\n\n前提：〇〇\n\n私は〜〜と思います。皆さんは？\n\n#議論 #思考実験',
      '【予測】2025年の〇〇はどうなる？\n\n予測1：〇〇\n予測2：〇〇\n\n1年後に検証します！\n\n#予測 #未来',
    ],
    postingFrequency: '1日3〜5回',
    bestPractices: [
      '独自の視点や予測を発信する',
      '議論や対話を促す投稿をする',
      '他のインフルエンサーと関わる',
      '商品・サービスの紹介を組み込む',
    ],
  },
  '50000+': {
    id: 'expert',
    followerRange: '50000+',
    title: 'リーダーシップとビジネス',
    description: '影響力を活かしてビジネスや社会課題に取り組む段階です。',
    templates: [
      '【提言】〇〇の課題解決について。\n\n現状：〇〇\n解決策：〇〇\n\n誰かと一緒に動きたいです！\n\n#提言 #社会課題',
      '【事例】〇〇企業の成功事例。\n\n背景：〇〇\n施策：〇〇\n結果：〇〇\n\n#事例 #成功例',
      '【声明】〇〇についての私の考え。\n\nスタンス：〇〇\n行動：〇〇\n\n#声明 #方針',
    ],
    postingFrequency: '1日5回以上',
    bestPractices: [
      '社会課題や業界課題について発信する',
      '提言や声明を出す',
      '成功事例を共有する',
      'ビジネスへの導線を最適化する',
    ],
  },
};

function getFollowerRange(followerCount: number): string {
  if (followerCount < 1000) return '0-1000';
  if (followerCount < 10000) return '1000-10000';
  if (followerCount < 50000) return '10000-50000';
  return '50000+';
}

export default function FollowerSuggestionsPage() {
  const [inputFollowers, setInputFollowers] = useState('');
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<FollowerBasedSuggestion | null>(null);

  const handleAnalyze = () => {
    const count = parseInt(inputFollowers, 10);
    if (isNaN(count) || count < 0) return;

    const range = getFollowerRange(count);
    setSelectedRange(range);
    setSuggestion(SUGGESTIONS[range]);
  };

  const handleSelectRange = (range: string) => {
    const ranges: Record<string, string> = {
      '初心者': '0-1000',
      '中級者': '1000-10000',
      '上級者': '10000-50000',
      '専門家': '50000+',
    };

    const rangeKey = ranges[range];
    const sampleCounts: Record<string, number> = {
      '0-1000': 500,
      '1000-10000': 5000,
      '10000-50000': 30000,
      '50000+': 75000,
    };

    setInputFollowers(sampleCounts[rangeKey].toString());
    setSelectedRange(rangeKey);
    setSuggestion(SUGGESTIONS[rangeKey]);
  };

  const handleUseTemplate = (template: string) => {
    navigator.clipboard.writeText(template);
    alert('テンプレートをクリップボードにコピーしました！');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            フォロワー数に応じた投稿戦略
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            あなたのフォロワー数に合わせた最適な投稿戦略とテンプレートを提案します
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800 mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                フォロワー数
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputFollowers}
                  onChange={e => setInputFollowers(e.target.value)}
                  placeholder="例: 5000"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors self-end"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              分析
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {['初心者', '中級者', '上級者', '専門家'].map(level => (
              <button
                key={level}
                onClick={() => handleSelectRange(level)}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  selectedRange && SUGGESTIONS[selectedRange] &&
                  ((level === '初心者' && selectedRange === '0-1000') ||
                   (level === '中級者' && selectedRange === '1000-10000') ||
                   (level === '上級者' && selectedRange === '10000-50000') ||
                   (level === '専門家' && selectedRange === '50000+'))
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {suggestion && (
          <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {suggestion.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {suggestion.description}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {suggestion.followerRange}
              </span>
            </div>

            <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>推奨投稿頻度: {suggestion.postingFrequency}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>ターゲット層</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                おすすめ実践
              </h4>
              <ul className="space-y-2">
                {suggestion.bestPractices.map((practice, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    {practice}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                テンプレート例
              </h4>
              <div className="space-y-3">
                {suggestion.templates.map((template, index) => (
                  <div
                    key={index}
                    className="relative group"
                  >
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="w-full text-left p-4 text-sm bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
                        {template}
                      </pre>
                    </button>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        クリックでコピー
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!suggestion && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
            <svg
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              フォロワー数を入力
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              あなたのフォロワー数に応じた最適な投稿戦略とテンプレートを提案します
            </p>
            <button
              onClick={handleAnalyze}
              disabled={!inputFollowers}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              分析を開始
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
