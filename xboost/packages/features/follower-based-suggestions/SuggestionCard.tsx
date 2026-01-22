'use client';

import { Users, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import type { FollowerBasedSuggestion } from './utils';

interface SuggestionCardProps {
  suggestion: FollowerBasedSuggestion;
  isSelected?: boolean;
  onClick?: () => void;
  onUseTemplate?: (template: string) => void;
}

export function SuggestionCard({
  suggestion,
  isSelected = false,
  onClick,
  onUseTemplate,
}: SuggestionCardProps) {
  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {suggestion.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {suggestion.description}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {suggestion.followerRange}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{suggestion.postingFrequency}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span>対象層</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          テンプレート例
        </h4>
        <div className="space-y-2">
          {suggestion.templates.map((template, index) => (
            <button
              key={index}
              onClick={e => {
                e.stopPropagation();
                onUseTemplate?.(template);
              }}
              className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {template.substring(0, 80)}
                {template.length > 80 ? '...' : ''}
              </div>
              <div className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                クリックで使用
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          おすすめ実践
        </h4>
        <ul className="space-y-1.5">
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
    </div>
  );
}

interface MilestoneCardProps {
  milestone: string;
  followers: number;
}

export function MilestoneCard({ milestone, followers }: MilestoneCardProps) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-5 border border-purple-200 dark:border-purple-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
          <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
            次の目標
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {milestone}
          </p>
        </div>
      </div>
    </div>
  );
}

interface TipsSectionProps {
  tips: string[];
}

export function TipsSection({ tips }: TipsSectionProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-700">
      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
        <Users className="h-4 w-4" />
        今後のアドバイス
      </h3>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li
            key={index}
            className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
