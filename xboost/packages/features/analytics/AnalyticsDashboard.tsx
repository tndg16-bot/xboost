'use client';

import { ImpressionChart } from './ImpressionChart';
import { FollowerGrowthChart } from './FollowerGrowthChart';
import { EngagementCard } from './EngagementCard';
import { PostRanking } from './PostRanking';
import { TimeAnalysis } from './TimeAnalysis';
import { PatternDetector } from './PatternDetector';
import { monthlyData, postPerformance, timeOfDayData, calculateTotals } from './mockData';

const colors = {
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
} as const;

export const AnalyticsDashboard: React.FC = () => {
  const totals = calculateTotals();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors['gray-50'] }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Track your performance and identify viral patterns</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Engagement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EngagementCard
            title="Total Impressions"
            value={formatNumber(totals.totalImpressions)}
            change="+45% from last period"
            changeType="positive"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            color="blue"
          />
          <EngagementCard
            title="Total Likes"
            value={formatNumber(totals.totalLikes)}
            change="+38% from last period"
            changeType="positive"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
            color="red"
          />
          <EngagementCard
            title="Total Retweets"
            value={formatNumber(totals.totalRetweets)}
            change="+52% from last period"
            changeType="positive"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
            color="blue"
          />
          <EngagementCard
            title="Follower Growth"
            value={`+${formatNumber(totals.followerGrowth)}`}
            change="+18% from last period"
            changeType="positive"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            color="green"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Impression Trends</h2>
            <ImpressionChart data={monthlyData} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Follower Growth</h2>
            <FollowerGrowthChart data={monthlyData} />
          </div>
        </div>

        {/* Post Ranking and Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PostRanking posts={postPerformance} limit={5} />
          <TimeAnalysis data={timeOfDayData} />
        </div>

        {/* Pattern Detector */}
        <PatternDetector />
      </div>
    </div>
  );
};
