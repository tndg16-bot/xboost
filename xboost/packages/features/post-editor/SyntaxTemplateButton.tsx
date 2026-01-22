'use client';

import { useState } from 'react';

export interface SyntaxTemplateButtonProps {
  onSelectTemplate: (template: string) => void;
}

export function SyntaxTemplateButton({ onSelectTemplate }: SyntaxTemplateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    { name: '断言宣言', template: '断言しますが、{内容}です。' },
    { name: '意見を聞く', template: '{テーマ}だと思いますか？' },
    { name: '共感を呼ぶ', template: '{状況}な人、手を挙げて。' },
    { name: '知っているか', template: '{トピック}を知っていますか？' },
    { name: '唐突に', template: '唐突ですが、{物語}。' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-200 dark:hover:bg-teal-800"
      >
        <span>📚</span>
        <span>構文テンプレート</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-xl border-2 border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <div className="p-4">
            <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              よく使う構文
            </p>
            <div className="space-y-2">
              {templates.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    onSelectTemplate(t.template);
                    setIsOpen(false);
                  }}
                  className="w-full rounded-lg border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-sm hover:border-teal-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-teal-500 dark:hover:bg-zinc-800"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{t.name}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{t.template}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full rounded-lg border-2 border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              すべてのテンプレートを見る →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
