'use client';

import { useState } from 'react';

export interface AIReformatProps {
  content: string;
  onReformat: (reformattedContent: string) => void;
}

const REFORMAT_STYLES = [
  {
    id: 'friendly',
    name: 'フレンドリー',
    icon: '😊',
    description: '親しみやすく、絵文字を使ったトーン',
  },
  {
    id: 'professional',
    name: 'プロフェッショナル',
    icon: '💼',
    description: 'ビジネスライクで、説得力のあるトーン',
  },
  {
    id: 'casual',
    name: 'カジュアル',
    icon: '🎮',
    description: 'リラックスした、会話のようなトーン',
  },
  {
    id: 'urgent',
    name: '緊急感',
    icon: '🚨',
    description: '今すぐ行動を促すトーン',
  },
  {
    id: 'story',
    name: '物語風',
    icon: '📖',
    description: '物語を語るようなトーン',
  },
];

export function AIReformat({ content, onReformat }: AIReformatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReformatting, setIsReformatting] = useState(false);

  const handleReformat = async (styleId: string) => {
    if (!content.trim()) return;

    setIsReformatting(true);
    setIsOpen(false);

    try {
      const style = REFORMAT_STYLES.find((s) => s.id === styleId);
      if (!style) return;

      const prompt = `以下の投稿を「${style.name}（${style.description}）」のスタイルで書き換えてください。\n\n元の投稿:\n${content}`;

      const response = await fetch('/api/ai/reformat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        onReformat(data.content);
      }
    } catch (error) {
      console.error('Reformat error:', error);
    } finally {
      setIsReformatting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isReformatting}
        className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800 hover:bg-purple-200 disabled:opacity-50 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800"
      >
        <span>✨</span>
        <span>{isReformatting ? '書き換え中...' : 'AIで書き換え'}</span>
      </button>

      {isOpen && !isReformatting && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-xl border-2 border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <div className="p-4">
            <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              スタイルを選択
            </p>
            <div className="space-y-2">
              {REFORMAT_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleReformat(style.id)}
                  className="w-full rounded-lg border-2 border-zinc-200 bg-zinc-50 px-3 py-3 text-left hover:border-purple-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-purple-500 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{style.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {style.name}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {style.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
