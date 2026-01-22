'use client';

import { useState } from 'react';
import { brainstormingKeywords } from '../mockData';

export const IdeaBrainstorming: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [theme, setTheme] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);

  const handleGenerateIdeas = () => {
    if (!theme || !selectedCategory) return;

    const keywords = brainstormingKeywords[selectedCategory as keyof typeof brainstormingKeywords] || [];
    const ideas: string[] = [];

    // Generate multiple idea variations
    keywords.forEach(keyword => {
      ideas.push(`【${keyword}】${theme}について感じること`);
      ideas.push(`今日${keyword}で${theme}を思った`);
      ideas.push(`${keyword}の${theme}、実は...`);
    });

    setGeneratedIdeas(ideas.slice(0, 6)); // Limit to 6 ideas
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        💡 アイデアブレインストーミング
      </h2>

      {/* Theme Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          テーマを入力
        </label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="例: 仕事での疲れ、最近の悩み、家族との時間..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          カテゴリを選択
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.keys(brainstormingKeywords).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedCategory === category
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">
                {category === '仕事' && '💼'}
                {category === '健康' && '🏃'}
                {category === '家族' && '👨‍👩‍👧‍👦'}
                {category === '趣味' && '🎮'}
                {category === '成長' && '📈'}
                {category === '人間関係' && '🤝'}
              </div>
              <div className="text-sm font-medium text-gray-900">{category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateIdeas}
        disabled={!theme || !selectedCategory}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        アイデアを生成
      </button>

      {/* Generated Ideas */}
      {generatedIdeas.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            💡 アイデア提案
          </h3>
          <div className="space-y-2">
            {generatedIdeas.map((idea, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  // Copy to clipboard functionality could be added here
                  navigator.clipboard.writeText(idea);
                  alert('コピーしました！');
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{idea}</span>
                  <span className="text-xs text-gray-400">クリックでコピー</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pattern Suggestions */}
      {selectedCategory && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            📝 共感系パターンの適用
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-medium mb-2">おすすめのアプローチ：</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              {selectedCategory === '仕事' && (
                <>
                  <li>脱力感パターン: 「今週、本当に疲れた...」</li>
                  <li>共通の敵パターン: 「会議が長すぎて夕飯食べるの忘れた」</li>
                </>
              )}
              {selectedCategory === '健康' && (
                <>
                  <li>等身大の悩み: 「最近、睡眠不足で辛い...」</li>
                  <li>小さな幸せ: 「今日は久々に早起きできた✨」</li>
                </>
              )}
              {selectedCategory === '家族' && (
                <>
                  <li>等身大の失敗: 「昨日、子供と喧嘩した...」</li>
                  <li>共鳴: 「〇〇さんの言う通り、家族って難しい」</li>
                </>
              )}
              {selectedCategory === '趣味' && (
                <>
                  <li>小さな幸せ: 「今週末、久々にゲームできた！」</li>
                  <li>等身大の成長: 「新しい趣味が見つかって嬉しい」</li>
                </>
              )}
              {selectedCategory === '成長' && (
                <>
                  <li>等身大の反省: 「今日反省したこと...」</li>
                  <li>等身大の成長: 「最近やっと分かってきた」</li>
                </>
              )}
              {selectedCategory === '人間関係' && (
                <>
                  <li>等身大の失敗: 「今日、大失態を犯しました」</li>
                  <li>共鳴: 「まさに今の私の状態」</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
