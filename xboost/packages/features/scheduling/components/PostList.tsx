'use client';

import React from 'react';
import { ScheduledPost } from '../types';
import PostReservation from './PostReservation';
import { Button, Modal } from '@xboost/ui';

interface PostListProps {
  posts: ScheduledPost[];
  onPostClick: (post: ScheduledPost) => void;
  onPostDelete?: (postId: string) => void;
  onPostEdit?: (post: ScheduledPost) => void;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  onPostClick,
  onPostDelete,
  onPostEdit,
}) => {
  const [deleteConfirmPost, setDeleteConfirmPost] = React.useState<ScheduledPost | null>(null);

  const handleDelete = (postId: string) => {
    onPostDelete?.(postId);
    setDeleteConfirmPost(null);
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
  };

  // Group posts by month
  const groupedPosts = posts.reduce((acc, post) => {
    const monthKey = formatMonth(post.scheduledAt);
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(post);
    return acc;
  }, {} as Record<string, ScheduledPost[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          予約投稿一覧 ({posts.length}件)
        </h2>
        <Button variant="primary" size="sm">
          新規作成
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 text-sm">
            予約投稿はまだありません
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPosts).map(([month, monthPosts]) => (
            <div key={month}>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {month}
                <span className="text-gray-400">({monthPosts.length}件)</span>
              </h3>
              <div className="space-y-2">
                {monthPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative"
                  >
                    <PostReservation
                      post={post}
                      onClick={() => onPostClick(post)}
                    />
                    {/* Quick Actions */}
                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPostEdit?.(post)}
                        className="h-8 w-8 p-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteConfirmPost(post)}
                        className="h-8 w-8 p-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmPost !== null}
        onClose={() => setDeleteConfirmPost(null)}
        title="予約をキャンセル"
        description="この予約をキャンセルしてもよろしいですか？この操作は元に戻せません。"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmPost(null)}
            >
              キャンセル
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(deleteConfirmPost!.id)}
            >
              削除する
            </Button>
          </div>
        }
      >
        {deleteConfirmPost && (
          <div className="bg-gray-50 rounded-lg p-3 mt-4">
            <p className="text-sm text-gray-700 line-clamp-2">
              {deleteConfirmPost.content}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {deleteConfirmPost.scheduledAt.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
