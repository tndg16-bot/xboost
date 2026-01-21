'use client';

import { PostPerformance } from './mockData';

const colors = {
  'blue-500': '#1DA1F2',
  'green-500': '#17BF63',
  'gray-200': '#E5E7EB',
  'gray-400': '#9CA3AF',
  'gray-500': '#6B7280',
  'gray-700': '#374151',
  'gray-900': '#111827',
  'yellow-500': '#F59E0B',
  'yellow-100': '#FEF3C7',
} as const;

interface PostRankingProps {
  posts: PostPerformance[];
  limit?: number;
}

export const PostRanking: React.FC<PostRankingProps> = ({ posts, limit = 5 }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const topPosts = posts.slice(0, limit);

  const isViral = (impressions: number) => impressions > 100000;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Top Performing Posts</h3>
        <p className="text-sm text-gray-500 mt-1">Posts with the highest impressions</p>
      </div>
      <div className="divide-y divide-gray-100">
        {topPosts.map((post, index) => (
          <div
            key={post.id}
            className={`px-6 py-4 hover:bg-gray-50 transition-colors ${isViral(post.impressions) ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </span>
                  {isViral(post.impressions) && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: colors['yellow-100'], color: colors['yellow-500'] }}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Viral
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{post.content}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {formatNumber(post.impressions)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {formatNumber(post.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {formatNumber(post.retweets)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {formatNumber(post.replies)}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: colors['green-500'] }}
                  >
                    {post.engagementRate}% engagement
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold" style={{ color: colors['blue-500'] }}>
                  {formatNumber(post.impressions)}
                </span>
                <p className="text-xs text-gray-400 mt-1">impressions</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
