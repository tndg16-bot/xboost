'use client';

import { getViralPosts, PostPerformance } from './mockData';

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
  'blue-500': '#1DA1F2',
} as const;

export const PatternDetector: React.FC = () => {
  const viralPosts = getViralPosts();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const analyzePatterns = () => {
    const totalViralImpressions = viralPosts.reduce((sum, post) => sum + post.impressions, 0);
    const totalPosts = 12; // From mock data
    const viralRate = (viralPosts.length / totalPosts) * 100;
    const avgImpressions = totalViralImpressions / viralPosts.length;
    const avgEngagement =
      viralPosts.reduce((sum, post) => sum + post.engagementRate, 0) / viralPosts.length;

    return {
      totalViralImpressions,
      viralRate,
      avgImpressions,
      avgEngagement,
    };
  };

  const patterns = analyzePatterns();

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
            <p className="text-sm text-gray-500">Posts with 100K+ impressions</p>
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
              {viralPosts.length}
            </p>
            <p className="text-xs mt-1" style={{ color: colors['yellow-600'] }}>
              Viral Posts
            </p>
          </div>
          <div className="rounded-lg p-4 text-center bg-gray-50">
            <p className="text-3xl font-bold text-gray-900">{patterns.viralRate.toFixed(0)}%</p>
            <p className="text-xs text-gray-500 mt-1">Viral Rate</p>
          </div>
          <div className="rounded-lg p-4 text-center bg-gray-50">
            <p className="text-3xl font-bold" style={{ color: colors['blue-500'] }}>
              {formatNumber(patterns.avgImpressions)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Avg Impressions</p>
          </div>
          <div className="rounded-lg p-4 text-center bg-gray-50">
            <p className="text-3xl font-bold" style={{ color: colors['green-500'] }}>
              {patterns.avgEngagement.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Avg Engagement</p>
          </div>
        </div>

        {/* Viral Posts List */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Viral Posts</h4>
          {viralPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              style={{
                backgroundColor: index === 0 ? `${colors['yellow-100']}` : 'transparent',
                borderColor: index === 0 ? colors['yellow-500'] : colors['gray-200'],
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
                  {index === 0 && '🏆'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 line-clamp-2 mb-1">{post.content}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-semibold" style={{ color: colors['blue-500'] }}>
                    {formatNumber(post.impressions)} impressions
                  </span>
                  <span style={{ color: colors['green-500'] }}>
                    {post.engagementRate}% engagement
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
