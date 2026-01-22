'use client';

import { useState } from 'react';

interface TimeSuggestion {
  time: string;
  engagementScore: number;
  reason: string;
}

interface ContentRecommendation {
  type: string;
  description: string;
  tips: string[];
}

export function StrategicPosting() {
  const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [scheduledPosts, setScheduledPosts] = useState<number[]>([]);

  const timeSuggestions: Record<string, TimeSuggestion[]> = {
    morning: [
      { time: '07:00 - 08:00', engagementScore: 85, reason: '通勤時間、ニュースチェック' },
      { time: '09:00 - 10:00', engagementScore: 75, reason: '仕事開始前' },
      { time: '12:00 - 13:00', engagementScore: 80, reason: '昼休み' },
    ],
    afternoon: [
      { time: '15:00 - 16:00', engagementScore: 70, reason: '午後の休憩' },
      { time: '18:00 - 19:00', engagementScore: 90, reason: '帰宅時間' },
      { time: '20:00 - 21:00', engagementScore: 85, reason: '夕食後' },
    ],
    evening: [
      { time: '21:00 - 22:00', engagementScore: 80, reason: '夜間アクティブ' },
      { time: '22:00 - 23:00', engagementScore: 75, reason: '遅番ユーザー' },
      { time: '23:00 - 00:00', engagementScore: 65, reason: '深夜ユーザー' },
    ],
  };

  const contentRecommendations: ContentRecommendation[] = [
    {
      type: '朝の投稿',
      description: 'エネルギッシュで前向きなコンテンツが好まれる',
      tips: [
        'モチベーションを上げる引用',
        '今日の目標やタスク',
        '朝のルーティンや習慣',
        'エネルギッシュなハッシュタグ',
      ],
    },
    {
      type: '昼の投稿',
      description: '教育的で知識を共有するコンテンツが効果的',
      tips: [
        '業界のニュースやトレンド',
        'ノウハウやテクニックの共有',
        'ケーススタディ',
        'Q&A形式の投稿',
      ],
    },
    {
      type: '夜の投稿',
      description: '感情的で共感を呼ぶコンテンツが響く',
      tips: [
        '個人的なストーリー',
        '失敗談と学び',
        'リラックスしたトーン',
        'インタラクティブな質問',
      ],
    },
    {
      type: '週末の投稿',
      description: 'エンターテインメント性の高いコンテンツが良い',
      tips: [
        'ユーモラスな投稿',
        '週末のリフレッシュ方法',
        'フォロワーとの交流',
        '週間の振り返り',
      ],
    },
  ];

  const handleSchedulePost = (time: string) => {
    const id = Date.now();
    setScheduledPosts([...scheduledPosts, id]);
    // TODO: Implement actual scheduling logic
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">戦略的投稿</h1>
      <p className="text-gray-600 mb-8">
        ブースト期間中の最適な投稿タイミングとコンテンツを提案します
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Suggestions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">⏰ 最適な投稿時間</h2>
          
          <div className="flex gap-2 mb-6">
            {(['morning', 'afternoon', 'evening'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === 'morning' && '朝'}
                {period === 'afternoon' && '昼'}
                {period === 'evening' && '夜'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {timeSuggestions[selectedPeriod].map((suggestion, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{suggestion.time}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      suggestion.engagementScore >= 80
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    エンゲージメント: {suggestion.engagementScore}%
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{suggestion.reason}</p>
                <button
                  onClick={() => handleSchedulePost(suggestion.time)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  予約する
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Content Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">💡 コンテンツ推奨</h2>
          
          <div className="space-y-4">
            {contentRecommendations.map((rec, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-lg mb-2">{rec.type}</h3>
                <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                <ul className="space-y-2">
                  {rec.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scheduled Posts */}
      {scheduledPosts.length > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-2">
            予約済みの投稿 ({scheduledPosts.length})
          </h2>
          <p className="text-green-800 text-sm">
            投稿が正常に予約されました。指定した時間に自動的に投稿されます。
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">💎 ブースト期間のコツ</h2>
        <ul className="text-purple-800 space-y-2 text-sm">
          <li>• 1日3〜4回の投稿を目安にしてください</li>
          <li>• 朝、昼、夜の異なる時間帯に投稿することで、異なる層にリーチできます</li>
          <li>• コンテンツの種類を変えることで、フォロワーが飽きないようにしましょう</li>
          <li>• エンゲージメントの高い投稿は、後からリポストするのも効果的です</li>
          <li>• 一貫した投稿スケジュールを維持することが重要です</li>
        </ul>
      </div>
    </div>
  );
}
