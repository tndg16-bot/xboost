'use client';

import { CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { getImprovementLevel } from './utils';

interface ProfileScoreProps {
  score: number;
  totalSuggestions: number;
}

export function ProfileScore({ score, totalSuggestions }: ProfileScoreProps) {
  const level = getImprovementLevel(score);
  const percentage = Math.round(score);

  const getCircumference = () => {
    const radius = 60;
    return 2 * Math.PI * radius;
  };

  const circumference = getCircumference();
  const offset = circumference - (percentage / 100) * circumference;
  const strokeColor =
    percentage >= 80
      ? '#16a34a'
      : percentage >= 60
        ? '#2563eb'
        : percentage >= 40
          ? '#ea580c'
          : '#dc2626';

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            プロフィール評価
          </h2>
          <p className={`text-lg font-semibold ${level.color}`}>
            {level.label}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {level.description}
          </p>
        </div>

        <div className="relative">
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            className="transform -rotate-90"
          >
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke={strokeColor}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.5s ease-in-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {percentage}
            </span>
          </div>
        </div>
      </div>

      {totalSuggestions > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {totalSuggestions > 5 ? (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            ) : totalSuggestions > 2 ? (
              <TrendingUp className="h-4 w-4 text-blue-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            <span>
              {totalSuggestions}件の改善提案があります
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
