'use client';

import React, { useState } from 'react';
import { CalendarView, PostList, ScheduledPost, ReservationFormData, mockScheduledPosts } from '@xboost/scheduling';

export default function SchedulingPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>(mockScheduledPosts);
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');

  const handlePostCreate = (data: ReservationFormData) => {
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content: data.content,
      scheduledAt: new Date(`${data.scheduledDate}T${data.scheduledTime}`),
      status: 'normal',
      platform: 'x',
      createdAt: new Date(),
      updatedAt: new Date(),
      characterCount: data.content.length,
      hashtags: data.hashtags ? data.hashtags.split(' ') : undefined,
    };

    setPosts([...posts, newPost]);
  };

  const handlePostUpdate = (postId: string, data: ReservationFormData) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              content: data.content,
              scheduledAt: new Date(`${data.scheduledDate}T${data.scheduledTime}`),
              hashtags: data.hashtags ? data.hashtags.split(' ') : undefined,
              characterCount: data.content.length,
              updatedAt: new Date(),
            }
          : post
      )
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                予約投稿管理
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                2ヶ月先まで投稿をスケジュールできます
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveView('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeView === 'calendar'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                カレンダー
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeView === 'list'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                リスト
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          {activeView === 'calendar' ? (
            <CalendarView
              posts={posts}
              onPostCreate={handlePostCreate}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ) : (
            <PostList
              posts={posts}
              onPostClick={(post: ScheduledPost) => console.log('Clicked post:', post.id)}
              onPostDelete={handlePostDelete}
              onPostEdit={(post: ScheduledPost) => console.log('Edit post:', post.id)}
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>正常</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>要確認</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>クリックして予約作成</span>
            </div>
          </div>
          <p className="mt-2">Powered by Xboost • シンプルで直感的な投稿管理</p>
        </div>
      </div>
    </div>
  );
}
