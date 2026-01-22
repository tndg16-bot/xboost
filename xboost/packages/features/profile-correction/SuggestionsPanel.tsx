'use client';

import { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import {
  ProfileSuggestion,
  getImprovementLevel,
} from './utils';

interface SuggestionsPanelProps {
  suggestions: ProfileSuggestion[];
  onApplyImprovement?: (suggestionId: string, improvedText: string) => void;
  onDismiss?: (suggestionId: string) => void;
}

export function SuggestionsPanel({
  suggestions,
  onApplyImprovement,
  onDismiss,
}: SuggestionsPanelProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const activeSuggestions = suggestions.filter(
    s => !dismissedIds.has(s.id)
  );

  const getSeverityIcon = (severity: ProfileSuggestion['severity']) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'low':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getSeverityBorder = (severity: ProfileSuggestion['severity']) => {
    switch (severity) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-orange-500';
      case 'low':
        return 'border-l-4 border-blue-500';
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
    onDismiss?.(id);
  };

  if (activeSuggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          すべての項目がチェックされました
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          特に改善が必要な項目はありません
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          改善提案 ({activeSuggestions.length})
        </h3>
        <button
          onClick={() => setDismissedIds(new Set())}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          すべて再表示
        </button>
      </div>

      <div className="space-y-3">
        {activeSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 ${getSeverityBorder(
              suggestion.severity
            )}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getSeverityIcon(suggestion.severity)}
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {suggestion.issue}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {suggestion.category}
                  </span>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {suggestion.suggestion}
                </p>

                {suggestion.originalText && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      現在の内容:
                    </p>
                    <p className="text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                      {suggestion.originalText || '(空白)'}
                    </p>
                  </div>
                )}

                {suggestion.improvedText && onApplyImprovement && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onApplyImprovement(suggestion.id, suggestion.improvedText!)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      改善案を適用
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDismiss(suggestion.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="無視する"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
