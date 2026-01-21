'use client';

import React, { useState } from 'react';
import { TopicSuggestions } from './TopicSuggestions';
import { TrendingTopics } from './TrendingTopics';
import { PastPostAnalyzer } from './PastPostAnalyzer';
import { WritingFeedback } from './WritingFeedback';
import type { TopicCategory } from './mockData';

export interface InspoDashboardProps {
  onAddToDraft?: (content: string) => void;
}

export const InspoDashboard: React.FC<InspoDashboardProps> = ({ onAddToDraft }) => {
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [addedTopicIds, setAddedTopicIds] = useState<Set<string>>(new Set());

  const categories: { value: TopicCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'ホンネで書き出す', label: 'ホンネで書き出す' },
    { value: '逆張り', label: '逆張り' },
    { value: '共感', label: '共感' }
  ];

  const handleAddToDraft = (content: string) => {
    if (onAddToDraft) {
      onAddToDraft(content);
    } else {
      setDraftContent(content);
    }
    // Show success feedback
    alert('下書きに追加しました！');
  };

  const handleClearDraft = () => {
    setDraftContent('');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <div
        className="px-6 py-6 border-b"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>
                投稿アイデア（Inspo）
              </h1>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                AIが提案するバイラルトピックと成功パターン
              </p>
            </div>
            <button
              onClick={() => handleAddToDraft('')}
              className="py-2.5 px-4 text-white text-sm font-medium rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#1DA1F2' }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              空白投稿を作成
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filter Bar */}
        <div
          className="rounded-lg border bg-white p-6 mb-6 shadow-sm hover:shadow-md transition-shadow"
          style={{ borderColor: '#E5E7EB' }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9CA3AF' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="トピックを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' }}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className="py-2.5 px-4 text-sm font-medium rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  style={{
                    backgroundColor:
                      selectedCategory === cat.value ? '#1DA1F2' : '#FFFFFF',
                    color:
                      selectedCategory === cat.value ? '#FFFFFF' : '#374151',
                    border: '1px solid #D1D5DB'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Topic Suggestions */}
          <div className="lg:col-span-2 space-y-6">
            {(selectedCategory === 'all' || selectedCategory === 'ホンネで書き出す') && (
              <TopicSuggestions
                category="ホンネで書き出す"
                onAddToDraft={handleAddToDraft}
                addedTopicIds={addedTopicIds}
              />
            )}
            {(selectedCategory === 'all' || selectedCategory === '逆張り') && (
              <TopicSuggestions
                category="逆張り"
                onAddToDraft={handleAddToDraft}
                addedTopicIds={addedTopicIds}
              />
            )}
            {(selectedCategory === 'all' || selectedCategory === '共感') && (
              <TopicSuggestions
                category="共感"
                onAddToDraft={handleAddToDraft}
                addedTopicIds={addedTopicIds}
              />
            )}
          </div>

          {/* Right Column: Analytics and Feedback */}
          <div className="space-y-6">
            <TrendingTopics />
            <PastPostAnalyzer />

            {/* Quick Draft Preview */}
            {draftContent && (
              <div
                className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                style={{ borderColor: '#E5E7EB' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold" style={{ color: '#111827' }}>
                    下書きプレビュー
                  </h2>
                  <button
                    onClick={handleClearDraft}
                    className="py-1.5 px-3 text-sm font-medium rounded hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    style={{ color: '#6B7280' }}
                  >
                    クリア
                  </button>
                </div>
                <div
                  className="rounded-lg p-4 mb-3"
                  style={{ backgroundColor: '#F9FAFB' }}
                >
                  <p className="text-sm whitespace-pre-wrap" style={{ color: '#374151' }}>
                    {draftContent}
                  </p>
                </div>
                <button
                  onClick={() => alert('投稿エディタに移動します（デモ）')}
                  className="w-full py-2.5 px-4 text-white text-sm font-medium rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
                  style={{ backgroundColor: '#1DA1F2' }}
                >
                  編集する
                </button>
              </div>
            )}

            <WritingFeedback content={draftContent} />
          </div>
        </div>

        {/* Footer Info */}
        <div
          className="mt-8 p-4 rounded-lg border"
          style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5"
                style={{ color: '#1DA1F2' }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>
                Inspoタブの使い方
              </h3>
              <ul className="text-xs space-y-1" style={{ color: '#4B5563' }}>
                <li>• トピックカードの「下書きに追加」をクリックして、エディタに送信</li>
                <li>• トレンドトピックと過去の成功パターンを参考にする</li>
                <li>• ライティングフィードバックで投稿を最適化</li>
                <li>• カテゴリフィルターで興味のあるトピックを絞り込む</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
