'use client';

import { useState } from 'react';

const CTA_KEYWORDS = [
  'bit.ly',
  '.bit',
  'リンク',
  'link',
  '👉',
  'チェック',
  'check',
  'ここから',
  'ここから',
  '詳細は',
  'もっと見る',
  'もっと見る',
  'クリック',
  'click',
  'タップ',
  'tap',
  '/app/',
  '/checkout/',
];

interface CTACheckResult {
  hasCTA: boolean;
  ctaType?: string;
  suggestions: string[];
}

const checkForCTA = (text: string): CTACheckResult => {
  const suggestions: string[] = [];
  let ctaType = '';

  for (const keyword of CTA_KEYWORDS) {
    if (text.toLowerCase().includes(keyword)) {
      if (!ctaType) {
        if (keyword.includes('.') || keyword.includes('/app')) {
          ctaType = 'url';
        } else if (['bit.ly', 'リンク', 'link', 'ここから', 'もっと見る'].includes(keyword)) {
          ctaType = 'link';
        } else if (['チェック', 'check', 'クリック', 'タップ'].includes(keyword)) {
          ctaType = 'button';
        }
        suggestions.push(keyword);
      }
    }
  }

  return {
    hasCTA: suggestions.length > 0,
    ctaType,
    suggestions,
  };
};

const CTAWarningDialog = ({ isOpen, onClose, result, onIgnore }: { isOpen: boolean; onClose: () => void; result: CTACheckResult; onIgnore: () => void }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
          <div className="mb-4 flex items-start gap-3">
            <svg className="h-6 w-6 text-yellow-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-2.83 6 6.0 001.414 6 6 0 00-2.83 0zM10 14a8 8 0 100-2.83 6 6 0 001.414 6 6 0 00-2.83 0zm0-6a8 8 0 11-6 0 8 8 0 01-8 8 0 001.414 6 6 0 00-8 8 8zm0 2a2 2 0 110 0v5.5a2 2 0 012-2 2-2 2 2 0 011-4.28 2.282a2 2 0 001.414 2 2 2zm0 2a2 2 0 110 0v5.5a2 2 0 012-2 2 2-2 2 0 011-4.28 2 282a2 2 0 001.414 2 2 2 0 011-.72.898-.878zm-1 5 12c0-.66 0-1.2.555-2-2 0-1.792-2 2 2 0 00-2.83 0-1.766.2 2 2 0 00.37 0 .422 2.2 2 0 00.37-.898-.878zM12 10c0 1.66 2.83 2.83 2.83 0 01.66.417 0 2 2 2 0 00-2.83-2-2.2 0 011.32.676.676 0 01.832-1.766 2 2 2 0 01.766-.676-.676zM13.516 12c0-1.66-.834-3-2.5-2-5-2 0-1.792-2-2-2 0 00-2.83-2 2 2 0 0 0 4.796-4.696a2 2 0 00-2.83 2.2 2 0 011.32 2.676 2.676a2 2 0 0 00 2.83-2-2 2 0 01.766-.676-.676z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                CTAが含まれている可能性があります
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                以下のキーワードが検出されました: <strong>{result.suggestions.join('、')}</strong>
              </p>
              {result.ctaType && (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <strong>タイプ:</strong> {result.ctaType === 'url' ? 'リンク' : result.ctaType === 'button' ? 'ボタン' : '不明'}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4 rounded-lg bg-zinc-50 p-4">
            <p className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              CTAシグネチャを追加してみてください：
            </p>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• {result.ctaType === 'url' ? '「もっと見る」のあとにURLを入力' : '「クリック」のあとに詳細ページを入力'}</li>
              <li>• 「@xboost_now」を追加して認知度を高める</li>
              <li>• プロダクトの紹介リンクを追加する</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border-2 border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              あとで追加する
            </button>
            <button
              onClick={onIgnore}
              className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100"
            >
              今はスキップ
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default function CTAChecker() {
  const [inputText, setInputText] = useState('');
  const [warningOpen, setWarningOpen] = useState(false);
  const [checkResult, setCheckResult] = useState<CTACheckResult | null>(null);

  const handleCheck = () => {
    if (!inputText.trim()) return;

    const result = checkForCTA(inputText);
    setCheckResult(result);
    setWarningOpen(result.hasCTA);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            CTAシグネチャー・ツール
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            投稿にCTAが含まれているかをチェックして改善案内を提示
          </p>
        </div>

        {/* CTA Checker */}
        <div className="mb-8 rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            CTAチェック
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                投稿内容を入力
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="ここに投稿内容を入力..."
                className="w-full h-64 rounded-lg border-2 border-zinc-300 bg-zinc-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-zinc-800 dark:focus:border-zinc-600 dark:focus:ring-zinc-900"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCheck}
                disabled={!inputText.trim()}
                className="flex-1 rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white disabled:bg-teal-400 disabled:cursor-not-allowed transition-colors hover:bg-teal-700"
              >
                チ�チェック
              </button>
              <button
                onClick={() => {
                  setInputText('');
                  setCheckResult(null);
                  setWarningOpen(false);
                }}
                className="flex-1 rounded-lg border-2 border-zinc-300 px-6 py-3 text-base font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:bg-zinc-600"
              >
                クリア
              </button>
            </div>
          </div>

          {checkResult && (
            <div className="rounded-lg border-2 border-zinc-200 bg-zinc-50 p-6">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                チエック結果
              </h3>
              <div className={`flex items-center gap-2 mb-3 ${checkResult.hasCTA ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  {checkResult.hasCTA ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-2.83 6 6 0 001.414 6 6 0 001.414 6 6 0 00-2.83 0zM10 14a8 8 0 100-2.83 6 6 0 001.414 6 6 0 00-2.83 0zm0-6a8 8 0 11-6 0 8 8 0 01-8 8 0 001.414 6 6 0 00-8 8 8zm0 2a2 2 0 110 0v5.5a2 2 0 012-2 2 2-2 2 0 011-4.28 2 282a2 2 0 001.414 2 2 2 0 011-.72.898-.878zm-1 5 12c0-.66 0-1.2.555-2-2 0-1.792-2 2 0 00-2.83-2 2 0-00.83-37 0 .422 2 2 2 0 0 .37-.898-.878zM12 10c0 1.66 2.83 2.83 2.83 0 01.66.417 0 2 2 2 0 00-2.83-2-2 2 0 0 0 4.796-4.696a2 2 0 00-2.83-2 2 2 0 011.32.676.676 0 0 1.832-1.766 2 2 2 0 01.766-.676-.676zM13.516 12c0-1.66-.834-3-2.5-2-5-2 0-1.792-2-2-2 0 00-2.83-2-2 2 0 0 0 4.796-4.696a2 2 0 00-2.83-2 2 2 0 0 11.32 2.676 2.676a2 2 0 0 00 2.83-2-2 2 0 0 01.766-.676-.676z" clipRule="evenodd" />
                  )}
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-2.83 6 6 0 001.414 6 6 0 00-2.83 0zm0 6a8 8 0 11-6 0 8 8 0 01-8 8 0 001.414 6 6 0 00-8 8 8zm0 2a2 2 0 110 0v5.5a2 2 0 012-2 2 2 2 0 011-4.28 2 282a2 2 0 001.414 2 2 2 0 011.32 2.676 2.676a2 2 0 0 00-2.83-2-2 2 0 0 11-.72.898-.878zM-1 5 12c0-.66 0-1.2.555-2-2 0-1.792-2 2 0 00-2.83-2 2 0 00-83-37 0 .422 2 2 2 0 0 0 37-.898-.878zM12 10c0 1.66 2.83 2.83 2.83 0 01.66.417 0 2 2 2 0 00-2.83-2-2 2 0 0 0 4.796-4.696a2 2 0 00-2.83-2 2 2 0 0 11.32.676 676 0 0 1.832-1.766 2 2 2 0 01.766-.676-.676zM13.516 12c0-1.66-.834-3-2.5-2-5-2 0-1.792-2 2 0 00-2.83-2-2 2 0 00-2.83-2 2 2 0 0 0 4.796-4.696a2 2 0 00-2.83-2 2 2 0 0 11.32 2.676 2.676a2 2 0 0 00-2.83-2 2 0 0 01.766-.676-.676z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">
                  {checkResult.hasCTA ? 'CTA検出' : 'CTAなし'}
                </span>
              </div>
              {checkResult.suggestions.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    検出されたキーワード:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {checkResult.suggestions.map((suggestion, i) => (
                      <span
                        key={i}
                        className="inline-block rounded bg-zinc-200 px-2 py-1 text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Warning Dialog */}
      <CTAWarningDialog
        isOpen={warningOpen}
        result={checkResult!}
        onClose={() => setWarningOpen(false)}
        onIgnore={() => {
          setWarningOpen(false);
        }}
      />
    </div>
  );
}
