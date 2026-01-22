'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const colors = {
  white: '#FFFFFF',
  'gray-200': '#E5E7EB',
  'gray-500': '#6B7280',
  'green-400': '#4ADE80',
  'green-500': '#17BF63',
  'green-600': '#16A34A',
  'green-700': '#15803D',
} as const;

interface FollowerGrowthChartProps {
  data: { month: string; totalFollowers: number }[];
}

export const FollowerGrowthChart: React.FC<FollowerGrowthChartProps> = ({ data }) => {
  const formatFollowers = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors['green-500']} stopOpacity={0.3} />
            <stop offset="95%" stopColor={colors['green-500']} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors['gray-200']} />
        <XAxis
          dataKey="month"
          tick={{ fill: colors['gray-500'], fontSize: 12 }}
          axisLine={{ stroke: colors['gray-200'] }}
        />
        <YAxis
          tickFormatter={formatFollowers}
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
          formatter={(value: number) => [formatFollowers(value), 'Followers']}
        />
        <Area
          type="monotone"
          dataKey="totalFollowers"
          stroke={colors['green-500']}
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorFollowers)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
