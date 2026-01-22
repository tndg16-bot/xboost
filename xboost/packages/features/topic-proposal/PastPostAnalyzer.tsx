import React from 'react';
import { pastPostInsights } from './mockData';

export const PastPostAnalyzer: React.FC = () => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ホンネで書き出す':
        return { bg: 'rgba(236, 72, 153, 0.15)', text: '#EC4899' };
      case '逆張り':
        return { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6' };
      case '共感':
        return { bg: 'rgba(29, 161, 242, 0.15)', text: '#1DA1F2' };
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
          style={{ color: '#17BF63' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>
          過去投稿の成功パターン
        </h2>
      </div>

      <div className="space-y-4">
        {pastPostInsights.map((insight) => {
          const categoryColor = getCategoryColor(insight.category);
          return (
            <div
              key={insight.id}
              className="border rounded-lg p-4 transition-shadow hover:shadow-sm"
              style={{ borderColor: '#E5E7EB' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}
                  >
                    {insight.category}
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: '#F3F4F6', color: '#374151' }}
                  >
                    {insight.topic}
                  </span>
                </div>
                <span
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: 'rgba(5, 150, 105, 0.15)', color: '#059669' }}
                >
                  {formatNumber(insight.impressions)}表示
                </span>
              </div>

              {/* Content Preview */}
              <p className="text-sm mb-3 line-clamp-2" style={{ color: '#374151' }}>
                {insight.content}
              </p>

              {/* Success Factors */}
              <div className="space-y-2">
                <p className="text-xs font-medium" style={{ color: '#6B7280' }}>
                  成功要因:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {insight.successFactors.map((factor, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: '#F9FAFB',
                        color: '#374151',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <svg className="w-3 h-3" style={{ color: '#059669' }} fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div
                className="flex items-center justify-between mt-3 pt-3"
                style={{ borderTop: '1px solid #F3F4F6' }}
              >
                <div className="flex items-center gap-4 text-xs" style={{ color: '#6B7280' }}>
                  <span>エンゲージメント率: {insight.engagementRate}%</span>
                  <span>{insight.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div
        className="mt-4 p-3 rounded-lg text-xs"
        style={{ backgroundColor: '#F9FAFB' }}
      >
        <p style={{ color: '#4B5563' }}>
          💡 ヒント: 成功した投稿のパターンを分析し、類似のトピックや形式を試してみてください。
        </p>
      </div>
    </div>
  );
};
