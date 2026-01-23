'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeOfDayData } from './mockData';

const colors = {
  white: '#FFFFFF',
  'gray-200': '#E5E7EB',
  'gray-500': '#6B7280',
  'blue-400': '#38BDF8',
  'blue-500': '#1DA1F2',
  'blue-600': '#0284C7',
  'green-500': '#17BF63',
  'green-600': '#16A34A',
} as const;

interface TimeAnalysisProps {
  data: TimeOfDayData[];
}

export const TimeAnalysis: React.FC<TimeAnalysisProps> = ({ data }) => {
  const formatHour = (hour: number) => {
    return `${hour}:00`;
  };

  const formatImpressions = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  // Find best posting times
  const sortedByImpressions = [...data].sort((a, b) => b.impressions - a.impressions);
  const sortedByEngagement = [...data].sort((a, b) => b.engagementRate - a.engagementRate);
  const bestTimeImpressions = sortedByImpressions[0];
  const bestTimeEngagement = sortedByEngagement[0];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Best Posting Times</h3>
        <p className="text-sm text-gray-500 mt-1">Analyze when your content performs best</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Most Impressions</p>
            <p className="text-2xl font-bold text-blue-900">{formatHour(bestTimeImpressions.hour)}</p>
            <p className="text-sm text-blue-700 mt-1">{formatImpressions(bestTimeImpressions.impressions)} avg impressions</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Highest Engagement</p>
            <p className="text-2xl font-bold text-green-900">{formatHour(bestTimeEngagement.hour)}</p>
            <p className="text-sm text-green-700 mt-1">{bestTimeEngagement.engagementRate}% avg engagement rate</p>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors['gray-200']} />
              <XAxis
                dataKey="hour"
                tickFormatter={formatHour}
                tick={{ fill: colors['gray-500'], fontSize: 11 }}
                axisLine={{ stroke: colors['gray-200'] }}
              />
              <YAxis
                tickFormatter={formatImpressions}
                tick={{ fill: colors['gray-500'], fontSize: 11 }}
                axisLine={{ stroke: colors['gray-200'] }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.white,
                  border: `1px solid ${colors['gray-200']}`,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                labelFormatter={(label) => `${label}:00`}
                formatter={(value: number | undefined) => value !== undefined ? [formatImpressions(value), 'Impressions'] : ['', '']}
              />
              <Bar dataKey="impressions" fill={colors['blue-500']} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
