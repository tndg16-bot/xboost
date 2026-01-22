'use client';

import { useState } from 'react';
import { Users, Calculator, ArrowRight, Sparkles } from 'lucide-react';
import {
  analyzeByFollowerCount,
  type FollowerAnalysis,
  FOLLOWER_RANGES,
} from './utils';
import { SuggestionCard, MilestoneCard, TipsSection } from './SuggestionCard';

interface FollowerBasedSuggestionsPanelProps {
  followerCount?: number;
  onUseTemplate?: (template: string) => void;
}

export function FollowerBasedSuggestionsPanel({
  followerCount,
  onUseTemplate,
}: FollowerBasedSuggestionsPanelProps) {
  const [inputFollowers, setInputFollowers] = useState(
    followerCount?.toString() || ''
  );
  const [analysis, setAnalysis] = useState<FollowerAnalysis | null>(null);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const handleAnalyze = () => {
    const count = parseInt(inputFollowers, 10);
    if (isNaN(count) || count < 0) return;

    const result = analyzeByFollowerCount(count);
    setAnalysis(result);
  };

  const handleSelectRange = (range: string) => {
    const ranges: Record<string, number> = {
      '0-1000': 500,
      '1000-10000': 5000,
      '10000-50000': 30000,
      '50000+': 75000,
    };

    const count = ranges[range];
    setInputFollowers(count.toString());
    const result = analyzeByFollowerCount(count);
    setAnalysis(result);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          フォロワー数に応じた投稿サジェスト
        </h2>

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
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors self-end"
          >
            <Calculator className="h-4 w-4" />
            分析
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(FOLLOWER_RANGES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleSelectRange(value.range)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                analysis?.currentRange === value.label
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>
      </div>

      {analysis && (
        <>
          <MilestoneCard
            milestone={analysis.nextMilestone || 'さらなる成長を目指そう'}
            followers={parseInt(inputFollowers, 10)}
          />

          <TipsSection tips={analysis.tips} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                推奨投稿戦略
              </h3>
              <button
                onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
              >
                {showAllSuggestions ? '自分のレベルのみ' : 'すべて表示'}
                <ArrowRight
                  className={`h-4 w-4 transition-transform ${
                    showAllSuggestions ? 'rotate-90' : ''
                  }`}
                />
              </button>
            </div>

            {showAllSuggestions ? (
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.suggestions.map(suggestion => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onUseTemplate={onUseTemplate}
                  />
                ))}
              </div>
            ) : (
              analysis.suggestions.map(suggestion => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onUseTemplate={onUseTemplate}
                />
              ))
            )}
          </div>
        </>
      )}

      {!analysis && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            フォロワー数を入力
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            あなたのフォロワー数に応じた最適な投稿戦略を提案します
          </p>
          <button
            onClick={handleAnalyze}
            disabled={!inputFollowers}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            分析を開始
          </button>
        </div>
      )}
    </div>
  );
}
