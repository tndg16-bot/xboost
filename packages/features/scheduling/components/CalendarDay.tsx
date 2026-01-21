'use client';

import React from 'react';
import { CalendarDay as CalendarDayType, ScheduledPost } from '../types';
import { cn } from '@xboost/ui';

interface CalendarDayProps {
  day: CalendarDayType;
  onClick: (date: Date) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, onClick }) => {
  const getPostCount = () => day.posts.length;

  const getStatusColor = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'normal':
      case 'scheduled':
      case 'posted':
        return 'bg-emerald-500';
      case 'needs-review':
      case 'failed':
        return 'bg-rose-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <button
      onClick={() => onClick(day.date)}
      className={cn(
        'relative h-28 p-2 text-left transition-all duration-200',
        'border border-gray-200 rounded-lg',
        'hover:shadow-md hover:border-blue-400 hover:z-10',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
        {
          'bg-white': day.isCurrentMonth,
          'bg-gray-50': !day.isCurrentMonth,
          'ring-2 ring-blue-500 ring-offset-1': day.isToday,
          'cursor-pointer': true,
        }
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <span
          className={cn(
            'text-sm font-medium',
            day.isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-700',
            !day.isCurrentMonth && 'text-gray-400'
          )}
        >
          {day.date.getDate()}
        </span>
        {getPostCount() > 0 && (
          <span className="text-xs text-gray-500 font-medium">
            {getPostCount()}
          </span>
        )}
      </div>

      <div className="space-y-1 overflow-hidden">
        {day.posts.slice(0, 2).map((post) => (
          <div
            key={post.id}
            className={cn(
              'flex items-center gap-1.5',
              'text-xs text-gray-700 truncate',
              'px-1.5 py-0.5 rounded-md',
              'bg-gray-100 hover:bg-gray-200'
            )}
            title={post.content}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', getStatusColor(post.status))} />
            <span className="truncate">{post.content}</span>
          </div>
        ))}
        {day.posts.length > 2 && (
          <div className="text-xs text-gray-500 pl-2.5">
            +{day.posts.length - 2} more
          </div>
        )}
      </div>
    </button>
  );
};

export default CalendarDay;
