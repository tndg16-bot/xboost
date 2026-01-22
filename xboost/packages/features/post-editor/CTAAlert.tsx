'use client';

import { useState, useEffect } from 'react';

export interface CTAAlertProps {
  content: string;
  onDismiss?: () => void;
}

const CTA_KEYWORDS = [
  'フォロー',
  'follow',
  'DM',
  'コメント',
  'comment',
  '詳細はリンク',
  'link',
  '今すぐ',
  'クリック',
  'click',
  '申請',
  '登録',
  'sign up',
  'join',
  'チェック',
  'check',
  '購入',
  'buy',
  '注文',
  'order',
];

export function CTAAlert({ content, onDismiss }: CTAAlertProps) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!content || content.length < 20) {
      setShowAlert(false);
      return;
    }

    const hasCTA = CTA_KEYWORDS.some((keyword) =>
      content.toLowerCase().includes(keyword.toLowerCase())
    );

    setShowAlert(!hasCTA);
  }, [content]);

  if (!showAlert) return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950">
      <span className="text-2xl">⚠️</span>
      <div className="flex-1">
        <h4 className="mb-1 text-sm font-semibold text-amber-900 dark:text-amber-100">
          CTA（行動喚起）が見つかりません
        </h4>
        <p className="mb-3 text-sm text-amber-800 dark:text-amber-200">
          フォローやクリックを促す言葉を追加すると、エンゲージメントが向上する可能性があります。
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            フォローしてください
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            DMで相談
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            リンクで詳細
          </span>
        </div>
      </div>
      <button
        onClick={() => {
          setShowAlert(false);
          onDismiss?.();
        }}
        className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        ✕
      </button>
    </div>
  );
}
