'use client';

import { useState, useEffect } from 'react';

const colors = {
  white: '#FFFFFF',
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
  'gray-200': '#E5E7EB',
  'gray-500': '#6B7280',
  'gray-700': '#374151',
  'gray-900': '#111827',
  'blue-500': '#1DA1F2',
  'green-500': '#17BF63',
  'red-500': '#EF4444',
  'yellow-500': '#F59E0B',
  'yellow-100': '#FEF3C7',
} as const;

interface PostWithMetrics {
  id: string;
  content: string;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  engagementRate: number;
  format: string;
  contentType?: string | null;
  hook?: string;
  contentLength?: number;
  characterCount?: number;
  isViral: boolean;
}

interface PatternAnalysis {
  viralPosts: PostWithMetrics[];
  normalPosts: PostWithMetrics[];
  viralStats: {
    count: number;
    avgImpressions: number;
    avgEngagementRate: number;
    commonFormats: { format: string; count: number }[];
    commonContentTypes: { type: string | null; count: number }[];
    avgContentLength: number;
    avgCharacterCount: number;
    sampleHooks: string[];
  };
  normalStats: {
    count: number;
    avgImpressions: number;
    avgEngagementRate: number;
    commonFormats: { format: string; count: number }[];
    commonContentTypes: { type: string | null; count: number }[];
    avgContentLength: number;
    avgCharacterCount: number;
    sampleHooks: string[];
  };
  insights: {
    bestPerformingFormat?: string;
    bestPerformingContentType?: string | null;
    optimalContentLength?: { min: number; max: number };
    hookPatterns?: string[];
  };
}

export const WinningPatternAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'insights'>('overview');

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/analytics/winning-patterns?period=30d');
      if (!response.ok) {
        throw new Error('Failed to fetch winning patterns');
      }
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Winning Pattern Analysis</h3>
        </div>
        <div className="p-6 text-center text-gray-500">Loading analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Winning Pattern Analysis</h3>
        </div>
        <div className="p-6 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { viralPosts, viralStats, normalStats, insights } = analysis;

  const formatLabel = (format: string) => {
    const labels: Record<string, string> = {
      SINGLE: 'Single Post',
      THREAD: 'Thread',
      QUOTE: 'Quote',
      REPLY: 'Reply',
      POLL: 'Poll',
    };
    return labels[format] || format;
  };

  const contentTypeLabel = (type: string | null) => {
    const labels: Record<string, string> = {
      EDUCATIONAL: 'Educational',
      ENTERTAINMENT: 'Entertainment',
      PROMOTIONAL: 'Promotional',
      PERSONAL: 'Personal',
      NEWS: 'News',
      OPINION: 'Opinion',
      OTHER: 'Other',
    };
    return type ? labels[type] || type : 'Unknown';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Winning Pattern Analysis</h3>
            <p className="text-sm text-gray-500 mt-1">
              Analyze viral vs normal posts to find winning patterns
            </p>
          </div>
          <button
            onClick={fetchAnalysis}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'comparison'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Comparison
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Insights
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="rounded-lg p-4 text-center"
                style={{ backgroundColor: `${colors['yellow-100']}` }}
              >
                <p className="text-3xl font-bold" style={{ color: colors['yellow-500'] }}>
                  {viralStats.count}
                </p>
                <p className="text-xs mt-1" style={{ color: colors['yellow-600'] }}>
                  Viral Posts (100K+ impressions)
                </p>
              </div>
              <div className="rounded-lg p-4 text-center bg-gray-50">
                <p className="text-3xl font-bold" style={{ color: colors['blue-500'] }}>
                  {formatNumber(Math.floor(viralStats.avgImpressions))}
                </p>
                <p className="text-xs text-gray-500 mt-1">Avg Viral Impressions</p>
              </div>
              <div className="rounded-lg p-4 text-center bg-gray-50">
                <p className="text-3xl font-bold" style={{ color: colors['green-500'] }}>
                  {viralStats.avgEngagementRate.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Avg Viral Engagement</p>
              </div>
            </div>

            {/* Viral Posts Preview */}
            {viralPosts.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Top Viral Posts</h4>
                <div className="space-y-2">
                  {viralPosts.slice(0, 3).map((post, index) => (
                    <div
                      key={post.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-100"
                      style={{
                        backgroundColor: index === 0 ? `${colors['yellow-100']}` : 'transparent',
                      }}
                    >
                      <div className="flex-shrink-0">
                        <span
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                          style={{
                            backgroundColor: colors['yellow-500'],
                            color: colors.white,
                          }}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="font-semibold" style={{ color: colors['blue-500'] }}>
                            {formatNumber(post.impressions)} impressions
                          </span>
                          <span style={{ color: colors['green-500'] }}>
                            {post.engagementRate.toFixed(1)}% engagement
                          </span>
                          {post.format && <span>{formatLabel(post.format)}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-gray-600 font-semibold">Metric</th>
                    <th className="px-3 py-2 text-center text-gray-600 font-semibold" style={{ color: colors['yellow-500'] }}>
                      Viral Posts
                    </th>
                    <th className="px-3 py-2 text-center text-gray-600 font-semibold">Normal Posts</th>
                    <th className="px-3 py-2 text-center text-gray-600 font-semibold">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-3 py-2 text-gray-700">Count</td>
                    <td className="px-3 py-2 text-center" style={{ color: colors['yellow-500'] }}>
                      {viralStats.count}
                    </td>
                    <td className="px-3 py-2 text-center">{normalStats.count}</td>
                    <td className="px-3 py-2 text-center">
                      {viralStats.count > normalStats.count ? (
                        <span style={{ color: colors['green-500'] }}>+{viralStats.count - normalStats.count}</span>
                      ) : (
                        <span style={{ color: colors['red-500'] }}>{viralStats.count - normalStats.count}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-3 py-2 text-gray-700">Avg Impressions</td>
                    <td className="px-3 py-2 text-center" style={{ color: colors['yellow-500'] }}>
                      {formatNumber(Math.floor(viralStats.avgImpressions))}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {formatNumber(Math.floor(normalStats.avgImpressions))}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {viralStats.avgImpressions > normalStats.avgImpressions ? (
                        <span style={{ color: colors['green-500'] }}>
                          +{((viralStats.avgImpressions / normalStats.avgImpressions - 1) * 100).toFixed(0)}%
                        </span>
                      ) : (
                        <span style={{ color: colors['red-500'] }}>
                          {((viralStats.avgImpressions / normalStats.avgImpressions - 1) * 100).toFixed(0)}%
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-3 py-2 text-gray-700">Avg Engagement Rate</td>
                    <td className="px-3 py-2 text-center" style={{ color: colors['yellow-500'] }}>
                      {viralStats.avgEngagementRate.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2 text-center">
                      {normalStats.avgEngagementRate.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2 text-center">
                      {viralStats.avgEngagementRate > normalStats.avgEngagementRate ? (
                        <span style={{ color: colors['green-500'] }}>
                          +{(viralStats.avgEngagementRate - normalStats.avgEngagementRate).toFixed(2)}%
                        </span>
                      ) : (
                        <span style={{ color: colors['red-500'] }}>
                          {(viralStats.avgEngagementRate - normalStats.avgEngagementRate).toFixed(2)}%
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-3 py-2 text-gray-700">Avg Content Length (lines)</td>
                    <td className="px-3 py-2 text-center" style={{ color: colors['yellow-500'] }}>
                      {viralStats.avgContentLength.toFixed(0)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {normalStats.avgContentLength.toFixed(0)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {viralStats.avgContentLength < normalStats.avgContentLength ? (
                        <span style={{ color: colors['green-500'] }}>
                          {normalStats.avgContentLength - viralStats.avgContentLength} lines shorter
                        </span>
                      ) : (
                        <span style={{ color: colors['red-500'] }}>
                          +{viralStats.avgContentLength - normalStats.avgContentLength} lines longer
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Format Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3" style={{ color: colors['yellow-500'] }}>
                  Viral Post Formats
                </h4>
                <div className="space-y-2">
                  {viralStats.commonFormats.map((item) => (
                    <div key={item.format} className="flex justify-between items-center text-xs">
                      <span className="text-gray-700">{formatLabel(item.format)}</span>
                      <span className="font-semibold" style={{ color: colors['yellow-500'] }}>
                        {item.count} ({((item.count / viralStats.count) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Normal Post Formats</h4>
                <div className="space-y-2">
                  {normalStats.commonFormats.map((item) => (
                    <div key={item.format} className="flex justify-between items-center text-xs">
                      <span className="text-gray-700">{formatLabel(item.format)}</span>
                      <span className="font-semibold text-gray-600">
                        {item.count} ({normalStats.count > 0 ? ((item.count / normalStats.count) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            {/* Key Insights */}
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: `${colors['green-500']}10` }}
            >
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Insights</h4>
              <div className="space-y-2 text-xs">
                {insights.bestPerformingFormat && (
                  <div className="flex items-center gap-2">
                    <span style={{ color: colors['green-500'] }}>✓</span>
                    <span className="text-gray-700">
                      Best performing format: <strong>{formatLabel(insights.bestPerformingFormat)}</strong>
                    </span>
                  </div>
                )}
                {insights.bestPerformingContentType && (
                  <div className="flex items-center gap-2">
                    <span style={{ color: colors['green-500'] }}>✓</span>
                    <span className="text-gray-700">
                      Best content type: <strong>{contentTypeLabel(insights.bestPerformingContentType)}</strong>
                    </span>
                  </div>
                )}
                {insights.optimalContentLength && (
                  <div className="flex items-center gap-2">
                    <span style={{ color: colors['green-500'] }}>✓</span>
                    <span className="text-gray-700">
                      Optimal content length: <strong>{insights.optimalContentLength.min} - {insights.optimalContentLength.max} lines</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Recommendations</h4>
              <div className="space-y-2 text-xs text-gray-700">
                <p>
                  <strong>Focus on {insights.bestPerformingFormat || 'single posts'}</strong>: This format performs {viralStats.count > 0 ? ((viralStats.avgImpressions / normalStats.avgImpressions - 1) * 100).toFixed(0) : 'significantly'} better on average.
                </p>
                {insights.optimalContentLength && (
                  <p>
                    <strong>Keep content concise:</strong> Aim for {insights.optimalContentLength.min}-{insights.optimalContentLength.max} lines to maximize engagement.
                  </p>
                )}
                {viralStats.avgEngagementRate > normalStats.avgEngagementRate && (
                  <p>
                    <strong>Engage your audience:</strong> Viral posts have {(viralStats.avgEngagementRate - normalStats.avgEngagementRate).toFixed(2)}% higher engagement rate.
                  </p>
                )}
                <p>
                  <strong>Study viral hooks:</strong> Analyze the first 1-2 lines of your viral posts to craft compelling hooks.
                </p>
              </div>
            </div>

            {/* Sample Hooks */}
            {viralStats.sampleHooks.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Viral Post Hooks</h4>
                <div className="space-y-2">
                  {viralStats.sampleHooks.map((hook, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-gray-100 text-sm"
                      style={{ backgroundColor: `${colors['yellow-100']}` }}
                    >
                      <div className="font-semibold mb-1 text-xs" style={{ color: colors['yellow-600'] }}>
                        Hook #{index + 1}
                      </div>
                      <p className="text-xs text-gray-700 italic">"{hook}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
