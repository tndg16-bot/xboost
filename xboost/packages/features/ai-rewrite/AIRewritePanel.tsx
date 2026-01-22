'use client';

import { useState } from 'react';

interface RewriteStyle {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

interface AIRewritePanelProps {
  content: string;
  onRewritten: (rewritten: string) => void;
}

const REWRITE_STYLES: RewriteStyle[] = [
  {
    id: 'friendly',
    name: 'フレンドリー',
    description: '親しみやすく、カジュアルなトーン',
    emoji: '😊',
  },
  {
    id: 'professional',
    name: 'プロフェッショナル',
    description: 'ビジネス向けのフォーマルなトーン',
    emoji: '💼',
  },
  {
    id: 'casual',
    name: 'カジュアル',
    description: 'ラフでリラックスしたトーン',
    emoji: '😎',
  },
  {
    id: 'urgent',
    name: '緊急感',
    description: '緊急性を強調したトーン',
    emoji: '⚡',
  },
  {
    id: 'story',
    name: '物語風',
    description: '物語形式で伝えるトーン',
    emoji: '📖',
  },
];

export function AIRewritePanel({ content, onRewritten }: AIRewritePanelProps) {
  const [selectedStyle, setSelectedStyle] = useState<RewriteStyle | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenContent, setRewrittenContent] = useState('');

  const handleRewrite = async (style: RewriteStyle) => {
    setSelectedStyle(style);
    setIsRewriting(true);

    const rewritten = await simulateAIRewrite(content, style.id);
    setRewrittenContent(rewritten);
    setIsRewriting(false);
  };

  const handleApply = () => {
    if (rewrittenContent) {
      onRewritten(rewrittenContent);
      setSelectedStyle(null);
      setRewrittenContent('');
    }
  };

  const handleTryDifferent = () => {
    if (selectedStyle) {
      handleRewrite(selectedStyle);
    }
  };

  const simulateAIRewrite = async (content: string, style: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const transformations: Record<string, (text: string) => string> = {
      friendly: (text) => {
        const friendlyPhrases = [
          '〜かな？',
          '〜だよね！',
          '〜みたい',
          '〜やってみて！',
        ];
        let result = text;
        friendlyPhrases.forEach(phrase => {
          result = result.replace(/。/g, ` ${phrase}。`);
        });
        return result;
      },
      professional: (text) => {
        return text
          .replace(/〜/g, '〜')
          .replace(/だよね/g, 'と考えられます')
          .replace(/かな？/g, 'と考えられます')
          .replace(/！/g, '。')
          .replace(/💦/g, '')
          .replace(/😅/g, '');
      },
      casual: (text) => {
        return text
          .replace(/です/g, 'だ')
          .replace(/ます/g, 'る')
          .replace(/〜/g, '〜')
          .replace(/ください/g, 'して');
      },
      urgent: (text) => {
        return `【急ぎ】${text}\n\n今すぐチェック！`;
      },
      story: (text) => {
        return `ある日の話です。\n\n${text}\n\nそれがきっかけで...`;
      },
    };

    return transformations[style]?.(content) || content;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        AIリライト
      </h2>

      {!selectedStyle ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            書き直したいスタイルを選択してください
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {REWRITE_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => handleRewrite(style)}
                disabled={isRewriting}
                className="text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{style.emoji}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {style.name}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {style.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedStyle.emoji}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedStyle.name}で書き直し
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedStyle.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedStyle(null);
                setRewrittenContent('');
              }}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              変更
            </button>
          </div>

          {isRewriting ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  書き直しています...
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    元の内容
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {content}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    書き直し後
                  </label>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                    <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {rewrittenContent}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleTryDifferent}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  別のバージョン
                </button>
                <button
                  onClick={handleApply}
                  disabled={!rewrittenContent}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors"
                >
                  適用
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
