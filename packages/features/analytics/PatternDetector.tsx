'use client';

import { useState, useEffect } from 'react';

const colors = {
  white: '#FFFFFF',
  'yellow-500': '#F59E0B',
  'yellow-100': '#FEF3C7',
  'yellow-600': '#D97706',
  'gray-200': '#E5E7EB',
  'gray-500': '#6B7280',
  'gray-700': '#374151',
  'gray-900': '#111827',
  'green-500': '#17BF63',
  'blue-100': '#DBEAFE',
  'blue-500': '#1DA1F2',
  'blue-600': '#0284C7',
  'red-500': '#EF4444',
} as const;

export const PatternDetector: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWinningPatterns();
  }, []);

  const fetchWinningPatterns = async () => {
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
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Viral Post Pattern Detector</h3>
        </div>
        <div className="p-6 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Viral Post Pattern Detector</h3>
        </div>
        <div className="p-6 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { viralPosts, viralStats, normalStats, insights } = analysis;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: `${colors['yellow-500']}20` }}>
            <svg className="w-4 h-4" fill={colors['yellow-500']} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Viral Post Pattern Detector</h3>
            <p className="text-sm text-gray-500">Analyze viral vs normal posts</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div
            className="rounded-lg p-4 text-center"
            style={{ backgroundColor: `${colors['yellow-100']}` }}
          >
            <p className="text-3xl font-bold" style={{ color: colors['yellow-600'] }}>
              {viralStats.count}
            </p>
            <p className="text-xs mt-1" style={{ color: colors['yellow-600'] }}>
              Viral Posts
            </p>
          </div>
          <div className="rounded-lg p-4 text-center bg-gray-50">
            <p className="text-3xl font-bold text-gray-900">
              {viralStats.count > 0 && normalStats.count > 0
                ? ((viralStats.count / (viralStats.count + normalStats.count)) * 100).toFixed(1)
                : '0'}
              %
            </p>
            <p className="text-xs text-gray-500 mt-1">Viral Rate</p>
          </div>
          <div className="rounded-lg p-4 text-center bg-gray-50">
            <p className="text-3xl font-bold" style={{ color: colors['blue-500'] }}>
              {formatNumber(Math.floor(viralStats.avgImpressions))}
            </p>
            <p className="text-xs text-gray-500 mt-1">Avg Viral Impressions</p>
          </div>
          <div className="rounded-lg p-4 text-center bg-gray-50">
            <p className="text-3xl font-bold" style={{ color: colors['green-500'] }}>
              {viralStats.avgEngagement.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Avg Viral Engagement</p>
          </div>
        </div>

        {/* Comparison: Viral vs Normal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Viral Posts Stats</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Count:</span>
                <span className="font-semibold text-gray-900">{viralStats.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Impressions:</span>
                <span className="font-semibold text-gray-900">{formatNumber(Math.floor(viralStats.avgImpressions))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Engagement:</span>
                <span className="font-semibold text-gray-900">{viralStats.avgEngagement.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Content Length:</span>
                <span className="font-semibold text-gray-900">{viralStats.avgContentLength.toFixed(0)} lines</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Character Count:</span>
                <span className="font-semibold text-gray-900">{viralStats.avgCharacterCount.toFixed(0)} chars</span>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Normal Posts Stats</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Count:</span>
                <span className="font-semibold text-gray-900">{normalStats.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Impressions:</span>
                <span className="font-semibold text-gray-900">{formatNumber(Math.floor(normalStats.avgImpressions))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Engagement:</span>
                <span className="font-semibold text-gray-900">{normalStats.avgEngagement.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Content Length:</span>
                <span className="font-semibold text-gray-900">{normalStats.avgContentLength.toFixed(0)} lines</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Character Count:</span>
                <span className="font-semibold text-gray-900">{normalStats.avgCharacterCount.toFixed(0)} chars</span>
              </div>
            </div>
          </div>
        </div>

        {/* Format Analysis */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Best Performing Formats</h4>
          <div className="space-y-2">
            {viralStats.commonFormats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {viralStats.commonFormats.map((item: any) => (
                  <div
                    key={item.format}
                    className="rounded p-2 text-center text-xs"
                    style={{
                      backgroundColor: `${colors['yellow-100']}`,
                      color: colors['yellow-600'],
                    }}
                  >
                    <div className="font-bold">{item.format}</div>
                    <div className="text-gray-500">{item.count} posts</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Type Analysis */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Best Performing Content Types</h4>
          <div className="space-y-2">
            {viralStats.commonContentTypes.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {viralStats.commonContentTypes.map((item: any) => (
                  <div
                    key={item.type || 'unknown'}
                    className="rounded p-2 text-center text-xs"
                    style={{
                      backgroundColor: `${colors['blue-100']}`,
                      color: colors['blue-600'],
                    }}
                  >
                    <div className="font-bold">{item.type || 'Unknown'}</div>
                    <div className="text-gray-500">{item.count} posts</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        {insights && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Insights</h4>
            <div className="space-y-2 text-xs">
              {insights.bestPerformingFormat && (
                <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: `${colors['green-500']}10` }}>
                  <span style={{ color: colors['green-500'] }}>✓</span>
                  <span className="text-gray-700">
                    Best format: <strong>{insights.bestPerformingFormat}</strong>
                  </span>
                </div>
              )}
              {insights.bestPerformingContentType && (
                <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: `${colors['green-500']}10` }}>
                  <span style={{ color: colors['green-500'] }}>✓</span>
                  <span className="text-gray-700">
                    Best content type: <strong>{insights.bestPerformingContentType || 'Mixed'}</strong>
                  </span>
                </div>
              )}
              {insights.optimalContentLength && (
                <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: `${colors['green-500']}10` }}>
                  <span style={{ color: colors['green-500'] }}>✓</span>
                  <span className="text-gray-700">
                    Optimal content length: <strong>{insights.optimalContentLength.min} - {insights.optimalContentLength.max} lines</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sample Hooks */}
        {viralStats.sampleHooks.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Viral Post Hooks (First Lines)</h4>
            <div className="space-y-2">
              {viralStats.sampleHooks.map((hook: string, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-100 text-sm text-gray-700"
                  style={{ backgroundColor: `${colors['yellow-100']}` }}
                >
                  <div className="font-semibold mb-1" style={{ color: colors['yellow-600'] }}>
                    Hook #{index + 1}
                  </div>
                  <p className="text-xs italic">"{hook}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
