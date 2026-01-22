'use client';

import { useState } from 'react';

interface RewriteStyle {
  id: string;
  name: string;
  description: string;
  emoji: string;
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
  {
    id: 'short',
    name: '短くまとめる',
    description: '要点を絞り込んで短く',
    emoji: '✂️',
  },
];

export default function AIRewritePage() {
  const [originalContent, setOriginalContent] = useState('');
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<RewriteStyle | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [history, setHistory] = useState<Array<{ style: RewriteStyle; original: string; rewritten: string }>>([]);

  const handleRewrite = async (style: RewriteStyle) => {
    if (!originalContent.trim()) {
      alert('元の内容を入力してください');
      return;
    }

    setSelectedStyle(style);
    setIsRewriting(true);

    const rewritten = await simulateAIRewrite(originalContent, style.id);
    setRewrittenContent(rewritten);
    setIsRewriting(false);

    setHistory(prev => [
      { style, original: originalContent, rewritten },
      ...prev.slice(0, 4),
    ]);
  };

  const handleTryDifferent = async () => {
    if (selectedStyle) {
      setIsRewriting(true);
      const rewritten = await simulateAIRewrite(originalContent, selectedStyle.id);
      setRewrittenContent(rewritten);
      setIsRewriting(false);
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
        return result + '\n\nどうかな？';
      },
      professional: (text) => {
        return text
          .replace(/〜/g, '〜')
          .replace(/だよね/g, 'と考えられます')
          .replace(/かな？/g, 'と考えられます')
          .replace(/！/g, '。')
          .replace(/💦/g, '')
          .replace(/😅/g, '')
          + '\n\nご確認をお願いいたします。';
      },
      casual: (text) => {
        return text
          .replace(/です/g, 'だ')
          .replace(/ます/g, 'る')
          .replace(/〜/g, '〜')
          .replace(/ください/g, 'して');
      },
      urgent: (text) => {
        return `【急ぎ】${text}\n\n⚡今すぐチェック！\n\n緊急情報です。`;
      },
      story: (text) => {
        return `ある日の話です。\n\n${text}\n\nそれがきっかけで、何かが変わりました...`;
      },
      short: (text) => {
        const sentences = text.split('。').filter(s => s.trim());
        return sentences.slice(0, 2).join('。') + '。';
      },
    };

    return transformations[style]?.(content) || content;
  };

  const handleCopy = () => {
    if (rewrittenContent) {
      navigator.clipboard.writeText(rewrittenContent);
      alert('コピーしました！');
    }
  };

  const handleUseHistory = (item: { style: RewriteStyle; original: string; rewritten: string }) => {
    setOriginalContent(item.original);
    setRewrittenContent(item.rewritten);
    setSelectedStyle(item.style);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            AIリライト
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            あなたのテキストを様々なスタイルで書き直します
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                スタイルを選択
              </h2>

              <div className="space-y-2">
                {REWRITE_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => handleRewrite(style)}
                    disabled={isRewriting}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedStyle?.id === style.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    } ${isRewriting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{style.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {style.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {style.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {history.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  履歴
                </h2>

                <div className="space-y-2">
                  {history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleUseHistory(item)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.style.emoji}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                          {item.original.substring(0, 40)}...
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                入力
              </h2>

              <textarea
                value={originalContent}
                onChange={e => setOriginalContent(e.target.value)}
                placeholder="ここにリライトしたいテキストを入力してください..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {originalContent.length}文字
                </span>
                <button
                  onClick={() => {
                    setOriginalContent('');
                    setRewrittenContent('');
                    setSelectedStyle(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  クリア
                </button>
              </div>
            </div>

            {isRewriting && (
              <div className="bg-white rounded-lg p-12 shadow-sm dark:bg-gray-800 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-600 dark:text-gray-400">
                    書き直しています...
                  </span>
                </div>
              </div>
            )}

            {rewrittenContent && !isRewriting && (
              <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {selectedStyle && (
                      <>
                        <span className="text-2xl">{selectedStyle.emoji}</span>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {selectedStyle.name}で書き直し
                        </h2>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleTryDifferent}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      別のバージョン
                    </button>
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors"
                    >
                      コピー
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                    {rewrittenContent}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
