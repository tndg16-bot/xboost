'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const colors = {
  white: '#FFFFFF',
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
  'gray-200': '#E5E7EB',
  'gray-300': '#D1D5DB',
  'gray-400': '#9CA3AF',
  'gray-500': '#6B7280',
  'gray-600': '#4B5563',
  'gray-700': '#374151',
  'gray-800': '#1F2937',
  'gray-900': '#111827',
  'blue-400': '#38BDF8',
  'blue-500': '#1DA1F2',
  'blue-600': '#0284C7',
  'blue-700': '#0369A1',
  'blue-900': '#0C4A6E',
  'green-400': '#4ADE80',
  'green-500': '#17BF63',
  'green-600': '#16A34A',
  'green-700': '#15803D',
  'red-500': '#EF4444',
  'red-600': '#DC2626',
  'yellow-500': '#F59E0B',
  'yellow-600': '#D97706',
} as const;

interface ImpressionChartProps {
  data: { month: string; impressions: number }[];
}

export const ImpressionChart: React.FC<ImpressionChartProps> = ({ data }) => {
  const formatImpressions = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors['gray-200']} />
        <XAxis
          dataKey="month"
          tick={{ fill: colors['gray-500'], fontSize: 12 }}
          axisLine={{ stroke: colors['gray-200'] }}
        />
        <YAxis
          tickFormatter={formatImpressions}
          tick={{ fill: colors['gray-500'], fontSize: 12 }}
          axisLine={{ stroke: colors['gray-200'] }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.white,
            border: `1px solid ${colors['gray-200']}`,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          formatter={(value: number) => [formatImpressions(value), 'Impressions']}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="impressions"
          stroke={colors['blue-500']}
          strokeWidth={3}
          dot={{ fill: colors['blue-500'], strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: colors['blue-600'] }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
