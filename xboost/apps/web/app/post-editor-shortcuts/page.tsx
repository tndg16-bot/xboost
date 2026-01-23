'use client';

interface KeyboardShortcutProps {
  shortcut: string;
  mac: string;
  windows: string;
  description: string;
}

const shortcuts: KeyboardShortcutProps[] = [
  {
    shortcut: 'cmd+shift+v',
    mac: '⌘ + ⇧ + V',
    windows: 'Ctrl + Shift + V',
    description: '画像・動画をコピペ',
  },
];

export default function PostEditorPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          投稿作成
        </h1>

        {/* Shortcuts Guide */}
        <div className="mb-8 rounded-2xl border-2 border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            💡 キーボードショートカット
          </h2>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            画像や動画を効率的に追加できます
          </p>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg border-2 border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="flex-shrink-0 font-mono text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {shortcut.mac}
                  {shortcut.mac !== shortcut.windows && (
                    <span className="text-zinc-400 dark:text-zinc-600">
                      {' / '}
                      {shortcut.windows}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {shortcut.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example: How to use */}
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            使用方法
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                手順
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-700 dark:text-zinc-400">
                <li>画像を右クリックして「コピー」を選択</li>
                <li>投稿エディタにフォーカスを置く</li>
                <li>「⌘ + ⇧ + V」または「Ctrl + Shift + V」でペースト</li>
                <li>完了！</li>
              </ol>
            </div>
            <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
              <p className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                💡 ヒント
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-zinc-700 dark:text-zinc-400">
                <li>コピーしたらは、すぐにペーストしてください</li>
                <li>対応ファイル形式: PNG, JPG, GIF, WebP, MP4, MOV, WebM</li>
                <li>複数の画像もまとめてコピペ可能</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Post Editor Area */}
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            投稿エリア
          </h2>
          <textarea
            placeholder="ここに投稿内容を入力..."
            className="w-full h-64 rounded-lg border-2 border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 dark:focus:border-teal-500 dark:focus:ring-2 dark:focus:ring-offset-0 dark:focus:ring-zinc-900"
            rows={6}
          />
          <div className="mt-4 flex justify-end">
            <button className="rounded-full bg-black px-6 py-3 text-white font-semibold hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              投稿する
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
