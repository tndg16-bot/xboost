'use client';

interface EngagementCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

const colors = {
  'blue-500': '#1DA1F2',
  'green-500': '#17BF63',
  'red-500': '#EF4444',
  'yellow-500': '#F59E0B',
  'gray-400': '#9CA3AF',
  'gray-500': '#6B7280',
  'green-600': '#16A34A',
  'red-600': '#DC2626',
  'white': '#FFFFFF',
} as const;

export const EngagementCard: React.FC<EngagementCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  color = 'blue',
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return colors['blue-500'];
      case 'green':
        return colors['green-500'];
      case 'red':
        return colors['red-500'];
      case 'yellow':
        return colors['yellow-500'];
      default:
        return colors['blue-500'];
    }
  };

  const getChangeColorClass = () => {
    switch (changeType) {
      case 'positive':
        return colors['green-600'];
      case 'negative':
        return colors['red-600'];
      default:
        return colors['gray-500'];
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm mt-1" style={{ color: getChangeColorClass() }}>
              {changeType === 'positive' && '↑ '}
              {changeType === 'negative' && '↓ '}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${getColorClass()}15` }}
          >
            <div style={{ color: getColorClass() }}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
};
