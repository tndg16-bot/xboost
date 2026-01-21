'use client';

import React, { useState } from 'react';
import { ReservationFormData, ScheduledPost, PostStatus } from '../types';
import { Modal, Button, Input } from '@xboost/ui';

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  post?: ScheduledPost | null;
  onSave: (data: ReservationFormData) => void;
  onCancel?: () => void;
  initialDate?: Date;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  isOpen,
  onClose,
  post,
  onSave,
  onCancel,
  initialDate,
}) => {
  const [content, setContent] = useState(post?.content || '');
  const [scheduledDate, setScheduledDate] = useState(
    post
      ? post.scheduledAt.toISOString().split('T')[0]
      : initialDate
        ? initialDate.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState(
    post
      ? post.scheduledAt.toTimeString().slice(0, 5)
      : '09:00'
  );
  const [hashtags, setHashtags] = useState(post?.hashtags?.join(' ') || '');

  const characterCount = content.length;
  const isOverLimit = characterCount > 280;

  const handleSave = () => {
    if (content.trim() && scheduledDate && scheduledTime) {
      const data: ReservationFormData = {
        content: content.trim(),
        scheduledDate,
        scheduledTime,
        hashtags: hashtags.trim() || undefined,
      };
      onSave(data);
      handleClose();
    }
  };

  const handleClose = () => {
    if (!post) {
      setContent('');
      setScheduledDate(new Date().toISOString().split('T')[0]);
      setScheduledTime('09:00');
      setHashtags('');
    }
    onClose();
  };

  const handleCancel = () => {
    handleClose();
    onCancel?.();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={post ? '予約を編集' : '新しい予約'}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            disabled={!content.trim() || isOverLimit}
            variant="primary"
          >
            {post ? '更新' : '予約'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Content Input */}
        <div>
          <Input
            label="投稿内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="何を投稿しますか？"
            multiline
            rows={4}
            error={isOverLimit ? `${characterCount} / 280 文字 - 文字数制限を超えています` : undefined}
            helperText={`${characterCount} / 280 文字`}
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="日付"
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={today.toISOString().split('T')[0]}
            max={twoMonthsLater.toISOString().split('T')[0]}
            helperText="2ヶ月先まで予約可能"
          />
          <Input
            label="時刻"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            step={60}
            helperText="1分単位で指定"
          />
        </div>

        {/* Hashtags */}
        <div>
          <Input
            label="ハッシュタグ（オプション）"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="growth xboost (スペース区切り)"
            leftElement={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            }
          />
        </div>

        {/* Preview */}
        {content && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-xs font-medium text-gray-500 mb-2">プレビュー</p>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-sm text-gray-900 leading-relaxed">
                {content}
              </p>
              {hashtags && (
                <p className="text-sm text-blue-600 mt-1">
                  {hashtags.split(' ').filter(Boolean).map(tag => `#${tag}`).join(' ')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReservationForm;
