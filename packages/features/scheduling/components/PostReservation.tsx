'use client';

import React from 'react';
import { ScheduledPost } from '../types';
import { cn } from '@xboost/ui';

interface PostReservationProps {
  post: ScheduledPost;
  onClick: () => void;
}

const PostReservation: React.FC<PostReservationProps> = ({ post, onClick }) => {
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

  const getStatusLabel = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'scheduled':
        return '予約済';
      case 'posted':
        return '投稿済';
      case 'needs-review':
        return '要確認';
      case 'failed':
        return '失敗';
      default:
        return status;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left transition-all duration-200',
        'group hover:shadow-md'
      )}
    >
      <div className={cn('flex items-start gap-2 p-3 rounded-lg border transition-colors', 'bg-white border-gray-200 hover:border-blue-400')}>
        {/* Status Indicator with Halo Effect */}
        <div className="relative flex-shrink-0 mt-1">
          <span className={cn('absolute inset-0 rounded-full opacity-20 animate-pulse', getStatusColor(post.status))} />
          <span className={cn('relative w-2 h-2 rounded-full', getStatusColor(post.status))} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">{formatTime(post.scheduledAt)}</span>
            <span
              className={cn(
                'text-[10px] font-medium px-1.5 py-0.5 rounded',
                post.status === 'needs-review' || post.status === 'failed'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-700'
              )}
            >
              {getStatusLabel(post.status)}
            </span>
          </div>

          <p className="text-sm text-gray-900 leading-relaxed line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.content}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{post.characterCount} 文字</span>
            {post.hashtags && post.hashtags.length > 0 && (
              <span className="text-xs text-gray-400">
                {post.hashtags.map(tag => `#${tag}`).join(' ')}
              </span>
            )}
          </div>
        </div>

        {/* Chevron for expandable indicator */}
        <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default PostReservation;
