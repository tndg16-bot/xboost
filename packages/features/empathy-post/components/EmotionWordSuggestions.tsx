'use client';

import { useState } from 'react';
import { emotionWords, sentenceEndingStyles } from '../mockData';

export const EmotionWordSuggestions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEnding, setSelectedEnding] = useState<string | null>(null);
  const [content, setContent] = useState('');

  const handleWordClick = (word: string) => {
    setContent(prev => prev + word);
  };

  const handleInsertEnding = (style: { id: string; suffix: string }) => {
    setContent(prev => {
      // Remove existing punctuation if any
      const withoutEnding = prev.replace(/[。？！〜...]+$/, '');
      return withoutEnding + style.suffix;
    });
    setSelectedEnding(style.id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Emotion Words */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          😊 感情語の提案
        </h2>

        <div className="space-y-4">
          {Object.entries(emotionWords).map(([category, words]) => (
            <div key={category}>
              <button
                onClick={() => setSelectedCategory(category)}
                className="w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:border-gray-300 text-left"
              >
                <span className="font-medium text-gray-900">{category}</span>
                <span className="text-xs text-gray-500">{words.length}語</span>
              </button>

              {selectedCategory === category && (
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {words.map(word => (
                    <button
                      key={word}
                      onClick={() => handleWordClick(word)}
                      className="px-2 py-1 bg-gray-50 rounded text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sentence Ending Styles */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          ✍️ 文末のスタイル調整
        </h2>

        <div className="space-y-3">
          {sentenceEndingStyles.map(style => (
            <button
              key={style.id}
              onClick={() => handleInsertEnding(style)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedEnding === style.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900 mb-1">{style.label}</div>
              <div className="text-sm text-gray-600 mb-2">例: {style.examples.join(', ')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📝 共感系ポスト作成
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              投稿内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="感情語を選択したり、文末スタイルを適用して、共感系ポストを作成しましょう..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              文字数: {content.length}文字
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setContent('')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                クリア
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  alert('コピーしました！');
                }}
                disabled={!content}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                コピー
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            💡 共感系ポストのコツ
          </h3>
          <div className="bg-yellow-50 rounded-lg p-4 space-y-2 text-sm text-yellow-900">
            <p>• 具体的なエピソードを交える</p>
            <p>• 読者が「あるある！」と思える内容にする</p>
            <p>• 自分の弱さや失敗をさらけ出す</p>
            <p>• 文末を「...」にして余韻を残す</p>
            <p>• 小さな幸せに焦点を当てる</p>
          </div>
        </div>
      </div>
    </div>
  );
};
