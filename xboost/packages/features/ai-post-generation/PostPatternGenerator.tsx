'use client';

import { useState } from 'react';

interface PostPattern {
  id: string;
  patternType: 'empathy' | 'useful' | 'entertainment';
  content: string;
  reasoning: string;
  keyPoints: string[];
  hashtags: string[];
  estimatedEngagement: 'high' | 'medium' | 'low';
}

const patternTypeLabels = {
  empathy: '共感',
  useful: '有益',
  entertainment: 'エンタメ',
};

const patternTypeDescriptions = {
  empathy: '感情に訴えかけるアプローチ',
  useful: '実用的な情報を提供するアプローチ',
  entertainment: '楽しくて面白いコンテンツ',
};

export const PostPatternGenerator: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'authoritative'>('friendly');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patterns, setPatterns] = useState<PostPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<PostPattern | null>(null);

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError('テーマを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPatterns([]);
    setSelectedPattern(null);

    try {
      const response = await fetch('/api/v1/ai/posts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: theme.trim(),
          targetAudience: targetAudience.trim() || undefined,
          tone: tone,
          includeHashtags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate patterns');
      }

      const data = await response.json();
      setPatterns(data.patterns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate patterns');
      console.error('Error generating patterns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPattern = (pattern: PostPattern) => {
    setSelectedPattern(pattern);
  };

  const handleCopy = () => {
    if (selectedPattern) {
      navigator.clipboard.writeText(selectedPattern.content);
      alert('クリップボードにコピーしました！');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">投稿パターン生成</h1>
          <p className="text-sm text-gray-500 mt-1">
            1つのテーマから「共感」「有益」「エンタメ」の3パターンを生成
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 pb-24">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">生成設定</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                テーマ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="例: 時間管理、リモートワーク、健康習慣"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ターゲット層
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="例: 若手エンジニア、フリーランサー、起業家"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                トーン
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="professional">プロフェッショナル</option>
                <option value="casual">カジュアル</option>
                <option value="friendly">フレンドリー</option>
                <option value="authoritative">権威的</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeHashtags"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeHashtags" className="ml-2 text-sm text-gray-700">
                ハッシュタグを含める
              </label>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !theme.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '生成中...' : 'パターンを生成'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">エラー</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generated Patterns */}
        {patterns.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">生成されたパターン</h2>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => handleSelectPattern(pattern)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPattern?.id === pattern.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                        {patternTypeLabels[pattern.patternType]}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {patternTypeDescriptions[pattern.patternType]}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      期待エンゲージメント: {pattern.estimatedEngagement}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-3 whitespace-pre-wrap">{pattern.content}</p>
                  <div className="text-sm text-gray-600 mb-2">{pattern.reasoning}</div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {pattern.hashtags.length > 0 && (
                      <span>ハッシュタグ: {pattern.hashtags.join(', ')}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Pattern Actions */}
            {selectedPattern && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      選択したパターン: {patternTypeLabels[selectedPattern.patternType]}
                    </h3>
                    <p className="text-sm text-gray-600">
                      このパターンをコピーして投稿できます
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    コピーして使用
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
