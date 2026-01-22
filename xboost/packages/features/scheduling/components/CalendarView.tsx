'use client';

import React, { useState, useMemo } from 'react';
import { ScheduledPost, CalendarDay as CalendarDayType, ReservationFormData } from '../types';
import CalendarDay from './CalendarDay';
import ReservationForm from './ReservationForm';
import { Button } from '@xboost/ui';

interface CalendarViewProps {
  posts: ScheduledPost[];
  onPostCreate?: (data: ReservationFormData) => void;
  onPostUpdate?: (postId: string, data: ReservationFormData) => void;
  onPostDelete?: (postId: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onPostCreate,
  onPostUpdate,
  onPostDelete,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Start from Sunday (0) before the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // End from Saturday (6) after the last day
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: CalendarDayType[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDateIter = new Date(startDate);

    while (currentDateIter <= endDate) {
      const date = new Date(currentDateIter);

      // Find posts for this day
      const dayPosts = posts.filter((post) => {
        const postDate = new Date(post.scheduledAt);
        postDate.setHours(0, 0, 0, 0);
        return postDate.getTime() === date.getTime();
      });

      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime(),
        posts: dayPosts,
      });

      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    return days;
  }, [currentDate, posts]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
    setEditingPost(null);
  };

  const handlePostClick = (post: ScheduledPost) => {
    setSelectedDate(post.scheduledAt);
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleFormSave = (data: ReservationFormData) => {
    const dateTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`);

    if (editingPost) {
      onPostUpdate?.(editingPost.id, data);
    } else {
      onPostCreate?.(data);
    }

    setIsFormOpen(false);
    setEditingPost(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPost(null);
    setSelectedDate(null);
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  // Calculate statistics
  const totalPosts = posts.length;
  const thisMonthPosts = posts.filter((post) => {
    return post.scheduledAt.getMonth() === currentDate.getMonth() &&
           post.scheduledAt.getFullYear() === currentDate.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            スケジュール管理
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            合計 {totalPosts}件 • 今月 {thisMonthPosts}件の予約
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={goToToday}>
            今日
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={goToPreviousMonth}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
          />
          <div className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg min-w-[140px] text-center">
            <span className="font-semibold text-gray-900">
              {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
            </span>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={goToNextMonth}
            rightIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`py-3 text-center text-sm font-medium ${
                index === 0 ? 'text-rose-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
          {calendarDays.map((day) => (
            <CalendarDay
              key={day.date.toISOString()}
              day={day}
              onClick={handleDayClick}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-gray-600 bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>正常</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span>要確認</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span>今日</span>
        </div>
        <div className="ml-auto text-xs text-gray-400">
          2ヶ月先まで予約可能
        </div>
      </div>

      {/* Reservation Form Modal */}
      <ReservationForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        post={editingPost}
        initialDate={selectedDate || undefined}
        onSave={handleFormSave}
        onCancel={handleFormClose}
      />
    </div>
  );
};

export default CalendarView;
