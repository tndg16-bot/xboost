import React from 'react';
import { trendingTopics } from './mockData';

export const TrendingTopics: React.FC = () => {
  const getTrendIcon = (rank: number) => {
    if (rank <= 2) {
      return (
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: '#F59E0B' }}
        >
          {rank}
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium text-gray-600"
        style={{ backgroundColor: '#E5E7EB' }}
      >
        {rank}
      </span>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ホンネで書き出す':
        return { bg: '#DBEAFE', text: '#2563EB' };
      case '逆張り':
        return { bg: '#F3E8FF', text: '#9333EA' };
      case '共感':
        return { bg: '#ECFDF5', text: '#059669' };
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  return (
    <div
      className="rounded-lg border bg-white p-6 h-full shadow-sm hover:shadow-md transition-shadow"
      style={{ borderColor: '#E5E7EB' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5"
          style={{ color: '#1DA1F2' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>
          トレンドトピック
        </h2>
      </div>

      <div className="space-y-3">
        {trendingTopics.slice(0, 5).map((trend, index) => {
          const categoryColor = getCategoryColor(trend.category);
          return (
            <div
              key={trend.id}
              className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50"
              style={{ backgroundColor: index === 0 ? 'rgba(29, 161, 242, 0.08)' : undefined }}
            >
              <div className="flex-shrink-0 mt-0.5">{getTrendIcon(index + 1)}</div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium mb-1" style={{ color: '#111827' }}>
                  {trend.topic}
                </h3>

                <div className="flex items-center gap-3 text-xs" style={{ color: '#6B7280' }}>
                  <span>関連投稿 {trend.relatedPosts}件</span>
                  <span>•</span>
                  <span>平均{formatNumber(trend.avgImpressions)}インプレッション</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}
                  >
                    {trend.category}
                  </span>

                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: '#F3F4F6', color: '#374151' }}
                  >
                    {trend.timeframe}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: 'rgba(5, 150, 105, 0.15)', color: '#059669' }}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
                  </svg>
                  {trend.trendingScore}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
